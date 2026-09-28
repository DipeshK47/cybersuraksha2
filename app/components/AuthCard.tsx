import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  tip,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  tip: React.ReactNode;
}) {
  return (
    <main className="authPage">
      <section className="authCard" aria-labelledby="auth-title">
        <div className="authBrand">
          <b>Cyber</b>Suraksha
        </div>
        <h1 id="auth-title">{title}</h1>
        <p className="authSub">{subtitle}</p>
        {children}
        <div className="authTip">{tip}</div>
        <Link className="authBack" href="/">
          ← Back to CyberSuraksha
        </Link>
      </section>
    </main>
  );
}
