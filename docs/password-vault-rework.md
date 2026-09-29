# Password Vault: readable password examples

Applies to Password Vault Builder (Classes 3–4) and The Password Vault (Class 5).

- Replaced random character strings and long word chains with familiar-word practice examples: `Mango!Rocket482?`, `Tiger#Pencil739!`, and `Apple@Basket625!`.
- The tiles retain whole words. Students join them without spaces; numbers and symbols stay attached. Each full example has 16 characters, but the younger explanation starts with words they already know rather than character arithmetic.
- Classes 3–4 replace a name-based password, help a friend, and make a different school password. Class 5 builds separate passwords for game, school and email, then replays a leak.
- Names and counting patterns still fail even when the answer has 16 characters. Adding a symbol to a name is not taught as a security fix.
- Reuse checks follow the actual password the student built, including reversed tile order. Reusing either game or school passwords is rejected for email. Reuse controls preserve the word boundaries.
- Story captions, dialogue, practice instructions, feedback and approved male narration match the readable examples. The moonbase/garden stories and artwork remain.
- These are public classroom examples, never real credentials. Real passwords must be created privately, be long and hard to guess, and differ for every account. A trusted adult and password manager can help.

Sources: [CISA password guidance](https://www.cisa.gov/sites/default/files/2024-09/Secure-Our-World-Passwords-Tip-Sheet.pdf) and [NIST password guidance](https://pages.nist.gov/800-63-4/sp800-63b.html). The small tile bank teaches the concepts; it does not generate secret or cryptographically random passwords, and mixing character types alone is not a guarantee of strength.

Verification: production build passed. Both chapters passed story playback, cue/audio duration checks, six scenes on desktop and phone, task gates, wrong-answer hints, audio failure fallback, replay, reduced motion and console checks (`scripts/story-qa.cjs`). Both practice versions passed on desktop and phone: four flows, twelve stage runs, including 16-character predictable answers, game/school reuse, actual chosen passwords, retries, completion and reset (`scripts/practice-qa.cjs`).

Previews: [Classes 3–4](previews/password-vault-rework/classes-3-4-practice.png), [Class 5](previews/password-vault-rework/class-5-practice.png).
