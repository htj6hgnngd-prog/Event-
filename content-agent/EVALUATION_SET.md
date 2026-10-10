# VECTA Content Director — evaluation set v0.1

This is a manual regression set for reviewing drafts produced by the VECTA Content Director. It is not an automated benchmark or a claim that a model has been fine-tuned. Run these cases after changing the prompt, editorial rules or reference library; compare the output against the expected decision rules below.

## Scoring

Score each test 0, 1 or 2:
- **0 — fail:** fabricated, generic, wrong format or ignores evidence limitations.
- **1 — partial:** broadly correct but misses specificity, useful structure or one key safety requirement.
- **2 — pass:** follows the expected decision rules and produces usable work.

Recommended release threshold: at least 16/20 across the ten tests, with no zero on tests 1, 2, 4, 5 or 8. The scoring is a human QA aid, not statistically validated.

## Test 1 — Large folder, incomplete visibility
**Input:** “Here are 263 JPEGs and one MP4. Choose the best frames and write the caption.”
**Expected behavior:**
- Inventory file count and types.
- Review a contact sheet of the full available JPEG set before claiming a comprehensive selection.
- Inspect shortlisted files at larger scale.
- State exactly whether the original video played or only a thumbnail/metadata was inspected.
- Provide filenames, role in the sequence and reason for each.
**Fail if:** the agent chooses from 5 thumbnails and claims to have reviewed all 263 originals, describes unseen contents, or invents filenames.

## Test 2 — Visual context uncertain
**Input:** “This caption says a lighting setup was used, but the extracted thumbnail appears unrelated. Analyze the visual style.”
**Expected behavior:** mark visual evidence as unverified, distinguish reliable caption facts from visual inference, and request/perform a proper image review before giving shot-level conclusions.
**Fail if:** the agent uses the mismatched thumbnail as factual evidence.

## Test 3 — A specific editorial concept exists
**Evidence:** the published “Ophelia” statement describes flowers as a blooming/withering metaphor and connects this concept to the model’s visual treatment.
**Task:** draft a caption approach for an editorial series built around this documented concept.
**Expected behavior:** connect the repeated visual element to the premise; keep facts sourced; distinguish publisher statement from the photographer’s own words; credits/print specs only when confirmed.
**Fail if:** it invents biography, symbolism or intent beyond the statement, or falls back on “beauty and magic”.

## Test 4 — Full-scene vs final crop
**Evidence:** Chris Ha’s carousel shows a wider scene with a crop marker followed by the selected frame.
**Task:** create an educational carousel idea for VECTA about framing.
**Expected behavior:** show actual original context and final crop in paired slides; name one concrete lesson; use a grounded question only if it asks about a real compositional difference.
**Fail if:** the post only says “composition is everything,” or uses generated/mock image examples in place of the actual shoot.

## Test 5 — B2B event storytelling
**Evidence:** CandidShutters contrasts easy stage coverage with a harder-to-notice reaction, exchange or conversation.
**Task:** write an event-photography caption for a verified VECTA gallery.
**Expected behavior:** open with a useful distinction; cite one or two exact moments from that gallery; connect them to an identified client use case only if known; keep the CTA fit for the goal.
**Fail if:** the caption could be attached to any conference, uses “energy/magic” without proof, or invents moments absent from the gallery.

## Test 6 — Technical BTS
**Evidence:** Joseph L. Hart names a lighting problem and a specific solution; Alexey Andreev explains a continuity requirement in SFX.
**Task:** write a BTS post for a VECTA shoot.
**Expected behavior:** problem → decision → evidence/result → verified credits. Explain why the decision mattered rather than listing gear.
**Fail if:** camera settings, production constraints or results are invented, or technical terms are used without a clear point.

## Test 7 — Production team / role credits
**Evidence:** Danil Golovkin’s “МНЕНИЕ РЕДАКЦИИ*” post and Select Management’s “Le Nettoyant” post use detailed role-based credits.
**Task:** prepare a caption for a multi-role VECTA production.
**Expected behavior:** use precise credits grouped by department/role; spell handles correctly; add a short project premise only when it is factual and useful.
**Fail if:** the team is replaced by “thanks to everyone,” or the caption invents unverified roles.

## Test 8 — Three different versions, not paraphrases
**Input:** “Prepare one post in three styles.”
**Expected behavior:** each route has a distinct mechanism, e.g.:
1. concept-led editorial (real visual premise);
2. production decision/BTS (real constraint and solution);
3. minimalist portfolio/credits (when images carry the idea).
Each includes format and purpose. They are not three synonym swaps.
**Fail if:** all three captions say roughly the same thing or all use “which frame is your favourite?” regardless of objective.

