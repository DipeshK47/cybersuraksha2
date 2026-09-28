"use client";

import { AlertTriangle, ArrowLeft, Flag, Heart, MessageCircle, Send, ShieldCheck, ShoppingBag, ShoppingCart, Store, X } from "lucide-react";
import { useState } from "react";
import type { CyberLessonComponentProps } from "../../lesson-types";
import { CyberExperienceFrame } from "../CyberExperienceFrame";
import { makeHints, makeMistake } from "../experience-content";
import type { ExperienceDefinition } from "../experience-types";
import { BrowserShell, type BrowserTab } from "../shells/BrowserShell";
import { SocialShell } from "../shells/SocialShell";
import { useCyberExperience } from "../useCyberExperience";
import styles from "./upper-experiences.module.css";

const definition: ExperienceDefinition = {
  id: "influencer-shop",
  objective: "Investigate before you buy.",
  place: "CircleUp shopping trail",
  guide: "Meera",
  scenes: ["See post", "Open DM", "Visit shop", "Inspect checkout", "Exit and report"],
  completionTitle: "Meera protected the budget!",
  completionSummary: "You followed the scam journey, inspected the merchant, left checkout, and reported the post.",
  familyMove: "Check contact, return, domain, and payment details before an online purchase.",
  hints: makeHints("Open the sponsored post.", "Read comments before the DM.", "Inspect the shop before checkout.", "Leave pressure screens and report the source post."),
};

type View = "feed" | "comments" | "messages" | "shop" | "cart" | "checkout" | "reported";
const shopTabs: BrowserTab[] = [{ id: "shop", title: "FlashKart Deal", address: "flashkart-deal.shop-now.fake" }];

