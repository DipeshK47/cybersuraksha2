# Class 7 chapter artwork

All 32 chapters have original related illustrations generated with the built-in ImageGen tool. Warm cinematic school scenes follow the existing course style, with Class 7 characters Tara and Neel, supportive adults and objects relevant to each chapter's decision. Examples include a role-access plan, short/long training strips, binary lamps, sorted book cards, a paper rover and a recurring-price timeline.

The self-contained delivery assets are in `public/cyber-missions/class-7/`: 32 full illustrations at 1400 × 788 and 32 smaller previews under `previews/` at 640px width, preserving the source aspect ratio. Full WebPs total 3.81 MiB; previews total 1.15 MiB. Encoding quality is 82 and 76 respectively. The lessons load these local assets without an image-generation service at runtime.

Images appear in stories, practicals and all subject-library cards. Responsive `srcSet` values provide the smaller images on narrow screens. The chapter illustration fills the story area in place of the unrelated generic portrait. Image descriptions are authored in both English and Hindi. Teaching text is rendered as HTML, so exact numbers, rules, supplied records and task grids are available without interpreting a generated picture. The decorative code in the QR chapter is deliberately non-scannable.

[class-7-artwork-prompts.json](class-7-artwork-prompts.json) records the shared visual direction and each chapter's scene and descriptions. [class-7-artwork-manifest.json](class-7-artwork-manifest.json) records the original generated PNG path and delivered WebP hashes/sizes. Original PNGs remain in the local generated-image archive; the WebPs needed by the course are included in the repository.

Asset checks require one distinct illustration and preview for every chapter, valid WebP files, smaller preview sizes and bilingual descriptions. Browser checks cover all 32 stories on desktop/mobile, all mobile practical views, all 32 library previews, Hindi descriptions, visible keyboard focus, layout bounds and page errors. These checks are included in `tests/class-7-browser-qa.py`.
