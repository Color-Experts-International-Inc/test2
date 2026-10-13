# Adversarial critiques of the specialist drafts

Resolved in docs/PLAN.md. Kept for traceability.


## seo-critic

**Verdict:** The engineering is excellent, but the SEO plan builds for indexation instead of authority. The plan wants about 375–400 indexable URLs in November 2026, mostly code-generated single designs, on a domain with no history. That launch would follow three 2026 spam updates aimed at content-level abuse; secondary coverage reports the August update ran Aug 18–21, though I did not find Google's own announcement. The plan's own competitor evidence argues against this: SketchJoy indexes topic hubs, not individual designs. Its gates check whether files and text strings differ (dHash, trigram Jaccard). Google judges whether a page helps the searcher, which those checks don't measure. The six sections also disagree on:
- URLs for the online coloring app, asset host, printables, bundles, color-by-number, the 28 Arabic letter slugs and team pages;
- the launch dates (Ramadan hub on Nov 10, Nov 20, or "Dec 1–12");
- what the Islamic review gate covers.

Since slugs and image URLs are never meant to change, these must be settled before anything ships. Cannibalization is managed by comparing keyword strings, so the plan still creates overlapping grids: event × age facets, a lantern sub-hub that repeats the Ramadan grid, an Islamic parent that aggregates everything, a no-faces hub that equals the whole launch catalog, and two color-by-number paths. The traffic KPIs are about 5–10× too high for a 4-month-old domain: 80–200K clicks in Feb 2027, and top 10 for "ramadan coloring pages". Link acquisition is a contact list, not a program with an owner, budget and quotas.

Several platform facts in the plan check out:
- FAQ rich results were retired on 2026-05-07 (TechWyse, jsonld.com). The plan is right not to chase them.
- Google announced in Nov 2025 that Practice Problems support would be removed from January 2026 (Google Search Central blog).
- AI Overviews image generation and the Google Images redesign were announced on 2026-07-14, rolling out in English starting with US desktop.

I could not confirm that the Licensable badge is still live in 2026, because the sources I found date from 2018–2020. The Ahrefs connection failed (proxy 403), so no live SERP or volume data was pulled. All volumes remain the brief's estimates.

Bottom line:
- Lock one URL specification.
- Ship the Ramadan cluster first, around Nov 10, with about 120–150 indexable URLs: hubs of at least 20 designs, Arabic letter pages, printables, bundles, and real entity pages.
- Set single pages from the parametric generators to noindex until Search Console shows demand.
- Cut the facet pages and per-design format URLs.
- Rebalance the inventory toward printables that an AI Overview image can't replace.
- Re-baseline the KPIs and staff link acquisition properly.

- **[blocker] Cross-section URL spec (SEO §1.2/§1.3 vs arch §3.4/§4/§6, content §4.5/§5, design §6, app §4.3)** — The sections use different URLs for the same objects:
- Online coloring: `#color` on the design page (SEO), `/color/#slug` (arch), `/color-online/{topic}/{design}/` (app), `/color-online/{slug}/` (design).
- PDFs and images: same-origin `/files/...` (SEO), `cdn.kidscolorit.com/d/` and `/pdf/` (arch), `/assets/{hub}/{slug}/` (content), `/pdf/{slug}-a4.pdf` and `/img/` (design).
- Printables: `/printables/{slug}/` (SEO), `/printables/{type}/{slug}/` (arch), root `/ramadan-calendar-for-kids/` (content).
- Bundles: `/bundles/` (SEO), `/coloring-books/` (arch), `/{id}/` (content).
- Hubs: `/color-by-number/ramadan/` vs `/ramadan-color-by-number/`; `/islamic-geometric-coloring-pages/` vs `/islamic-geometric-patterns/`; `/shape-` vs `/shapes-coloring-pages/`.
- People and policy pages: `/team/` vs `/authors/` vs `/about/reviewers/`; three different URLs for the Islamic standards page.
- Letter slugs: SEO uses daal/dhaal/saad/daad/ayn/ghayn; content uses dal/dhal/sad/dad/ain/ghain.

The SEO plan says slugs never change. Image URLs that change reset their Google Images history, which rebuilds slowly. Reconciling after launch means mass 301s and lost image equity.
  - Fix: Before any generator writes manifests, freeze a single route table, `docs/URLS.md`, owned by SEO, and generate `packages/core/routes.ts` from it. Add a CI test asserting that every template's path matches the table. Choose:
- designs: `/{primary-hub}/{slug}/`
- assets: same-origin `/files/{img|pdf}/...` with no hash in the filename, served from Workers or R2 behind the same origin
- printables: `/printables/{slug}/`
- bundles: `/bundles/{slug}/`
- color by number: `/color-by-number/{topic}/`
- Islamic geometric: `/islamic-geometric-coloring-pages/`
- people: `/team/{slug}/`
- standards: `/about/islamic-content-guidelines/`
- letter slugs: one transliteration dictionary

Add a test that fails if any slug differs from the dictionary.
- **[blocker] Online coloring routes (app §4.3, design §6.4 vs SEO §0 item 5, arch §0 item 7)** — The app plan creates one `noindex,follow` page per design at `/color-online/{topic}/{design}/`. These pages are linked from every card and prerendered by Speculation Rules. It also indexes `/color-online/{topic}/` grids at launch. That means hundreds of noindexed crawl targets, engagement split away from the URL that should rank, and indexable topic grids that duplicate the coloring hubs. It contradicts the SEO plan's rule of one canonical HTML page per design, with online topic hubs only after demand is proven.
  - Fix: Use one app shell, `/color/#slug` (noindex, one URL, precached by the service worker), or open the canvas on the design URL with `#color`. Do not create per-design app routes. Keep one indexable `/color-online/` hub. Create `/color-online/{topic}/` pages only after Search Console shows at least 200 impressions a month for that topic (SEO §1.5). Remove the speculation-rules prerender of the app route, which also inflates analytics.
- **[blocker] Per-design indexation of generator output (SEO §1.2, §3.3–3.4; content §0 items 1 and 10, §5)** — About 300 of the roughly 375 launch URLs would be single outputs from parametric generators: 38 mandalas, 48 geometric tiles, 20 lanterns, 12 snowflakes, 26 A–Z pages, 41 numeral pages, 20 count-and-color pages and 28 color-by-number transforms. Their copy comes from `describe()` plus AI-drafted blurbs.

The gates (dHash at Hamming distance 6–12, trigram Jaccard below 0.5) show that files and strings differ. They don't show that a searcher gains anything from the 17th mandala URL compared with the hub. Coverage of the 2026 spam updates (March, June and August) reports scaled content abuse as a main target, including programmatic sites that lost hundreds of thousands of queries. A new domain has no trust to absorb that. The plan's own teardown also notes that SketchJoy indexes topic pages, not individual designs.
  - Fix: Publish an indexability matrix for launch day.

Index:
- coloring hubs with at least 20 designs
- the 3 Arabic alphabet hubs and 28 letter pages
- printable hubs and items
- bundles, guides, tools
- real entity pages (named mosques, Quran animals and foods, once studio art exists)

Set `noindex,follow` on single pages from parametric families (mandala, geometric, snowflake, lantern variants, A–Z, numbers, shapes, color-by-number). They stay linked and usable. Point their PDFs' canonical header at the hub.

Promote a design to indexable only when both are true:
- Search Console shows its named subject earning impressions on the hub, or a keyword tool shows at least about 50 searches a month for that subject;
- it has unique pedagogical content.

Make indexability a flag per family, so a whole family can be set to noindex in one deploy if an update hits. Target 120–150 indexable URLs at launch.
- **[blocker] Launch calendar and review gate (SEO §10; content §5 and §8 schedule; app §9; Islamic §5.11 rule L12 and §4.3 Wave 1)** — The Ramadan hub is dated Nov 10 with 60 designs (content), Nov 20 with at least 40 (SEO), and "Dec 1–12, launch alongside the Ramadan hub" (app).

The Islamic rule L12 keeps every `islamic.hub` entry out of the production build until both the Islamic studies and Arabic reviewers approve it. The SEO plan gates only calligraphy, 99 Names, wudu/salah, Hajj and Quran animals. Reviewer contracts are only due by Nov 1, and the 48-hour turnaround starts Nov 15. If reviewers slip, the whole Ramadan cluster cannot be built, and mid-December indexing fails.
  - Fix: Adopt one calendar with the content plan's Nov 10 date. The Ramadan hub ships with about 40–60 code-generated designs: Tier A objects and patterns, no sacred text. Review them in one batch on Nov 3–7. Sign reviewers by Oct 24, with a named backup.

The hub does not need the canvas at launch. It ships with PDFs, and the "Color online" button appears when the app is ready.

State in SEO §10 that L12 applies to every Islamic hub, and treat reviewer hiring as the first critical-path task.
- **[major] Hub hierarchy and duplicate grids (SEO §2.4 H6/H18/H19, §2.5; content §5 Wave 1B and 1C)** — Several hubs would repeat other hubs' grids:
- `/ramadan-lantern-coloring-pages/` lists lanterns whose primary hub is `/ramadan-coloring-pages/`, so it is a subset copy.
- `/islamic-coloring-pages/` "aggregates all Islamic designs" (content plan).
- `/no-faces-coloring-pages/` is a curated grid, but every launch design is `faces:none`, so it equals the whole site.
- `/winter-coloring-pages/` and `/snowflake-coloring-pages/` show the same 12 snowflakes.
- `/geometric-coloring-pages/` (20) and `/islamic-geometric-coloring-pages/` (40) come from the same generators.
  - Fix: Enforce a strict tree:
- Each design has exactly one primary leaf hub, and lantern designs are primary in the lantern hub.
- Parent hubs show at most 12 featured cards plus tiles linking to child hubs, never the full child grid.
- `/islamic-coloring-pages/` is a navigator (SEO version), not an aggregator.
- `/no-faces-coloring-pages/` is an editorial policy explainer that links to hubs. Don't give it its own grid until animate content exists.
- Launch winter only. No snowflake hub until there are at least 20 snowflake designs.
- Launch `/geometric-coloring-pages/` only when it has non-Islamic designs that differ from the Islamic geometric hub.

Add a CI check that fails if any two indexable hubs share more than 30% of their cards.
- **[major] Keyword ownership collisions (SEO §2.1–§2.6)** — Several queries are assigned to more than one URL:
- "bold easy ramadan": `/bold-and-easy-coloring-pages/` and the facet `/ramadan-coloring-pages/bold-and-easy/`.
- "islamic coloring book pdf": a secondary of `/islamic-coloring-pages/` and the slug of `/bundles/islamic-coloring-book-pdf/`.
- "color by arabic letter": `/arabic-alphabet/coloring-pages/` and `/color-by-number/arabic-letters/`.
- "ramadan mandala": the mandala hub, while the Ramadan mandalas live in the Ramadan hub.
- Arabic numbers: `/number-coloring-pages/`, `/color-by-number/arabic-numbers/` and content's `/arabic-numbers/`.
- Eid al-Adha: in the `/eid-coloring-pages/` meta, while `/eid-al-adha-coloring-pages/` exists.
- "ramadan coloring pages for preschool": a secondary of the main hub and also its own facet.
- "When is Ramadan 2027": the hub quick-facts, the FAQ, `/ramadan-activities-for-kids/` and `/guides/when-is-ramadan-2027/`.
  - Fix: Give each query exactly one URL, and delete it from the other pages' secondaries, meta descriptions and FAQs. Extend `export-keyword-map.ts` and `cannibalization.ts` to check secondaries as well as primaries. Make `/eid-coloring-pages/` an Eid al-Fitr page that links to the Adha hub. Drop the "when is Ramadan" guide: timeanddate and news sites own that query. Keep a short dates box on the hub instead.
- **[major] Cannibalization detection method (SEO §2.1 rule 1, scripts/seo/cannibalization.ts)** — The check compares normalized primary-keyword strings only (lowercased, singularized, colouring→coloring). It cannot detect pairs that Google serves with the same results page, such as "islamic coloring pages" vs "muslim coloring pages", "eid coloring pages" vs "eid mubarak coloring pages", "ramadan activities for kids" vs "ramadan printables", or facets vs their parent hub. Google decides cannibalization by search intent, not by string.
  - Fix: Cluster keywords by SERP overlap:
- Pull the top 10 results for every primary and secondary keyword from a SERP API. The Ahrefs connector failed to connect in this session.
- Merge keywords that share at least 4 of 10 URLs onto one page.
- Block a new hub or facet when its target shares at least 4 URLs with an existing owner.
- Each month, re-check the Search Console query→page export (BigQuery) for queries where two or more URLs earn impressions.
- **[major] Facet pages (SEO §1.7, §2.6 event × age and event × style)** — The plan whitelists 15 or more static facet pages: Ramadan × toddler, preschool, kindergarten, easy and bold-and-easy; Eid × toddler and preschool; mandala and geometric × adults or easy. Each is a subset of the parent's grid plus 150–300 words of tips, which is near-duplicate content. "Ramadan coloring pages for preschoolers" almost certainly returns the same results as the head term. And with only about 60 Ramadan designs at launch, a 12-design minimum means the facet grids overlap heavily.
  - Fix: Create no facet pages at launch. Show age and difficulty as anchored sections on the parent (`#preschool`, `#bold-and-easy`), each with real tips, plus the JavaScript filter. Create a facet page only when all three hold:
- its search results share less than 30% with the parent's;
- it has at least 20 designs that mostly don't appear in the parent's first rows;
- Search Console shows the parent ranking 11–30 for the facet query.
- **[major] Format item URLs (SEO §1.2 and §2.6 vs §3.4 rule 2; content G18, G20, G25)** — Color-by-number and dot-to-dot items get URLs like `/color-by-number/{topic}/{item}/`. Yet G18 color-by-number pages are transforms of approved base designs (same art plus number labels), and dot-to-dot and how-to-draw pages reuse the same objects. This breaks the SEO plan's own rule that variants are grouped on one page unless the named subject differs.

The content plan also has 6 Ramadan word searches, 6 mazes and 4 dot-to-dots. That is below SEO's 8-item index threshold, so `/word-search/ramadan/` and the others would be noindex, yet they are listed as Nov 20 launch pages.
  - Fix: Put color-by-number, dot-to-dot and bold versions on the base design page as tabs or anchors (`OtherVersions`). Format hubs list cards linking to `base/#color-by-number`. Create no format item URLs. Merge the Ramadan word search, maze and dot-to-dot sets into sections of `/ramadan-activities-for-kids/` until each set reaches at least 12 items, or raise the inventory before launch.
- **[major] Hub copy template (SEO §2.3)** — The template asks for 800–1,200 words under the grid on Tier A hubs. It repeats the same sections on 40–60 hubs: "How to use and print", "Coloring ideas and palettes" and a 4–8 question FAQ. That produces boilerplate across the whole site, an essay under a grid that parents skip. The 40% boilerplate check runs within one page, not across hubs.

"What is Ramadan? Explained for kids" appears on the hub, on `/ramadan-activities-for-kids/` and on `/guides/how-to-explain-ramadan-to-kids/`.
  - Fix: - Set each hub's copy length from what the top 5 results actually show, often 150–400 words.
- Move printing and licence help to one `/how-to-print/` page and link to it.
- Add a cross-hub check that fails if more than 15% of word shingles are shared between any two hubs.
- Keep one canonical explainer per topic, as the guide, with a two-sentence summary and a link on hubs.
- Use only FAQs specific to the hub. Put the generic ones (free?, classroom use?, Letter or A4?) on a single `/faq/` page.
- **[major] KPIs (SEO §11)** — The plan targets 3–6M impressions and 80–200K organic clicks in Feb 2027, plus top 10 for "ramadan coloring pages" at peak, on a domain launched in Oct 2026 with 80–120 referring domains. The brief's own estimates put the whole English Islamic cluster at peak in the low hundreds of thousands of US searches ("ramadan coloring pages" alone 50–90K). 80K clicks would need top-3 positions across almost the entire cluster, at about 25% blended click-through, in results pages crowded with image packs, Pinterest and AI Overviews.

"Indexable URLs 700 → 1,500 → 3,000" rewards exactly the scaled output that spam updates punish.
  - Fix: Re-baseline with a keyword-share model:
- Feb 2027: floor 3K, target 15K organic clicks; 300–800K impressions.
- "ramadan coloring pages": top 20 in 2027, top 10 by Ramadan 2028.
- Measure wins on spam-flooded long-tail queries (wudu steps for kids, arabic letter tracing, ramadan calendar printable for kids).
- Replace the URL-count KPI with "share of indexable URLs with at least 1 click in 28 days", target at least 50%, plus the indexed ÷ submitted ratio.
- Treat Pinterest as the main 2027 seasonal channel in the forecast.
- **[major] Link acquisition (SEO §8 Outreach and Digital PR)** — The link plan is a target list of 300 contacts and six PR angles. It has no owner, budget, weekly volume or conversion assumptions. At a typical 3–8% link rate that list yields about 10–25 links, not 80–120 referring domains by April.

The fasting-hours study competes with timeanddate and the annual news graphics. School-district resource pages link to established brands. There are no link-scheme guardrails for co-branded PDFs, embeddable tools or links from the parent company.
  - Fix: - Name an owner (about 0.5 FTE) and budget a PR freelancer.
- Set quotas: about 40 personalized pitches a week from Nov to Feb, tracked by status.
- Have 3 teacher-facing link assets live by Nov 20: the ungated Ramadan pack, a 28-letter tracing workbook, and a mosque passport.
- Build partnerships with weekend madrasahs, Islamic school associations and Muslim parenting creators (free co-branded packs, with a credit link to the landing page requested, never required).
- Answer journalist requests on platforms such as Qwoted and Featured for "explaining Ramadan to kids" in Jan–Feb.
- Guardrails: brand-name anchors only, no paid or exchanged links, no keyword anchors inside embeds, and a single link from the parent company's About page, not sitewide.
- Reset the referring-domain KPI to 10–20 by mid-January and 40–60 by mid-April.
- **[major] Generic evergreen hubs at launch (SEO §10 Oct 23 and Nov 6, §2.5)** — The Oct 23 and Nov 6 waves include fall (24), mandala, A–Z, numbers, shapes, rainbow, space, easy, toddler and preschool hubs, and later dinosaur AI line art. These head terms belong to DR70+ incumbents, the content is generic and easy for AI to replace, and about 150 such URLs would dilute the site's topical focus during its first crawl.

The content plan has no fall or leaf generator at all. Fall demand also peaks in Oct–Nov, before a new site can rank.
  - Fix: Launch the Islamic cluster plus Islamic geometric patterns first, since those are genuinely differentiated. Drop fall 2026. Defer generic evergreen hubs to the July 2027 build month unless they have a Muslim angle, for example A–Z as "M is for Mosque" folded into an Islamic alphabet set. Deprioritize the dinosaur and ocean AI line art in the illustration backlog.
- **[major] AI Overview image threat vs launch inventory (SEO §9; content §5 and §6.2)** — The plan names the threat correctly: AI Overviews image generation and the Google Images feed were announced on Jul 14 2026, rolling out in English. Yet most of the launch inventory, and most Wave 2 AI-line-art work (foods, dinosaurs, ocean), are simple single-subject pages of exactly the kind an AI Overview can generate. The plan has no measurement for this, beyond a 20-prompt monthly panel.
  - Fix: - Make printables, bundles, workbooks, calendars and trackers the primary product.
- Put "Download all N as one PDF" above the grid on every hub.
- Tag Search Console queries as "replaceable" (simple "[x] coloring page") or "durable" (worksheet, calendar, workbook), and track click-through for each class every month.
- Track SERP features (AI Overview present, image generation shown, image pack) weekly for all 53 tracked keywords.
- Non-English results are not yet exposed to this feature, so move Indonesian work earlier.
- Stop spending AI line-art budget on generic subjects.
- **[major] Copy at scale and sourcing (SEO §3.2 and §3.4 rule 7; content §4.4; arch §7.1)** — Every design needs a "human-written" 25–60-word description, alt detail, tips, a palette and a sourced fun fact, with 3,000 URLs planned by Oct 2027 and a small team. In practice that copy will be AI-drafted with an `editedBy` name added. Sourced fun facts written at that volume will include made-up sources, which is an accuracy risk for Islamic content. The trigram gate is easy to pass with paraphrase, so it doesn't measure quality.
  - Fix: Make `funFact` optional, and draw it only from the reviewed fact files in Islamic §5.5, referenced by ID. Free-form facts are not allowed. Write per-design copy only for indexable designs, which is far fewer after the noindex change above. Publish an editorial capacity model (words per hour × hours available) and cap release velocity to it. Audit 10% of each batch by hand and record the rejection rate.
