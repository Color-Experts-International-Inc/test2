<!-- Specialist draft (Islamic imagery & content standards). Superseded by docs/PLAN.md where they disagree. -->

 overrides live in `src/data/islamic/observances.yaml`, with fields `event`, `hijri`, `expected`, `confirmed`, `confirmedDate` and `source`.
- Calendar printables come in two versions. The **undated evergreen** version has "write the date" boxes. The **dated** version (e.g. "Ramadan 2027 / 1448") carries the footer *"Dates may vary by a day in your country."*
- We provide no prayer-time or iftar-time tables at launch. Times depend on location, and a wrong time carries real consequences.

---

## 4. Cultural diversity

### 4.1 Architectural styles: visual signatures for illustrators

| Style | Signatures to get right |
|---|---|
| Early Umayyad (Damascus, Jerusalem, Córdoba) | Horseshoe arches, mosaics of plants and buildings with no figures, octagonal plans |
| Abbasid (Samarra) | Spiral minaret, carved stucco in the "bevelled" style |
| Fatimid and Mamluk (Cairo) | Carved stone domes, *ablaq* stripes (alternating light and dark stone), muqarnas portals, mashrabiya screens, tiered minarets (square, then octagonal, then round) |
| Ottoman | Central dome with a cascade of semi-domes, pencil minarets with balconies (*şerefe*), grey lead domes, crescent finials (*alem*), Iznik tiles |
| Persian (Safavid, Timurid) | Iwans, tall pishtaq portals, bulbous turquoise domes, haft-rangi and mosaic tiles, muqarnas |
| Mughal | Red sandstone with white marble, onion domes with lotus finials, chhatris, jali screens, pietra dura |
| Bengal Sultanate | Brick with terracotta, curved *chala* cornices (taken from Bengali hut roofs), many low domes, engaged corner towers, no tall minarets |
| Andalusian / Moorish | Horseshoe and polylobed arches, red-and-white voussoirs, sebka lattice, carved stucco, zellige dadoes, courtyard fountains |
| Maghrebi | Square minarets, green-glazed tile roofs, zellige, carved cedar |
| Sahelian / Sudano-Sahelian | Mud brick (banco), projecting palm stakes (toron), conical pinnacles, flat roofs |
| Swahili coast | Coral stone, fluted domes, carved doors |
| Malay / Nusantara | Tiered pyramidal *tajug* roofs (no dome), timber construction. Later mosques add domes (Moorish revival and modern). |
| Chinese-Islamic | Timber pavilion halls, upturned eaves, courtyards, pagoda-like minarets, Sini calligraphy plaques |

**Rule:** do not blend styles in one building. For example, never put Ottoman pencil minarets on a Javanese tiered-roof mosque. Generic "fantasy mosques" come from the parametric generator and are captioned "A mosque", never with a real place name.

### 4.2 Modest dress for faceless figures (Tier C)

**Baseline**
- Women and older girls: loose, opaque clothing from wrists to ankles, with hair and neck covered.
- Men: covered at least from navel to knee. In Islamic hubs, men wear long garments or trousers and sleeves.
- In prayer scenes, the women's prayer garment covers the feet, which satisfies every school.
- In Islamic hubs, every female figure, including small girls, wears a headscarf. In general sections, girls who are visibly under about 8 may have uncovered hair and modest clothing.

**Rotate across scenes** so that no single region becomes "the Muslim look":

| Region | Women and girls | Men and boys |
|---|---|---|
| Gulf / Arab | Shayla wrap with abaya | Thobe or kandura; ghutra with agal |
| Levant / Egypt | Pinned hijab, long coat (*jilbab*) | Galabiya, trousers with shirt |
| Türkiye | Pinned *türban*, long trench coat | Takke cap |
| South Asia | Hijab, or dupatta over a headscarf, with shalwar kameez | Kurta or panjabi with pajama, topi; Jinnah cap for older men |
| Bangladesh (Eid) | Salwar kameez with hijab | Panjabi with pajama, tupi |
| Malaysia / Brunei | Tudung bawal, baju kurung | Baju Melayu with sampin, songkok |
| Indonesia | Jilbab or khimar, gamis | Baju koko, sarung, peci |
| West Africa | Headwrap with underscarf covering the neck, long boubou | Boubou or kaftan, kufi (*fila*) |
| East Africa | Buibui | Kanzu, kofia |
| Maghreb | Hijab with djellaba | Djellaba with hood |
| Western | Hijab with maxi dress or wide trousers and long cardigan | Hoodie, trousers, kufi |

Also include:
- Occasionally, niqab (it is faceless by nature). It is never the default.
- Grandparents with walking sticks.
- A person praying seated on a chair (permitted for those unable to stand).
- A wheelchair user.
- Babies, faceless, in arms or in a stroller.

Thumbnail previews are colored with a range of skin tones (on hands). Ethnicity is never shown through caricatured features.

### 4.3 Starter list: 40 mosques

All landmark mosques are **drawn by the studio from license-logged references**: own photos, CC0, or CC BY or BY-SA with the license recorded in `provenance.references`. Line art is original and never traced from a single copyrighted photo. Wave 1 (W1) is due **10 Dec 2026** for the Ramadan hub; W2 by 1 Feb 2027; W3 by 30 Apr 2027. Data lives in `src/data/mosques.json`.

