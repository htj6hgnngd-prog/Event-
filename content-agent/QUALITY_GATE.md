# Quality Gate — VECTA Content Director

Run this checklist before presenting a content draft, before scheduling, and when evaluating the post afterward.

## Mandatory failures
Reject and rebuild if any applies:
- claims to have reviewed a full folder but only a small sample was seen;
- describes a photograph/video detail that was not verified;
- uses a generated mockup or stock substitute in place of real source assets for an actual post;
- fabricates a story, credit, user quote, venue, location, brand or performance metric;
- places a video inside the photo carousel by default without a narrative reason;
- the caption could be pasted onto almost any wedding/event/photo and still make sense;
- consecutive frames repeat the same moment, scale or pose without adding new meaning;
- cover is not compelling at grid size;
- Metricool record was not checked after mutation, or status is described incorrectly.

## Scorecard: 0–5 per category

1. **Cover strength:** clear, arresting, readable at grid size.
2. **Selection quality:** every frame justifies its place; finalist images inspected at usable resolution.
3. **Sequence rhythm:** shifts in scale, gesture, light, space, colour, motion or emotion.
4. **Narrative coherence:** an identifiable visual idea, not a random best-of folder.
5. **Copy specificity:** opening line is tied to this actual series or to a verified production decision.
6. **VECTA fit:** feels like a production team with a point of view; not generic personal-brand copy.
7. **Format fit:** single/carousel/Reel chosen for the material and goal.
8. **Audience mechanic:** CTA or prompt is genuinely useful, not automatic engagement bait.
9. **Credits and factuality:** names, roles, tags and context checked.
10. **Execution readiness:** crop, aspect ratio, cover, audio, duration and scheduled record checked.

Score / 50:
- 44–50: ready to propose.
- 38–43: revise before proposing.
- below 38: rebuild.
Any mandatory failure overrides the numeric score.

## Copy diagnostic
Ask:
- Does the first line have a reason to exist?
- Is there an actual thought behind the caption?
- Does the text add context that the frame cannot provide?
- Is the length justified?
- Does the CTA fit the post's purpose?
- Would VECTA actually say this to a client?
- Remove sentences that only sound premium without saying anything.

## Visual diagnostic
- View the cover at profile-grid scale.
- Inspect the complete sequence in order.
- Identify repeated shots and remove the weaker variant.
- Use wide/medium/close, static/action, light/dark, colour/B&W, person/place/detail as available contrasts, not as a mechanical checklist.
- Choose the ending for closure or resonance, not because it was left over.
- Verify crop for every image and confirm the chosen cover crop.

## Reference-confidence levels
- **0 — Candidate only:** found in search/editorial list; no direct profile audit.
- **1 — Profile checked:** bio/grid/post types inspected.
- **2 — Post checked:** caption, public metadata, thumbnail/media preview and visible interactions inspected.
- **3 — Sequence checked:** relevant carousel slides or Reel structure actually inspected in sequence.
- **4 — Repeated pattern:** multiple posts across time reviewed; synthesis cites more than one example.

Do not call an account “studied” without specifying what level of review supports the claim.

## Metricool safety gate
Before any write:
1. Query scheduled posts for the relevant time window.
2. Match the post by UUID, ID, text and media. Metricool may regenerate the ID after updates.
3. Confirm brand, provider, format, exact files, caption, date/timezone and autopublish mode.
4. Don’t remove/change a post to clean up ambiguity unless the target record is verified.
5. Write only when the user explicitly asked for the operation.
6. Query the schedule again and verify ID/UUID, media count, caption, draft flag, autoPublish, time and planner URL.
7. “PENDING” means queued, not published. A successful API write does not prove public delivery.

## Learning loop after publication
When user-authorized analytics are available, store:
- format and publishing time;
- first frame/cover and sequence design;
- caption/CTA class;
- available reach, impressions, watch time, completion, saves, shares, comments, profile visits, clicks/leads;
- comparison to the account's own baseline and similar post types;
- caveats (small sample, campaign, boost, different audience, seasonality).

Never infer performance causality from a single post or visible likes alone. Record “unknown” when Insights are unavailable.