export function InfluencerShopExperience({ runtime, ...props }: CyberLessonComponentProps & { assessmentIds: readonly [string, string, string] }) {
  const experience = useCyberExperience(runtime, definition, props.assessmentIds);
  const [view, setView] = useState<View>("feed");
  const [inspected, setInspected] = useState(false);
  const [cart, setCart] = useState(false);
  const [pressure, setPressure] = useState(false);
  const [budget] = useState(1000);

  function openComments() { setView("comments"); experience.setScene(1); }
  function openMessages() { setView("messages"); experience.act({ id: "open-dm", correct: true, assessmentIndex: 0, nextScene: 1 }); }
  function openShop() { setView("shop"); experience.setScene(2); }
  function inspectShop() { setInspected(true); experience.act({ id: "inspect-merchant", correct: true, assessmentIndex: 1, nextScene: 2 }); }
  function addCart() { setCart(true); setView("cart"); }
  function checkout() { setView("checkout"); setPressure(true); experience.setScene(3); }
  function unsafePay() { experience.act({ id: "pay-now", correct: false, assessmentIndex: 2, unsafe: true, mistake: makeMistake("The payment is still risky", "The shop has no reliable contact, returns, or trusted domain. The timer only adds pressure.", "Leave checkout when merchant details cannot be verified." ) }); }
  function exitCheckout() { setPressure(false); setView("feed"); experience.act({ id: "exit-checkout", correct: inspected, assessmentIndex: 2, nextScene: 4 }); }
  function reportPost() { setView("reported"); experience.act({ id: "report-post", correct: experience.has("exit-checkout"), nextScene: 4 }); }

  const feedPost = <article className={styles.socialPost}><header><span>MG</span><div><b>MayaGlow</b><small>Sponsored · Fictional creator</small></div></header><div className={styles.postImage}><span>🎧</span><b>90% OFF</b><small>Only 3 left!</small></div><nav><Heart aria-hidden="true" /><button onClick={openComments} type="button"><MessageCircle aria-hidden="true" /> 143</button><button onClick={openMessages} type="button"><Send aria-hidden="true" /> DM</button></nav><p><b>MayaGlow</b> Secret giveaway! Comment WIN and check your DM.</p></article>;

  return (
    <CyberExperienceFrame definition={definition} onHelp={experience.showHint} points={experience.points} runtime={runtime} scene={experience.scene} status={experience.has("report-post") ? `₹${budget} protected. Post reported.` : view === "checkout" ? "Pressure screen active. Inspect or leave." : inspected ? "Merchant warnings found." : "Follow the shopping trail carefully."}>
      <section className={styles.influencerExperience} data-experience="influencer-shop" data-interaction="social">
        {view === "feed" || view === "comments" || view === "messages" || view === "reported" ? <div className={styles.socialAndBudget}><SocialShell active={view === "messages" ? "messages" : "feed"} appName="CircleUp" feed={view === "comments" ? <div className={styles.commentsView}><button onClick={() => setView("feed")} type="button"><ArrowLeft aria-hidden="true" /> Post</button><h2>Comments</h2><p><b>@real_student</b> Has anyone received it?</p><p><b>@deal_alert</b> Mine asks for payment first.</p><p><b>@MayaGlow</b> Winners check DM now!</p><button onClick={openMessages} type="button"><Send aria-hidden="true" /> Open DM</button></div> : view === "reported" ? <div className={styles.reportedPost}><ShieldCheck aria-hidden="true" /><h2>Post reported</h2><p>CircleUp will review this fictional sponsored post.</p></div> : feedPost} message={<i />} onOpen={(next) => next === "messages" ? openMessages() : setView("feed")}>{view === "messages" ? <div className={styles.dmView}><header><span>MG</span><div><b>MayaGlow Deals</b><small>New account</small></div></header><p>You won! Buy one item to unlock your prize.</p><button onClick={openShop} type="button"><ShoppingBag aria-hidden="true" /> Open secret shop</button></div> : null}</SocialShell><aside className={styles.budgetCard}><b>Protected budget</b><strong>₹{budget}</strong><span>{cart ? "Cart is fictional" : "Nothing spent"}</span></aside></div> : null}
        {view === "shop" || view === "cart" || view === "checkout" ? <BrowserShell activeTab="shop" address={shopTabs[0].address} onBack={() => setView("messages")} onClosePopup={() => setPressure(false)} onNavigate={inspectShop} onReload={() => undefined} onSelectTab={() => undefined} popup={pressure ? <div className={styles.checkoutPressure}><button aria-label="Close pressure popup" onClick={() => setPressure(false)} type="button"><X aria-hidden="true" /></button><AlertTriangle aria-hidden="true" /><h2>PAY IN 30 SECONDS</h2><p>Your prize will disappear.</p><button onClick={unsafePay} type="button">Pay ₹600 now</button><button onClick={exitCheckout} type="button">Leave checkout</button></div> : undefined} secure={false} tabs={shopTabs}>
          {view === "shop" ? <div className={styles.shopPage}><header><Store aria-hidden="true" /><div><b>FlashKart Deal</b><small>Prize partner</small></div><button onClick={inspectShop} type="button">Merchant details</button></header>{inspected ? <div className={styles.merchantWarnings}><span>⚠ No working contact</span><span>⚠ No return address</span><span>⚠ Domain created for this deal</span></div> : null}<div className={styles.product}><span>🎧</span><h2>Pro Gaming Headset</h2><s>₹5,999</s><b>₹600</b><button onClick={addCart} type="button"><ShoppingCart aria-hidden="true" /> Add to cart</button></div></div> : null}
          {view === "cart" ? <div className={styles.cartPage}><ShoppingCart aria-hidden="true" /><h2>Your cart</h2><div><span>🎧</span><b>Pro Gaming Headset</b><strong>₹600</strong></div><button onClick={checkout} type="button">Go to checkout</button></div> : null}
          {view === "checkout" ? <div className={styles.checkoutPage}><h2>Checkout</h2><p>Only instant payment accepted.</p><button onClick={() => setPressure(true)} type="button">Continue payment</button><button onClick={exitCheckout} type="button"><ArrowLeft aria-hidden="true" /> Leave safely</button></div> : null}
        </BrowserShell> : null}
        {experience.has("exit-checkout") && !experience.has("report-post") ? <button className={styles.reportAction} onClick={reportPost} type="button"><Flag aria-hidden="true" /> Report CircleUp post</button> : null}
        {experience.has("report-post") ? <button className={styles.finishAction} onClick={experience.finish} type="button">Finish shop investigation</button> : null}
      </section>
    </CyberExperienceFrame>
  );
}