| # | Mosque | Place | Era / style | Must get right | Wave |
|---|---|---|---|---|---|
| 1 | Masjid al-Haram and the Kaaba | Makkah, Saudi Arabia | — | See §4.5. The Kaaba is a cuboid about 13.1 m high with sides of about 11.03 × 12.86 m, so not a perfect cube. Black kiswah, with the gold hizam band about two-thirds up drawn as a pattern band. Gold door on the north-east face, raised about 2 m. Black Stone at the east corner in a silver frame. Semicircular Hijr Ismail wall on the north-west side, with the gold mizab (rain spout) above it. Maqam Ibrahim in a gold-and-glass enclosure facing the door side. | W1 |
| 2 | Masjid an-Nabawi | Madinah | Many eras | The green dome (painted green in 1837), silver domes, 10 minarets, courtyard umbrella canopies (modern). Caption the building, not the grave. No interior views of the chamber. | W1 |
| 3 | Masjid Quba | Madinah | First mosque, 622; current building 1986 by Abdel-Wahed El-Wakil | White, four minarets, clustered domes. Historical versions show a simple courtyard with no minarets. | W1 |
| 4 | Sheikh Zayed Grand Mosque | Abu Dhabi, UAE | 2007 | 82 white domes, 4 minarets (about 107 m), floral marble inlay (flowers only), reflecting pools | W1 |
| 5 | Dome of the Rock (Qubbat al-Sakhra) | al-Aqsa compound, Jerusalem (al-Quds) | 691–692, Umayyad | Octagonal, golden dome, blue and turquoise tiled walls. **Label it "Dome of the Rock", never "al-Aqsa Mosque".** | W1 |
| 6 | Al-Qibli Mosque | al-Aqsa compound | Mostly 11th century and later | Grey (lead) dome, arcaded front porch, at the south of the compound. Ship it with a compound map page: *"Al-Aqsa is the whole blessed compound of about 14 hectares, including the Dome of the Rock and the Qibli Mosque."* | W1 |
| 7 | Umayyad Mosque | Damascus | 705–715 | Three minarets of different styles, large courtyard, golden landscape mosaics (no figures) | W2 |
| 8 | Al-Azhar Mosque | Cairo | 970–972, Fatimid with Mamluk additions | Five minarets, including the double-finial minaret of al-Ghuri | W2 |
| 9 | Mosque of Ibn Tulun | Cairo | 876–879 | Spiral external-stair minaret, huge courtyard with a domed fountain, pointed arches | W2 |
| 10 | Sultan Hasan Mosque-Madrasa | Cairo | 1356–1363, Mamluk | Towering muqarnas portal, four-iwan plan | W3 |
| 11 | Great Mosque of Kairouan | Tunisia | Founded 670; mostly 9th century | Square three-tier minaret (among the oldest standing), ribbed dome | W3 |
| 12 | Al-Qarawiyyin | Fez, Morocco | Founded 859 by Fatima al-Fihri | Green tile roofs, zellige fountains. Tell her story; never depict her. | W2 |
| 13 | Kutubiyya Mosque | Marrakesh | 12th century, Almohad | Square minaret about 77 m, sebka panels, copper-ball finial | W3 |
| 14 | Hassan II Mosque | Casablanca | 1993 | 210 m minaret, partly built over the Atlantic, green roofs, zellige | W1 |
| 15 | Djamaa El Djazaïr | Algiers | Completed 2019 | Square minaret of 265 m, the tallest in the world; modern lines | W3 |
| 16 | Great Mosque of Djenné | Mali | Current building 1907 | Mud brick, projecting toron stakes, three towers on the qibla wall topped with ostrich eggs. The annual community re-plastering may appear only as a Tier C variant. | W1 |
| 17 | Djinguereber Mosque | Timbuktu, Mali | 1327, built under Mansa Musa | Mud and limestone, pyramidal minaret with toron | W3 |
| 18 | Abuja National Mosque | Nigeria | 1984 | Golden dome, four minarets | W2 |
| 19 | Great Mosque of Córdoba | Spain | From 785; extended in the 960s | Double-tier horseshoe arches with red-and-white voussoirs; the mihrab of al-Hakam II. **Caption:** "Great Mosque of Córdoba (today the Mosque–Cathedral)". Draw only the arcades and mihrab: no nave, crosses or bell-tower top. | W2 |
| 20 | Gazi Husrev-beg Mosque | Sarajevo | 1530–31, Ottoman | Single dome, one minaret, courtyard fountain (*şadırvan*) | W3 |
| 21 | Sultan Ahmed (Blue) Mosque | Istanbul | 1609–1616 | **Exactly 6 minarets**: 4 with 3 balconies and 2 with 2. Cascading domes. Grey exterior; the "blue" is the interior Iznik tiles, so say so in the caption. | W1 |
| 22 | Süleymaniye Mosque | Istanbul | 1550–1557, Sinan | Four minarets with 10 balconies in total, hilltop setting | W2 |
| 23 | Selimiye Mosque | Edirne | 1568–1575, Sinan | Four slender minarets (over 70 m), each with 3 balconies; one huge dome | W3 |
| 24 | Hagia Sophia Grand Mosque | Istanbul | Built 537 as a church; mosque 1453–1934; museum; mosque again since 2020 | **Exterior only**: buttresses and four minarets. Never the interior figural mosaics. Factual, neutral caption. | W2 |
| 25 | Shah Mosque (also called Imam Mosque) | Isfahan, Iran | 1611–1629, Safavid | Turquoise haft-rangi tiles, four iwans, set on Naqsh-e Jahan Square | W2 |
| 26 | Nasir al-Mulk Mosque | Shiraz, Iran | 1876–1888, Qajar | Stained-glass windows and pink tiles. Use the window and floral patterns only. Ideal for color-by-number. | W2 |
| 27 | Great Mosque of Samarra | Iraq | 848–851, Abbasid | Malwiya spiral minaret (about 52 m); the mosque itself survives mostly as walls | W3 |
| 28 | Bibi-Khanym Mosque | Samarkand, Uzbekistan | 1399–1404, Timurid | Huge ribbed turquoise dome. Caption it "restored". | W3 |
| 29 | Badshahi Mosque | Lahore, Pakistan | 1671–1673, Mughal | Red sandstone, 3 white marble domes, 4 corner minarets, vast courtyard | W1 |
| 30 | Faisal Mosque | Islamabad, Pakistan | 1986, by Vedat Dalokay | Tent-like eight-sided shell with **no dome**, four pencil minarets (about 90 m), Margalla Hills behind | W1 |
| 31 | Jama Masjid | Delhi, India | 1644–1656 | Red sandstone with white marble stripes, three striped marble domes, two minarets, gateways approached by stairs | W2 |
| 32 | Sixty Dome Mosque (Shait Gumbad) | Bagerhat, Bangladesh | Mid-15th century; UNESCO | Brick. Despite the name: **77 low roof domes (the central row is 7 chauchala vaults) plus 4 corner towers**. Curved cornice. Named for its roughly 60 pillars. | W1 |
| 33 | Star Mosque (Tara Masjid) | Dhaka | 18th century; redecorated 1926 | White domes covered in blue *chinitikri* (broken-china) star mosaics. **Check the current dome count against recent photos**, because the mosque was enlarged in the 20th century. | W1 |
| 34 | Baitul Mukarram | Dhaka | 1960–1968, by A. H. Thariani | Cube-like main block inspired by the Kaaba, with no large dome. Say "inspired by", never "a copy of". | W1 |
| 35 | Istiqlal Mosque | Jakarta | 1978, by Frederich Silaban | 45 m white dome, single tall minaret. Do not draw the neighbouring cathedral. | W1 |
| 36 | Masjid Agung Demak | Central Java | 15th century | **Three-tier Javanese tajug roof with no dome**; timber pillars | W2 |
| 37 | Baiturrahman Grand Mosque | Banda Aceh | 1879–1881 | Black domes, white walls. Mention the 2004 tsunami gently; no disaster imagery. | W2 |
| 38 | Putra Mosque | Putrajaya, Malaysia | 1999 | Pink granite dome, 116 m minaret over the lake | W2 |
| 39 | Sultan Omar Ali Saifuddien Mosque | Brunei | 1958 | Golden dome, set on a lagoon with a replica royal barge | W3 |
| 40 | Great Mosque of Xi'an | China | Founded 742 by tradition; mostly Ming | Chinese pavilions and courtyards, upturned eaves, pagoda-style minaret, **no domes**. Draw plaques blank. | W3 |

