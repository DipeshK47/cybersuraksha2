import Link from "next/link";
import { LandingStartup } from "./components/LandingStartup";

const features = [
  {
    tag: "Missions, not lectures",
    title: "Learn by making things",
    copy:
      "Every lesson is a hands-on challenge. Students decode patterns, test ideas, and see how their choices change the result.",
  },
  {
    tag: "For teachers",
    title: "See where ideas click",
    copy:
      "Per-student results, class averages, and clear progress signals make the next classroom discussion easier to plan.",
  },
  {
    tag: "Built for discovery",
    title: "Curriculum becomes a lab",
    copy:
      "Computational Thinking and Artificial Intelligence become practical missions students can explore at their own pace.",
  },
];

const steps = [
  {
    title: "Register your school",
    copy: "Two minutes: school name, a contact person, and an email. No payment details.",
  },
  {
    title: "We approve & set up",
    copy: "We verify the school, secure access, and provide the teacher login.",
  },
  {
    title: "Classes start",
    copy: "The teacher creates student accounts, prints login slips, and runs the first mission.",
  },
];

export default function Home() {
  return (
    <main className="landingPage">
      <LandingStartup />
      <div className="landingShell">
        <nav className="landingNav" aria-label="Primary navigation">
          <Link className="landingBrand" href="/">
            <b>Cyber</b>Suraksha
          </Link>
          <div className="landingLinks">
            <Link className="pillButton pillButtonGhost" href="/teacher-login">
              Teacher login
            </Link>
            <Link className="pillButton pillButtonPrimary" href="/student-login">
              Student login
            </Link>
          </div>
        </nav>

        <section className="landingHero">
          <p className="landingEyebrow">Computational Thinking · Artificial Intelligence</p>
          <h1>
            Ideas become experiments.
            <br />
            Curiosity becomes <em>momentum.</em>
          </h1>
          <p className="landingSub">
            A bright learning studio where Classes 3–10 solve puzzles, build
            computational thinking skills, and explore responsible AI through
            interactive missions.
          </p>
          <div className="landingCtas">
            <Link className="pillButton pillButtonPrimary" href="/register-school">
              Register your school
            </Link>
            <Link className="pillButton pillButtonGhost" href="/student-login">
              I have a student login
            </Link>
          </div>
          <p className="landingHint">
            Built for classrooms. Designed for independent discovery.
          </p>
        </section>

        <section className="featureGrid" aria-label="CyberSuraksha benefits">
          {features.map((feature) => (
            <article className="featureCard" key={feature.title}>
              <span>{feature.tag}</span>
              <h2>{feature.title}</h2>
              <p>{feature.copy}</p>
            </article>
          ))}
        </section>

        <section className="onboarding" id="onboarding">
          <h2>How a school comes on board</h2>
          <div className="stepGrid">
            {steps.map((step, index) => (
              <article className="stepCard" key={step.title}>
                <b>{index + 1}</b>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="landingFooter">
          <span>© CyberSuraksha</span>
          <Link href="/register-school">Register a school</Link>
        </footer>
      </div>
    </main>
  );
}
