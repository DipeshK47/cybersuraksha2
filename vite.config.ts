import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json" with { type: "json" };
import { sites } from "./scripts/sites-vite-plugin.ts";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  // `.wrangler/` is live Miniflare runtime state, not source, so watching it is
  // pointless — and on this project's NFS-backed /scratch it is actively fatal.
  // Killing a workerd process that still holds the D1 SQLite file makes NFS
  // silly-rename it to `.nfsXXXX`; chokidar then tries to watch that stub and
  // throws `UNKNOWN: watch ... errno -116`, which kills the whole dev server at
  // startup with a stack trace that points at Vite rather than at the cause.
  const ignored = ["**/.wrangler/**", "**/.nfs*"];

  // On Torch the server runs on one compute node while files are edited from
  // another, and NFS never delivers inotify events across nodes — the server
  // kept serving a stale curriculum for an hour. devserver.sbatch sets this.
  const pollNfs = process.env.CYBERSURAKSHA_WATCH_POLL === "1";

  return {
    server: {
      ...(isCodexSeatbeltSandbox || pollNfs
        ? { watch: { useFsEvents: false, usePolling: true, interval: 1500, ignored } }
        : { watch: { ignored } }),
      // STORY_NO_HMR=1: parallel browser QA runs share one server; without HMR an edit in one
      // chapter can't reload another run's page. Each page load still gets the latest code.
      ...(process.env.STORY_NO_HMR === "1" ? { hmr: false } : {}),
    },
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
        // Browser QA for content-only work must not open or migrate a
        // developer's persisted D1 state. Normal local development keeps the
        // existing project-local persistence behaviour.
        persistState: process.env.CYBERSURAKSHA_EPHEMERAL_WORKERS === "1" ? false : true,
      }),
    ],
  };
});