**Backlog for Wave 4:** Sultan Qaboos Grand Mosque, Kul Sharif, the Grand Mosque of Paris, Cambridge Central Mosque, East London Mosque, Islamic Center of Washington, Muhammad Ali Mosque, Kusumba, Choto Sona, Atiya, Larabanga, Great Mosque of Kilwa, Ubudiah, Masjid Kampung Laut, Menara Kudus, Niujie.

Every mosque page carries: "Where" (city, country), "Built", "Style", one vetted fun fact, and a **"Real colors" palette** for the online canvas.

### 4.4 Twenty historic pattern sources

**Studio rule:** when we cite a source, we take its geometry, plants and color logic. We never take its inscriptions or figural details. A generated pattern may be called "Alhambra-style" only if the IS or studio lead confirms it matches a documented panel; otherwise call it "inspired by". The Gen column shows what code can generate: Y = generator, S = studio only.

| # | Source | Era / place | Take | Avoid or note | Gen |
|---|---|---|---|---|---|
| 1 | Dome of the Rock | 691–692, Jerusalem | Vegetal scrolls, jeweled vases, octagonal geometry | The Quranic frieze becomes a plain band | S |
| 2 | Umayyad Mosque window grilles and mosaics | 715, Damascus | Among the earliest geometric marble grilles; tree-and-building mosaics | No figures exist here; keep it that way | Y (grilles) |
| 3 | Mosque of Ibn Tulun | 879, Cairo | Stucco window grilles, arch-soffit ornament | — | Y |
| 4 | Great Mosque of Kairouan | 9th century, Tunisia | Panels from the carved teak minbar (862, the oldest surviving minbar), lustre-tile layouts | — | Y/S |
| 5 | Great Mosque of Córdoba | 10th century | Interlaced polylobed arches, ribbed domes | Exclude Christian additions | S |
| 6 | Alhambra | 14th century, Granada | Zellige dadoes, sebka, muqarnas, tessellations | The Nasrid motto "wa la ghaliba illa Allah" is everywhere; never reproduce it | Y |
| 7 | Bou Inania Madrasa and the living Fez zellige craft | 1350s onward, Morocco | 8- and 16-fold star rosettes, carved cedar | Credit Maghrebi zellige as a living craft | Y |
| 8 | Mamluk Quran frontispieces and enameled mosque lamps | 14th century, Cairo | Star-polygon "carpet pages"; lamp silhouettes for Ramadan lanterns | Illumination only: never the text. The lamps' Ayat an-Nur becomes a band. | Y/S |
| 9 | Seljuk work: the Kharraqan towers (1067/1093) and the Divriği Great Mosque portal (1228) | Iran, Anatolia | Dozens of brick-bond geometries; deep-carved stone stars | — | Y |
| 10 | Topkapı Scroll | Late 15th century, Timurid/Turkmen | An architect's scroll of geometric and muqarnas designs; the canonical construction lines | — | Y |
| 11 | Darb-e Imam girih | 1453, Isfahan | Girih tiles (five shapes) and 10-fold patterns | It is a shrine: caption the pattern, not the building | Y |
| 12 | Safavid Isfahan (Shah and Sheikh Lotfollah mosques) | 17th century | Islimi arabesques, khata'i florals, dome medallions | — | S |
| 13 | Timurid Samarkand (Shah-i-Zinda, Gur-e Amir) | 14th–15th century | Carved glazed terracotta, tile palettes | **Banna'i square Kufic spells sacred names.** Never generate Kufic-like brick lettering. | S |
| 14 | Ottoman Iznik tiles and tezhip illumination | 16th century | Tulip, carnation, hyacinth, saz leaf, rumi and hatayi borders | No tughra (it is text) | S |
| 15 | Mughal jali and pietra dura (Sidi Saiyyed jali in Ahmedabad, 1573; Taj Mahal inlay) | 16th–17th century | Tree-of-life lattice, inlaid flowers | The Taj Mahal is a tomb: pattern source only | Y (jali) / S |
| 16 | Bengal Sultanate terracotta (Sixty Dome, Choto Sona, Bagha, Atiya) | 15th–17th century, Bangladesh | Rosettes, vine scrolls, hanging-lamp (chain-and-bell) mihrab panels | Never figural temple terracotta | S, with a Bangladesh-team specialty series |
| 17 | Sahelian and Hausa architecture (Djenné, Zaria, Kano) | West Africa | Façade rhythm, pinnacles, Hausa relief wall decoration | — | S |
| 18 | Swahili carved doors (Zanzibar, Lamu) | East Africa | Chain bands, vegetal and geometric panels | Leave out fish motifs in Tier A | S |
| 19 | Malay and Nusantara work: woodcarving (*awan larat*) and geometric batik (kawung, ceplok, parang, truntum, megamendung) | Malaysia, Indonesia | Cloud scrolls, circle- and grid-based batik | Leave out figurative or mythic motifs (naga, garuda/*sawat*, wayang) | Y (batik) |
| 20 | Chinese-Islamic carving (Great Mosque of Xi'an) | Ming dynasty | Cloud, floral and lattice motifs | Plaques stay blank; Sini text is never reproduced | S |

Generated patterns record `pattern: { family: 'khatam-8'|'10-fold'|'12-fold'|'girih'|'16-fold'|'jali'|'kawung'…, symmetry: 'p4m'|'p6m'|'p10'…, method: 'hankin'|'systematic-polygonal', historicRef: <#> }`. They follow Jay Bonner's *Islamic Geometric Patterns* (2017) and Hankin's "polygons in contact" method.

### 4.5 Respectful depiction of sacred sites and objects

- **Kaaba, Masjid an-Nabawi, al-Aqsa:** no cartoon exaggeration, no faces, no kawaii style, no party props, fairy lights or characters on or near them. Never cropped by the page edge. Never placed in the bottom band of a page. Never a game piece, and never crossed by maze paths. Tawaf diagrams use counter-clockwise arrows with the Kaaba on the walker's left.
- In historical (seerah) scenes: **no clock tower, minarets, domes, electric light or umbrellas.** The Prophet's ﷺ first mosque in Madinah had mud-brick walls, palm-trunk pillars and a palm-frond roof.
- **The mushaf:** shown closed, on a rehal or shelf. When open, its pages are plain lines.
- **Prayer-mat designs:** a mihrab arch with floral or geometric fill. No Kaaba and no text.
- **Mosques:** no people or characters on roofs or minarets. No flags or slogans. Never add or remove minarets or domes for "balance".
- **Crescent and star:** described as "widely used as a symbol of Ramadan and of Muslim cultures", not as a religious obligation. Never reproduce a specific national flag in Islamic hubs.

---

## 5. Educational content accuracy and review

### 5.1 Anatomy of a printable (Letter and A4, per DESIGN.md)

The page has six regions, in this order:

1. **Title band:** the English title, plus the Arabic term (solid text) if there is one.
2. **Content.**
3. **"For grown-ups" box** (bottom of page 1, or page 2 for worksheets): learning goal, age band, `<MadhabNote>` if relevant, references (e.g. "Quran 5:6 · Bukhari 201"), and how to use the sheet.
4. **Credit line:** "Reviewed by {IS name}, Islamic studies teacher · Arabic reviewed by {AR name}".
5. **Footer:** "kidscolorit.com · Free for home and classroom use", plus the notice when it is required (§2.5).
6. **Safety icons** where needed: "Grown-up help: scissors", "LED tea light only".

There are no QR codes in the kid area. A QR code may appear only in the grown-ups box, and only pointing to our own page.

### 5.2 Wudu steps

- **Canonical (Tier A, `wudu-steps-hands`):** steps illustrated with hands, forearms, feet, water and arrows only.
- **Variant (Tier C):** a faceless child, with separate boy and girl versions.

**Steps (common Sunni order):**
0. Intention in the heart, then Bismillah.
1. Wash the hands 3 times.
2. Rinse the mouth 3 times.
3. Rinse the nose 3 times.
4. Wash the face 3 times, from hairline to chin and ear to ear.
5. Wash the arms up to and including the elbows 3 times, right first.
6. Wipe the head once.
7. Wipe the ears once.
8. Wash the feet up to and including the ankles 3 times, right first, between the toes.

For the face-washing step in the Tier A version, show cupped hands with a splash; no face is drawn. Neck-wiping is not shown. Add a tip: *"Use a little water. The Prophet ﷺ used only a small amount for wudu"* (Bukhari 201).

**Bathroom-safe version:** for posters likely to hang in a bathroom, step 0 reads *"Make your intention and say the basmalah before you begin"*. "Basmalah" names the phrase without containing the divine name. The print note says: *"Best displayed outside the bathroom."*

**"Things that break wudu" (ages 8 and up):** list only the agreed items: using the toilet, passing wind, deep sleep, losing consciousness. Differences go in the grown-ups note.

**Madhab note (exact):** *"This sheet shows the order of wudu that many families learn. Muslims follow different schools of thought, and some details differ: for example, whether rinsing the mouth and nose is required or recommended, whether the exact order is required, and how the head is wiped. In Shia (Ja'fari) practice, the face and arms are washed from top to bottom, and the feet are wiped rather than washed. Please follow what your family and teacher practise."*

### 5.3 Salah steps

- **Canonical illustrated version (Tier C):** a faceless figure in each position.
- **Tier A `altVariant`, the "prayer-mat map":** a top-down view of a mat showing where the feet, knees, palms and forehead-and-nose go. These are the seven body parts in sujud (Bukhari 812).

**Must show**
- Before praying: wudu; a clean body, clothes and place; facing the qiblah; intention.
- The five daily prayers with their fard rak'ahs: Fajr 2, Dhuhr 4, Asr 4, Maghrib 3, Isha 4.
- The positions in order, each with its words in vocalized Arabic, KC-Translit and meaning:
  - Takbir: *Allahu akbar*
  - Qiyam: al-Fatiha (on the worksheet only; `sacredText: quran`)
  - Ruku: *Subhana rabbiyal-‘azim*
  - I'tidal: *Sami‘allahu liman hamidah*, *Rabbana wa lakal-hamd*
  - Sujud: *Subhana rabbiyal-a‘la*
  - Jalsa
  - Tashahhud: the Ibn Mas'ud wording, with the note "other authentic wordings exist"
  - Taslim, to the right and then the left
- Clothing: women's garment covering hair, neck, arms and feet; men's clothing covering at least navel to knee.

**Hands while standing:** in the generic sheet, hands are folded at the middle of the body.

**Madhab note (exact):** *"Muslims follow different schools of thought, and some details of prayer differ: for example, where the hands are placed while standing (below the navel, on the chest, or at the sides), the wording of the tashahhud, and when the hands are raised. This sheet shows one common way. Your family or teacher will show you the way you follow."*

### 5.4 Five pillars

- Shahada, salah, zakat, sawm, Hajj (Bukhari 8; Muslim 16).
- Tier A icons: a raised index finger for the shahada (hands rule), a prayer mat, coins passing from hand to hand, a crescent with dates, the Kaaba.
- The shahada text is set solid, with the `sacred-name` notice.
- Zakat for kids: *"giving a small part of our savings to people in need each year."* Grown-ups note: *"2.5% of qualifying wealth held for a lunar year above the nisab."*
- Hajj: *"once in a lifetime, for those who are able"* (Quran 3:97).
- Grown-ups note: *"This list comes from a well-known hadith. Shia teaching describes these acts among the Branches of Religion (Furu' al-Din), alongside other duties."*

### 5.5 Ramadan: vetted kid facts (`src/data/islamic/facts/ramadan.json`)

1. Ramadan is the 9th month of the Islamic (Hijri) calendar.
2. It lasts 29 or 30 days, depending on the moon.
3. It comes about 11 days earlier each year.
4. Fasting (sawm) is one of the five pillars (Quran 2:183–185).
5. The fast runs from dawn (Fajr) to sunset (Maghrib), with no food or drink.
6. The Quran was first revealed in Ramadan (2:185).
7. Laylat al-Qadr is "better than a thousand months" (97:3). It falls in the last ten nights; many seek it on the odd nights, especially the 27th.
8. Suhoor is the pre-dawn meal, and there is blessing in it (Bukhari 1923).
9. Iftar is often begun with dates or water (Abu Dawud 2356).
10. Children don't have to fast until they are grown up (puberty). Many practise with shorter fasts. People who are sick or travelling don't have to fast and can make it up later.
11. Many Muslims pray extra night prayers called taraweeh.
12. Zakat al-Fitr is given before the Eid prayer so everyone can enjoy Eid (Bukhari 1503).
13. Ramadan ends with Eid al-Fitr on 1 Shawwal.
14. Muslims try to do extra good: reading Quran, giving charity, being kind. "Smiling at your brother is charity" (Tirmidhi 1956).
15. Fasting teaches patience and gratitude, and helps us remember people who are hungry.

**Myths that must never be stated as fact**
- "Ramadan is a festival." It is a month of worship.
- "Muslims always fast 30 days."
- "Laylat al-Qadr is definitely the 27th."
- "You can't swallow your saliva."
- "Children must fast."
- "Ramadan Kareem is wrong." Ship both Kareem and Mubarak versions of every greeting card; some families prefer "Mubarak".

**Ramadan calendar**
- Days 1–30, with day 30 marked "if the month has 30 days".
- The odd last-ten nights marked "Look for Laylat al-Qadr".
- Comes in undated and dated versions (§3.4).
- **Good-deeds tracker:** agreed acts only. **Fasting tracker:** includes "practice fast" options.

### 5.6 Eid al-Fitr

**Show**
- Eid prayer in the morning, with takbirat.
- Eating dates, an odd number, before the prayer (Bukhari 953).
- Best clothes, family visits, gifts.

**Gift-money names to rotate:** Eidi (Pakistan, India), salami (Bangladesh), eidiya (Arab countries), THR or salam tempel (Indonesia), duit raya (Malaysia), bayram harçlığı (Türkiye).

**Eid's name around the world:** Lebaran (Indonesia), Hari Raya Aidilfitri (Malaysia), Ramazan Bayramı (Türkiye), Korité (Senegal), Sallah (Nigeria).

**Cards:** "Eid Mubarak" or "Eid Saeed" on the cover. "Taqabbal Allahu minna wa minkum" is allowed inside only (§2.2).

### 5.7 Eid al-Adha and Qurbani

**Imagery**
- Only eligible animals: sheep, goat, cow or buffalo, camel.
- Alive, healthy, calm, untethered or loosely led, in a pasture or yard. Garlands are fine.
- **Never:** knives, blood, slaughter, carcasses, meat on hooks, frightened or bound animals.
- Sharing is shown as **closed parcels** labelled "family", "friends" and "people in need". Copy: *"many families share in three parts"*; this is recommended, not required.

**Story**
- Ages 3–5: *"Eid al-Adha is a happy day! We pray, visit family and share food."*
- Ages 6–8: add the link to Hajj and sharing with people in need.
- Ages 9–12: *"Allah tested Prophet Ibrahim (Abraham), peace be upon him. Out of His mercy, Allah sent a ram in place of his son (Ismail, according to most scholars)."* Include Quran 22:37 in the meaning: *"It is not the meat… that reaches Allah, but your taqwa."*
- Mention that some families pay for Qurbani to be done abroad.
- **Never depict Ibrahim, Ismail or the scene.**

**Local names:** Kurban Bayramı (Türkiye), Bakra Eid (South Asia), Idul Adha (Indonesia), Hari Raya Haji (Malaysia), Tabaski (West Africa), Eid el-Kebir (Maghreb).

### 5.8 Hajj and Umrah

Hajj pages are **Tier A**: maps, objects and diagrams. Pilgrims appear only as dots or arrows on maps, or as a Tier C variant. Every map is labelled *"Schematic, not to scale."*

| Day (Dhul Hijjah) | Step | Tier A visual |
|---|---|---|
| 8 | Ihram, travel to Mina | Two white unstitched cloths for men (women wear their normal modest clothing); tents of Mina |
| 9 | Standing at Arafah, then Muzdalifah at night to collect pebbles | Plain of Arafah with Jabal al-Rahmah (a landmark only; never imply a ritual climb); pebbles the size of chickpeas |
| 10 | Stoning Jamarat al-Aqabah, sacrifice, shaving or trimming, Tawaf al-Ifadah and Sa'i | **The Jamarat drawn as modern walls in a multi-level bridge, not old pillars**; a parcel; scissors; tawaf diagram |
| 11–13 | Mina; stoning all three Jamarat | The three walls with arrows |
| Last | Farewell tawaf | Tawaf diagram |

- Stoning copy: *"remembering how Prophet Ibrahim, peace be upon him, refused Shaytan's whispers."* Shaytan is never depicted.
- **Umrah:** ihram from the miqat; tawaf of 7 circuits counter-clockwise, starting at the Black Stone corner; 2 rak'ahs (behind Maqam Ibrahim if possible); Zamzam; Sa'i of 7 laps starting at Safa and ending at Marwah, with men jogging between the green markers; shaving or trimming.

### 5.9 Animals in the Quran, and foods (both series)

**Animals (Tier B, featureless by default).** Captions give the reference only, e.g. "Mentioned in Surah an-Naml (27:18)". Never depict the person in the story.

| Animal | Reference |
|---|---|
| Elephant | Surah 105 |
| Ababil birds | 105:3 |
| Ant | 27:18 |
| Hoopoe | 27:20 |
| Bee | 16:68–69 |
| Spider | 29:41 |
| Cow | 2:67–71 |
| Camel | 88:17 |
| Horses | 100:1 |
| Sheep and goats | 6:143 |
| The great fish of Prophet Yunus (whale only) | 37:142 |
| Dog of the cave | 18:18; Wave 2, with a neutral caption |

**Excluded from this series:** the calf (an idol), the snake (a miracle story), apes (a punishment context), pigs.

**Foods (Tier A):**

| Food | Reference |
|---|---|
| Dates and grapes | 16:67 |
| Milk | 16:66 |
| Honey | 16:69 |
| Figs and olives | 95:1 |
| Pomegranate | 55:68 |
| Ginger | 76:17 |
| Gourd | 37:146 |

### 5.10 Age-appropriate phrasing

**Readability limits (lint rule L18)**
- Kid copy for ages 3–8: no more than 10 words per sentence, everyday words.
- Ages 9–12: no more than 15 words per sentence.
- Grown-up notes: about grade 8.
- **Not in scope at any age:** death, the grave, the hereafter, punishment.

| Topic | 3–5 | 6–8 | 9–12 |
|---|---|---|---|
| Fasting | "In Ramadan, grown-ups don't eat in the daytime. At sunset, it's iftar!" | Dawn to sunset; kids practise | Suhoor and iftar, who is excused, why Muslims fast |
| Prayer | "Muslims pray five times a day." | Names of the prayers, simple steps | Positions, words and meanings |
| Hajj | "Muslims visit the Kaaba in Makkah." | Steps on a map | Days 8–13 |
| Eid al-Adha | Sharing and family | Link to Hajj, sharing with people in need | The Ibrahim story without graphic detail |
| Ashura | — | First sentence only | Full neutral copy (§3.3) |

### 5.11 Review workflow

**Roles**
- **Islamic Studies Reviewer (IS):** a qualified teacher (an alim or alimah, or someone with a degree in Islamic studies or Shariah) with at least 3 years teaching children. Reviews all faith content, tiers and tone.
- **Arabic Reviewer (AR):** a native Arabic speaker with Arabic-teaching experience. Reviews all Arabic.
- They must be **two different people**.
- **Community reader:** a Shia reader for pages tagged `observance: differing` that involve Ahl al-Bayt or Ja'fari variants.
- **Locale reviewers** (Phase 2): id, ms, tr, ur, bn, fr.
- **Recruiting:** the IS reviewer may come from Bangladesh, near the studio. The AR reviewer works remotely. **Contracts should be signed by 1 Nov 2026.**

**Pipeline**
1. The author creates an entry and art brief. `npm run check:islamic` must pass.
2. The art is made and passes studio QA (§7.5). `provenance.artQaBy` is set.
3. The PR is opened. Lint adds the labels `needs-islamic-review`, `needs-arabic-review` and `needs-community-reader` according to the content flags.
4. Reviewers work from the Cloudflare preview URL and the **PDF proofs**, using the PR template `.github/PULL_REQUEST_TEMPLATE/islamic-review.md`. Reviewers who don't use Git send written approval, which the editor records and links in the PR.
5. If changes are requested, the work goes back to step 2.
6. On approval: `review.status: approved`, reviewer IDs and `lastReviewed` are set, and a CODEOWNERS (`@kidscolorit/islamic-review`) approval is recorded. The PR is merged.

**Build gate (lint rule L12):** entries where `islamic.hub` is true, or that have `islamic.references`, are excluded from the production build and sitemap unless they are approved by the required reviewers. Preview builds render them with `noindex` and a "DRAFT – not reviewed" ribbon.

**Turnaround (SLA)**
- Normally 5 working days.
- **48 hours from 15 Nov to 15 Dec 2026** (the Ramadan crunch).
- Capacity for Wave 1: about 150 items, roughly 25 hours of IS time and 10 hours of AR time.

**Re-review is triggered by:**
- any change to the text or art of an approved page;
- `lastReviewed` older than 365 days (lint L13 raises a warning);
- an accuracy report from a user.

Computed date changes need no re-review. Copy edits do.

### 5.12 Review checklist IIS-1.0

Failed IDs are recorded in `review.failed`.

- **IMG-01** The tier and `faces` values are correct.
- **IMG-02** At 200% zoom there are no facial features anywhere: background figures, moons, suns, lanterns.
- **IMG-03** Nothing from the NEVER list.
- **IMG-04** Modest dress (§4.2).
- **IMG-05** No other-faith or occult symbols, and no crosses on finials.
- **IMG-06** No musical instruments (Islamic hubs) and no object-faces (Islamic hubs).
- **IMG-07** Hexagram and crescent rules (§7.4).
- **TXT-01** The sacred-text class is correct and allowed for this format (§2.2).
- **TXT-02** Placement rules (§2.3).
- **TXT-03** The notice and the `altVariant` are present.
- **TXT-04** No pseudo-script, and inscriptions are drawn as bands.
- **AR-01** Spelling and positional letter forms are correct.
- **AR-02** Vocalization is complete and correct.
- **AR-03** Codepoints and digit set are clean.
- **AR-04** Stroke order and direction are correct.
- **AR-05** Transliteration and meaning are correct.
- **FA-01** Facts match the vetted fact files.
- **FA-02** Quran and hadith references are verified, and gradings are acceptable.
- **FA-03** A madhab or community note is present where practice differs.
- **FA-04** Dates use "expected / on or around".
- **FA-05** No blocked sayings or myths.
- **ARCH-01** Architecture matches the brief's `mustInclude` (minaret, dome and arch counts) and the caption is correct.
- **TONE-01** Language suits the age band.
- **TONE-02** No fear, guilt or sectarian labels.
- **TONE-03** Inclusive language (§6.5).
- **SAFE-01** Craft safety notes are present.
- **SAFE-02** No external links or QR codes in kid areas.

### 5.13 "Reviewed by": data, credit and schema

**Data:** `src/content/reviewers/{id}.yaml` holds `name`, `role` ("Islamic studies teacher" or "Arabic language reviewer"), `credentials`, `bio`, `languages` and `since`. **Every reviewer has given written consent to be named.**

**Avatars:** reviewer and team pages use initials or object illustrations. No photos, to stay consistent with the brand.

**Hub byline (`<Byline>`):** *"Written by {author} · Reviewed by {IS} (Islamic studies) and {AR} (Arabic) · Updated {date}"*. It links to `/about/reviewers/{id}/`.

**Design pages:** the same credit appears in the "For grown-ups" box and on the PDF credit line.

**Schema:** `WebPage.reviewedBy` holds an array of `Person` objects (`name`, `jobTitle`, `url`). `WebPage.lastReviewed` is an ISO date.

**Footer copy for Islamic pages:** *"Our Islamic pages are written with a qualified Islamic studies teacher and checked by a native Arabic speaker. Muslims follow different schools of thought; where practice differs, we say so. For personal religious questions, please ask your local imam or teacher."*

---

## 6. Writing voice for Islamic content

### 6.1 Voice

The voice is **warm, full of wonder, inclusive, gentle and accurate.** Hub intros speak to Muslim families warmly without shutting anyone out ("Ramadan is a special month for Muslims around the world"). Fact sheets use "Muslims…" and "you", so they work at home and in mixed classrooms.

**Gentle reminders:** at most one per page. They are always an invitation, never a condition.

| Do | Don't |
|---|---|
| "Tip: many families say Bismillah before they start. Ready?" | "You must say Bismillah or…" |
| "Look at the patterns Allah made on a honeycomb!" | "Allah will be angry if you don't pray." |
| "What kind thing will you do today?" | "Good Muslim kids always…" |
| "Some families do this differently, and that's okay." | Labelling things "haram" in kid copy; comparing families' practice |
| "the month of Ramadan" | "the Ramadan holiday"; "the Islamic Christmas" |

**General-topic bridges:** at most one "Did you know?" box, and only where the link is genuine. Example: *"The bee is mentioned in the Quran, and there's a whole surah called an-Nahl, The Bee."* It links to the Islamic page.

### 6.2 "Allah" or "God"

**Decision: use "Allah" throughout English copy.** It is the name Muslim children use in their duas and in the shahada in every language, it matches our Arabic learning content, and it avoids switching names between pages. The glossary entry and the first mention on hub pages explain: *"Allah is the Arabic word for God, used by Muslims everywhere."*

- Pronouns referring to Allah are capitalized: He, His, Him.
- "God" appears only inside quoted sources.

### 6.3 Honorifics

- **The Prophet Muhammad:** the ﷺ glyph after **every** mention ("the Prophet ﷺ"), in body copy only. Rendered by `<Saw/>`:

  ```html
  <span class="honorific" lang="ar" role="img" aria-label="peace and blessings be upon him">ﷺ</span>
  ```

  The font stack is Amiri, then Noto Naskh Arabic.
- **Omit ﷺ** from `<title>`, meta descriptions, alt text, URLs, schema and file names, and from coloring sheets (it contains the divine name; §2.1).
- **Other prophets:** *"Prophet Musa (Moses), peace be upon him"* at the first mention on each page or printed sheet. The English name is given in parentheses at first mention.
- **Companions:** *"(may Allah be pleased with him/her)"* at first mention.
- **Ahl al-Bayt in neutral contexts:** the name plus a relationship ("Husayn ibn Ali, the beloved grandson of the Prophet ﷺ") with no honorific formula, because the formulas mark community.
- **Abbreviations are never used** (pbuh, saw, swt, AS, RA), and neither is "(SWT)" after Allah.
- **Locales:** the ﷺ glyph is used everywhere by default. The id and ms locales may use "SAW" in titles.

### 6.4 Protected house spellings (`src/data/islamic/house-style.json`; lint rule L10 auto-fixes)

| Use | Not |
|---|---|
| Allah | — |
| Quran | Koran, Qur'an |
| Kaaba | Ka'bah |
| Makkah ("Mecca" once in meta or alt where natural) | — |
| Madinah | — |
| Masjid al-Haram, Masjid an-Nabawi, al-Aqsa | — |
| Muhammad | Mohammed, Mahomet |
| Muslim | Moslem |
| Ramadan, Ramadan Mubarak, Ramadan Kareem | — |
| Eid al-Fitr, Eid al-Adha, Eid Mubarak | — |
| suhoor, iftar, taraweeh | — |
| Laylat al-Qadr | — |
| zakat, zakat al-Fitr, sadaqah | — |
| salah, wudu, adhan, qiblah | — |
| mihrab, minbar | — |
| masjid or mosque ("mosque" in titles) | — |
| Fajr, Dhuhr, Asr, Maghrib, Isha | — |
| Jumu'ah | — |
| Hajj, Umrah, ihram, tawaf, Sa'i, Arafah, Muzdalifah, Mina, Jamarat, Zamzam | — |
| Qurbani | — |
| Hijri, AH | — |
| Muharram, Ashura, Rajab, Sha'ban, Shawwal, Dhul Hijjah, Mawlid | — |
| Bismillah, Alhamdulillah, SubhanAllah, Allahu akbar | — |
| insha'Allah, masha'Allah | — |
| Assalamu alaikum, Wa alaikum assalam | — |
| dua, dhikr, tasbih | — |
| fanoos | — |
| hijab, kufi, thobe, abaya | — |

**Banned outright (lint rule L09):** "Mohammedan", "pbuh", "(SWT)", sectarian labels, "Islamic Christmas".

### 6.5 Inclusion

- Do not assume every relative is Muslim. Welcome "new Muslims".
- Show girls and boys equally.
- Show prayer on a chair and wheelchair users.
- Include single-parent families.
- Show families in Muslim-minority countries.
- Show mosques with women's spaces, presented neutrally.
- Never rank how religious a family is.

### 6.6 Microcopy samples

- **Hub intro:** *"Ramadan is almost here! Get ready with free Ramadan coloring pages: lanterns, crescent moons, mosques from around the world and a 30-day calendar to color as the month goes by. Every page prints free on Letter or A4, or you can color it online."*
- **Card line:** *"Geometric Fanoos: an 8-point star lantern for bold markers."*
- **Teacher note:** *"Teaching your class about Ramadan? These fact sheets talk about 'Muslims' so every child can join in."*

---

## 7. Guardrails for AI-generated art

### 7.1 Where AI may and may not be used

**May be used, as drafts that the studio always redraws or cleans up before vectorizing:**
- generic nature, food and objects;
- animals in general sections;
- fictional generic buildings;
- rough drafts of Tier C family scenes.

**Never AI. These are code-generated or studio-drawn only:**
- the Kaaba, Masjid an-Nabawi and the al-Aqsa compound;
- any named landmark mosque;
- geometric patterns (AI breaks the symmetry; for example it draws an "8-point star" with 7 points);
- calligraphy, Arabic letters and any text;
- numbers, maps, Hajj and tawaf diagrams;
- salah-position figures.

AI output must contain **no text at all**. Every word is added afterwards by code from verified strings.

### 7.2 Prompt template (`art/prompts/{slug}.txt`)

`black-and-white coloring page line art, clean closed outlines, uniform {stroke} stroke, no shading, no gray, no gradients, pure white background, {SUBJECT}, {REGION/STYLE}, simple shapes for age {AGE}, generous white margins, portrait composition`

### 7.3 Negative prompt (universal block, plus additions by tier)

**Universal:** `text, letters, writing, calligraphy, arabic script, pseudo-script, signature, watermark, logo, face, eyes, nose, mouth, lips, eyebrows, facial features, smiling moon, sun with face, kawaii face on object, halo, nimbus, glowing figure, angel, winged human, winged horse, pegasus, prophet, saint, robed bearded holy man, deity, god, idol, statue, buddha, cross, crucifix, church, cathedral, steeple, bell tower, star of david, hexagram, pentagram, occult symbol, evil eye, nazar, hamsa, zodiac, tarot, magic wand, witch, wizard, christmas tree, santa, ornament baubles, easter egg, bunny, jack-o-lantern, halloween, skull, musical instrument, drum, guitar, flute, oud, piano, wine, beer, alcohol, pig, pork, dice, playing cards, gambling, weapon, sword, knife, gun, blood, meat, slaughter, flag, revealing clothing, sleeveless, shorts above knee, swimsuit, tight clothing, kissing, romance, shading, crosshatching, grayscale, photorealistic, 3d render`

**Tier A adds:** `person, people, human, child, crowd, figure, hand-drawn person, animal, bird, insect, fish, creature`

**Tier C adds:** `profile silhouette, ears, glasses, beard lines on face, bare arms, uncovered hair (female)`

**Architecture adds:** `cross on dome, onion dome with cross, extra minarets, asymmetrical minarets, melted architecture, broken arches, clock tower` (the clock tower only for historical scenes)

### 7.4 Symbol rules

**Six-point stars.** Hexagonal and 12-fold geometry is a classical Islamic tradition, and the six-point star (historically "the seal of Sulayman") appears throughout it. Today, an isolated hexagram reads as the Star of David or the Israeli flag symbol. So:
- Six-fold stars are allowed **only inside a continuous tessellation**: interlaced or touching their neighbours, with at least 7 stars visible (a centre plus its 6 neighbours), or as part of a 12-fold rosette.
- **Never** a single centred six-point star, a medallion, icon, logo, card or tag shape, craft cut-out, or a lone blue-on-white star.
- Star crafts use 5-, 8-, 10-, 12- or 16-point stars.
- **Enforcement:** the pattern generator throws an error if `symmetry===6 && layout!=='tessellation'`, and a vitest test covers it (lint rule L16). Studio and AI art are checked by IMG-07.

**Other symbol rules**
- **Crescent:** either orientation is fine. The horns must not touch, it must have no face, and it must not copy a national flag.
- **Five-point stars** are fine filled. The outlined interlaced pentagram ({5/2}, especially inside a circle) is never used.
- The 8-point star (khatam, ۞) is fine.

### 7.5 QA (scripts in `scripts/qa/`, followed by human review)

**Automated (`ai-art-check.ts`, run on a 2000 px render):**
- OCR with Tesseract `eng+ara`. Any token with confidence above 60 is flagged.
- A face detector (OpenCV YuNet). Any detection is flagged.
- A vision-model checklist pass that returns JSON for the IMG-01 to IMG-07 questions.
- Pixel check: pure black and white only.
- Closed-region check for bucket fill (per DESIGN.md).

**Human review:**
- At 200% zoom, by **two people for Islamic hubs** (studio QA and the IS reviewer).
- Check minaret, dome and arch counts against the brief's `mustInclude`.
- Check for anachronisms: no cars, electric light, umbrellas or clock tower in historical scenes; no domes on the Prophet's-era mosque; no printed books in 7th-century scenes.
- Check for regional mash-ups: no camels in a Javanese village; no Gulf dress in a Malay scene.

### 7.6 Provenance and disclosure

- `provenance.source: ai-assisted` requires `tool`, `promptFile` and `artQaBy`, plus a passing AI checklist (lint rule L14).
- Lint rule L14 also fails if the subject is on the "never AI" list.
- The About page states: *"Some illustrations begin as AI drafts and are redrawn and checked by our studio and reviewers. Patterns, Arabic letters, maps and sacred places are never AI-made."*

---

## 8. Content safety and child protection (whole site)

**Standards:** we design to the strictest regimes, COPPA (US) and the UK Age Appropriate Design Code. GDPR Article 8 and Indonesia's PDP Law 27/2022 are covered by the same design.

**No child data**
- No accounts.
- No personal data collected from children.
- Cookieless analytics (Cloudflare Web Analytics), with no session replay and no fingerprinting.

**Kid mode (`data-mode="kid"`)**
- Always on for the `/color/` canvas. Elsewhere it is a toggle (`kc:kidmode`).
- **No external links:** external `<a>` elements are tagged `data-external` at build time, hidden by CSS, and blocked by a click guard (lint rule L17).
- No ads, now or after monetization is switched on.
- No Pinterest or share buttons. No newsletter prompts. No request form.
- "For grown-ups" sections are collapsed.
- **Parental gate** before leaving the site, opening settings, or anything purchase-related. It uses a knowledge task: *"Grown-ups: what is seven times six?"* with randomized numbers and a keypad.

**Requests (grown-ups only)**
- The form is protected with Turnstile and asks the user to confirm they are 16 or older.
- Requests are limited to 140 characters and go into a private moderation queue.
- Requests are auto-checked against the blocklists (`blocked-terms.json`: the NEVER list, licensed characters, profanity, adult terms). Matches get a friendly reply: *"We don't make pages of real or religious figures, but here are some ideas…"*
- Requests are never published raw. Any public "popular requests" list is rewritten by editors.

**No UGC at launch**
- Colored artwork is saved on the device only (IndexedDB). "Share" means "download PNG". There are no uploads, galleries or comments.
- A future gallery would need parental consent and pre-moderation, and could not include names or photos.

**Future AI features: "photo to coloring page" and the generator**
- Grown-ups only, behind the parental gate.
- Places and objects only. On-device face detection rejects photos with people.
- Images are deleted immediately after processing.
- Prompts are filtered with the blocklists, outputs are face-checked, and nothing is published publicly.

**Embeds:** no YouTube or other third-party embeds on kid surfaces.

**Safety notes on printables**
- Crafts that need scissors carry a "Grown-up help" icon.
- Lantern crafts say **"LED tea lights only"**.
- Food activities carry an allergy note (dates, nuts).
- No fire, and no small parts for ages under 3.

**Search (Pagefind):** everything stays on-site. Queries matching the blocklist show *"Let's search for something else!"* and the search does not run.

**When monetization is switched on later (all off at launch)**
- Never in kid mode or on the canvas.
- AdSense with child-directed treatment and non-personalized ads.
- Blocked categories: dating, alcohol, gambling, astrology or esoteric, other-faith and sectarian religious ads, politics, cosmetic procedures, weight loss.
- Verified Muslim charities (zakat and sadaqah) are allowed.

**Corrections and incidents**
- Grown-ups can use "Report a problem with this page". Islamic accuracy reports are reviewed within 7 days.
- **If a NEVER-list item ships:** unpublish within 24 hours; purge the CDN cache and the PDF; delete Pinterest pins; log it in `docs/incidents/`; add a regression check.

---

## 9. Implementation map

| Path | Purpose |
|---|---|
| `src/content.config.ts` | The `imagery`, `islamic`, `review` and `provenance` schemas (§1.5) |
| `src/content/reviewers/*.yaml` | Reviewer records (§5.13) |
| `src/lib/imagery.ts` | Tier helpers and count precomputation |
| `src/lib/hijri.ts` | Umm al-Qura expected dates (§3.4) |
| `src/components/imagery/ImageryFilter.tsx` | Picture-preferences island |
| `src/components/islamic/{SacredTextNotice,Saw,ReviewedBy,Byline,MadhabNote,ExpectedDate,TierGuard}.astro` | Islamic page components |
| `src/data/islamic/{notices.ts,house-style.json,blocked-terms.json,blocked-sayings.json,observances.yaml,facts/*.json}` | Islamic data |
| `src/data/arabic/{letters.json,letter-words.json,strokes/*.json}` | Arabic letter data |
| `src/data/{mosques.json,patterns/sources.json}` | §4.3 and §4.4 |
| `art/briefs/*.yaml`, `art/prompts/*.txt` | Studio and AI intake; each brief has `tier`, `mustInclude`, `mustAvoid`, `references` |
| `scripts/qa/islamic-lint.ts` (`npm run check:islamic`, run in CI before build) | Lint rules L01–L18 (below) |
| `scripts/qa/ai-art-check.ts` | §7.5 |
| `.github/CODEOWNERS` | `/docs/ISLAMIC-IMAGERY.md`, `/src/data/islamic/**` and `/src/data/arabic/**` owned by `@kidscolorit/islamic-review` |
| `.claude/skills/islamic-review/SKILL.md` | Runs the lint, renders PDF proofs, prints the IIS-1.0 checklist (details in SKILLS.md) |

**Lint rules (`scripts/qa/islamic-lint.ts`)**

| ID | Checks |
|---|---|
| L01 | `tier` and `faces` are consistent |
| L02 | Islamic hub heroes, OG images, pins and the first 12 cards are Tier A |
| L03 | No object-faces in Islamic hubs |
| L04 | Sacred-text class is allowed for the format (§2.2) |
| L05 | A notice is present when required |
| L06 | `altVariant` exists for sacred-name pages |
| L07 | Arabic codepoint hygiene |
| L08 | Harakat coverage |
| L09 | Banned terms and blocked sayings |
| L10 | House spellings (auto-fix) |
| L11 | Date phrasing |
| L12 | Review build gate |
| L13 | Review staleness |
| L14 | AI provenance |
| L15 | NEVER-list terms in titles, tags or slugs |
| L16 | Hexagram generator test |
| L17 | No external links on kid surfaces |
| L18 | Readability |

---

## 10. Governance

- Changes to this file go through a PR approved by both the IS and AR reviewers. The minor version bumps for wording changes (IIS-1.1) and the major version for rule changes (IIS-2.0). `review.checklist` records which version a page was reviewed against.
- **Quarterly:** audit 5% of approved Islamic pages at random, review the filter analytics (§1.6), and review incident logs.
- **Changelog:** IIS-1.0 (2026-10-13), first release.

## Appendix A: Reviewer reference list

Hadith references use sunnah.com numbering. The IS reviewer verifies each one at review time.

- **On images:** Bukhari 2225, 3225, 5951, 6130; Muslim 2106, 2108; Abu Dawud 4158, 4932.
- **On worship:** Quran 2:183–185, 3:97, 5:6, 17:1, 22:37, 97:1–5; Bukhari 8, 201, 631, 812, 953, 1503, 1923, 2363, 4987 (Uthman's handling of copies of the mushaf; background for the disposal guidance); Muslim 8, 16; Abu Dawud 2356; Tirmidhi 1956.
- **Texts and references:** Tanzil Uthmani text (Quran source); Jay Bonner, *Islamic Geometric Patterns* (2017); Lu and Steinhardt, *Science* 315 (2007) on girih; Necipoğlu, *The Topkapı Scroll* (1995).