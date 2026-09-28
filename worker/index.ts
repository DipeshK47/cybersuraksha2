/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { SESSION_COOKIE } from "../app/lib/cookie-names";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

// Content Security Policy applied to HTML documents. 'unsafe-inline'/'unsafe-eval'
// are required by the current Next/vinext client runtime; tighten with nonces
// once the framework output is audited. connect-src 'self' covers fetch + the
// SSE live feed; Groq is only ever called server-side.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

function isSecure(request: Request, url: URL): boolean {
  return (
    url.protocol === "https:" ||
    (request.headers.get("x-forwarded-proto") ?? "").includes("https")
  );
}

function hasTeacherSession(request: Request): boolean {
  const pattern = new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=[^;\\s]+`);
  return pattern.test(request.headers.get("cookie") ?? "");
}

/** Re-emit a response with hardened security headers (stream-preserving). */
function harden(response: Response, request: Request, url: URL): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  if (isSecure(request, url)) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  if ((headers.get("content-type") ?? "").includes("text/html")) {
    headers.set("Content-Security-Policy", CSP);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    // Defense-in-depth UX guard: bounce unauthenticated teacher-console page
    // loads to the login screen. The real authorization gate is per-API and
    // session-verified; this only avoids rendering an empty shell.
    if (url.pathname === "/teach" || url.pathname.startsWith("/teach/")) {
      if (!hasTeacherSession(request)) {
        return Response.redirect(new URL("/teacher-login", url).toString(), 302);
      }
    }

    const response = await handler.fetch(request, env, ctx);
    return harden(response, request, url);
  },
};

export default worker;
