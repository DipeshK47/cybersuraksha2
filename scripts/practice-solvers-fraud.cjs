// Accessible learner flows for the root's batched practice QA. Stage indexes are 0, 1, 2.
const assert = require('node:assert/strict');
const button = (page, name) => page.getByRole('button', { name, exact: true });
async function noAdvance(page) {
  assert.equal(await button(page, 'Next challenge').count(), 0, 'Challenge must be solved before advancing');
  assert.equal(await button(page, 'Review mission').count(), 0, 'Final challenge must be solved before review');
}
async function stageIndex(page, supplied) { return supplied ?? Number(await page.locator('[data-new-mission][data-stage]').getAttribute('data-stage')); }
async function disabled(page, name) { assert.equal(await button(page, name).isEnabled(), false, `${name} is gated`); }
async function absent(page, name) { assert.equal(await button(page, name).count(), 0, `${name} requires its earlier step`); }

module.exports = {
  'nanis-secret-code': {
    async solveStage(page, stage) {
      await noAdvance(page);
      if (stage === 0) await button(page, 'Cover the code').click();
      else if (stage === 1) await button(page, 'End call').click();
      else { await absent(page, 'Tell Nani and Mum'); await button(page, /^Nani and a trusted adult/).click(); await noAdvance(page); await button(page, 'Tell Nani and Mum').click(); }
    },
    async wrongStage(page, stage) {
      stage = await stageIndex(page, stage);
      await button(page, stage === 0 ? 'Read the code aloud' : stage === 1 ? 'Give two digits' : 'Call the stranger back').click();
      await noAdvance(page); return /Keep every digit private|Calling the stranger back/;
    },
  },
  'surprise-pop-up': {
    async solveStage(page, stage) {
      await noAdvance(page);
      await button(page, 'Close surprise pop-up').click();
      if (stage === 1) { await noAdvance(page); await button(page, 'Tell a trusted adult').click(); }
      if (stage === 2) { await noAdvance(page); await disabled(page, 'Report the overlay'); await button(page, 'Save practice screenshot').click(); await button(page, 'Report the overlay').click(); }
    },
    async wrongStage(page, stage) {
      stage = await stageIndex(page, stage);
      await button(page, stage === 1 ? 'Install helper' : 'Claim prize').click();
      await noAdvance(page); return /offer now wants access to private information/;
    },
  },
  'otp-guardian': {
    async solveStage(page, stage) {
      await noAdvance(page);
      if (stage === 0) { await absent(page, 'Flag payment-versus-repair mismatch'); await button(page, /^Inspect bank message/).click(); await noAdvance(page); await button(page, 'Flag payment-versus-repair mismatch').click(); }
      else if (stage === 1) { await disabled(page, 'End call'); await button(page, 'Refuse OTP request').click(); await noAdvance(page); await button(page, 'End call').click(); }
      else { await absent(page, 'Verify through number on bill'); await button(page, /^Open electricity bill/).click(); await noAdvance(page); await button(page, 'Verify through number on bill').click(); }
    },
    async wrongStage(page, stage) {
      stage = await stageIndex(page, stage);
      await button(page, stage === 0 ? 'Flag the polite greeting instead' : stage === 1 ? 'Send OTP' : 'Call back stranger').click();
      await noAdvance(page); return /polite greeting proves nothing|Sharing an OTP could approve|returns to the unverified caller/;
    },
  },
  'qr-code-caution': {
    async solveStage(page, stage) {
      await noAdvance(page);
      if (stage === 0) { await absent(page, 'Flag as outgoing payment'); await button(page, 'Preview Pay ₹500').click(); await noAdvance(page); await button(page, 'Flag as outgoing payment').click(); }
      else if (stage === 1) await button(page, 'Cancel payment').click();
      else { await absent(page, 'Share my receive QR'); await button(page, /^Use shop’s own QR/).click(); await noAdvance(page); await button(page, 'Share my receive QR').click(); }
    },
    async wrongStage(page, stage) {
      stage = await stageIndex(page, stage);
      await button(page, stage === 0 ? 'Treat as ₹500 received' : stage === 1 ? 'Enter practice PIN to pay' : 'Scan buyer QR and enter PIN').click();
      await noAdvance(page); return /screen says Pay|PIN here would approve|buyer’s QR can open another payment/;
    },
  },
  'digital-arrest-simulation': {
    async solveStage(page, stage) {
      await noAdvance(page);
      if (stage === 0) {
        await disabled(page, 'Check selected evidence');
        await button(page, 'Mark secrecy demand: “Stay on camera. Tell no one.”').click();
        await disabled(page, 'Check selected evidence');
        await button(page, 'Mark payment demand: “Pay ₹50,000 now.”').click();
        await button(page, 'Check selected evidence').click();
      } else if (stage === 1) {
        await disabled(page, 'Tell a trusted adult'); await button(page, 'End call').click(); await noAdvance(page); await button(page, 'Tell a trusted adult').click();
      } else {
        await button(page, /^Open official reporting route/).click(); await disabled(page, 'Submit practice report'); await button(page, 'Save call evidence').click(); await noAdvance(page); await button(page, 'Submit practice report').click();
      }
    },
    async wrongStage(page, stage) {
      stage = await stageIndex(page, stage);
      await button(page, stage === 0 ? 'Treat the uniform as proof' : stage === 1 ? 'Transfer the fee' : 'Open caller’s report link').click();
      await noAdvance(page); return /uniform can be copied|Paying under threat|caller controls their link/;
    },
  },
  'deepfake-voice-relative-scam': {
    async solveStage(page, stage) {
      await noAdvance(page);
      // The transcript is the keyboard/audio-failure equivalent of playing the supplied real note.
      if (stage < 2) { const contact = stage === 0 ? /^Open saved contacts/ : /^Open known family channel/; if (!await button(page, contact).isEnabled()) await disabled(page, contact); }
      else await disabled(page, 'Ask another known family contact');
      await button(page, 'Read voice-note transcript').click();
      if (stage < 2) {
        await button(page, stage === 0 ? /^Open saved contacts/ : /^Open known family channel/).click(); await noAdvance(page);
        await button(page, stage === 0 ? 'Call uncle’s saved number' : 'Use private family check').click();
      } else {
        await disabled(page, 'Ask another known family contact'); await button(page, 'Put payment on hold').click(); await noAdvance(page); await button(page, 'Ask another known family contact').click();
      }
    },
    async wrongStage(page, stage) {
      stage = await stageIndex(page, stage);
      await button(page, 'Read voice-note transcript').click();
      await button(page, stage === 0 ? 'Send money now' : stage === 1 ? 'Send a test payment' : 'Pay without checking').click();
      await noAdvance(page); return /urgent or familiar-sounding voice cannot prove identity/;
    },
  },
};