- **[major] Mosque hub and entity pages (SEO §2.4 H8, §2.6, §10 Nov 6 vs content G11 rule, Islamic §4.3)** — The SEO plan ships "12 mosques with CG silhouettes and fact tables" on Nov 6 under the title "30 Mosque Coloring Pages: Famous Masjids". The content plan forbids naming a generated mosque after a landmark, and the Islamic plan requires landmarks to be studio-drawn, with Wave 1 due Dec 10. A launch hub of generic "A mosque" designs under a "Mosques of the World" title is misleading and thin.
  - Fix: Launch `/mosque-coloring-pages/` with a style-based title, for example "Mosque Coloring Pages: Ottoman, Mughal & Moroccan Styles". Add an entity page only when its studio landmark art lands, each with a facts table, Wikidata `sameAs` and a vetted fact. Change the title to "Famous Masjids" and add counts only when real landmarks exist. Schedule the Wave 1 landmarks before the peak, ideally by Dec 10.
- **[major] Calligraphy, 99 Names and bismillah (SEO H16 and H17, §10 Nov 6–13, rank-tracking list vs content decision 11 and Islamic §2.2)** — Hubs are scheduled, and keywords tracked ("bismillah coloring page", "99 names of allah coloring"), for content the content plan excludes at launch: no divine names, no Quranic text, no Bismillah. A calligraphy hub at launch would hold only the "Eid Mubarak" and "Ramadan Kareem" lettering already listed in the Ramadan and Eid hubs. Even "Alhamdulillah" contains a divine name.
  - Fix: Don't publish the calligraphy or 99 Names hubs until reviewed sacred-text designs exist, using the Islamic `altVariant` and notice rules. Remove those keywords from the 2027 targets, or write the review path and date explicitly. Keep the lettering designs primary in the Ramadan and Eid hubs.
- **[major] Indonesian and other locale pilots (SEO §2.7 and §10 Dec 14; arch §3.5)** — The plan leaves the Indonesian pilot pages undefined:
- whether cards link to English design pages with English PDFs and footers;
- who writes the Indonesian titles, alt text and copy;
- whether hreflang applies, given that the plan says the Indonesian designs differ (ketupat, bedug), so the pages aren't true twins.

Indonesian results for "mewarnai ramadhan" are led by high-authority media and Pinterest. A Dec 14 launch on a 2-month-old domain leaves about 8 weeks before the Ramadhan peak. Translating "every hub" without native editors creates the same scaled-content risk as the English plan.
  - Fix: Write a locale content spec:
- Indonesian titles, alt text and blurbs;
- A4-default Indonesian PDFs with a Nama/Kelas box;
- either localized design pages or an explicit link-to-English rule;
- a native reviewer gate.

Move the Indonesian Ramadhan and hijaiyah pages to around Nov 24, since non-English results aren't yet exposed to AI Overview image generation. Add hreflang only between genuinely equivalent pairs. Make the Indonesian Pinterest profile the primary channel for that market.
- **[major] Authorship and image metadata (SEO §3.1 byline and §4.3 VisualArtwork.creator; content §4.4 source; arch §3.2 IPTC)** — "Illustrated by {artist}" and `VisualArtwork.creator` set to a Person are false credits for code-generated art, which undercuts an E-E-A-T strategy. Tagging AI-assisted art with `compositeWithTrainedAlgorithmicMedia` can trigger AI labels in Google's "About this image" and on Pinterest. Pinterest uses image metadata for its AI labels (verify current behaviour), which could reduce reach on the main 2027 seasonal channel.
  - Fix: For generated art, use a byline like "Generated by the KidsColorIt pattern engine, curated by {name}", with creator set to the Organization. Tag code art truthfully as `algorithmicMedia`, which is not generative AI. Keep AI-assisted art out of Pinterest-heavy seasonal sets, and disclose AI use on the page itself.
- **[minor] hreflang (SEO §5.3 vs arch §7.2)** — The SEO plan emits `x-default` on every page, even while only English exists. The architecture plan emits hreflang only when there are at least 2 alternates.
  - Fix: Use the architecture rule: emit hreflang only when at least one published twin exists, and never emit `x-default`-only tags. Run the reciprocity test only on actual pairs.
- **[minor] FAQ markup (SEO §2.3 and §4.1, arch §7.3)** — The plan is correct that FAQ rich results were retired on 2026-05-07. It still requires 4–8 FAQs and FAQPage markup on every hub, which adds templated content with no rich-result return. The architecture plan's comment still says FAQ results are "restricted", which is out of date.
  - Fix: Use FAQs only for questions specific to the hub. Keep the markup only where those visible FAQs exist. Update the architecture plan's comment to say the rich result is retired.
- **[minor] robots.txt (SEO §5.5 vs arch §7.5)** — The architecture plan disallows `/search/`, so crawlers never see its noindex, and the URL can still be indexed from links. It also blocks training bots and Google-Extended from the whole site, while the SEO plan blocks them only from `/files/` and allows Google-Extended.
  - Fix: Use the SEO version for `/search/`: crawlable, with `X-Robots-Tag: noindex`. Treat the training-bot policy as a business decision, noting that Google-Extended doesn't affect Search rankings or AI Overviews. Then document one robots.txt.
- **[minor] Removed content (SEO §5.9 vs arch §4 URL rules)** — The SEO plan returns 410 for withdrawn designs. The architecture plan 301-redirects retired designs to their hub, which Google tends to treat as a soft 404.
  - Fix: Return 410 unless a genuine equivalent page exists, and drive it from `gone.json`.
- **[minor] Years in URLs (SEO §2.6 guides; arch printables `ramadan-calendar-2027` and `supersededBy`)** — `/guides/when-is-ramadan-2027/`, `/guides/ramadan-2027-fasting-hours/` and `/printables/calendars/ramadan-calendar-2027/` break the SEO plan's own §1.5 rule against years in URLs.
  - Fix: Use evergreen slugs (`/guides/ramadan-fasting-hours/`, `/printables/ramadan-calendar-for-kids/`) and show each year's edition on the page.
- **[minor] Trailing-slash redirects (SEO §5.1 vs arch wrangler.jsonc)** — `auto-trailing-slash` may return a 307. A temporary redirect is a weaker canonicalization signal for external links that omit the slash.
  - Fix: Force a 301 or 308 through the Worker or a Redirect Rule, and add an E2E test asserting the status code.
- **[minor] Hub thresholds and pagination (SEO §1.6 and §1.8 vs arch §4 and design §5 EmptyState)** — The minimum design count for an indexable hub is 8 (SEO), 6 (architecture) or 12 (design). The Ramadan hub is planned to reach "80+" designs on Jan 11, which exceeds the SEO plan's 60-card cap without a stated way to split it.
  - Fix: Require at least 20 designs for an indexable coloring hub. Before Ramadan passes 60 designs, make the lantern, crescent, mosque and mandala child hubs the primary homes, and keep the Ramadan hub at 60 cards or fewer.
- **[minor] Season banner and daily rebuild (SEO §5.1, §6; arch §7.6 IndexNow)** — The banner text changes on every page every day. If any diff logic hashes the HTML, IndexNow would ping thousands of URLs daily, and lastmod could drift.
  - Fix: Base IndexNow and lastmod only on the content entry's `updatedAt`, and keep banner text out of every diff.
- **[minor] Indexable HTML sitemap pages (SEO §1.8)** — `/sitemap/{silo}/` pages with up to 600 links are indexable but have no search value.
  - Fix: Set them to `noindex,follow`.
- **[minor] Image licence metadata (SEO §4.1)** — The plan calls licence metadata the "main investment". The Licensable badge doesn't improve rankings, and I couldn't confirm it is still shown in 2026.
  - Fix: Implement it, since it's cheap, but put the main investment into image quality: at least 1200 px previews, descriptive filenames, the text around each image, and hub thumbnails that link to large images.
- **[minor] Core Web Vitals KPI (SEO §11)** — "100% of mobile URLs good" can't be measured through Chrome UX Report data for a new, low-traffic site.
  - Fix: Measure with Cloudflare real-user monitoring and Lighthouse CI until Chrome UX Report data appears.
- **[minor] Search intent mismatches (SEO §2.4–§2.6)** — Several target queries expect a different page type:
- "mosque drawing" and "eid drawing easy" return mostly video and image results;
- "animals in the quran" and "foods mentioned in the quran" return informational articles;
- "ramadan activities for kids" returns listicles.
  - Fix: Shape each page to its results: publish how-to-draw time-lapses as YouTube Shorts and embed them with a transcript; write the Quran animals and foods pages as article-first; make the Ramadan activities page a numbered list of activities with the printables embedded.

**Missing:**
- A launch-day indexability matrix listing every page type and generator family as index or noindex, the reason, and the condition for promotion. Store it as data so a family can be flipped in one deploy.
- A check of what currently ranks for the top 30 targets: page types, AI Overview and image-generation presence, image packs, Pinterest, video and listicles. All volumes in the brief are estimates, and the Ahrefs connector failed to connect in this session.
- A domain history check for kidscolorit.com: Wayback captures, previous owners, existing backlinks and any manual actions, to rule out expired-domain abuse.
- An operating plan for link acquisition: owner, budget, weekly quotas, a tracking sheet and link-scheme guardrails covering co-branded PDFs, embeds and parent-company links.
- A rollback playbook for spam or core updates, with monitoring of "Crawled – currently not indexed" and "Discovered" per family from week 1, and a one-deploy switch to noindex a family.
- An image URL permanence policy: one asset host, no filename hashing, and no re-encoding that changes paths.
- A locale content specification: who writes and reviews each language, localized PDFs and alt text, whether design pages are localized or link to English, and hreflang rules for pages that aren't exact twins.
- Measurement of AI Overview and image-generation presence for each tracked keyword, and click-through for replaceable vs durable query classes.
- Pinterest operating limits. A Pinterest community staff reply puts RSS auto-publishing at about 200 pins a day across all feeds; this needs to be confirmed. The plan also needs a policy on how AI-modified labels affect seasonal sets.
- An editorial and review capacity model (hours × throughput) that limits release velocity, both for Islamic studies and Arabic review and for copy editing.
- Brand and direct-channel resilience targets: newsletter, WhatsApp channel and PWA installs, as a hedge against AI Overviews and Google Images taking clicks.
- Weekly monitoring for queries where Search Console shows two or more site URLs earning impressions, as a live cannibalization alarm.

**Contradictions:**
- Online coloring URL: SEO puts `#color` on the design page and arch uses a single `/color/#slug` shell, while app uses per-design `/color-online/{topic}/{design}/` (noindex) and design uses `/color-online/{slug}/`. SEO or arch wins: no per-design app URLs.
- Asset host: SEO uses same-origin `/files/` and says never move images to a subdomain; arch uses `cdn.kidscolorit.com`; content uses `/assets/{hub}/{slug}/`; design uses `/pdf/` and `/img/`. SEO wins, with one permanent same-origin path.
- Ramadan hub launch: content says Nov 10 with 60 designs, SEO says Nov 20 with at least 40, app says Dec 1–12 "alongside the hub". Content's Nov 10 wins, and the canvas follows later.
- Scope of the Islamic review gate: SEO gates only specific categories, while Islamic L12 gates every `islamic.hub` entry. Islamic wins, but the SEO schedule must then treat reviewer hiring as the critical path.
- Wave timing: SEO ships geometric, mandala, the Arabic alphabet and fall on Oct 23, while content ships them on Nov 24 and Dec 8 and has no fall generator. Content wins and fall is dropped.
- Mosque pages: SEO plans 12 named mosques with code-generated silhouettes on Nov 6, while content forbids naming generated mosques and Islamic requires studio landmarks by Dec 10. Content and Islamic win.
- Calligraphy and 99 Names: SEO ships them Nov 6–13, while content excludes divine names and Bismillah at launch. Content and Islamic win.
- Wudu and salah printables: SEO ships Dec 8, while the content backlog has the designer art due Jan 10. Prioritize the designer art to land in December, because these are the highest-gap keywords; until then, the content date stands.
- Index threshold for a hub: SEO says at least 8 designs, arch at least 6, design at least 12. Use at least 20, which is closest to the design plan.
- Title brand suffix: SEO says none, while arch and design add " | KidsColorIt". SEO wins.
- Year-stamp window: SEO uses 16 weeks before the event, arch 150 days. SEO wins.
- robots.txt: SEO allows Google-Extended, blocks training bots only from `/files/`, and leaves `/search/` crawlable with noindex. Arch disallows `/search/` and blocks training bots and Google-Extended site-wide. SEO wins on `/search/`; the training-bot policy is a business decision.
- Retired designs: SEO returns 410, arch 301-redirects to the hub. SEO wins.
- Arabic letter slugs: SEO uses daal, dhaal, saad, daad, ayn, ghayn; content uses dal, dhal, sad, dad, ain, ghain. Pick one dictionary and freeze it before launch.
- Years in URLs: SEO forbids them but lists guides `when-is-ramadan-2027` and `ramadan-2027-fasting-hours`, and arch has printable `ramadan-calendar-2027`. The no-year rule wins.
- Color-by-number item URLs (SEO §1.2) contradict SEO §3.4 rule 2, which groups variants on one page. The grouping rule wins.
- Hub card cap: SEO caps a hub at 60 cards, design shows "Show all 49 (if >48)", arch renders all cards (about 120). SEO wins.
- `/islamic-coloring-pages/`: SEO has a top-24 navigator, content aggregates all Islamic designs. SEO wins.
- Online topic hubs: app indexes `/color-online/{topic}/` at launch, while SEO waits for Search Console demand. SEO wins.
- Visual distinctness thresholds: SEO uses dHash ≥10 within a hub and ≥6 site-wide, content uses pHash ≥12 and ≥8. Use content's stricter numbers plus a gate on the named subject.
- Design copy minimums: SEO requires a 25–60-word description and 80 unique words, arch requires at least 60 words, content requires a one-sentence blurb. Merge them into one rule, applied only to indexable designs.
- hreflang: SEO always emits `x-default`, arch emits hreflang only when at least 2 alternates exist. Arch wins.
- SearchAction: SEO emits it, arch omits it. Either is fine, but choose one.
- Hosting plan: SEO uses Workers Paid with assets on Workers, content says the Free plan suffices, arch uses R2 on a subdomain. Use SEO's same-origin setup, with R2 behind the same-origin Worker if needed.

## eng-critic