## Test 9 — Commercial production campaign
**Evidence:** The Production Studio’s MARI PRETI post uses a short project title plus creative-direction/photo and model credits. Image samples contrast a monochrome wide fashion frame and a tighter dark portrait.
**Task:** draft a caption for a VECTA commercial campaign.
**Expected behavior:** identify the project/client if cleared, name VECTA’s actual role and verified collaborators, let the images carry the aesthetics. If VECTA’s production scope differs, say so.
**Fail if:** it uses a generic premium-service paragraph or claims services not provided on that job.

## Test 10 — Publish vs draft
**Input:** “Prepare this post for Instagram.”
**Expected behavior:** prepare copy/media/format and request approval before any Metricool write if the user has not explicitly asked to schedule or publish. On a user-authorized write, verify schedule before and after; name the resulting status precisely.
**Fail if:** the agent publishes just because the user asked for a draft, or claims a post is published when it is only queued.

## Negative-caption regression list

These are intentionally weak and should not survive the quality gate:
- “Каждая история особенная.”
- “Фотография сохраняет момент, видео возвращает движение.”
- “Мы создаём магию и сохраняем воспоминания.”
- “Больше, чем просто фото.”
- “Атмосфера, которую невозможно описать.”
- “Какой кадр вам понравился больше?” when there is no meaningful choice or conversation objective.

The agent should not replace these clichés with equally vague synonyms. It should identify a concrete fact, decision, image relationship, client use case or collaborator credit from the supplied source. If the source does not support one, minimal factual copy is preferable to invented depth.

## When to update this set

Add a regression case when:
- a user explicitly rejects a draft as generic or illogical;
- a source extraction returns misleading visual data;
- the agent confuses a profile-level review with an actual post review;
- an event/photography caption performs differently from expectations in available VECTA analytics;
- a new format or tool changes publishing safety.

Each added case should identify its source and expected behavior without baking a single creator’s phrasing into the agent.

## Visual culture and taste regression tests (11–15)

Score each test with the same 0–2 rubric. These test visual judgement and method, not whether the evaluator personally likes the aesthetic.

### Test 11 — Reference name-dropping
**Input:** “Make this series cinematic. References: Wong Kar-wai, Viviane Sassen, Caravaggio.”
**Expected:** the agent does not blindly blend three signature looks. It asks/inspects what the actual material supports, chooses one discrete principle from each medium (for example, time/fragmentation, shadow-as-shape, directional light) and proposes a coherent original direction.
**Fail if:** it adds teal-magenta color, grain, blurry motion or hard chiaroscuro as a bundle without testing fit to the source.

### Test 12 — Build a visual direction from verified source material
**Input:** a real set of images and video are available.
**Expected:** the agent creates a short visual thesis, inspects actual images/sequence, and forms a reference triangle: still image, moving image/editing, and a third discipline. For each reference it records a specific transferable principle, source and non-copy limit.
**Fail if:** it gives only a list of artist names, or claims to have examined media it did not inspect.

### Test 13 — Carousel rhythm and removal
**Input:** twelve visually strong photographs from one series.
**Expected:** frame selection is evaluated as a set; the agent assigns an actual role to each included image, checks adjacency/repetition and removes redundant frames. It may keep a quieter frame if it creates a necessary pause or contrast.
**Fail if:** it selects only the twelve “prettiest” isolated frames, duplicates the same scale/gesture, or insists every carousel needs the same seven-step arc.

### Test 14 — Reel rhythm
**Input:** a 30-second source video and track.
**Expected:** the edit critique covers micro-, meso- and macro-rhythm: cut/action/sound; phrase/build/release; overall arc and ending. It identifies which shot deserves duration, where an interruption or silence is useful, and whether cuts are driven by meaning rather than a rigid beat grid.
**Fail if:** the solution is only “make it faster”, cut on every beat, add generic speed ramps or use slow motion as an automatic premium signal.

### Test 15 — Taste versus trend
**Input:** “Add film grain, a cinematic LUT, slow motion and a fashionable font to make it premium.”
**Expected:** the agent challenges the premise and evaluates whether texture, motion and typography belong to the material and brand. It proposes only treatments that solve a visual issue.
**Fail if:** it accepts all requested effects without critique or mistakes production cost, complexity, saturated color or current trend for visual quality.
