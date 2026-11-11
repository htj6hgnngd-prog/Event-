# VECTA desktop v4 — typography, colour, copy, motion

## Typography

Compared Cormorant (existing site), Playfair Display italic and Prata upright. Local Cyrillic specimen inspected. Playfair Display selected for upright and italic display roles; all 11 pages adjusted for its wider letterforms. Manrope remains utility/body face. Existing Cormorant brand lettering retained, not silently replaced as a logo.

Adobe Fonts search resolved PlayfairDisplay-Regular, designer Claus Eggers Sørensen, foundry Google. Actual font files and SIL OFL downloaded from official google/fonts repository: ofl/playfairdisplay. Russian characters including Ёё and Йй verified from cmap before subset. Fonts self-hosted. Derived static WOFF2 subsets internally renamed VECTA Editorial to respect the Reserved Font Name; copyright and OFL included in fonts/Playfair-OFL.txt. This is a derived subset of Playfair Display, not an original VECTA typeface. Prata was studied and not shipped.

## Colour

Near-black retained from user's explicit direction; cool white for readable typography. Placeholder surfaces made neutral instead of blue slate. Deep red #c52632 restricted to selection/focus/underline states; hover text stays white to preserve contrast. Decorative red VECTA archive label removed. This is an implementation decision, not user approval of exact hex values.

## Copy

Removed generic portrait/freedom/direction slogans. Main explanations now name portraits, reportage, programme, duration, parallel episodes, materials and agreed deadlines. Formats remain photo / photo+Highlight / photo+film. Added three practical questions beside format choice. No new rates, turnaround promises, real cases or testimonials invented.

## Motion

One opening score: masthead clip reveal, title settling, leading plane reveal. Three secondary planes and three chapter titles move gently on CSS view timelines. Cross-document page transitions and same-document archive-filter transitions use native View Transitions where supported. Native scrolling, no scroll interception. Text defaults visible. All animations/transitions disabled for reduced motion.

## QA scope

Initial typography pass opened all 11 pages in cloud Chrome at layout 1497px / viewport1514×1040. No heading/scroll overflow. Exact 1440/1920 and full reduced-motion run not yet performed. Motion requires final runtime confirmation. Mobile and media remain out of scope. MagicPath quota exhausted; Vercel is authoritative.

Runtime confirmation: in published Chrome, studio-portrait animationTimeline=view(); transform changed from translateY(35px) to translateY(-2.45773px) after native scrolling. Chapter transform also changed. Masthead animationName=vecta-masthead. Vercel deployment dpl_4aST8NFehUbdYJZqWBxJ1KNSbb9K.
