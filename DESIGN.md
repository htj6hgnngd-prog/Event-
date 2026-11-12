# VECTA — evening editorial / v10

The user rejected the v9 lettering as rap-like, uneven and insufficiently refined. The current task is the whole visual system: composition, scale, pacing, navigation, page relationships and readable conversion paths. Do not treat a new font as the redesign. This file supersedes the v9 visual direction; its source and studies remain in Git.

## Evidence inspected

Desktop reference captures were made at 1440 px on 12 November 2026. Reference images are research only and are not in the site payload.

| Source | Inspected evidence | Useful rule | Do not import |
| --- | --- | --- | --- |
| [Bottega53](https://bottega53.com/) — previously selected | Full capture; first 3400 px viewed | Photography holds the mass; navigation is extremely quiet; dense and sparse scenes have different rhythm | Its content, client/publication marks, all-image wall as a substitute for the current no-media scope |
| [Greg Finck](https://gregfinck.com/) — previously selected | Full capture; upper sequence viewed | Strong editorial masthead, explicit margins, image/caption alignment, substantial negative space | Its logo geometry, photographic work or an identical composition |
| [Two Hearts & Co case study](https://www.behance.net/gallery/252049957/Breaking-the-Wedding-Website-Formula) | All 17 supplied project images viewed as overview, including grid and inner pages | A fixed column system, text/image scale hierarchy, functional filters without UI cards | Outdoor/nature positioning or cream-only branding |
| [Klassen Weddings case study](https://www.behance.net/gallery/230328215/KLASSEN-WEDDINGS-for-cinematic-and-luxury-weddings) | Three supplied overview images | Landscape/portrait montage and concise category explanations | Their media or arbitrary display font |
| [Magda Butrym](https://www.magdabutrym.com/) | Full desktop capture, top and next scene viewed | Centered quiet identity, balanced split navigation, a single dominant scene | Products, campaign imagery, shop mechanics |
| [THE WED](https://thewed.com/) | Full capture; actual browser hero viewed after cookie action | Magazine hierarchy, section labels are smaller than visual work, consistent caption scale | Newsletter overlay, editorial claims, same article grid |
| [The Lane](https://thelane.com/) | Full capture, top and body crops viewed | Distinct heading/body roles, major visual followed by smaller narrative material | Obstructive signup, four-column content feed for every section |
| [Château Voltaire](https://www.chateauvoltaire.com/en/) | Full capture, upper sequence viewed | Calm booking action, material/color consistency, image-to-copy balance | Illustrations, hotel story, orange palette |
| [Hôtel Costes](https://www.hotelcostes.com/) | Capture returned its text introduction state rather than a usable whole homepage | Small functional masthead and low-interaction journey; branding extraction returned Futura/Garamond | Unverified homepage composition; this capture is not proof of its full interaction system |

Observed reference type samples: THE WED extraction returned 72 px H1 and 52 px H2; The Lane about 80/57 px. These are extracted samples, not universal role sizes. Spacing in image-only case studies is a visual estimate. VECTA sizes below are deliberate implementation decisions.

## Fixed visual rules

Palette: almost black #0a0a0c, neutral paper #eae8e2, concentrated deep red #4b0712, muted old-gold hairlines #aa9163. Light surfaces use ink #242225 and secondary text #666268. No sepia overlay, fake metal gradients, noisy texture, floral flourishes or gothic decoration.

Two active typography families: Prata for composed display and Manrope for useful text. Cormorant italic is a restricted italic accent inside selected display phrases. Prata is self-hosted under SIL OFL; its Cyrillic cmap is verified. No synthetic italics or crude geometric distortions. The experimental v9 pen family and SVG drawings are not loaded by v10. They are not a finished typeface and must not be described as one.

Role scale at the principal desktop: utility 9–12 px, body 14–16 px, editorial statement 31–41 px, section 62–100 px, main page title 78–145 px. Only the Latin cover masthead may exceed that scale. Default text remains readable; no large calligraphic word occupies half a functional page.

Header: centered VECTA, two navigation links on each side, no pill, no overlay. Frame outer margin 5%, reading/spread margin 9%. Components align to those axes. A scene can break its alignment once, not at every edge.

Home pacing: dark cover and studio → continuous paper archive and approach → dark commercial formats and inquiry. The archive and approach share the paper surface without a second artificial separator. This is three tonal movements, not repeating equal-height sections.

No photography or video is published in this phase. Gray/red planes mark planned media scale and preserve existing labels. No reference, stock or generated photograph is substituted. This limits how much cinematic atmosphere can honestly be assessed; a blank plane is not evidence of finished photographic art direction.

## Whole-site prototype and route system

| Page | Dominant composition | Reading/action placement |
| --- | --- | --- |
| Home | Roman masthead, landscape plus smaller portrait; restrained type | Offering readable in first scene; date and work routes below; formats before final inquiry |
| Archive | Moderate title, quiet horizontal filter, asymmetric project sequence | Captions sit beside project scale; no fictional client names |
| Story | Two-line title crossing only the edge of a large cover; sequence of different crops | Intro has independent reading area; film frame and next routes retain hierarchy |
| Photo / film | A single clear title and a leading large frame | Description occupies its own left column; formats are directly reachable |
| Studio | Title, large portrait, concise introduction; second opposite-side scene | Method is structured in rows with short headings and supporting text |
| Formats | Paper surface, clear title, three editorial rows rather than price cards | Result, scope and action stay adjacent; no invented prices |
| Inquiry | Paper surface, moderate headline, left invitation/right form | Controls readable and calm; prepared Telegram message only |
| Three service/SEO pages | Same night surface, measured title and single leading visual | Scope and cost explanation use a shared two-column system |

## Motion and acceptance

One short cover-title entrance, initially visible. Native scroll; no repetitive chapter drift and no masked state that leaves a page blank. Reduced-motion fallback remains explicit. Media hover stays subtle. No extra animation framework or cursor gimmick.

Before publication: inspect real rendered home sequence and functional pages, verify titles never collide with body copy, controls receive pointer/keyboard focus, paper-surface text and inputs have contrast, all route links resolve, archive filter works, format selection reaches the correct inquiry, and no success is shown without actual delivery. Test the active desktop range and record actual viewport dimensions rather than claiming exact emulation.


## v11 — продолжение полной светлой версии

Все 11 страниц используют единое поле #f3f1eb, графит #292627, вторичный текст #68635f. Глубокий красный #510d1b остаётся в мастхеде и двух медиа-плоскостях; золото #806849 — только тонкие линии. Чёрные секции удалены из активной версии, а не чередуются с белыми. Сохраняются композиция v10, Prata / Cormorant / Manrope, маршруты и коммерческие переходы. Главный экран: тёмный текст на нейтральных плоскостях, красный мастхед. Новых изображений нет. Мобильная композиция не разрабатывается. Активный финальный слой — editorial-light.css; предыдущая система сохранена для истории.


## v12 — самостоятельная композиция светлой версии

Первый экран разделён на читаемую левую колонку и крупную плоскость справа. Заголовок и призыв не лежат поверх будущей фотографии; малый кадр связывает колонки. Мастхед уменьшен с 22.4 до 20.4vw. Уплотнены переходы студия → архив → подход; сохранены асимметрия и интервалы между изображениями. Отдельные масштабы для широкого десктопа. Правки этого прохода ограничены desktop media queries от 1100px. Тексты первого экрана и подхода сокращены, повторение географии убрано.
