"use client";

import { StoryScene } from "./StoryScene";
import styles from "./badal-and-moti.module.css";

const states = [
  {
    name: "Sunny welcome",
    scene: <StoryScene badal={{ x: 400, action: "wave" }} label="Badal waves in the sunny courtyard." moti={{ x: 280, action: "runIn" }} />,
  },
  {
    name: "Quiet night",
    scene: <StoryScene badal={{ x: 400 }} label="Badal and Moti sit together under the moon." moti={{ x: 290, action: "sit" }} sky="night" />,
  },
  {
    name: "Sunset transition",
    scene: <StoryScene badal={{ x: 400 }} label="The sun sets while Moti listens." moti={{ x: 290, action: "tilt" }} sky="toNight" />,
  },
  {
    name: "Rainy discovery",
    scene: <StoryScene badal={{ x: 350, action: "walkIn" }} label="Badal finds Moti in the rain." moti={{ x: 470, action: "shiver" }} rain="pour" />,
  },
  {
    name: "Rain clearing",
    scene: <StoryScene badal={{ x: 320 }} label="The rain clears as Maa welcomes Moti." maa={{ x: 110, action: "wave" }} moti={{ x: 430, action: "sit" }} rain="clearing" />,
  },
  {
    name: "Puppy celebration",
    scene: <StoryScene badal={{ x: 400, action: "wave" }} label="Moti jumps beside Badal." moti={{ x: 285, action: "jump" }} />,
  },
  {
    name: "Walking together",
    scene: <StoryScene badal={{ x: 390, action: "walkAcross" }} label="Badal and Moti move across the courtyard." moti={{ x: 275, action: "runAcross" }} />,
  },
  {
    name: "Bat and ball",
    scene: <StoryScene badal={{ x: 410 }} ball={{ x: 340, roll: true }} label="A ball rolls toward Badal and Moti." moti={{ x: 260, action: "jump" }} />,
  },
] as const;

/** Visual-regression gallery; intentionally not linked from the learner route. */
export default function StoryScenePreview() {
  return (
    <main className={styles.scenePreview}>
      <header>
        <p>Badal and Moti · animation QA</p>
        <h1>Story scene states</h1>
      </header>
      <div className={styles.scenePreviewGrid}>
        {states.map(({ name, scene }) => (
          <section key={name}>
            <h2>{name}</h2>
            {scene}
          </section>
        ))}
      </div>
    </main>
  );
}
