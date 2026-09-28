"use client";

import { Blend, Check, Crop, Eye, MapPinOff, Share2, ZoomIn } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./upper-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "photo-privacy",
  objective: "Make the photo safe.",
  place: "Photo privacy editor",
  guide: "Meera",
  scenes: ["Inspect", "Edit", "Preview", "Share safely"],
  completionTitle: "The safe photo is ready!",
  completionSummary: "You removed location, cropped the school badge, blurred a face, and checked the audience.",
  familyMove: "Inspect one family photo background for details before sharing it.",
  hints: makeHints("Zoom into the photo.", "Look beyond the main subject.", "Location, faces, and badges can reveal details.", "Remove clues and preview the audience."),
};

export function PhotoPrivacyExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [zoom, setZoom] = useState(1);
  const [location, setLocation] = useState(true);
  const [cropped, setCropped] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const [audience, setAudience] = useState("Everyone");
  const protectedCount = Number(!location) + Number(cropped) + Number(blurred) + Number(audience === "Family");

  function removeLocation() { setLocation(false); experience.act({ id: "remove-location", correct: true, assessmentIndex: 0, nextScene: 1 }); }
  function cropBadge() { setCropped(true); experience.act({ id: "crop-badge", correct: true, assessmentIndex: 1, nextScene: 1 }); }
  function blurFace() { setBlurred(true); experience.act({ id: "blur-face", correct: true, nextScene: 2 }); }
  function preview() { experience.act({ id: "preview-audience", correct: audience === "Family" && protectedCount === 4, assessmentIndex: 2, nextScene: 3 }); }

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("preview-audience") ? "Safe family preview ready." : `${protectedCount}/4 privacy protections applied.`}>
      <section className={styles.photoExperience} data-experience="photo-privacy" data-interaction="editor">
        <div className={styles.photoEditor}>
          <div className={styles.photoCanvas} style={{ "--photo-zoom": zoom, "--crop": cropped ? "14%" : "0%" } as React.CSSProperties}>
            <div className={styles.photoImage}><span className={blurred ? styles.faceBlurred : ""}>🧑🏽‍🤝‍🧑🏽</span><b className={cropped ? styles.badgeCropped : ""}>🏫 DPS DEMO</b><i>Road sign: Sector 9</i></div>
            {location ? <div className={styles.locationTag}>📍 School Road, Demo City</div> : null}
          </div>
          <div className={styles.editorToolbar}>
            <label><ZoomIn aria-hidden="true" /><span>Zoom</span><input aria-label="Photo zoom" max="1.8" min="1" onChange={(event) => setZoom(Number(event.target.value))} step="0.2" type="range" value={zoom} /></label>
            <button disabled={!location} onClick={removeLocation} type="button"><MapPinOff aria-hidden="true" /> Remove location</button>
            <button disabled={cropped} onClick={cropBadge} type="button"><Crop aria-hidden="true" /> Crop badge</button>
            <button disabled={blurred} onClick={blurFace} type="button"><Blend aria-hidden="true" /> Blur face</button>
          </div>
        </div>
        <aside className={styles.sharePreview}><Eye aria-hidden="true" /><h2>Share preview</h2><label>Audience<select onChange={(event) => setAudience(event.target.value)} value={audience}><option>Everyone</option><option>School group</option><option>Family</option></select></label><div className={styles.exposureMeter}><i style={{ transform: `scaleX(${Math.max(.08, 1 - protectedCount * .23)})` }} /><span>{protectedCount < 3 ? "High exposure" : protectedCount === 3 ? "Check audience" : "Low exposure"}</span></div><ul><li className={!location ? styles.protected : ""}>{!location ? <Check /> : null} Location removed</li><li className={cropped ? styles.protected : ""}>{cropped ? <Check /> : null} Badge cropped</li><li className={blurred ? styles.protected : ""}>{blurred ? <Check /> : null} Face blurred</li></ul><button disabled={protectedCount < 4 || experience.has("preview-audience")} onClick={preview} type="button"><Share2 aria-hidden="true" /> Preview safe share</button></aside>
        {experience.has("preview-audience") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish photo edit</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