**Verdict:** The six sections are each strong on their own, but together they are six partly incompatible plans, not one buildable plan, and the schedule cannot be met as written. What checked out: every npm version cited exists (checked with npm view: astro 7.3.8, harfbuzzjs 1.6.3, clipper2-ts 2.0.1-18, pdf-lib 1.17.1, @resvg/resvg-js 2.6.2, perfect-freehand 1.2.3, @pagefind/component-ui 1.5.2). The Astro Fonts API and CSP API exist and are config-level since Astro 6 (https://astro.build/blog/astro-6, https://astro.build/blog/astro-710), and `@astrojs/sitemap` 3.7.0 added `chunks` (https://docs.astro.build/en/guides/integrations-guide/sitemap/). Workers static assets `_headers` supports `:placeholder` and `:splat` substitution (https://developers.cloudflare.com/workers/static-assets/headers/). The weak point is the contracts between the lanes. There are 3–4 conflicting versions of each of these: the asset URL scheme and hosting (same-origin `/files/` vs an R2 `cdn.` subdomain vs `/assets` vs `/pdf`), the online-coloring route (`#color` on the design page vs `/color/#slug` vs `/color-online/{slug}/` vs `/color-online/{topic}/{design}/`), the rendering engine (vector regions vs a raster label map), the SVG/region format and units (720×940 KCI-SVG vs 1000×1294/1414 split SVGs vs an IR in mm vs 2550px artboards), the difficulty enum and thresholds, the imagery taxonomy, the parent gate, the JS budgets, robots.txt, and the data homes for events, people, palettes and letters. If coding starts before these are unified, the generators, templates, the app and the CI property tests will fail against each other on day one. The schedule is also not credible. Three lanes put dates in October (domain Oct 16, Wave 1 Oct 23, app engine core Oct 30). The Ramadan hub is gated by an Islamic-review rule (L12) that excludes every `islamic.hub` entry until a reviewer approves it, and reviewers are not contracted until Nov 1. The plan also asks for 26 generators, a dual-engine coloring app, R2, a service worker, CSP and Analytics Engine to be in place before Nov 20. Recommendation: before any code, freeze a one-page `docs/CONTRACTS.md` covering the URL table, asset paths, KCI-SVG v1, one Zod schema, the difficulty table, imagery tiers and event data. Then cut to a Ramadan-critical MVP: about 8 generators; harfbuzzjs to outlines to pdf-lib vector PDFs; all files same-origin on Workers static assets (paid plan), with no R2 serving in year 1; a vector-only coloring app with fill, brush, eraser, undo, autosave and PNG/print. Defer the raster engine, service worker, color-by-number advanced mode, stickers, Analytics Engine, cross-domain CSP for ads and the membership stubs. Where sections conflict, ISLAMIC-IMAGERY wins on imagery and content rules, SEO wins on URLs and indexing, and the app section wins on in-app rendering.

- **[blocker] All (SEO §10, content §8, app §9, Islamic §5.11)** — The schedule cannot be met. SEO puts the domain live Oct 16 and Wave 1 (Arabic alphabet, 40 geometric, 40 mandalas, numbers, A–Z, color-by-number, fall) live Oct 23, which is 10 days from now. Content needs 26 generators built by Nov 3, then 498 curated designs, about 8 h of human review and test prints, live Nov 10, 24 and Dec 8. The app milestones finish Dec 1–12, after the Ramadan hub (Nov 10 in content, Nov 20 in SEO) is already live with 'Color online' buttons pointing at nothing. Architecture adds R2, a service worker, CSP, Analytics Engine, Lighthouse CI and visual regression on top.
  - Fix: Publish one merged critical-path calendar in docs/ROADMAP.md, with the hard date Nov 20 for the Ramadan hub (at least 40 designs) and a target of Nov 13.
- Oct 16: domain, Search Console, skeleton and trust pages.
- By Oct 30: the pipeline plus 4 generators that need no review (mandala, rosette/pic-tiling, snowflake, shapes/numbers), giving about 80 evergreen pages to start crawl history.
- Nov 1: reviewers signed (escalate now).
- By Nov 13: Ramadan generators (fanoos, crescent-sky, EN lettering, generic mosque, objects subset, calendar/tracker, word search, maze, color-by-code), then review Nov 13–18.
- Nov 20: Ramadan hub, calendar, tracker, and a minimal app (fill, brush, eraser, undo, autosave, PNG, print).
- Dec 8: Eid, Arabic alphabet, adult geometric, color-by-number UI.
Keep the 'Color online' button behind flags.app until the app ships. Everything else goes to the January backlog.
- **[blocker] Islamic §5.11 (L12) vs SEO §3.4 item 5 vs content §4.6** — Lint rule L12 excludes every entry where `islamic.hub` is true from the production build until an IS reviewer approves it. Read literally, that is all 60+ Ramadan designs, the calendars and the Arabic letters, which also need AR review. No reviewer is contracted yet (target Nov 1), and SEO §7 forbids inventing reviewers. The review capacity of about 150 items in roughly 25 h assumes a reviewer who does not yet exist. So the whole Ramadan launch hangs on one hire that has not happened.
  - Fix: Define review scope by risk, not by hub.
- **Editorial QA only:** code-generated Tier A art with no text (lanterns, crescents, generic mosques, patterns).
- **IS review:** hub body copy, facts, Quran or hadith references, sacred text, people, and named sacred places.
- **AR review:** every Arabic string, including letter glyph pages, where review is batched once per generator template rather than per design.

Add a `reviewScope` enum to the schema and make L12 key off it. Recruit a backup IS reviewer now. If no reviewer is signed by Nov 1, ship the Ramadan hub with generated aniconic art only and no fact copy beyond vetted facts/ramadan.json, then add the reviewed copy later.
- **[blocker] SEO §1.2/§5.1 vs arch §3.4 vs content §4.1 vs design §6** — There are four asset URL and hosting schemes:
- SEO: same-origin `/files/{img|pdf|svg}/{hub}/…`, and 'never move images to a subdomain'.
- Arch: R2 at `cdn.kidscolorit.com/d/{slug}/…` plus a separate PDF Worker, CORS and purge.
- Content: `/assets/{hub}/{slug}/…`.
- Design: `/pdf/{slug}-{letter|a4}.pdf` and `/img/…`.
The cross-origin choice forces an extra Worker (the `download` attribute is ignored cross-origin), CORS for the canvas, CDN purges, a second Search Console property and an extra TLS connection on mobile LCP. Connection coalescing does not help on Safari or Firefox.
  - Fix: Adopt the SEO scheme: same-origin `/files/…` on Workers Static Assets on the paid plan.

Capacity numbers: about 13 files per design and a 100K-file cap gives roughly 7,000 designs, against a 12-month target of about 3,000. R2 serving is therefore not needed in year 1. Keep R2 only as a private build cache, so CI restores derived files before running `wrangler deploy`.

Replace the PDF canonical Worker with one `_headers` rule using placeholders: lay PDFs out as `/files/pdf/:hub/:design/{design}-coloring-page-{letter|a4}.pdf` and set `Link: <https://kidscolorit.com/:hub/:design/>; rel="canonical"`. Add one extra rule for the three-segment format-item paths.

Put `ASSET_BASE` in config so `/files/*` can later be served from R2 through a same-origin Worker route.
- **[blocker] SEO §0.5/§2.4 H20 vs arch §5.1 vs design §6.4/§8 vs app §4.3** — There are four online-coloring routes:
- SEO: `#color` on the design URL.
- Arch: a single `/color/#slug` shell with `client:only`.
- Design: `/color-online/{slug}/`.
- App: `/color-online/{topic}/{design}/` noindex pages with `client:load` and the art inlined.
There are also two engines for the same job: design §8 specifies a raster `lineart.png`/`labels.png` label-map Canvas2D engine, while app §1 specifies vector SVG regions with a lazy raster fallback. Per-design app pages double the HTML count (+10K files at 10K designs) and waste crawl budget on noindex duplicates, which SEO explicitly rejected.
  - Fix: Use one noindex app shell at `/color/#slug` (arch). It fetches the SVG same-origin from `/files/svg/`, and its canonical points at the indexable `/color-online/` hub (SEO H20). Use the app section's vector-first engine. Delete design §8's label-map pipeline and drop `labels.png` from launch outputs.

All launch art is generated with guaranteed regions, so the raster engine and labeler worker move to January, when illustrated art arrives. Even then, vectorize to KCI-SVG first and use raster only as a last resort.
- **[blocker] content §1 vs app §1.2 vs arch §3.1 vs design §9 item 11** — There are four incompatible art contracts:
- Content: one SVG `0 0 720 940` (the same physical 7.2×9.4 in on both papers), `data-layer` groups, `data-region` paths tucked under the ink by +0.35w.
- App: two sibling SVGs (`kc-regions` and `kc-lines`) at 1000×1294 for Letter and 1000×1414 for A4, so a different aspect per paper, with region edges on the centerline.
- Arch: an IR in mm with `regions[]` and `strokes[]`, using `data-r`.
- Design: 2550×3300 / 2480×3508 px artboards with stroke weights in px.
The thresholds in mm², inscribed radius in units, and px stroke widths cannot be compared, and thumbnails are 17/22 (design) vs 0.766 (content).
  - Fix: Make KCI-SVG v1 (content §1) the single canonical master: viewBox 720×940, the same art box on both papers, `data-region` and `data-layer`. The app adapts at runtime by splitting the `regions` and `ink` layers into its z-stack; there is no second build artifact. Delete the arch IR mm units (the IR stays internal to generators) and design §9's px artboards.

State every threshold once, in units, in `generators/core/difficulty.ts`, imported by QA, the app manifest builder and the docs. Set thumbnails to aspect 720/940.

The app must treat the 0.3w strip under the ink as no-region and use tolerant hit-testing there. The compiler rule 'region edges on centerline' is replaced by the tuck rule.
- **[blocker] SEO §3.2 schema vs content §4.4 vs arch §2.4 vs design §5 imagery table vs app §6 types** — There are three or more design schemas with incompatible fields.
- **Difficulty:** `easy|medium|detailed|expert` (SEO), `bold|easy|medium|hard|expert` (content), `easy|medium|hard|expert` (arch), `d1–d5` (app).
- **Imagery:** `animate`/`people` booleans (SEO), `faces: none|faceless-people|animals` (content), `beings[]` + `facesDrawn: false` (arch), `data-imagery: aniconic|faceless|animals`, where design L2 is 'animals with simple faces', which arch's `z.literal(false)` and Islamic IMG-02 both forbid. Islamic uses Tiers A/B/C.
- **Other field names:** description vs blurb vs summary; ages vs ageRange; publishedAt vs published; hub vs primaryHub vs primaryTopic.
  - Fix: Write one Zod schema in `src/content.config.ts` and copy it into docs/CONTRACTS.md.
- `difficulty: 'bold'|'easy'|'medium'|'hard'|'expert'`, with display labels (hard is shown as 'Detailed') set in i18n.
- `imagery: { tier: 'A'|'B'|'C' }` (owned by ISLAMIC-IMAGERY), with `facesDrawn: z.literal(false)`. Derive `data-imagery` and the filter from `tier`.
- Delete design L2. Animals are always featureless Tier B.
- Field names: `primaryHub`, `hubs[]`, `description`, `ages: [min, max]`, `publishedAt`/`updatedAt`, `reviewScope`, `review{}`, `provenance{}`, `translationKey`.

The arch property tests, the SEO gates and the Islamic lint all import this one schema.
- **[major] Content §1.2 vs arch §11.1 property tests vs app §1.2 vs design §9.11** — Region and stroke thresholds conflict, so CI goes red on content's own presets.
- **Region counts:** arch requires easy ≤30, medium ≤80 and hard ≤200 regions, but content generates easy 15–60, medium 50–160 and hard 140–400.
- **Minimum region area:** arch's toddler ≥400 mm² vs content's bold 150 mm²; design gives '15mm/8mm/4mm/2mm' with no unit area.
- **Stroke width:** design's expert 2–3 px at 300 DPI is 0.48–0.72 pt, below content's 1.5 pt floor.
- **App caps:** the app's d5 limit of 1,500 regions conflicts with content's expert cap of 1,200.
  - Fix: Make content §1.2 the single table, extended with the app's per-level inscribed-radius tap floor and online cap converted to units. Generate the property-test bounds and the app compiler checks from it. Delete the numbers in arch §11.1 and design §9.11, and make those sections reference the table instead.
- **[major] Islamic §7.4 L16 vs content G01/G06/G08/G10** — L16 says the generator throws if `symmetry===6 && layout!=='tessellation'`. That rule would reject:
- every G08 snowflake (D6, centered),
- G01 rosettes and G06 mandalas with n=6,
- G09 hexagonal lantern bodies, if symmetry is tagged.
Separately, G10 explicitly draws free-standing '5-, 6- and 8-point star polygons', which do violate the policy. The rule as written targets the wrong property.
  - Fix: Rewrite L16 to target the motif, not the symmetry group. Fail when a {6/2} star polygon (hexagram) outline appears as an isolated or centered element, or as a cut-out, card or tag shape. Allow 6-fold symmetry otherwise: snowflakes, hexagons, 12-fold rosettes, and 6-point stars inside a tessellation with at least 7 neighbors. Remove the 6-point option from G10 and from G22 tag shapes. Add golden tests with one snowflake (pass), one centered hexagram (fail) and one tessellation (pass).
- **[major] Arch §1 (fonts/, text-to-path.ts via fontkit) and §11.1 vs content §3.5 vs design §3.1** — Arch converts text to paths with fontkit and claims 'HarfBuzz via fontkit'. That is wrong: fontkit has its own OpenType layout engine, not HarfBuzz, and its Naskh mark positioning and ligature handling is less proven. Content correctly uses harfbuzzjs and keeps opentype.js 2.0.0 'for metadata', which is a redundant third font stack.

Gaps in the ZWJ positional-form technique:
- It does not say which features to disable. Noto Naskh's discretionary and contextual ligatures would merge the target letter into a ligature glyph, so the 'reject' rule fires on many example words.
- Variable-font instancing is unspecified.
  - Fix: Use one stack: harfbuzzjs for shaping plus harfbuzzjs `glyphToPath` (font units, y-up, flip y). Drop fontkit and opentype.js.
- Shape with explicit features `liga=0,dlig=0,calt` as needed, keeping only `rlig` (lam-alef).
- Use static Bold TTF instances, not variable fonts, for deterministic outlines, and pin font sha256.
- Add a golden test that compares harfbuzzjs glyph id and position sequences against `hb-shape` reference output for all 28 letters × 4 forms and the example words.
- Ship and test ZWJ handling with `HB_BUFFER_FLAG_REMOVE_DEFAULT_IGNORABLES` set.
- **[major] Content §4.3 (pdf-lib) vs SEO §5.8 step 5 (Playwright page.pdf) vs design §7.5** — There are two PDF engines and two footer-font policies. SEO prints with Chromium `page.pdf`; content draws with pdf-lib `drawSvgPath`; design wants an embedded Nunito footer; content uses non-embedded Helvetica.

Specific pdf-lib hazards:
- `drawSvgPath` already applies a y-flip (translate(x,y) scale(s,−s)), so content's plan to 'pre-transform coordinates into PDF points' risks a double flip.
- The fill is nonzero, so outline orientation must be consistent for glyph holes such as ه and ص.
- Standard Helvetica is WinAnsi-only: Turkish ş/ğ/İ and every Arabic, Bengali or Urdu footer will throw in Phase 2.
  - Fix: Choose pdf-lib (vector, fast, deterministic) and drop the Playwright PDF step.
- Pathify the footer and title text with the same harfbuzzjs pipeline, so no PDF ever embeds a font.
- Pass raw SVG-space `d` strings to `drawSvgPath` with `x`/`y` set to the art-box top-left in PDF space and `scale = 0.72`, with no manual flip.
- Add a PDF golden test: render each PDF with pdfium (`pdftoppm` or mutool) and pixel-compare it to the resvg render of the master at the same DPI, with a tolerance under 0.5%. This catches flips, dashes, joins and winding.
- Keep `@cantoo/pdf-lib` as a drop-in fallback.
- **[major] Arch §3 / §3.4 / §9 (R2 staging + prod, CopyObject, purge, cdn-pdf Worker, CORS, piscina, PWA SW, Analytics Engine, HTMLRewriter nonce fallback, membership D1 stubs)** — Much of the architecture is over-engineered for 500–3,000 designs and adds days of work and failure modes before Ramadan:
- Two R2 buckets with server-side copy and purge-by-URL.
- A dedicated PDF Worker.
- CORS on the canvas.
- A hand-rolled service worker at launch, where `flags.pwa: true` contradicts the app section's v1.1 offline plan, and a buggy SW can pin stale HTML.
- Analytics Engine used as a page-request moderation queue.
- A piscina pool for a 10-minute build.
  - Fix: For launch:
- Use Workers Static Assets on the paid plan, with all files same-origin.
- Keep R2 as a private build cache only.
- No service worker until v1.1, after the app is stable, with a kill-switch `sw.js` that unregisters itself.
- Use Cloudflare Web Analytics, plus at most one tiny `/api/e` beacon for PDF and app events.
- Use D1 plus Turnstile for request and contact forms. That matches SEO §7.5 and the Islamic private moderation queue.
- Use a plain `Promise.all` with p-limit instead of piscina.

Keep the membership, ads and AI stubs as flags plus empty modules only.
- **[major] Arch §4 printable route + events.occurrences/supersededBy vs SEO §1.5** — Arch's example `/printables/calendars/ramadan-calendar-2027/` with `supersededBy: ramadan-calendar-2028` puts the year in the URL. SEO forbids that ('Never create year URLs'; `/printables/islamic-calendar/` keeps an evergreen URL with past editions linked). Arch also adds a `{type}` path segment that SEO does not have, and uses `/coloring-books/` where SEO uses `/bundles/` and `/authors/` where SEO uses `/team/`.
  - Fix: SEO's URL table wins: `/printables/{slug}/` with evergreen slugs, and `year` as data that drives the title, H1 and PDF filename suffix only. Remove `supersededBy` routing and replace it with an `editions[]` array on the entry. Also adopt `/bundles/` and `/team/`. Generate a single route manifest (arch §2.5 is a good mechanism) from the SEO URL table and assert it in tests.
- **[major] SEO §10 (2026-11-06 mosques v1, 2026-11-13 99 Names, 2026-12-08 wudu/salah CG figures) vs content §3.4 G11/§0.11 vs Islamic §4.3/§7.1** — SEO schedules 12 named landmark mosques as 'CG silhouettes' with Wikidata `sameAs` by Nov 6. It ships calligraphy (Nov 6) and 99 Names (Nov 13), and salah steps with 'faceless pose figures (CG)'.

The other sections say otherwise:
- Content: never name a landmark for a generated mosque; 99 Names and Bismillah are excluded at launch; people are not generator-friendly.
- Islamic: landmark mosques are studio-drawn only (Wave 1 by Dec 10), and salah figures are studio-only.
  - Fix: Islamic and content win.
- **Mosque hub at launch:** generic generated mosques only, with entity pages added as the studio delivers (Wave 1 from Dec 10).
- **Calligraphy, 99 Names, wudu and salah:** January or later, after review.
- **SEO calendar:** re-slot these items and drop the Nov 6 entity-page row.
- **[major] SEO §3.2/§3.4 item 7 vs content §4.4/§3.1 describe() vs arch §7.1** — Each design needs a human-written 25–60-word unique description, plus `editedBy` (SEO). Arch's indexability gate demands at least 60 words, so a valid SEO description fails arch's gate. Content generates the blurb from `describe()`. For 498 designs plus 28 unique letter texts, human-edited copy is about 40+ hours, and no lane budgets that time before Nov 13.
  - Fix: Set one rule: `description` is 40–80 words, drafted by `describe()` plus an LLM, then human-edited (`editedBy` required). Main content reaches 80 or more unique words through the structured facts.
- Budget 3 minutes per design and assign an owner.
- Reduce the number of indexable design URLs by grouping low-differentiation variants (content §4.5 already groups letters).
- Drop arch's 60-word floor and cosine-similarity gate in favor of SEO's trigram Jaccard below 0.5.
- Use one perceptual hash (pHash on a 256px render, Hamming distance ≥8 site-wide and ≥12 within a generator) instead of both dHash and pHash.
- **[major] Design §2.3 tokens (light-dark())** — Every semantic token uses CSS `light-dark()`. That function is unsupported on Safari before 17.5 (iOS 17.4 and earlier, which includes many hand-me-down family iPads) and on old Android WebViews. There the declaration is invalid and colors fall back to initial, which produces transparent backgrounds and unreadable text. That is a whole-site failure on exactly the devices kids use.
  - Fix: Define light values on `:root`. Redefine the dark values under `@media (prefers-color-scheme: dark) { :root:not([data-theme=light]) {…} }` and under `:root[data-theme=dark]`. This works everywhere, keeps the zero-JS behavior, and still lets Tailwind 4 `@theme` reference the variables. Extend the contrast test to run both blocks.
- **[major] Arch §7.5 robots.txt vs SEO §5.5** — There are two conflicting robots.txt files.
- **Arch:** `Disallow: /` for GPTBot, CCBot, Google-Extended, Applebot-Extended, Bytespider, meta-externalagent and ClaudeBot, plus `Disallow: /search/` for everyone.
- **SEO:** those training crawlers may read the HTML (for brand and entity learning) and are kept only out of `/files/`. Google-Extended is fully allowed. `/search/` is deliberately not disallowed, so its noindex can be seen.
  - Fix: The SEO version wins, because it owns crawl policy. Generate robots.txt from one config in `site.config.ts` and test it in `tests/seo/robots.spec.ts`. Also note that Cloudflare's managed robots.txt and 'Block AI bots' settings must be off, as both sections say.
- **[major] Arch §2.2 CSP + SEO §7.5 forms + arch §10** — The CSP blocks planned features.
- `frame-src 'none'` and a script-src without `challenges.cloudflare.com` break Turnstile, which SEO and Islamic both require on forms.
- Cloudflare Web Analytics auto-injection on a proxied zone inserts an inline script that the hashed CSP blocks.
- SEO's Plausible would need another origin and contradicts the 'no third-party scripts' rule.
  - Fix: Add `https://challenges.cloudflare.com` to script-src and frame-src only on the form pages. Astro CSP can be set per page, or this can go in a separate `_headers` rule. Install the Web Analytics beacon as a manual script tag with its origin allowlisted, and disable zone auto-injection. Drop Plausible. Add a Playwright test that loads every template and fails on any `securitypolicyviolation` event.
- **[major] App §4.2/§0 vs design §7.6 vs arch §5.3** — Budgets conflict. The coloring app JS budget is ≤95 KB (design), ≤100 KB (app) or ≤130 KB (arch) gzipped, with React 19 alone at about 58 KB. Content-page budgets are hubs ≤15 KB / designs ≤20 KB (SEO), ≤12 KB (design), or hubs ≤10 KB / designs ≤8 KB (arch). LCP targets are 1.8 s vs 2.0 s.
  - Fix: Use one budget file (`budgets.json`) read by both kciBudgets and LHCI:
- `/color/`: ≤100 KB gzipped total JS on first load (React plus a ≤38 KB core), with lazy chunks counted separately.
- Hubs ≤10 KB, design pages ≤8 KB.
- LCP ≤1.8 s on hubs and design pages.

Record the decision in UI-UX.md and delete the other numbers.
- **[major] App §4.2 LCP target and §7 perf gate** — The plan says 'LCP (the inline SVG) < 1.8 s'. Inline `<svg>` path content is not an LCP candidate; only `<img>`, `<image>` inside SVG, video posters, background images and text blocks are. So the gate measures some unrelated text node or nothing, and gives false confidence.
  - Fix: Have the shell render the line-art WebP preview as a sized `<img>` with `fetchpriority=high`. That image is the LCP element, and the vector layers replace it in place (arch §5.1 already does this). Gate the app on the custom `kci:interactive` mark (<2.5 s), INP, and long-task total, not LCP.
- **[minor] App §1.6 tolerant hit-test** — The 9-sample majority vote can override a direct hit. On adult designs, regions can be about 1 px at fit on a 360 px phone (an inscribed radius of 0.6 mm), so the vote picks the large neighbor and kids or adults fill the wrong region.
  - Fix: If the center sample hits a region, return it. Run ring sampling only when the center misses (that is, it lands on ink or in the tuck gap). Add a unit test with a thin region between two large ones.
- **[minor] Content §2 steps 2 and 8 (Clipper offset and adjacency)** — Two parts of the region step can blow the time budget.
- **Adjacency:** computed as pairwise Clipper intersections of 0.6w dilations. For 1,200-region expert pages that is about 20K+ boolean operations in a prerelease pure-TS Clipper, potentially tens of seconds per design.
- **Round joins and ends:** these explode the vertex count unless `ArcTolerance` is set.
No per-design time budget is defined.
  - Fix: Derive adjacency from a 1024 px raster label map: rasterize the regions with ids, dilate them across ink by w, and collect neighbor pairs, which takes milliseconds. Alternatively track which faces lie either side of each ink segment.
- Set Clipper `ArcTolerance` to about 0.05 u and precision to 2.
- Add a perf test: each design under 3 s, and the whole Wave 1A under 10 minutes on CI.
- Keep clipper2-wasm behind the same wrapper, and add golden tests that run against both.
- **[minor] Content §1.4 / arch §11.2 regression snapshots** — Snapshot gates will flake. 'Pixelmatch at 400 px equals 0 changed pixels or re-approve' fails across machines and architectures (Mac ARM development vs x86 CI) because of resvg anti-aliasing and font differences. Separately, the Biome `noRestrictedGlobals` rule cannot restrict `Math.random` (only whole globals like `Math`), and restricting `Date` breaks legitimate code.
  - Fix: Use sha256 of the SVG master as the determinism gate (pin Node 22.x and the generator version). Run raster diffs only in the pinned CI container, with a tolerance of 0.1% or less.

Enforce the randomness ban with a Vitest setup file that replaces `Math.random`, `Date.now` and `new Date()` with throwing stubs while generators run, plus a grep check in CI.
- **[minor] Arch §1/§2.4 monorepo layout** — Arch's four-package pnpm workspace with content in `../content` sits outside the Astro root. Vite may refuse files outside root (`server.fs.allow`), `image()` assets in author files may fail, and HMR may not watch the content. Content §4.1 uses a flat layout with `generators/` at the root, so the two layouts conflict. The custom loader snippet also skips `context.parseData()`, so the schema is never applied.
  - Fix: Use a single package: `src/` (Astro), `generators/` (pure TS, its own Vitest project), `content/` inside the project root, `scripts/` and `worker/`. Add path aliases instead of workspaces. Custom loaders must call `parseData` before `store.set`.
- **[minor] Arch §11.6 / SEO §5.1 CI and nightly cron** — The CI setup depends on things that may not be available or reliable.
- `runs-on: ubuntu-latest-4-cores` requires a configured larger runner on a paid org; without one, the job queues forever.
- GitHub schedule crons are delayed at busy minutes and auto-disabled after 60 days without activity on public repos.
- The SEO ComingUpBanner text ('starts in about 37 days') is build-time only, so a missed nightly build shows a wrong countdown.
  - Fix: Use `ubuntu-latest`. Trigger the nightly build from a Cloudflare Cron Trigger that calls `workflow_dispatch`, and alert on failure. Recompute the banner countdown on the client from `data-start` (as in design §5), keeping the build-time text as a fallback.
- **[minor] Design §5/§7.4 vs Islamic §8 vs app §3.4 (parent gate and kid mode)** — There are three parent gates: typing a number written in words (design), a multiplication question on a keypad (Islamic), and a 2-second press-and-hold (app). Design itself notes press-and-hold is inaccessible.

Kid mode default also conflicts: opt-in toggle (design), always on for the canvas (Islamic), and on by default except on adult pages (app). The storage key is `kci:` in some sections and `kc:kidmode` in Islamic.
  - Fix: Use one `ParentGate` component (design's typed-number version) everywhere, including in-app share. App kid mode is on by default except for `audience: adult` designs; site kid mode is opt-in. Use the `kci:` prefix for all storage keys, and list every key in UI-UX.md.
- **[minor] SEO §1.7 vs design §5 FamilySettings vs arch kci-strict vs Islamic ImageryFilter.tsx** — The content filter is specified four ways:
- **SEO:** a 2-state 'no animate beings' toggle (`html.no-animate`).
- **Design:** a 3-way 'Show all / No faces / Objects & places only'. Its 'No faces' option is meaningless if nothing ever has faces.
- **Arch:** `kci-strict`.
- **Islamic:** a React island for the filter, which breaks the rule of no framework JS on content pages.
  - Fix: Build one vanilla filter with 3 states mapped to Islamic tiers: All / Hide people (hides C) / Objects & places only (hides B and C). It is set by the pre-paint script as `html[data-imagery]` with CSS hiding. No React.
- **[minor] Arch §7.4 vs SEO §5.4 (sitemaps); design §6/§6.2 vs SEO §1.6 (hub size thresholds)** — Sitemaps: arch uses `@astrojs/sitemap` chunks plus separately bolted-on image sitemaps; SEO builds custom endpoints. Hub thresholds: indexable at 6 (arch), 8 (SEO) or 12 (design, 'never publish under 12').
  - Fix: Generate sitemaps from custom endpoints driven by the route manifest, with image tags inline, and drop `@astrojs/sitemap`. Hubs are indexable at 8 or more designs, with 12 or more for facets (SEO). Below that they render `noindex,follow`, and design's 'never publish' becomes 'never link from navigation'.
- **[minor] Content §4.2 image outputs vs SEO §5.8 vs arch §3.2 vs design §5 DesignCard** — Each section specifies a different image set:
- **SEO:** 400/800/1200 lossless WebP + AVIF.
- **Content:** 400/800 AVIF + WebP.
- **Arch:** 360/720/1200 WebP only.
- **Design:** 320/480/640.
Design also adds a 'PNG · 300 DPI' download that no pipeline produces. AVIF on bilevel line art gives little gain and slows encoding a lot.
  - Fix: Line art: near-lossless WebP at 400, 800 and 1200. Colored example: WebP at 800, with AVIF optional later. Plus a 1000×1500 pin JPG and a 1200×630 OG JPG. Drop the 300 DPI PNG link (the PDF covers print). That is about 10 files per design.
- **[minor] App §1.5 adaptive raster window; app §2.8/§2.2 extras** — The launch scope includes heavy components that launch content does not need:
- the double-buffered overscan raster window,
- gradient, pattern and preset fills,
- crayon grain,
- stickers,
- three-finger redo,
- the full color-by-number highlight and strict modes.
All launch content is under about 200 regions in kid mode.
  - Fix: MVP (Nov 20): a fixed full-artboard dry canvas capped at 4 MP and re-rendered on settle, solid fills, brush and eraser with stay-inside clip, undo/redo, IndexedDB autosave, PNG and print. Color-by-number legend and progress come Dec 8. Advanced fills, crayon and stickers go to v1.1. Keep the engine interfaces as specified so the extras plug in later.
- **[minor] Content G16 / SEO §2.7 / Islamic IMG-06 and §4.5** — Some items conflict with policy:
- 'K is for Kaaba' ships in Wave 1C (Dec 8), but content lists the Kaaba as Wave 2 `sacred-place` needing review.
- SEO's Indonesian Ramadan pack includes a bedug drum, which IMG-06 bans in Islamic hubs.
- SEO's Animals of the Quran list includes frog and locust, which come from a punishment context and conflict with the Islamic exclusion principle.
  - Fix: Use 'K is for Kite' (or another neutral word). Send the bedug and the frog/locust entries to the IS reviewer, and default to excluding them. Run `islamic-lint` L15 (NEVER-list terms in titles, tags and slugs) over SEO's keyword map as well.

**Missing:**
- The Islamic section arrived truncated. It starts mid-sentence in §3.3, and §1–§3 are missing: tier definitions, sacred-text classes (§2.2), placement rules (§2.3), required notices (§2.5) and filter analytics (§1.6). Lint rules L01–L06 and checklist items TXT-01–03 cite these, so they cannot be reviewed or implemented until the full text is supplied.
- There is no single contracts document. The URL table, asset paths, KCI-SVG v1 spec, Zod schema, difficulty table, imagery tiers and storage keys are each defined in several sections. Without one owner and one file, every lane will keep diverging.
- Each kind of data has 3–5 proposed homes with no owner: event and Hijri dates (src/data/calendar/events.ts, content/events/events.yaml, src/content/events/*.yaml, src/data/islamic/observances.yaml), people and reviewers (team, authors, people, reviewers), palettes (12 vs 28 palettes, three files), Arabic letters (letters.json vs arabic.yaml) and glossary/transliteration (transliteration.ts, glossary.json, house-style.json). Pick one each, and make the letter slugs canonical (daal vs dal, saad vs sad, ayn vs ain).
- No section has a staffing and ownership plan, i.e. who builds which lane and when. The schedule assumes one build session plus a design team, but there is no capacity math for generator engineering, about 40 h of description editing, Arabic stroke correction, test prints and reviewer turnaround.
- Client-side error monitoring for the coloring app is missing. A privacy-safe JS error beacon to the Worker is needed so iOS/Android regressions are caught without third-party trackers. So is alerting on failed nightly builds and deploys.
- No test checks that the pipeline output works in the app. Run the app E2E against a sample of 20 real generated designs, tapping every region's polylabel point, and validate each master against a KCI-SVG v1 JSON schema in CI, not only against the fixture-grid designs.
- Phase-2 locale PDFs are not budgeted for: localized titles, footers and word-search lists would multiply PDF and file counts per locale. The file-count projection should include them before locales ship.
- The 'simple admin later' has no design. Which Git-based CMS (Keystatic, Pages CMS, Decap) can edit the YAML/JSON schema and trigger review labels? This affects how content files are structured now.
- There is no rollback or incident runbook for a generator bug that ships hundreds of bad pages, for example a mass unpublish via a flag, or a gone list.
- Font subsetting and the build pipeline for web fonts (Arabic subset including U+FDFA and Arabic-Indic digits; pyftsubset/glyphhanger) are missing, as is a license audit of all embedded and outlined fonts. Relief SingleLine's OFL status is still unverified.

**Contradictions:**
- Asset hosting: SEO says same-origin /files/ and 'never move images to a subdomain'; arch puts everything on R2 at cdn.kidscolorit.com; content uses /assets/; design uses /pdf/ and /img/. SEO wins, with R2 only as a private build cache.
- Online coloring route: SEO opens it on the design page with #color; arch uses /color/#slug; design uses /color-online/{slug}/; the app uses /color-online/{topic}/{design}/ noindex pages. Arch's single /color/#slug shell wins, with SEO's indexable /color-online/ hub.
- App rendering engine: design §8 uses a raster labels.png flood map; app §1 uses vector SVG regions. The app section wins, and raster is deferred.
- Art format and units: content uses 720×940 with one layered SVG and tucked regions; the app uses two SVGs at 1000×1294 or 1000×1414 with centerline regions; arch uses an IR in mm; design uses 2550/2480 px artboards. Content's KCI-SVG v1 wins.
- Difficulty enum: SEO easy/medium/detailed/expert; content bold/easy/medium/hard/expert; arch easy/medium/hard/expert; app d1–d5. Content's five levels win, with display labels in i18n.
- Imagery taxonomy: SEO animate/people booleans; content faces enum; arch beings[] with facesDrawn:false; design L0–L2, where L2 is animals with faces; Islamic Tiers A/B/C. Islamic tiers win, and design L2 is removed.
- Region and stroke thresholds: content §1.2, arch §11.1, app §1.2 and design §9.11 all differ, and the arch tests would fail content's presets. Content §1.2 wins as the single table.
- Description length: SEO 25–60 words, human-written; arch at least 60 words; content uses describe() blurbs. Use 40–80 words, drafted, then human-edited.
- Similarity gates: SEO uses dHash at 10/6 plus trigram Jaccard; content uses pHash at 12/8; arch uses cosine similarity below 0.8. Use pHash at 12/8 plus Jaccard.
- Text-to-path: arch uses fontkit ('HarfBuzz via fontkit', which is wrong); content and design use harfbuzzjs (design also mentions fontkit paths). harfbuzzjs wins.
- PDF engine: SEO uses Playwright page.pdf; content and arch use pdf-lib. Footer font: design embeds Nunito, content uses non-embedded Helvetica. pdf-lib wins, with pathified footer text.
- Vectorizer: arch uses the vtracer CLI; content uses potrace and explicitly rejects vtracer. Content wins.
- robots.txt: arch blocks training bots entirely, blocks Google-Extended and disallows /search/; SEO lets those bots read HTML but not /files/ and does not disallow /search/. SEO wins.
- Sitemaps: SEO uses custom endpoints; arch uses @astrojs/sitemap with chunks. Custom endpoints driven by the route manifest win.
- html_handling: SEO auto-trailing-slash; arch force-trailing-slash. Use force-trailing-slash, so canonicals and redirects are deterministic.
- Title suffix: SEO uses no brand suffix; arch and design append ' | KidsColorIt'. SEO wins.
- Season-window lead: SEO 16 weeks (112 days); arch titleYearLeadDays 150. Banner: SEO 60 days, arch promoLeadDays 63. Nightly cron: 00:30 vs 03:10 UTC. SEO wins on all three.
- Printable and bundle URLs: arch uses /printables/{type}/{slug}/ with year slugs and /coloring-books/; SEO uses /printables/{slug}/ evergreen and /bundles/; content puts /ramadan-calendar-for-kids/ and bundle landings at the root. SEO wins.
- Hub and silo slugs: /color-by-number/ramadan/ (SEO) vs /ramadan-color-by-number/ (content); /islamic-geometric-coloring-pages/ vs /islamic-geometric-patterns/; /shape- vs /shapes-coloring-pages/; /team/ vs /authors/ vs /about/reviewers/; standards page /about/islamic-content-guidelines/ vs /islamic-imagery-policy/ vs /about/islamic-content-standards/; /about/license/ vs /license/. SEO wins.
- Launch sequencing: SEO ships evergreen plus the Arabic alphabet on Oct 23 and Ramadan on Nov 20; content ships Ramadan and Arabic on Nov 10 and evergreen on Dec 8. The merged answer: content that needs no review goes first (late Oct), Ramadan by Nov 20 at the latest, and Arabic after AR review in early December.
- Landmark mosques: SEO plans CG silhouettes with entity pages by Nov 6; content says never name a generated mosque; Islamic says studio-drawn, Wave 1 by Dec 10. Islamic wins.
- 99 Names and calligraphy: SEO ships Nov 6/13; content excludes them at launch. Content and Islamic win.
- Salah figures: SEO says code-generated; content and Islamic say designer or studio only. Islamic wins.
- Coloring app JS budget: 95 KB (design), 100 KB (app), 130 KB (arch). Content-page JS: 15/20 KB (SEO), 12 KB (design), 10/8 KB (arch). The app section's 100 KB and arch's 10/8 KB win.
- PWA and service worker: arch has flags.pwa true at launch; the app plans offline support for v1.1 in January 2027. The app plan wins.
- Request form storage: SEO uses D1, email and Turnstile; arch uses Analytics Engine with a honeypot and no email; Islamic requires Turnstile, a 16+ confirmation and a private moderation queue. Use D1 with Turnstile. Newsletter and age gate: 18+ (design) vs 16+ (Islamic). Pick 18+.
- Analytics: SEO uses Plausible plus Cloudflare Web Analytics; arch says no third-party scripts beyond the Cloudflare beacon. Arch wins.
- Fonts: design uses Baloo 2 plus Nunito and preloads Baloo 2; arch uses Nunito plus Baloo Bhaijaan 2, preloads Nunito, and has no Baloo 2; SEO allows one preloaded UI font under 40 KB. Design's family list wins, with only the Nunito Latin file preloaded.
- Hub indexing threshold: 6 (arch), 8 (SEO), 12 (design). SEO wins.
- Withdrawn designs: arch 301-redirects them to the primary hub; SEO returns 410 for deliberate withdrawals. SEO wins.
- hreflang x-default: SEO always adds it; arch adds it only when at least 2 alternates exist. Arch wins.
- Parent gate: typed number in words (design), a multiplication keypad (Islamic), press-and-hold (app). Design wins.
- Kid-mode default: opt-in (design), always on for the canvas (Islamic), on by default except adult pages (app). The app's rule wins for the canvas and design's for the site.

## islamic-critic

**Verdict:** The ISLAMIC-IMAGERY section is the strongest part of the plan. It has tiers, madhab notes, accurate mosque facts, symbol rules, a review gate and a NEVER list. The other five sections do not consistently follow it. They disagree on the decisions Muslim families and child-safety regulators will judge the site by:

1. **Sacred text.** SEO publishes calligraphy, Bismillah, 99 Names and Indonesian Asmaul Husna and kaligrafi pages. Content excludes all of them at launch. The app assumes they can be colored online.
2. **Imagery filter.** There are four incompatible filter models, and one schema says "no faces ever" while the design spec allows animals with faces.
3. **Review gating and schedule.** Arabic letters, calligraphy and landmark mosques go live before the reviewers are contracted, and lint rule L12 would block the whole Ramadan hub.
4. **Contested observances.** Mawlid appears in the site-wide nav. The Islamic New Year is framed as a celebration even though Muharram leads into Ashura.
5. **The generators break the Islamic section's own symbol rules.** They produce stand-alone six-point stars next to crescents and {5/2} pentagrams.
6. **Religious education has gaps.** The salah sheet asserts hand and foot positions, ignores Hanafi women's postures, omits the salawat Ibrahimiyya and prints the Fatiha on a worksheet. The shahada appears on cut-out crafts. The Animals of the Quran list includes punishment and murder stories (crow, frog, locust) and a weakly attested spider–Hijrah link. The fasting-hours study uses sunrise instead of Fajr.

On child safety, the claim that the site is "for parents and teachers" does not hold up next to a mascot, a kid mode, kid-voice copy and the name "KidsColorIt". Regulators will treat the site as child-directed. That status rules out:
- logging raw search queries,
- "I'm 18+" checkboxes in place of a neutral age screen,
- religious-preference analytics without special-category handling,
- server-side photo processing,
- ad category lists that leave out riba finance, non-halal food, music, distressing charity creatives and photos of faces in ads.

The fix is structural. Make ISLAMIC-IMAGERY.md the single owner of these enums and tables:
- a sacred-text format matrix,
- an observance table,
- a general-topics and holidays policy,
- review tiers R0–R2 with capacity,
- the imagery tier enum.

Every other section should import them rather than restate them. Treat the site as child-directed in PRIVACY.md and the ad stack. Note that the ISLAMIC-IMAGERY draft I received starts mid-§3.4, so the missing §1–§3.3 must be restored and checked before the docs are written.

- **[blocker] Cross-section: SEO §2.4 H16/H17, §2.7, §8, §10, §11 vs Content §0 #11/§9 vs App §2.5/§2.8/§5 vs Design §5 MegaMenu** — There is no single rule for sacred text, and the sections conflict. SEO schedules these for launch:
- calligraphy (2026-11-06), including 'bismillah coloring page' and 'alhamdulillah coloring'
- the 99 Names of Allah hub on 2026-11-13: 99 cards, 9 sheet PDFs and a full-book PDF
- /id/mewarnai-asmaul-husna/ and /id/mewarnai-kaligrafi/
- an Indonesian 'Asmaul Husna' Pinterest board
- 'bismillah coloring page' and '99 names of allah coloring' in rank tracking

The Design mega-menu lists 99 Names, and the App designs a 'soft glow' completion for 99 Names and Bismillah, which assumes they can be colored online. Content and Islamic say no divine names and no Quranic text on any coloring page at launch, with 99 Names and Bismillah excluded. Outlined divine names that children scribble over, erase and throw away are the main source of offense on disposable sheets.
  - Fix: Put a format matrix in ISLAMIC-IMAGERY §2 that every section must follow:
- Divine names, the basmalah, the shahada and Quranic text are NEVER colorable outlines, on paper or online, and never on cut-out pieces.
- They may appear only as solid, non-colorable text inside a learning card or poster. The child colors only the ornamental frame. The sheet carries the 'please treat respectfully' notice and needs IS and AR sign-off.
- Rename H17 to '99 Names of Allah (Asmaul Husna) Learning Cards' and take it off the 2026 publishing calendar, the mega-menu and the rank list until sign-off.
- Limit /id/mewarnai-kaligrafi/ to phrases without divine names ('Marhaban ya Ramadhan', 'Selamat Idul Fitri') or to ornamental frames.
- In the app, sacred-text glyph regions are a locked layer: no fill, brush or eraser.
- **[blocker] SEO §10 calendar (2026-10-23, 11-06) vs Islamic §5.11 vs Content §3.5 (G14 stroke data)** — SEO publishes the Arabic alphabet (3 hubs and 28 letters) on 2026-10-23, and calligraphy plus a 12-mosque series on 11-06. Islamic §5.11 only has reviewer contracts signed by 1 Nov, and AR-01 to AR-05 apply to every glyph, positional form, example word and stroke arrow. Content §3.5 lets 'an Arabic teacher or the design team' correct stroke order in about 6 hours. Wrong stroke order or wrong vowel marks on a free alphabet worksheet is exactly the error that damages trust with madrasah teachers.
  - Fix: Gate Arabic letter, number and calligraphy go-live on AR sign-off, no earlier than about 17 Nov. Stroke-order JSON is corrected or approved by the AR reviewer only, never by the design team. Budget about 15–20 AR hours for letters, forms, example words, digits and bunting, not 10. Fill the 10-23 slot with R0 content only: non-Arabic geometric, mandala, shapes and snowflakes.
- **[blocker] Islamic §5.11 L12 vs Content §4.4/§5 (Wave 1A 205 designs, review {by:'QA-SR', islamic:false})** — L12 removes any entry with islamic.hub=true from production until IS and AR approve it. Read literally, that blocks every lantern and crescent in the Ramadan hub. Content marks those same designs 'islamic:false' after a studio check, which bypasses Islamic review completely. Review capacity is about 150 items and 25 IS hours, against 205 Wave 1A items, 85 of which are Arabic. Either the Ramadan hub misses its date, or the review gate is quietly skipped.
  - Fix: Define review tiers in ISLAMIC-IMAGERY.md:
- **R0:** general, non-religious art. Studio QA only.
- **R1:** aniconic Islamic-hub objects and patterns with no text, facts or people. The IS reviewer approves them in batches from a contact sheet, about 30 seconds each, and the approval is recorded per item.
- **R2:** text, facts, Arabic, people, sacred places and worship steps. Full IIS-1.0 checklist per item.

Replace the boolean with `review.tier` plus reviewer IDs and the checklist version. L12 then gates by tier. Recompute the Wave 1A load as roughly 120 R1 + 85 R2-Arabic + 19 R2 printables.
- **[blocker] SEO §7.7 ('framed for parents and teachers'), Design kid mode/Najma/kid microcopy, brand name** — FTC child-directed factors include subject matter, animated characters, child-oriented activities and language. This site has Najma the mascot, a kid mode, 'Print it!', '42 sleeps until Ramadan', coloring games and the name 'KidsColorIt'. It will be treated as directed to children, very likely as its primary audience. Saying 'adults download' does not change that. Consequences:
- Age checkboxes do not legitimize collecting personal information.
- Every free-text field may contain a child's personal information.
- Every ad request must carry COPPA flags.
  - Fix: Record in PRIVACY.md that the site is child-directed, and set the Google COPPA site designation. Collect no personal information except under COPPA's exceptions (security, one-time contact).

For a mixed-audience newsletter or contact form: put it on adult pages behind a neutral age screen (birth-year field, no hint of the 'right' answer), and get a written COPPA counsel opinion before the 2026-12-01 newsletter launch.

For programmatic ads: require regs.coppa=1 on every bidder and no user-ID modules (UID2, ID5 and similar). Get written confirmation that Mediavine or Raptive accepts child-directed inventory before the roadmap depends on them.
- **[major] Content §3.2–3.3 G01/G06/G10 vs Islamic §7.4 (L16)** — The generator catalog breaks the six-point-star rule:
- G01 rosette allows n=6 as a stand-alone shamsa medallion.
- G06 mandala takes its centerpiece from G01 at n=6.
- G10 crescent-sky uses '5-, 6- and 8-point star polygons', which puts a six-point star next to a crescent.
- 5-point 'star polygons' with ink computed from strokes can render as an interlaced {5/2} pentagram, which the Islamic section bans.
- G05 over-under interlace can produce chiral four-arm hooked crosses that read as swastikas.
  - Fix: Remove n=6 from the stand-alone modes of G01 and G06; allow it only inside tessellations with 7 or more stars. Drop six-point stars from G10, the gift tags, the sticker set and the sparkle library. Draw five-point stars as a plain outline with no internal crossings. Implement L16 as a geometry test in `generators/core/qa.ts` that detects isolated six-fold star outlines, {5/2} crossings and chiral hooked-cross motifs. Add golden tests for it.
- **[major] Content §3.5 G16 'K is for Kaaba', G12 qibla compass, G18/G24/G25 transforms vs Islamic §4.5** — The Kaaba appears in the launch A–Z set (Wave 1C, 8 Dec), although G12 schedules the Kaaba for Wave 2 as a sacred place. The A–Z layout puts the object in the lower half under a bubble letter, which breaks the 'never in the bottom band' rule. The dot-to-dot, masked maze and color-by-code transforms accept any G10–G12 object, including the Kaaba and mosque silhouettes. That turns sacred places into game pieces with maze paths crossing them, which §4.5 forbids.
  - Fix: Use 'K is for Key' or 'K is for Kufi'. The qibla compass shows an arrow and the word 'Qibla', not a Kaaba glyph. Exclude `sensitivity: sacred-place` from every transform: maze, dot-to-dot, strict color-by-number, stickers and how-to-draw. Masked mazes use crescent, lantern and star masks only, never a mosque.
- **[major] SEO §2.6 Animals of the Quran list; §6 bridge 'spider ↔ guide on the Hijrah' vs Islamic §5.9/§5.10** — SEO lists items the Islamic section excludes or would exclude by its own logic:
- **Crow (5:31):** the first murder and burial.
- **Frog and locust (7:133):** plagues sent as punishment. This is the same reason apes are excluded.
- **Ram:** the Ibrahim sacrifice story.
- **Cow:** the 'story summary' of 2:67–73 is a murder investigation.

§5.10 bars death and punishment at every age. The spider-at-the-cave story is weakly attested (its chains are disputed). The Quranic spider in 29:41 is a parable about false protectors, not the Hijrah.
  - Fix: Use Islamic §5.9 as the canonical list: drop crow, frog and locust; the ram appears only as an Eid al-Adha animal. Captions give the reference only ('Named in Surah al-Baqarah, The Cow'), with no narrative of killing or destruction. For the elephant, say 'the Year of the Elephant' and do not show Abraha's army. Remove the spider→Hijrah bridge, or label the story 'told in some seerah books; scholars differ on its authenticity'.
- **[major] Islamic §5.3 Salah steps; SEO H10 salah printable** — The sheet is not neutral across madhabs:
- Hands 'folded at the middle of the body' is itself a position.
- The girl version is presumably a mirror of the boy version. Hanafi fiqh, the majority in South Asia, Türkiye and Central Asia (including the studio's own Bangladesh), teaches distinct women's postures: hands on the chest, compact ruku and sujud, and sitting with both feet to the right.
- Iftirash versus tawarruk is visible in any side view.
- The salawat Ibrahimiyya in the final sitting is omitted. It is a pillar for Shafi'i and Hanbali, and sunnah for the others.
- A single taslim (Maliki) and witr (wajib for Hanafi) are not mentioned.
- The full al-Fatiha is printed in Arabic on a worksheet children write on.
  - Fix: Draw the standing and sitting positions from behind or three-quarter back, with robes covering the hands and feet, so the sheet does not assert one posture. Add a 'Girls (Hanafi)' variant, or show the differences in the grown-ups box. Add the salawat step. Extend the madhab note to cover hand placement, sitting, taslim, witr and qunut. Replace the Arabic Fatiha with 'Recite Surah al-Fatiha (1:1–7)', and link to a separate reference card that cannot be written on and carries the notice. Ask the madhab consultant pool to approve the final sheet.
- **[major] Islamic §5.2 Wudu; Content §6.2 P0-1 brief** — The brief 'hands cupping water up toward the nose' needs a nose, but the brief is meant to be faceless. The madhab note leaves out wiping the neck, which many Hanafi families in South Asia teach and which will be the first complaint from the studio's home market. It also leaves out new water for the ears (Shafi'i). The post-wudu dua (the shahada) has no placement rule for posters that hang near bathrooms.
  - Fix: Use an icon convention for the mouth, nose and face steps: a water-drop icon and a label, no anatomy. Add neck-wiping and ear practice to the note ('some families also…'). The post-wudu dua appears only in the grown-ups box version with the notice, never on the bathroom-safe poster.
- **[major] SEO H10 Five Pillars (cut-and-paste, hand craft) + Islamic §5.4; Content G23 word-search** — The shahada is 'set solid' on the Five Pillars sheet, and SEO plans cut-and-paste and hand-craft templates. Cut-outs and glued crafts are the most disposable format of all. Word-search lists (Ramadan, 5 Pillars, Hajj) have no rule against ALLAH or divine names. The filler-letter scan only checks profanity, so the grid can spell ALLAH or الله at random, and children circle and scribble over it.
  - Fix: The shahada pillar is shown as an icon (a raised finger) plus the word 'Shahada'. The Arabic shahada appears only on the reference poster, not on any cut-out. L04 treats any sheet with cut or fold guides as forbidding sacred text. Word lists exclude divine names. Add ALLAH, GOD and الله to the 8-direction scan of the filler letters for every locale.
- **[major] Design §1.4/§1.5 microcopy and tagline vs Islamic §5.2/§6.1/§6.4** — Islamic §5.2 uses 'basmalah' on bathroom posters because the Latin 'Bismillah' contains the divine name. Yet Design uses 'bismillah' as loading-spinner text ('Crayons ready… bismillah!') and in the kid tagline 'Grab your crayons — bismillah!', which will end up on OG images and pins. It also uses 'MashaAllah!', which differs from the house style. Islamic §6.2 puts 'Allah' throughout fact sheets, but notice detection does not check Latin script. Using bismillah as UI filler also contradicts 'at most one gentle reminder, as an invitation'.
  - Fix: Extend L05 to detect Latin transliterations (Allah, Bismillah, Alhamdulillah, SubhanAllah, insha'Allah, masha'Allah, Allahu akbar, Rabb) on every printable and add the notice automatically. Ban them on coloring regions, cut-outs and crafts. Remove 'bismillah' from spinners, taglines, OG images and pins, and keep only the §6.1 invitation pattern. Apply house spelling ('masha'Allah') with lint L10.
- **[major] Design §5 MegaMenu (Mawlid 'optional section'); SEO §6/§10; SEO H10 /printables/islamic-calendar/; Arch events observance** — Mawlid is in the site-wide navigation, while SEO says to keep it out of site-wide promotion. Labelling it 'optional section' in a nav is itself a stance. No section defines a policy for the other contested days: Isra' wal Mi'raj, Nisfu Sha'ban / Shab-e-Barat, Ghadir, and Ashura beyond §3.3 (which I could not see). The 2027 Islamic calendar printable promises 'approximate events' without saying which ones. Marking 12 Rabi' al-Awwal or 15 Sha'ban alienates Salafi and Deobandi families; leaving them out alienates Indonesian, Turkish (Kandil) and Barelvi families.
  - Fix: Add an observance table to ISLAMIC-IMAGERY.md:
- **Universal** (may appear in nav, banners and calendars): Ramadan, the last ten nights, the two Eids, the Day of Arafah, Hajj, a neutral 1 Muharram, and Ashura framed as fasting and history.
- **Community** (never in nav, banners or printed calendars): Mawlid, Isra-Mi'raj, Nisfu Sha'ban, Ghadir. These get only neutral explainer pages ('Some Muslims… others…') and a year-round Seerah hub. The id, ms and tr locales may opt in, with a locale reviewer.

There is no Buraq imagery anywhere. The calendar printable marks universal days only, with an optional sticker sheet for community days.
- **[major] SEO /islamic-new-year-coloring-pages/ (bridged to summer); Design greeting 'Welcome 1449 AH'; app celebration** — 1 Muharram starts the ten days that lead to Ashura, a period of mourning for Husayn for Shia families. Some Sunni scholars also consider celebrating the Hijri new year an innovation. A 'New Year' hub with summer-party art, confetti, balloons or fireworks will offend both groups.
  - Fix: Reframe the hub as 'The Hijri New Year & Islamic Months', calm and educational, with the Hijrah told in text only. Ban fireworks, party props, balloons and confetti motifs on it. Use no 'Happy New Year' greeting. Turn the banner off for 1–10 Muharram. Mute the app's completion celebration on this hub.
- **[major] SEO §2.7 (id 'bedug drum'); Design §4.6/§8.7 'chime'; SEO §8 video pins/Reels/YouTube; Islamic IMG-06** — The instrument rule is contradicted in three places:
- The Indonesian twin plans bedug drum designs, while IMG-06 and the AI negative prompt ban drums.
- The completion 'chime' is a bell sound, and bells are specifically disliked in hadith (Muslim 2113–2114).
- Video pins, Reels and YouTube time-lapses will pick up platform default music tracks.

IMG-06 only covers Islamic hubs, so instrument pages in general hubs are not ruled out.
  - Fix: Set a site-wide rule: no instrument-centred pages in any English hub. The bedug and kentongan are allowed only on /id/, as mosque prayer-call signals, captioned and approved by the Indonesian reviewer. The daff only after explicit review. Replace the chime with a non-melodic sound; sound stays off by default. Every video asset is silent, voice-only or ambient, with no music-library tracks; add this to the pinterest-batch skill and the RUNBOOK.
- **[major] Design §1.4 empty state ('No pages for unicorn yet… our designers may draw it'); SEO §2.5 general hubs** — There is no allow/deny policy for general topics, and the voice guide actively invites unicorn requests. Undecided areas include:
- unicorns and winged horses (the Buraq association is the reason the Islamic negative prompt bans winged horses)
- dragons, fairies, mermaids (modesty), witches, wizards and magic (sihr), genies (jinn are real beings in Islamic belief), ghosts and monsters
- zodiac and constellation myths (Space hub)
- birthdays, Valentine's Day, Mother's Day, Diwali, Holi, Hanukkah, Lunar New Year, St Patrick's Day, Thanksgiving
- the Fall hub, launching 23 Oct in peak Halloween season, with pumpkins and scarecrows
- Spring with eggs and bunnies; Summer with swimwear
- food hubs with pork, ham, pepperoni or wine
- dogs inside homes or prayer scenes
- a rainbow drawn as six horizontal stripes, which reads as a flag
  - Fix: Add a 'General topics & holidays policy' to ISLAMIC-IMAGERY.md with three lists: Allowed, Allowed-with-rules and Never. Seed blocked-terms.json from it for requests, search and AI prompts.
- **Fall:** leaves, apples, acorns and harvest only; no carved or faced pumpkins and no scarecrows.
- **Space:** astronomy only, including Arabic-origin star names (Aldebaran, Altair, Vega); no zodiac figures.
- **Food:** a halal-only list.
- **Rainbow:** weather and science framing, drawn as an arc.
- **Dogs:** outdoor or working contexts only.

Change the empty-state example from 'unicorn' to 'camel'.
- **[major] Content G06 ('Ramadan mandalas', 'Eid mandalas', 'Hajj-themed geometric/mandala'); SEO H12 secondaries ('ramadan mandala', 'islamic mandala')** — A mandala is a Hindu and Buddhist ritual diagram. SEO correctly gives the general hub a neutral framing, but Content puts 'mandala' inside the Ramadan, Eid and even Hajj hubs. 'Hajj mandala' will offend families. The Islamic art term is shamsa (sun medallion) or rosette.
  - Fix: Inside Islamic hubs, use titles such as 'Ramadan Rosette (Shamsa)' and 'Eid Star Medallion'. Keep 'mandala' only in the general mandala hub and its own keywords. Never pair 'mandala' with Hajj. Avoid lotus-throne and wheel-of-dharma motifs.
- **[major] Design §5 imagery levels; SEO §1.7; Arch §2.4/§5.2; Content §4.4; Islamic §9** — The imagery model is defined four different ways:
- **Design:** a 3-way filter (L0/L1/L2) on `data-imagery`.
- **SEO:** a 2-state 'No animate beings' toggle on `data-animate`.
- **Arch:** `kci-strict` on `data-beings`, plus `facesDrawn: z.literal(false)` meaning 'no faces, ever'. Design L2 ('animals with simple faces') contradicts that literal.
- **Content:** `faces: none|faceless-people|animals`.
- **Islamic:** tiers A/B/C, filtered by a React `ImageryFilter.tsx`, although Arch allows React only on the coloring route.

With four models, the 'no faces' promise cannot be guaranteed or tested.
  - Fix: Define one enum in `packages/core/imagery.ts`, owned by ISLAMIC-IMAGERY.md:
- tier A (aniconic)
- tier B (animals: `animalFaces: none | simple`, default none)
- tier C (faceless people)

The `facesDrawn` literal applies to humans only. Use one 3-way vanilla filter and one data attribute. The filter must also drive Pagefind results, RelatedGrid, MoreLikeThis, the home 'Popular' row, the animal links in the mega-menu, and the app sticker set.
- **[major] SEO §2.6 mosque slugs, entity facts table, Mosque JSON-LD addressCountry; SEO H8 world map** — SEO uses the slug `al-aqsa` for a separate mosque next to `dome-of-the-rock`, which contradicts Islamic §4.3: 'Al-Aqsa is the whole compound'. Muslims feel strongly about this. The facts table's 'country' field and JSON-LD addressCountry force a choice between Palestine and Israel for Jerusalem. The clickable SVG world map will draw contested borders (Kashmir, Palestine, Western Sahara). Those are offensive whichever way they are drawn, and map depictions of Kashmir are legally sensitive in India and Pakistan.
  - Fix: Use the slugs `al-aqsa-compound` (map page), `qibli-mosque` and `dome-of-the-rock`. Jerusalem entries omit the country field and addressCountry and use 'Jerusalem (al-Quds)'. The world map has coastlines and city dots only, with no borders, country labels or flags. Keep captions neutral for Hagia Sophia, Córdoba and Xi'an.
- **[major] SEO §8 digital PR #1 ('fasting hours… sunrise and sunset'), §9 'Ramadan 2027 dates by country' vs Islamic §3.4** — The fast begins at Fajr (dawn), not at sunrise. A 'sunrise to sunset' study is wrong about the most basic fact of Ramadan, and it is aimed at news media. Fajr also depends on the angle convention used (MWL 18°, ISNA 15°, Umm al-Qura 18.5°, Egyptian 19.5°), which shifts results by 20–40 minutes or more. Islamic §3.4 bans publishing prayer and iftar times at launch for exactly this reason. Per-country start dates invite errors: Türkiye calculates, and South Asia often starts a day later.
  - Fix: Drop the study for 2027, or recompute it from Fajr using at least two named conventions shown as a range, labelled 'approximate — follow your local mosque timetable', with IS review. Reframe 'dates by country' as 'dates by method' (calculation, Saudi announcement, local sighting), with a ±1–2 day note.
- **[major] Content G21 fasting trackers; SEO H10 'fasting tracker for first-time fasters'; certificate** — A 30-crescent fasting tracker plus a 'Ramadan Star' certificate gamifies hunger for an audience that includes ages 3–8. Prepubescent children are not obliged to fast. Some children have diabetes or other conditions. Some parents will feel pressured by a sheet their child brings home from weekend school.
  - Fix: Label fasting trackers ages 8+. Default the boxes to practice fasts ('until Dhuhr', 'half-day'). Never tie a certificate or reward to completing the fast. Add a grown-ups note: 'Children don't have to fast; check with your doctor for children with health conditions; keep them hydrated at suhoor and iftar.' Reward kindness and effort, not going without food.
- **[major] Design §7.7 and Islamic §8 blocked ad categories** — The block lists leave out:
- riba finance: credit cards, BNPL, payday and consumer loans, conventional mortgages
- crypto, forex and trading
- non-halal food brands and restaurants
- music streaming, instruments and lessons
- immodest fashion, swimwear and beauty
- licensed-character streaming and merchandise
- violent or loot-box games
- 'wazifa', love-spell and ruqyah-healer scams, which are common on South Asian networks
- unlicensed Hajj and Umrah agents
- Christmas and Halloween seasonal creatives

AdSense's 'Religion' sensitive category is all-or-nothing, so 'verified Muslim charities allowed' has no way to be implemented. Charity creatives often show starving or wounded children, which is distressing on a kids' site.
  - Fix: Block these AdSense sensitive categories: Religion, Consumer loans, Black magic/astrology/esoteric, Get rich quick, Dating, Gambling, Alcohol, Weight loss, Cosmetic procedures, References to sex, Sensationalism, Video games. Keep `docs/ads-blocklist.csv` with advertiser URLs for pork, alcohol, riba-lending, music and licensed brands. A named person reviews the Ad Review Center weekly, with an incident path for bad creatives. Muslim charities run only as hand-reviewed direct or house placements, with no distressing imagery.
- **[major] Design §7.7 / Arch §8 AdSlot vs the 'no faces' positioning** — Display ads show photos of real people, often women without hijab, right next to content sold as 'no faces'. That defeats the main differentiator on Islamic hubs and for any family that has set the imagery filter. AdSlot exclusions are keyed to slot IDs and routes, not to what the page contains, so sacred-place and worship pages are not reliably excluded.
  - Fix: AdSlot renders nothing when any of these is true:
- `data-imagery` is not 'show-all'
- `entry.sacredText` is not 'none'
- `sensitivity` is sacred-place
- the page is an Islamic worship printable (wudu, salah, pillars, Hajj)
- it is the first screen of an Islamic hub

Elsewhere prefer text or native units. FamilySettings copy discloses that ads may contain photos of people.
- **[major] SEO §11 events (search_query{q}); §5.9 404 'Request this page' prefill** — Children type names, schools and addresses into search boxes. Logging raw Pagefind queries collects free-text personal information from children (COPPA; UK Children's Code data minimisation).
  - Fix: Never log raw queries. Count a query only if it exactly matches a catalog term or alias, or keep only tokens seen N or more times a day after removing anything with digits, '@', URLs or capitalised name-like tokens. Do the same for 404 paths and the request form. Document this in the DPIA.
- **[major] SEO §7.5 (request form → D1 + email + public list; newsletter 'I'm 18+' checkbox) vs Arch §10 vs Islamic §8 (16+, 140 chars) vs Design Newsletter** — There are three incompatible form specifications, with different age claims (none, 16+, 18+), lengths (80 or 140), storage (D1 or Analytics Engine) and publication rules (public list or private). An 'I'm 18+' checkbox is not a neutral age screen. The corrections and contact form at /contact/?topic=correction collects email from what may be children.
  - Fix: Write one specification:
- **Request form:** no identity fields, at most 100 characters, PII scrubber, private moderation queue, and a public 'most requested' list written by editors.
- **Newsletter, contact and corrections:** adult pages only, behind a neutral age screen (birth year). Under-13 entries are not collected and nothing about them is stored.
- State retention periods for every store.
- **[major] SEO §11 (noanimate_toggle, Plausible), Islamic §10 ('review filter analytics'), SEO §8 newsletter segments** — A family's choice of 'No faces' or 'Objects & places only', and membership of 'Ramadan countdown' or 'Ramadan Day N' email segments, are data that reveal religious belief: special-category data under GDPR and UK GDPR Article 9. For children, it would be linked to Plausible's daily visitor hash.
  - Fix: Count filter states as aggregate counters only (an Analytics Engine counter with no visitor hash), never joined to other events. Newsletter Islamic segments need explicit opt-in wording ('Send me Ramadan & Islamic content'). Record the Art. 9(2)(a) basis in PRIVACY.md, sign a data processing agreement with Kit, and never export segments.
- **[major] App §8 photo-to-page (server, in memory) vs Arch §10 (on-device) vs Islamic §8** — A photo of a child or family is personal information under COPPA. Sending it to an AI or vectorize vendor is a third-party disclosure. The sections disagree on whether processing happens on the server or on the device.
  - Fix: Version 1 runs on the device only: edge detection in a Web Worker, with on-device face detection rejecting the photo before any processing, and no upload. Any server or AI path is adult-gated and requires a vendor DPA with zero retention and no training, plus a DPIA update before the feature flag is turned on.
- **[major] Design §5 ParentGate, Islamic §8, App §2/§3.4 (press-and-hold Share, long-press Advanced), Islamic §8 vs App §0 kid-mode defaults** — There are three gates: a number written in words, 'seven times six', and a 2-second press-and-hold. Design itself rejects press-and-hold, and a 7–8-year-old passes all three. Islamic says kid mode is always on in the canvas, but App makes Advanced mode (with Share) the default on adult pages.
  - Fix: Use one ParentGate component everywhere: exiting kid mode, external links, Share, Advanced mode, settings and any purchase. Use a randomised two-digit × one-digit multiplication with distractors and a keypad, and no timer. In the canvas, Share and external links are always gated, whatever the mode.
- **[major] Islamic §5.11 reviewer roles** — One Islamic Studies reviewer, likely trained in Bangladesh within a Hanafi Deobandi or Barelvi tradition, plus a Shia reader used only for 'differing' pages, cannot check worship printables meant for Shafi'i Southeast Asia and East Africa, Maliki North and West Africa, Hanbali or Salafi-leaning Gulf families, and Hanafi South Asia and Türkiye. Listing a reviewer's seminary or affiliation can also brand the site as sectarian.
  - Fix: Hire a paid consultant pool, one each for Hanafi, Shafi'i, Maliki and Hanbali/Salafi-leaning practice, to sign off asynchronously (one page each) on R2 worship sheets: wudu, salah, Hajj, zakat and fasting. List credentials neutrally (degree, years teaching). Escalation rule: when reviewers disagree, show both practices ('some families… others…') or remove the detail. The site never issues rulings.
- **[major] SEO §3.4 #7 (AI may draft copy), §3.2 funFact sourceUrl; Islamic L09** — Language models invent hadith numbers and repeat well-known fabricated sayings ('seek knowledge even in China', 'love of homeland is part of faith', 'the ink of the scholar…'). The only safeguard is human review under time pressure.
  - Fix: A CI validator checks every 'Quran s:a' reference against a pinned Tanzil text, and checks that any quoted meaning matches the chosen translation. It checks every hadith reference against a pinned sunnah.com dataset ID with a grading field. A reference that cannot be resolved fails the build. Seed blocked-sayings.json with known fabrications. AI never drafts Islamic facts, only non-religious design descriptions.
- **[major] SEO §10 (Indonesian pilot 2026-12-14) vs Islamic §5.11 (locale reviewers 'Phase 2')** — The /id/ pilot ships kaligrafi, Asmaul Husna, hijaiyah letters and Ramadhan copy with no Indonesian Islamic or language reviewer. Indonesian conventions also differ: the honorific 'SAW', 'Idul Fitri', 'Lebaran', 'Ramadhan', and the Kemenag translation of the Quran.
  - Fix: Contract an Indonesian IS-qualified reviewer and a language reviewer by 15 Nov, or delay the pilot. Add an id house-style file covering honorifics, spellings and the Quran translation source. Locale pages go through the same L12 tier gates.
- **[minor] SEO §2.7 /id/mewarnai-huruf-hijaiyah/; Content §3.5 (rejects لا ligature); SEO §1.3 vs Content §4.5 letter slugs** — Indonesian and Malay schools commonly teach 29–30 hijaiyah letters, including lam-alif (لا) and hamzah (ء), but Content's QA rejects لا. French-locale Maghrebi families learn different dotting for fa and qaf. letters.json has no blocklist for example words, so nothing stops الله for alif, prophets' names, or animate words on tier-A pages. The letter slugs conflict between sections (daal/saad/ayn versus dal/sad/ain). 'عيد أضحى مبارك' needs an AR check against 'عيد الأضحى مبارك'.
  - Fix: Configure a letter set per locale (id/ms: 30, including lam-alif and hamzah; ms Jawi adds 6). Add a Maghrebi variant note. Enforce the example-word blocklist in the schema. Keep one slug table in letters.json that SEO imports. The AR reviewer signs off all greeting strings.
- **[minor] Islamic §5.5 fact #7; Content G21 'Last 10 Nights' calendar** — 'Especially the 27th' reflects Sunni emphasis; many Shia families focus on the 19th, 21st and 23rd nights.
  - Fix: Write 'Many Muslims seek it in the odd nights of the last ten; some families focus on a particular night.' Calendars mark all odd nights equally.
- **[minor] Islamic §5.8 Hajj table; SEO H5; SEO §6 bridge camel↔hajj** — The stoning copy is framed only as Ibrahim versus Shaytan, which comes from a Companion's report. Several details are missing:
- leaving Mina after the 12th is allowed (Quran 2:203)
- Sa'i on day 10 applies to tamattu' pilgrims and to those who did not do Sa'i earlier
- women in menstruation are excused from the farewell tawaf

SEO writes 'Arafat' where the house style is 'Arafah'. The camel↔Hajj bridge implies camels in modern Hajj, an anachronism that §7.5 forbids.
  - Fix: Lead the stoning copy with 'to remember Allah, following the Prophet's ﷺ example; many teachers also tell how Prophet Ibrahim refused Shaytan's whispers'. Add 'many pilgrims leave after the 12th' and 'most pilgrims' qualifiers. Apply L10 to SEO copy. Link the camel only to Eid al-Adha and Animals of the Quran.
- **[minor] SEO H1 FAQ 'Ramadan or Ramzan?'; SEO H10 'ramadan advent calendar'** — An FAQ that implies 'Ramzan' is a misspelling will offend South Asian families. 'Advent' is a Christian liturgical term, and some families object to borrowing it (tashabbuh).
  - Fix: Answer the FAQ with: 'Both name the same month; Ramzan reflects the Urdu and Persian pronunciation of the Arabic letter ض.' Use 'advent' only as a keyword mentioned in passing in FAQ text. The product is named 'Ramadan countdown calendar'.
- **[minor] App §2.5/§2.8 stickers, confetti, presets vs Islamic §4.5** — Stickers (balloons, kites), confetti and 'rainbow' presets are disabled only on sacredText designs. They stay enabled on the Kaaba, Masjid an-Nabawi and al-Aqsa, where §4.5 forbids party props.
  - Fix: Disable stickers, confetti, sound and festive presets on `sensitivity: sacred-place` designs as well, using the same soft-glow completion.
- **[minor] Islamic §4.3 #2 Masjid an-Nabawi** — Families leaning Salafi object to giving prominence to the green dome built over the Prophet's ﷺ grave. It is still the most iconic image of Madinah.
  - Fix: Make the primary design focus on the minarets, the courtyard umbrellas and the façade, with the green dome as a variant. Never mention the grave in captions.
- **[minor] Design §7.5 (bundle cover QR) vs Islamic §5.1 (QR only in grown-ups box)** — A QR code on the bundle cover puts a scannable external path in the area children use.
  - Fix: Move the QR code to an inside-cover 'For grown-ups' note.
- **[minor] Design §1.4 greeting calendar; SEO §6 ComingUpBanner (UTC build date)** — Eid often falls a day apart between Saudi Arabia, South Asia and the Americas. A UTC-flipped 'Eid Mubarak!' appears while some families are still fasting their 30th day.
  - Fix: Use a two-day state reading 'Eid Mubarak to everyone celebrating today or tomorrow', recomputed client-side in local time, and keep the 'last 10 nights' copy until then.
- **[minor] SEO H2 'Teaching Ramadan in a mixed classroom', §8 outreach to US school districts and libraries** — Classroom packs for public schools that include wudu or salah steps, the shahada, or devotional imperatives ('Say Bismillah') become religious instruction. Districts will reject them, and the site risks bad press.
  - Fix: Build a separate 'Learning about Ramadan' classroom pack: descriptive 'Muslims…' voice, no worship instruction, no sacred text, and coloring limited to tier A.
- **[minor] Brand (Design §1) vs SEO adult hubs; Organization sameAs YouTube/Instagram** — The brand name says 'Kids' while the plan targets adult keywords ('islamic geometric coloring for adults'), which hurts click-through and clouds the audience story. A YouTube channel of kids' time-lapses must be designated 'Made for Kids' after the 2019 FTC/YouTube settlement.
  - Fix: Present adult content as 'KidsColorIt for Grown-ups' with a calm skin, and do not promote it from kid surfaces. Set the YouTube channel to Made for Kids (no comments, no personalised ads). Never install the Pinterest Tag, Meta Pixel, TikTok pixel, Clarity or GA4. A CI third-party script scan enforces this.

**Missing:**
- **ISLAMIC-IMAGERY draft is truncated.** The copy I received starts mid-§3.4. §1 (tier definitions and schema §1.5, filter analytics §1.6), §2 (sacred-text classes, the §2.2 format matrix, the §2.3 placement rules, the §2.5 notices) and §3.1–3.3 (Hijri calendar, Ashura copy) are missing. Several lint rules and fixes reference them and cannot be checked until they are restored.
- **General topics and holidays policy.** An Allowed / Allowed-with-rules / Never list covering fantasy creatures, jinn and genies, magic, zodiac, birthdays, Valentine's Day, Mother's Day, other faiths' festivals, Thanksgiving, music, dogs, food and swimwear. Seed it into blocked-terms.json for requests, search and AI prompts.
- **Observance policy table.** Mark each event as universal or community: Mawlid, Isra-Mi'raj, Nisfu Sha'ban / Shab-e-Barat, Ashura and Muharram, Ghadir. Say where each may appear (nav, banners, calendar printables, locales).
- **Search behavior for religious queries.** Blocklisted queries currently return 'Let's search for something else!'. A child who searches 'Allah' or 'Prophet Muhammad' would get that, which is offensive. Return a respectful explanation and links to suitable learning pages instead.
- **Ad operations.** AdSense sensitive-category settings, an advertiser URL blocklist (`docs/ads-blocklist.csv`), a named weekly Ad Review Center owner, an incident path for bad creatives, programmatic COPPA flag propagation, and Limited Ads (no cookies) in the UK and EEA in place of a consent banner shown to children.
- **Amended COPPA rule obligations.** A written information security program (§312.8), a written data retention policy published in the notice (§312.10), a channel for parental review and deletion requests, a processor list (Cloudflare, Turnstile, Kit, Lemon Squeezy) with DPAs, a child-friendly privacy notice (UK AADC transparency), and a DPIA update for every feature flag.
- **No push or engagement nudges.** Ban Web Push and any notification in the PWA. Do not call `navigator.storage.persist()` where it shows a permission prompt (Firefox) to children.
- **Brand and marketing imagery rules.** No identifiable children or human faces in desk mockups, pins, Reels, testimonials or press photos. Video assets carry no music.
- **Review of distribution content.** Pin titles and descriptions, newsletter and 'Ramadan Day N' emails, WhatsApp channel posts, outreach packs and guides with religious content currently bypass IS review. Route them through the R-tiers.
- **Quran text, translation and font licensing.** Record the source and licence per locale: Tanzil terms (verbatim, attribution); whether Sahih International or Abdel Haleem quotes are allowed; Kemenag and Diyanet for locales. Prefer the site's own reviewed paraphrases '(meaning)' for children.
- **Public guide on respectful disposal.** Name the options (keep, bury, shred) and say that views differ. Translate the notice into every locale and link it from every sheet that carries sacred text.
- **Contested-group moderation rules.** Requests for Ahmadi mosques, Sufi shrines and dargahs, or tombs (Taj Mahal, Gur-e Amir) as building subjects. The current rule covers them as pattern sources only.
- **Child safety for food activities.** Whole dates and nuts are a choking hazard for under-3s, in addition to the existing allergy note.

**Contradictions:**
- **Sacred text at launch.** SEO §2.4 H16/H17, §2.7, §10 and §11 (calligraphy, Bismillah, 99 Names on 11-13, id Asmaul Husna and kaligrafi) conflict with Content §0 #11/§9 and Islamic (no divine names or Quranic text on coloring pages; 99 Names and Bismillah excluded). App §2.5 assumes online coloring of 99 Names. **Content and Islamic should win**, with 99 Names reframed as solid-text learning cards after sign-off.
- **Imagery model.** SEO uses a 2-state `data-animate` toggle; Design a 3-way `data-imagery` filter that allows L2 'animals with simple faces'; Arch uses `kci-strict`/`data-beings` with `facesDrawn: z.literal(false)` ('no faces ever'); Islamic uses tiers A/B/C with a React `ImageryFilter.tsx`, while Arch allows React only on the coloring route. **Islamic tiers should win**, with Design's 3-way UI, Arch's vanilla implementation, and the faces literal applied to humans only.
- **Who makes the Kaaba and when.** Content G12 code-generates it for Wave 2 (Jan 15) while G16 puts 'K is for Kaaba' in Wave 1C (Dec 8). Islamic §4.3 has it studio-drawn and due 10 Dec. **Islamic wins** for the hero artwork; remove the Kaaba from the A–Z set.
- **Landmark mosques.** SEO §10 plans 'Mosques series v1, 12 mosques with CG silhouettes' for Nov 6. Content §3.4 says 'never name a landmark for a generated mosque', and Islamic §4.3 says studio-drawn only, W1 by Dec 10. **Content and Islamic win.**
- **Al-Aqsa.** SEO §2.6 uses an `al-aqsa` slug next to `dome-of-the-rock`; Islamic §4.3 says Al-Aqsa is the whole compound and labels the Qibli Mosque separately. **Islamic wins.**
- **Mawlid.** Design §5 lists it in the site-wide mega-menu as an 'optional section'; SEO §6/§10 keeps it out of the banner and site-wide promotion. **SEO wins**, extended by an observance table.
- **Wudu and salah printables.** SEO H10/§10 ships them on Dec 8 with code-generated figures; Content P0-1/P0-2 has designer vectors live by Jan 10; Islamic §7.1 allows code or studio. **Content's date and method win.**
- **Arabic alphabet go-live.** SEO says 2026-10-23; Content says Wave 1A on Nov 10; Islamic signs reviewer contracts by Nov 1 and gates on AR review. **The AR gate wins.**
- **Review record.** Content §4.4 uses `review: {by: 'QA-SR', islamic: boolean}`; Arch uses `islamicReviewBy: reference('authors')`; Islamic uses reviewer IDs, checklist version, CODEOWNERS and L12. **Islamic wins**, with review tiers added.
- **Parental gate and kid mode.** Design gates with a number in words; Islamic with 'seven times six'; App with press-and-hold and long-press. Islamic says kid mode is always on in the canvas, while App defaults adult pages to Advanced with Share. **One gate everywhere**, with Share always gated.
- **Forms and age claims.** SEO has a newsletter 'I'm 18+' checkbox and stores requests in D1 with email and a public list. Arch has no identity fields, at most 80 characters, and Analytics Engine storage. Islamic requires 16+ confirmation, 140 characters and an editor-rewritten list. **Arch's no-PII model plus Islamic's moderation win**, with neutral age screens on adult pages.
- **Analytics.** SEO uses Plausible plus `search_query{q}` and `noanimate_toggle`; Arch uses Cloudflare Web Analytics and Analytics Engine with {event, slug, country} only. **Arch wins.** Raw queries and religious-preference toggles are never logged per visitor.
- **Photo-to-coloring.** App §8 processes on the server; Arch §10 and Islamic §8 process on the device. **On-device wins.**
- **QR codes.** Design §7.5 puts one on the bundle cover; Islamic §5.1 allows QR codes only in the grown-ups box. **Islamic wins.**
- **Musical instruments.** SEO §2.7 plans Indonesian 'bedug drum' designs; Islamic IMG-06 and the AI negative prompt ban drums and instruments; Design adds a 'chime' sound. **Islamic wins**, with a documented /id/ bedug exception after review and the chime replaced.
- **Six-point stars.** Content G01 (n=6), G06 and G10 (6-point stars) conflict with Islamic §7.4 and L16 (no isolated hexagram). **Islamic wins.**
- **Animals of the Quran.** SEO §2.6 includes crow, frog and locust; Islamic §5.9 excludes punishment contexts. **Islamic wins.**
- **Fasting times.** SEO §8 publishes a 'sunrise and sunset' fasting-hours study; Islamic §3.4 says no fasting or prayer times at launch (and the fast starts at Fajr, not sunrise). **Islamic wins.**
- **House style.** Content writes 'Qur'an' and 'Tarawih'; SEO writes 'Arafat'; Design writes 'MashaAllah' and accepts '(peace be upon him)'. Islamic §6.3/§6.4 specifies Quran, taraweeh, Arafah, masha'Allah and the ﷺ glyph. **Islamic wins** via lint L10.
- **Bismillah as microcopy.** Design uses 'bismillah' in kid microcopy and the tagline, while Islamic §5.2 treats Latin 'Bismillah' as containing the divine name (hence 'basmalah' on bathroom posters). **Islamic wins.**
- **Coloring app route.** SEO opens it at `#color` on the design URL; Arch at `/color/#slug`; Design and App at `/color-online/{topic}/{design}/`. The rules for kid mode, no ads in the app and sacred designs are keyed to the route, so **pick one before writing the docs**.

## scope-critic

**Verdict:** Each of the six sections is strong on its own. Together they describe several person-months of work, and they disagree on the things that are hardest to change after launch: URLs, where assets are hosted, the design schema, artboard units, the difficulty scale, review gates and launch dates. Followed as written, one session would spend its budget on reconciliation and scaffolding: the monorepo, R2/CDN, CSP hashing, a PWA, kid mode, membership stubs, 26 generators and a full-featured canvas. It would still miss the one item with a hard deadline, an indexed Ramadan 2027 hub. Two gates make it worse. The Islamic review gate (L12) and the "human editedBy" gate would both exclude the whole Ramadan and Arabic catalog, because no reviewer or editor exists yet, and arch even hardcodes a made-up reviewer name.

**MVP (session definition of done):**
- **Build and hosting:** one Astro 7 package, static output. All binaries are served from the same origin under /files/ on Workers Static Assets. English only, but i18n-ready (locale config, html lang/dir, a lint for logical CSS properties).
- **Content:** about 130–170 code-generated designs. All are aniconic and contain no sacred text. They come from about nine generators: fanoos, crescent-sky, mandala with a Ramadan pack, rosette and Hankin tiling, a generic mosque composer, a few iftar objects, Arabic letters (bubble coloring plus a positional-forms worksheet, shaped with harfbuzzjs), word search, maze, and calendar/tracker.
- **Per design:** KCI-SVG master, WebP at 400/800/1200, OG JPG, and Letter and A4 vector PDFs from pdf-lib.
- **Indexable pages:**
  - Home and /islamic-coloring-pages/
  - /ramadan-coloring-pages/ with at least 40 designs
  - /ramadan-activities-for-kids/
  - /printables/ plus the Ramadan calendar and good-deeds tracker
  - /word-search/ramadan/ and /mazes/ramadan/
  - /bundles/ramadan-activity-pack/
  - /arabic-alphabet/ plus 28 letter pages
  - /islamic-geometric-coloring-pages/ and /mandala-coloring-pages/
  - /eid-coloring-pages/ with at least 12 designs
  - /mosque-coloring-pages/ with generic styles only, no named landmarks
  - Every design page, /color-online/, the about, license, privacy and Islamic-guidelines pages, contact, and 404
  - /search/ (Pagefind, noindex)
- **SEO plumbing, exactly as SEO.md specifies:**
  - Title and meta formulas with the season-window year
  - Self-referencing canonical and robots meta
  - OG tags
  - JSON-LD @graph: Organization, WebSite, CollectionPage+ItemList, ItemPage+VisualArtwork+licensed ImageObject, BreadcrumbList, LearningResource
  - Custom sitemap index with image:loc
  - robots.txt, _headers, _redirects, per-hub RSS
- **Small interactive pieces, all vanilla JS:** filter bar, Letter/A4 paper toggle, imagery toggle. An AdSlot component that renders nothing.
- **Online coloring:** a fill-only React island at /color/#slug. It does tap-fill, undo/redo, palettes, pinch and button zoom, IndexedDB autosave and PNG download.
- **Docs and skills:** docs/DECISIONS.md plus the five required docs. About seven skills, each wrapping a script that actually exists.
- **Verification:** `pnpm verify` passes. That covers Vitest tests for generator determinism and QA invariants, the content gates, seo-lint plus link-graph plus a JSON-LD validator over dist, Playwright smoke, a11y, download and app tests against astro preview, and Lighthouse CI on six URLs.

**Explicitly after the session:**
- Brush, color-by-number and advanced canvas tools
- Kid mode and parent gates
- Dark mode
- PWA and service worker
- CSP hashes
- R2
- Membership stubs
- Forms and newsletter
- Translated content
- Facet pages
- Named-mosque entity pages
- Wave 2 illustrated-art intake
- How-to-draw pages
- /tools/*
- Pinterest pins (needed by 14 Dec)

**What the user must provide:** Cloudflare, DNS and Search Console access, and a named real editor. With those, the first production deploy can include the Ramadan hub by 20–27 Oct, not 20 Nov.

- **[blocker] Cross-section URLs: SEO §1.2 vs Arch §3.4/§4 vs Design §6 vs App §4.3 vs Content §4.5/§5** — There are four incompatible URL schemes for online coloring: /{hub}/{design}/#color (SEO), /color/#slug (arch), /color-online/{slug}/ (design) and /color-online/{topic}/{design}/ (app). Other paths conflict too:
- Printables: /printables/{slug}/ vs root /ramadan-calendar-for-kids/ vs /printables/calendars/ramadan-calendar-2027/.
- Bundles: /bundles/ vs /coloring-books/ vs /{id}/.
- Color-by-number: /color-by-number/ramadan/ vs /ramadan-color-by-number/.
- Geometric: /islamic-geometric-coloring-pages/ vs /islamic-geometric-patterns/.
- Team pages: /team/ vs /authors/ vs /about/reviewers/.
- Imagery policy page: three different paths.
- Files: /files/pdf/{hub}/ vs cdn.kidscolorit.com/pdf/ vs /pdf/ vs /assets/.
- Feeds: /{hub}/rss.xml vs /feeds/{hub}.xml.
URLs are the one decision that cannot change after indexing.
  - Fix: Make SEO §1.2 the only URL authority. Encode it once in src/lib/routes.ts, with a snapshot test over every generated path. Use these decisions:
- Online coloring: one app shell at /color/#{hub}/{slug}, marked noindex and left out of the sitemap, plus an indexable /color-online/ landing page. No per-design app pages.
- Printables: evergreen /printables/{slug}/ with no year in the slug.
- Bundles: /bundles/{slug}/.
- Files: same-origin /files/{svg|img|pdf|og|pin}/{hub}/{slug}-coloring-page-*.
Record all of this in docs/DECISIONS.md before writing any template.
- **[blocker] Arch §0.3/§3.4 (R2 + cdn.kidscolorit.com + cdn-pdf Worker) vs SEO §5.1 vs Content §0.9** — Arch puts every binary on R2 behind a cdn subdomain and a second Worker. SEO says never move images to a subdomain. Content says the assets fit on Workers Static Assets.

R2 needs credentials and a bucket that this session does not have. It also creates CORS problems: the canvas gets tainted, and the download attribute is ignored on cross-origin links, which is why arch needs a PDF Worker just to set Content-Disposition. It adds a second Search Console property, plus upload, purge and CopyObject stages that cannot be tested here.
  - Fix: In v1, emit all assets into public/files/ (gitignored) and deploy them same-origin. That is about 1.6K files at MVP size and about 6K at 500 designs. Keep an ASSET_BASE constant. Moving to R2 later means routing /files/* on the same origin to R2 through a Worker, which is only worth doing at about 80K files. Remove the cdn-pdf Worker, the R2 upload, purge and copy stages, and the staging bucket from v1.
- **[blocker] Islamic §5.11 (lint L12) + Arch §2.4 (superRefine, recipe example) + SEO §3.4.5** — L12 drops every entry with islamic.hub=true from production until both the Islamic Studies (IS) and Arabic (AR) reviewers approve it. Arch requires islamicReviewBy for sacredText 'arabic-letters', and review.qaBy must reference a real author.

No reviewer is contracted; the target is 1 Nov, and the session has no humans. So the Ramadan hub, the Eid hub and all 28 Arabic letters would build empty.

Arch's recipe also hardcodes `islamicReviewBy: ustadha-amina`, a fabricated reviewer. That violates the 'never invent people' rule in SEO §7.
  - Fix: Narrow the production gate to content that genuinely needs scholarship:
- sacredText in {quran-verse, names-of-allah, bismillah, dua, shahada}
- people or figures
- Quran or hadith references
- named sacred places
- worship-procedure sheets (wudu, salah, Hajj steps)
- Arabic words or greetings beyond bare letters

Code-generated aniconic patterns and objects, and font-typeset isolated letters with their positional forms, ship without review under an honest 'Made by the KidsColorIt studio' byline with no reviewedBy schema. Make qaBy optional and point it at the organization.

Add a lint that fails when any author or reviewer file lacks consentOnFile: true. Pick the MVP catalog so that it sits entirely outside the narrowed gate.
- **[blocker] Content §0/§3/§5 (498 designs, 26 generators) + App §0–§9 + Arch §1 — overall scope and ordering** — The plan asks one session to build 26 generators, 498 curated designs, a canvas with brush, color-by-number, gradients, patterns, a raster engine, a gallery, print and share, a 4-package monorepo, about 13 docs and about 20 skills. That is several person-months. The likely result is many half-built subsystems and no deployable Ramadan hub.
  - Fix: Adopt the MVP and order the work so a deployable Ramadan hub exists by about one third of the way through the session. Everything after that is additive.

- **M0, spike (at most 10% of the session):** install pinned dependencies; get a hello build of Astro 7 + Tailwind 4 + React 19; check the Playwright browser path; smoke-test resvg, sharp, pdf-lib and harfbuzzjs; vendor the TTF fonts; decide between Clipper and raster connected-component labeling; write DECISIONS.md.
- **M1:** generator core, KCI-SVG, regions, QA, and the derive pipeline (WebP, OG, PDF). Generators: fanoos, crescent-sky and mandala. Contact sheets. Determinism tests.
- **M2:** routes and the full SEO head; JSON-LD; sitemaps, robots, _headers and _redirects; Home, Hub, Design and trust pages. Add a generic mosque generator, objects, rosette and tiling, so the Ramadan hub reaches at least 40 designs. This is the first deployable build.
- **M3:** calendar (2 variants), tracker, word search and maze; /ramadan-activities-for-kids/, /printables/ and the Ramadan bundle.
- **M4:** Arabic alphabet hub plus 28 letters.
- **M5:** the Eid, geometric, mandala, mosque and Islamic parent hubs.
- **M6:** docs, skills, CI YAML and the runbook.
- **M7:** fill-only coloring app.

A milestone is done only when `pnpm verify` passes and the work is committed.
- **[blocker] SEO §10 vs Content §5/§8 vs App §9 (launch dates)** — The Ramadan hub ships on Nov 20 in SEO, Nov 10 in content, and Dec 1–12 'alongside the app' in the app section. SEO also front-loads geometric, mandala and fall content on Oct 23 and holds Ramadan back four weeks.

A new domain with no backlinks needs weeks to get hundreds of URLs discovered and indexed. Delaying the hub that has the deadline is backwards. Tying the hub to the app milestone puts it past the mid-December indexing target.
  - Fix: The first production deploy (target Oct 20–27, depending only on the human Cloudflare, DNS and Search Console steps) includes:
- the Ramadan hub (at least 40 designs)
- /ramadan-activities-for-kids/
- the calendar and the tracker
- the Ramadan word search and maze
- the Arabic alphabet

Nov 10, Nov 24 and Dec 8 become expansion drops: more designs and copy, with no template changes. The hub never waits for the app. The 'Color online' button renders only when flags.colorOnline is true.
- **[blocker] SEO §3.2 + §3.4.7 (human-written description, editedBy required to publish)** — Two rules together mean zero designs are publishable at the end of the session: 'nothing published without editedBy', and a human-written 25–60-word description per design. Describing 14 parametric lanterns from their parameters will also fail the trigram Jaccard < 0.5 sibling gate.
  - Fix: Claude drafts each description from the design's structured facts, with deliberate variety; the gate enforces uniqueness.

A named real person (the user or a Color Experts International editor) batch-approves the copy on a generated review page: a contact sheet showing the copy, with approve buttons that write editedBy and editedAt. Until then, PUBLIC_REQUIRE_EDITOR=1 in production marks unapproved designs noindex rather than excluding them, so hubs still render.

Make funFact optional, and never emit a sourceUrl that nobody checked.
- **[blocker] Environment vs SEO §10 row 2026-10-16 ('production domain live'), §5.1 daily cron, Arch §11.6 CI** — The plan assumes the domain goes live on Oct 16, with a nightly cron, IndexNow and R2/Cloudflare secrets. The session has no Cloudflare account or token, no DNS access, no Search Console or Bing access, and no Pinterest account. wrangler, potrace, tesseract and exiftool are not installed. Nothing separates 'deploy-ready' from 'live'.
  - Fix: Session done means three things: `pnpm build && pnpm verify` passes, `wrangler deploy --dry-run` succeeds after installing wrangler from npm, and docs include a launch runbook.

The runbook gets a dated human checklist:
- Cloudflare account and API token stored as repo secrets
- kidscolorit.com on Cloudflare DNS
- Search Console domain TXT record, then import into Bing
- Disable Cloudflare's managed 'Block AI bots' robots.txt, Rocket Loader and Email Obfuscation
- Submit the sitemap index; URL-inspect the home, Ramadan and Arabic hubs
- Name the editor
- Sign the reviewers by Nov 1
- Pinterest business account and domain claim by Dec 1
- **[major] Content §4.4 vs SEO §3.2 vs Arch §2.4 (design schema and i18n model)** — There are three different design schemas:
- SEO: animate/people/artSource/requiresReview
- Content: faces/sensitivity/source/review{}
- Arch: per-field localized T() maps, beings[], an origin union, and a required qaBy

Arch's per-field locale map also contradicts SEO's model of one entry per locale linked by translationKey. Because en is required, it cannot express Indonesia-only pages such as /id/lomba-mewarnai/.
  - Fix: Use one Zod schema in src/content.config.ts with one entry per locale, linked by translationKey.

Fields: slug, primaryHub, alsoIn[], kind, title, description, alt, difficulty, style[], ages, imagery, sacredText, sensitivity, origin{generated|illustrated}, regions, palette, arabicWord?, seo{primaryKeyword, secondary[]}, review{status, islamicBy?, arabicBy?, editedBy?}, publishedAt, updatedAt, redirectFrom[].

Asset URLs are derived from the slug by convention and never stored.
- **[major] Content §1.2 vs Arch §11.1 vs Design §9.11 vs SEO §1.7 vs App §1.2 (difficulty and print specs)** — There are five difficulty scales (bold-to-expert, easy-to-expert, Easy-to-Expert, easy-to-detailed-to-expert, d1–d5), and their numbers conflict:
- Minimum stroke: 1.78 mm (content), 1.2 mm (arch), or 14–18 px at 300 dpi (design).
- Expert stroke: content's floor is 0.53 mm; design allows 0.17–0.25 mm.
- Minimum region: 150 mm² (content, bold) vs 400 mm² (arch, toddler).
- Region cap for easy: 60 vs 30.
  - Fix: Make content §1.2 the single source, in generators/core/difficulty.ts. Docs and tests import or print that table rather than restating it.

Site labels are easy, medium, detailed and expert. 'Bold' becomes difficulty easy plus style bold-and-easy, which is SEO's facet. The app's region caps are derived from the same table.
- **[major] Content §1 vs Arch §3.1 vs App §1.2 vs Design §8 (artboard, file format, engine contract)** — The sections disagree on units and file layout:
- viewBox 720×940 in units of 0.01 in (content), vs an IR in mm at aspect 0.72 (arch), vs 1000×1294 and 1000×1414 per paper (app), vs 2048×2650 PNG plus labels.png (design).
- Region attributes: data-region vs data-r.
- Layers: id-based groups vs data-layer. Content warns that svgo's cleanupIds breaks ids.
  - Fix: KCI-SVG v1 (content §1) is canonical: 720×940 portrait, 940×720 landscape, data-layer groups, data-region paths. Arch's IR stays internal to the generators. The app reads the viewBox from the file and never assumes a paper size. Drop labels.png for generated art.
- **[major] App §0–§9 + Design §8 + Arch §5.1 (coloring app scope)** — The app spec is the single largest work item in the plan. It covers per-region clipped brush strokes, an adaptive raster window, wet and dry canvases, palm rejection, color-by-number, gradients and patterns, IndexedDB with locks and BroadcastChannel, a print iframe, share behind a parent gate, a gallery, and a perf gate under CDP throttling. Design §8 also contradicts it by specifying a raster label-map engine for every design.
  - Fix: The app section wins on architecture: vector fills, with the engine kept outside React.

The session ships only:
- /color/#slug, which fetches the same-origin SVG
- tap-fill with a tolerant hit test
- an undo/redo command stack
- a 12-swatch strip and 3 palettes
- pointer-event pinch and pan, plus zoom buttons
- IndexedDB autosave of the fills map
- PNG export by drawing the SVG to a canvas
- at most 35 KB gzip of app code

Brush and eraser come next (by Nov 13), color-by-number and advanced tools in December, and the raster engine with Wave 2 art.

End-to-end tests: tapping a region sets its fill attribute; undo works; a reload restores the fills; the PNG download has a valid signature and size.
- **[major] Content §2 (clipper2-ts prerelease planar faces) + §6.5 (potrace intake)** — The whole region model depends on clipper2-ts@2.0.1-18, a prerelease, plus custom planar-face extraction. Illustrated-art intake separately needs potrace (a GPL CLI that is not installed here) and its own connected-component labeling. That is two region engines on the critical path.
  - Fix: Spike Clipper in M0 with a budget of about one hour. If its golden tests pass, keep it.

If they don't, use one raster region extractor for every design:
1. Render the ink layer with resvg at about 2400 px.
2. Label the 4-connected white pixel components.
3. Trace each label's contour with marching squares.
4. Simplify the contour and tuck it under the ink.

This needs no exact geometry, is immune to coincident Hankin edges, and is the same code Wave 2 illustrated art needs anyway.
- **[major] Content §3.5 + Arch §1/§11.1 (Arabic text pipeline)** — No Arabic fonts are installed in this environment; fc-list shows only Noto Color Emoji. harfbuzzjs needs TTF or OTF files, while Fontsource ships only woff and woff2.

Arch says shaping is 'HarfBuzz via fontkit'. That is wrong: fontkit has its own shaper, and positional forms built with zero-width joiners need HarfBuzz.

Stroke-order arrows need about 6 hours of human correction. Aref Ruqaa greetings and example words need sign-off from a native reader.
  - Fix: In M0, vendor the OFL TTFs from npm into assets/fonts with OFL.txt and pinned shas. Verify that the @expo-google-fonts/* packages ship .ttf files. Shape with harfbuzzjs only and drop fontkit.

Ship per letter: a bubble-letter coloring page and a positional-forms worksheet (dashed outline plus ghost fill).

Defer until the Arabic reviewer signs off:
- dotted centerlines with stroke arrows
- 'X is for Y' example words
- Arabic greeting lettering; use English 'Ramadan Mubarak' lettering instead

Add a unit test: the initial, medial and final glyph ids differ from the isolated one for the 22 joining letters, and the 6 non-connectors produce exactly 2 distinct forms.
- **[major] Islamic §7.4 (lint L16) vs Content G01/G06/G08/G10** — L16 throws on `symmetry===6 && layout!=='tessellation'`. That bans every snowflake (G08 is single-centred and six-fold by construction), n=6 rosettes and mandalas, and G10's 6-point stars. The intent is to ban the hexagram, but as written the rule kills the winter hub and many mandalas.
  - Fix: Lint on the motif, not the symmetry group. Forbid any standalone {6/2} hexagram or 6-point star polygon outside a tessellation of at least 7 stars. Remove 6-point stars from G10. Allow six-fold petal mandalas and dendritic snowflakes, and queue both for IS confirmation. Write the L16 vitest with exactly these cases.
- **[major] SEO §10 (Nov 6: '12 mosques with CG silhouettes') + §2.6 entity pages vs Content §3.4 G11 + Islamic §4.3** — SEO schedules 12 named-mosque entity pages built from code-generated silhouettes. Content forbids naming a landmark on a generated mosque, and Islamic §4.3 says landmarks are studio-drawn from licensed references. A wrong minaret count on the Blue Mosque is exactly the error the brand promises not to make.
  - Fix: In v1, /mosque-coloring-pages/ shows only generic mosques, captioned by style (for example 'An Ottoman-style mosque'), plus a parts-of-a-mosque diagram. Commit src/data/mosques.json now. Each /mosque-coloring-pages/{mosque}/ entity page is created only when its studio art passes the architecture check (ARCH-01).
- **[major] Arch §1 (pnpm workspace, 4 packages, 2 Workers, content outside the site root)** — Four packages and two Workers add workspace config, cross-package TypeScript paths, Vite fs.allow problems for the ../content loaders, and two deployables. None of that buys anything for a static site built by one agent.
  - Fix: Use a single package:
- src/ for Astro, with content in src/content and src/data
- generators/ for pure TypeScript
- scripts/ run with tsx
- an optional worker/index.ts

Keep the lint rule that bans Math.random and Date, scoped to generators/.
- **[major] SEO §5.4 vs Arch §2.2/§7.4 (sitemaps)** — SEO mandates custom sitemap endpoints with image:loc entries. Arch uses @astrojs/sitemap chunks plus an integration that patches sitemap-index.xml after the build, and isn't sure customSitemaps exists.
  - Fix: Use custom endpoints only: src/pages/sitemap-index.xml.ts and src/pages/sitemaps/[name].xml.ts, both built from the route manifest. Add image:loc entries, and take lastmod from content dates, never the build time. Drop @astrojs/sitemap.

Tests: every URL in a sitemap exists in dist, is indexable, is self-canonical, and appears in exactly one sitemap.
- **[major] Arch §0.6/§5 vs SEO §5.8/§12 vs Design §0/§6.7 vs Islamic §9 (React placement and JS budgets)** — React is placed in four different spots:
- only /color/ (arch)
- design pages via dynamic import (SEO)
- /search/ through SearchApp.tsx (design)
- ImageryFilter.tsx (Islamic)

JS budgets disagree as well: hubs at 15, 10 or 12 KB, and the app at 120, 130, 95, or 60 KB plus 58 KB of React.
  - Fix: React lives only on /color/. Search uses Pagefind's built-in UI, loaded when the search box gets focus. The filters and the imagery toggle are vanilla JS.

Keep one budgets source, used by both scripts/js-budget.ts and lighthouserc: content pages at most 10 KB gzip of JS; /color/ at most 130 KB gzip including React.
- **[major] SEO §1.7 vs Arch §5.2 vs Design §5 vs Islamic §1/§9 vs Content §4.4 (imagery filter)** — The same differentiator is encoded five ways: data-animate (SEO), data-beings with kci-strict (arch), a 3-way data-imagery (design), Tiers A/B/C (Islamic), and faces (content).

SEO's /no-faces-coloring-pages/ hub would also list the entire launch catalog, because every launch design is aniconic. That makes it a duplicate of every other hub.
  - Fix: Use one field, imagery, with values aniconic, faceless-people and animals (Tiers A, C and B). Render it as data-imagery. One vanilla 3-state toggle, set by a pre-paint script, hides cards with CSS.

Defer /no-faces-coloring-pages/ until animals or people exist. Until then, the policy lives on /about/islamic-content-guidelines/.
- **[major] Design §0/§4.6/§5 (kid mode, ParentGate, Najma animation, dark mode, popover mega menu) + Islamic §8 + App §3.4** — Kid mode is a variant of every component and is tested in four axe modes. The plan defines three incompatible parent gates: number written in words, a 7×6 keypad, and a 2-second press-and-hold that design itself calls inaccessible.

Automatic dark mode through light-dark() doubles visual QA. Popover and command-invoker menus need fallbacks on older Android WebViews.
  - Fix: For v1:
- No kid mode and no parent gate. The app has no share button and no external links, so there is nothing to gate.
- Light theme only, with `color-scheme: light`. Keep the tokens so dark mode can be added later.
- A static logo.
- A plain nav plus footer link columns.

After launch, add kid mode with a single gate: design's number-in-words.
- **[major] Arch §2.2/§7.9 (CSP hashes), §8 (membership stubs), §9 (PWA/SW), §5.2 (favorites + client merge), §10 (Analytics Engine, request form); SEO §7.5 (D1 + Turnstile forms), §8 (Kit newsletter)** — Each of these needs unverified Astro 7 configuration keys, Cloudflare resources and secrets, or ongoing operations. A buggy service worker at launch can pin stale HTML for returning visitors. None of them helps with indexing.
  - Fix: Cut all of these from v1:
- Astro CSP meta hashing. Ship a header CSP with only frame-ancestors, object-src and base-uri.
- The service worker and web manifest.
- Membership, D1 and billing stubs. Keep only flags.ts with ads:false and membership:false.
- Favorites.
- Analytics Engine.
- Forms. /contact/ uses a mailto link.
- The newsletter.

Analytics is the Cloudflare Web Analytics token, added at deploy.
- **[major] Design §3.1 vs Arch §2.2/§12 vs SEO §5.8 (fonts)** — The font budgets conflict: Baloo 2 plus Nunito at 90 KB (design), Nunito plus Baloo Bhaijaan 2 (arch), or one Latin file under 40 KB (SEO).

The Astro Fonts API with the Fontsource provider downloads from a CDN at build time. That may be blocked in this sandbox and in CI, and it is unverified on Astro 7.
  - Fix: Self-host from npm: the @fontsource-variable/nunito Latin subset, and the Noto Naskh Arabic Arabic subset loaded by unicode-range. Use plain @font-face with size-adjust fallbacks, and Nunito 800 as the display face in v1.

Gate: at most 2 font files on first load, at most 60 KB.
- **[major] SEO §5.8/§4.4 vs Content §4.2/§4.3 vs Arch §3.2 vs Design §7.5 (rasters and PDFs)** — The image widths disagree: 400/800/1200, 400/800, 360/720/1200, or 320/480/640. Formats disagree too: AVIF plus WebP, or WebP only.

PDF generation also conflicts: Playwright page.pdf (SEO) vs pdf-lib drawSvgPath (content and arch). The PDF footer is embedded Nunito (design) vs non-embedded Helvetica (content).
  - Fix: Raster output:
- WebP only, at 400, 800 and 1200 wide.
- Choose the encoding that passes the gates: 800 w at most 90 KB, LCP image at most 60 KB.
- OG image 1200×630 JPG.
- Pin image 1000×1500, priority P1 because it is needed by Dec 14.

PDFs:
- Generated by pdf-lib from path-only KCI-SVG.
- Footer in non-embedded Helvetica, ASCII only.
- Fixed dates in the metadata, so the bytes are stable.

The asset pipeline never launches Chromium.
- **[major] Content §4.6 + SEO §3.4.1 (distinctness gates)** — The two sections use different metrics and thresholds: dHash Hamming ≥10 within a hub and ≥6 site-wide, vs pHash ≥12 within a generator and ≥8 site-wide. Both would false-positive on grid-dominated printables (word searches, mazes, 30-cell calendars) and on the 28 letter pages, which share one frame.
  - Fix: Use one dHash implementation with content's thresholds, applied only to kind=coloring. Puzzles and printables are checked on parameter and text uniqueness instead, for example word list or maze solution hash. Letter pages are exempt. An exact-duplicate SVG hash check applies to every design.
- **[major] Verification environment (SEO §4.4/§5.8, Arch §11, App §7)** — The preinstalled browser is Chromium 141 (/opt/pw-browsers/chromium-1194), which matches the globally installed playwright 1.56.1. @playwright/test 1.64.0 will look for a newer browser build.

astro preview does not apply _headers, _redirects or the Worker. Lighthouse performance scores in a sandbox are noisy.
  - Fix: In M0:
- Run Playwright once on 1.64. If the browser is missing, set launchOptions.executablePath to /opt/pw-browsers/chromium-1194/chrome-linux/chrome, or pin @playwright/test to 1.56.1 for the session, and document whichever you chose.
- Unit-test _headers and _redirects as text, and test the Worker's fetch handler in vitest with a mocked ASSETS binding.
- Try a wrangler dev smoke test if workerd installs from npm.

Lighthouse CI hard-fails on: SEO score of 1, accessibility at least 0.95, CLS at most 0.05, and byte budgets. Locally, the performance score and LCP are warnings only.

Drop the exiftool and tesseract checks from v1.
- **[major] SEO §1.7 facets, §2.6 event×age/format, H9 three Arabic hubs, §10 'fall (24)'** — On a domain with zero authority, launching facets, format × topic pages, and three Arabic hubs that each list the same 28 letters multiplies near-duplicate subsets before the parent pages are indexed.

The 'fall (24)' hub due Oct 23 has no generator anywhere in the content plan.
  - Fix: v1 publishes only the indexable set in the MVP. Add facets and the Arabic format hubs after Search Console shows the parent page indexed. Drop the fall hub for 2026. Snowflake/winter is a stretch goal for December.
- **[major] Docs and skills (all sections)** — The sections ask for 13 docs and about 20 skills that overlap: add-design appears in 3 variants, there are 3 seasonal or rollover skills, and 2 intake skills. Several skills wrap scripts that will not exist. Writing docs before the contradictions are resolved bakes the conflicts into them.
  - Fix: Write docs/DECISIONS.md first. Write the 5 required docs plus ARCHITECTURE.md after M3, so they describe code that exists; ARCHITECTURE.md covers the pipeline, runbook and privacy.

Ship 7 skills, each wired to a real script and ending with a verification step: add-generated-design, new-generator, add-hub, seasonal-hub (which covers year rollover), seo-audit, islamic-review, and release. List the others in SKILLS.md as planned.
- **[major] SEO §2.3/§2.4 (Tier A copy volume, 'reviewed' faith sections)** — Tier A hubs need 800–1,300 words each. 'What is Ramadan? Explained for kids (reviewed)' and the Eid al-Adha story are faith content. With no reviewer, they either ship under a false 'reviewed' claim or don't ship at all.
  - Fix: Ground every faith statement in src/data/islamic/facts/ramadan.json (the Islamic §5.5 list), flagged pendingReview, and generate copy only from it. Use no 'reviewed' wording or reviewedBy schema until a real reviewer signs. Cap Tier A bodies at about 600 words at launch and expand them in later drops.
- **[minor] SEO §1.5 vs Arch §2.4 vs Design §1.4 vs Islamic §3.4 (event dates and season window)** — Event dates live in four files. The title-year lead is 16 weeks (SEO) vs 150 days (arch). The two cron times disagree, and both crons need secrets the session doesn't have. A banner reading 'starts in about 37 days' goes stale whenever a rebuild is missed.
  - Fix: Keep dates in one file, src/data/events.ts, and compute the window with one pure function, seasonWindow(date). Unit-test the boundaries: 2026-10-19, 2027-03-17, and the Ramadan 2030 double-year case. The banner HTML says 'expected around 8 Feb 2027', and the day count is computed client-side.
- **[minor] Arch §2.3/§7.1 + Design §6 vs SEO §2.2/§2.3 (titles)** — Arch and design add a ' | KidsColorIt' suffix. Arch's home title runs to about 75 characters, and design's design-page title is over 60.
  - Fix: Use only SEO's formulas, in src/lib/seo/meta.ts. seo-lint fails any title over 60 characters and any duplicate title.
- **[minor] Content §4.1 vs Arch §3.3 (what goes in Git)** — Content commits about 500 SVG masters. Arch regenerates them from generator@version plus seed.
  - Fix: Commit only the manifests and art/.snapshots.json (sha256 and dHash). Regenerate masters deterministically, and fail CI on hash drift without a version bump. Commit per milestone on claude/pensive-fermi-qaxfnq so partial progress survives.

**Missing:**
- A single decisions record (docs/DECISIONS.md / ADRs) with an owner who resolves cross-section conflicts. Six specialists each assumed they owned URLs, schema and budgets.
- The core rules of ISLAMIC-IMAGERY. The Islamic section arrived truncated: it starts mid-§3.4. The tier definitions, the sacred-text classes and allowed formats (§2.2/§2.3), the notices (§2.5) and the schemas (§1.5), which lints L01–L06 depend on, are not in the plan. They must be written in-session from scratch, conservatively.
- A dated list of human dependencies and owners:
- Cloudflare account and token
- DNS
- Search Console and Bing verification
- A named editor for the editedBy approvals
- IS and AR reviewer contracts
- Pinterest business account
- Legal review of the license, privacy policy and COPPA wording
- Physical print tests on inkjet and laser, Letter and A4
- An M0 environment spike with exit criteria. Already confirmed: Node is 22.22.0, the Playwright browser is chromium-1194, and no Arabic fonts, wrangler, potrace, tesseract or exiftool are installed. Still to check:
- Astro 7, Vite 8, Tailwind 4.3 and React 19.3 compatibility
- resvg and sharp native binaries
- harfbuzzjs with vendored TTFs
- clipper2-ts golden tests
- A `pnpm verify` definition of done, run before every commit. It should list exactly what runs: vitest, content gates, astro build, pagefind, seo-lint, link-graph, the JSON-LD validator, html-validate, Playwright on astro preview, and Lighthouse CI.
- An offline structured-data validation approach. There is no Rich Results Test API, so validate in three layers: schema-dts typing; a dist-wide script that parses every ld+json block, resolves every @id, checks the ImageObject license fields, checks BreadcrumbList positions, and checks ItemList count equals the rendered cards; then a post-deploy manual Rich Results Test and Search Console URL Inspection list of 6 URLs.
- An in-session visual QA loop for generated art. Contact sheets of 24 thumbnails per image keep image tokens manageable. Define reject criteria, and add a review page that writes review.status and editedBy.
- Fallback and drop order for when the session runs short:
1. Drop the app (M7) first.
2. Then the breadth hubs (M5).
3. Then the Arabic letters (M4).

The Ramadan hub, activities page, printables and SEO plumbing are never cut.
- How printables (multi-page and landscape) map to URLs, PDFs, LearningResource schema, sitemaps, and the PDF canonical-header Worker. SEO's Worker regex only handles single-design PDFs.
- Error policy for generator QA failures during the build: retry the next sub-seed, skip with a report, or fail. Also how a failing seed is surfaced so the hub count in the title stays honest.
- The Pinterest asset timeline. Pin images with title bands need font outlining in resvg or harfbuzz, and seeding starts Dec 14, yet no milestone owns this.
- A launch-day operations checklist: submit the sitemap; URL-inspect the priority pages; Cloudflare settings (managed robots off, Rocket Loader off, Email Obfuscation off); verify www-to-apex and http-to-https redirect rules; confirm no workers.dev indexing.
- Font and third-party license attribution (OFL.txt, a credits page) and a provenance record for code-generated art.

**Contradictions:**
- Online coloring URL: /{hub}/{design}/#color (SEO), /color/#slug (arch), /color-online/{slug}/ (design) or /color-online/{topic}/{design}/ (app). Winner: arch's single noindex shell at /color/#slug, plus SEO's indexable /color-online/ landing. App-section per-design pages are dropped.
- Asset host: same-origin /files/ (SEO, content) vs cdn.kidscolorit.com on R2 (arch) vs /pdf/ and /img/ (design) vs hashed /art/ URLs (app). Winner: SEO, same-origin /files/.
- Printable URLs: /printables/{slug}/ (SEO) vs /printables/{type}/{slug}/ with the year in the slug plus supersededBy (arch, 'ramadan-calendar-2027') vs root /ramadan-calendar-for-kids/ (content). Winner: SEO's evergreen /printables/{slug}/.
- Bundles at /bundles/ (SEO) vs /coloring-books/ (arch) vs /{id}/ (content); team pages at /team/ vs /authors/ vs /about/reviewers/; policy page at /about/islamic-content-guidelines/ vs /islamic-imagery-policy/ vs /about/islamic-content-standards/. Winner: SEO in every case.
- Hub slugs: /color-by-number/ramadan/ vs /ramadan-color-by-number/; /islamic-geometric-coloring-pages/ vs /islamic-geometric-patterns/; /shape-coloring-pages/ vs /shapes-coloring-pages/; /word-search/ramadan/ vs /ramadan-word-search/. Winner: SEO.
- Ramadan hub launch date: Nov 20 (SEO), Nov 10 (content) or Dec 1–12 (app). Winner: none of them. Ship it in the first deploy, Oct 20–27.
- Review gate: every Islamic-hub entry (Islamic L12), sacredText including arabic-letters plus people (arch), requiresReview on a narrow list (SEO), or sacred-place/text-review (content). Winner: a narrowed version of SEO plus content; L12 as written blocks the launch.
- Reviewer handling: SEO and Islamic say never invent reviewers; arch's recipe example uses 'ustadha-amina'. Winner: SEO and Islamic. Remove the placeholder.
- Region and canvas engine: vector fills with a raster fallback (app), region engine for generated art and raster for illustrated (arch), raster label map for everything (design). Winner: the app section.
- Artboard and units: 720×940 at 0.01 in (content), mm IR (arch), 1000×1294 and 1000×1414 (app), 2550×3300 px (design). Winner: content's KCI-SVG v1.
- Difficulty scale and print minima: five different scales and number sets across content, arch, design, SEO and app. Winner: content §1.2's table, mapped to SEO's site labels plus a bold-and-easy style.
- Text shaping: harfbuzzjs (content) vs 'HarfBuzz via fontkit' (arch; factually wrong). Winner: harfbuzzjs.
- PDF engine: Playwright page.pdf (SEO) vs pdf-lib (content, arch). Footer font: embedded Nunito (design) vs Helvetica (content). Winner: pdf-lib with Helvetica.
- Image formats: AVIF plus WebP (SEO, content) vs WebP only (arch); widths differ in all four sections. Winner: WebP at 400/800/1200.
- Sitemaps: custom endpoints (SEO) vs @astrojs/sitemap plus post-processing (arch). Winner: SEO.
- robots.txt: training bots may read HTML but are kept out of /files/, Google-Extended allowed, /search/ not disallowed (SEO) vs training bots and Google-Extended fully blocked, /search/ and /favorites/ disallowed (arch). Winner: SEO. Google-Extended stays a user business decision.
- Title suffix: none (SEO) vs ' | KidsColorIt' (arch, design). Home title differs in three sections. Winner: SEO.
- Design description length: 25–60 words (SEO) vs at least 60 words required for indexability (arch). Winner: SEO's range, plus its 80-unique-words main-content gate.
- Hub indexability threshold: ≥8 designs (SEO), ≥6 (arch) or never publish under 12 (design). Winner: publish at 12 or more; facets also at 12 or more.
- Imagery filter encoding: data-animate binary (SEO), data-beings (arch), data-imagery 3-way (design), Tiers A/B/C (Islamic), faces (content); ImageryFilter.tsx React island (Islamic) vs no React on content pages. Winner: design's data-imagery 3-way, vanilla JS.
- Filter state in the URL: ?age= with replaceState (SEO, design) vs #age= (arch). Winner: the hash, since there is then no parameter-URL surface; canonical stays clean either way.
- React and search: Pagefind Component UI with no React (arch) vs SearchApp.tsx React island (design). Canvas island loaded on design pages (SEO) vs on its own route (arch, app). Winner: arch.
- Kid mode: opt-in toggle (design), always on in the canvas (Islamic), default in the app (app). Parent gate: number in words (design), 7×6 keypad (Islamic), 2-second press-and-hold (app). Winner: cut all of it from v1.
- Six-point stars: L16 bans any non-tessellated 6-fold symmetry (Islamic) vs single centred D6 snowflakes, n=6 rosettes and 6-point stars in G10 (content). Winner: a motif-level rule.
- Named mosques: SEO schedules 12 code-generated silhouette entity pages on Nov 6 vs content (never name generated mosques) and Islamic (studio-drawn landmarks only, W1 Dec 10). Winner: content and Islamic.
- Kaaba: content's Wave 1C A–Z includes 'K is for Kaaba' and a qibla compass with a Kaaba glyph, while the Kaaba is listed as sacred-place Wave 2 requiring review. Winner: the review rule. Use 'K is for Kite' at launch.
- Event dates are stored in four files; the title-year lead is 16 weeks (SEO) vs 150 days (arch); the nightly rebuild runs at 00:30 vs 03:10 UTC. Winner: SEO's 16 weeks, from one events.ts.
- Font budget: one Latin file under 40 KB (SEO) vs Baloo 2 plus Nunito at 90 KB (design) vs Nunito plus Baloo Bhaijaan 2 (arch). Winner: at most 2 files and 60 KB, self-hosted from npm.
- Distinctness gate: dHash ≥10 in-hub / ≥6 site-wide (SEO) vs pHash ≥12 / ≥8 (content). Winner: one dHash implementation with content's thresholds, coloring kind only.
- Design schema and i18n model: one entry per locale with translationKey (SEO) vs per-field locale maps with en required (arch). Winner: SEO.