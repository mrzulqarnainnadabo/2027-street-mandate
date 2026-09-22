export type Locale = "en" | "pcm" | "ha" | "yo" | "ig";

export const LOCALES: { id: Locale; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "pcm", label: "Pidgin", short: "PCM" },
  { id: "ha", label: "Hausa", short: "HA" },
  { id: "yo", label: "Yorùbá", short: "YO" },
  { id: "ig", label: "Igbo", short: "IG" },
];

export const STORAGE_KEY = "iseyc_locale";

type Dict = Record<string, string>;

const en: Dict = {
  "header.tagline": "National civic instrument · non-partisan",
  "header.brief": "Brief",
  "header.charter": "Charter",
  "hero.kicker": "ISEYC · National civic instrument · 2027",
  "hero.title1": "Don’t tell them who you’ll vote for.",
  "hero.title2": "Tell them what they must deliver.",
  "hero.body":
    "One concrete demand. The right office. Your state. Reviewed by ISEYC before it enters the public record — never a candidate ranking or popularity poll.",
  "hero.cta": "State your mandate",
  "hero.published": "Published mandates",
  "hero.states": "States represented",
  "hero.unavailableTitle": "Published counts temporarily unavailable",
  "hero.unavailableBody":
    "The public record could not be loaded. No zero count is shown in place of real data.",
  "hero.readyNote": "Published records only · not a poll",
  "hero.loadingNote": "Loading public record…",
  "hero.chooseDuty": "Choose a duty of government below",
  "how.title": "How it works",
  "how.1": "Choose a duty of government.",
  "how.2": "Name the office responsible — or say you are unsure.",
  "how.3": "Add your state (and LGA if you know it).",
  "how.4": "Write one concrete demand for a service or outcome.",
  "how.5": "Submit. You get a status reference. The mandate stays New until ISEYC review.",
  "how.6": "Only Published mandates appear on Civic Pulse and the State Civic Brief.",
  "how.publish": "We publish",
  "how.publishBody": "Specific service demands tied to public responsibility.",
  "how.reject": "We reject",
  "how.rejectBody": "Threats, hate, party slogans, candidate promotion, empty noise.",
  "how.footer":
    "Zero published is an empty public record — not a ranking and not a failure. Optional demographics stay private.",
  "how.charter": "Charter & methodology",
  "form.step": "Step 2",
  "form.title": "State your civic mandate",
  "form.intro": "Tie the demand to an office and a place so it can enter the public record as data — not noise.",
  "form.publishLikely": "More likely published",
  "form.publishLikelyBody": "Specific service or outcome (e.g. medicines at the PHC, teachers present, cleared drains).",
  "form.rejectLikely": "Usually rejected",
  "form.rejectLikelyBody": "Party slogans, candidate promotion, threats, personal attacks, empty insults.",
  "form.office": "Which office must deliver this?",
  "form.officePlaceholder": "Select responsible office…",
  "form.state": "Your state",
  "form.statePlaceholder": "Select state…",
  "form.lga": "LGA",
  "form.lgaOptional": "(optional but useful)",
  "form.lgaHint": "LGA helps the brief connect demands to the right local place.",
  "form.demand": "What must they deliver?",
  "form.demandHint": "One concrete demand. Prefer something you could check in 6–12 months. Not a campaign slogan.",
  "form.examples": "Tap an example to start (edit before submit)",
  "form.demographics": "Optional demographics · not shown on the public wall",
  "form.age": "Age",
  "form.gender": "Gender",
  "form.preferNot": "Prefer not to say",
  "form.submit": "Submit my mandate",
  "form.submitting": "Submitting mandate…",
  "form.disclaimer":
    "Non-partisan. No candidate rankings. Text appears on Civic Pulse only after ISEYC publishes it.",
  "form.emergency":
    "This tool does not provide emergency help, jobs, food, healthcare, or security. In danger, contact local emergency services.",
  "success.title": "Submitted for review",
  "success.body":
    "Your mandate is not public yet. It appears on Civic Pulse only after ISEYC moderation marks it Published.",
  "success.keepRef": "Keep your reference",
  "success.checkStatus": "Check submission status",
  "success.copyStatus": "Copy status link",
  "success.pending": "pending review",
  "success.shareNote": "Share the civic mandate if you wish. Public publication still depends on ISEYC review.",
  "success.whatsapp": "Share on WhatsApp",
  "success.x": "Share on X",
  "success.copy": "Copy civic mandate",
  "success.another": "Submit another mandate",
  "lang.label": "Language",
};

const pcm: Dict = {
  ...en,
  "header.tagline": "National civic tool · no party side",
  "hero.title1": "No be who you go vote for make you yarn.",
  "hero.title2": "Yarn wetin dem must deliver.",
  "hero.body":
    "One clear demand. Di right office. Your state. ISEYC go review am before e enter public record — no candidate ranking, no popularity contest.",
  "hero.cta": "Put your mandate",
  "hero.published": "Published mandates",
  "hero.states": "States wey dey",
  "hero.chooseDuty": "Choose di duty of government for below",
  "how.title": "How e dey work",
  "how.1": "Choose di duty of government.",
  "how.2": "Name di office wey suppose do am — or say you no sure.",
  "how.3": "Add your state (and LGA if you know am).",
  "how.4": "Write one clear demand for service or result.",
  "how.5": "Submit. You go get status reference. E go remain New until ISEYC review.",
  "how.6": "Na only Published mandates dey show for Civic Pulse and State Civic Brief.",
  "how.publish": "We dey publish",
  "how.reject": "We no go publish",
  "form.title": "Put your civic mandate",
  "form.office": "Which office must deliver this one?",
  "form.demand": "Wetin dem must deliver?",
  "form.submit": "Submit my mandate",
  "success.title": "Dem don collect am for review",
  "success.body":
    "Your mandate no public yet. E go show for Civic Pulse only after ISEYC mark am Published.",
  "form.emergency":
    "Dis tool no be emergency help. E no give job, food, hospital, or security. If you dey danger, call local emergency.",
};

const ha: Dict = {
  ...en,
  "header.tagline": "Kayan aiki na ƙasa · ba na jam'iyya ba",
  "hero.title1": "Kada ka gaya musu wanda zaka zaba.",
  "hero.title2": "Gaya musu abin da dole su kawo.",
  "hero.body":
    "Buƙata ɗaya bayyananne. Ofis ɗin da ya dace. Jiharka. ISEYC za ta duba kafin ya shiga bayanan jama'a — ba ranking na 'yan takara ba.",
  "hero.cta": "Bayyana buƙatarka",
  "hero.published": "Buƙatun da aka wallafa",
  "hero.states": "Jihohin da ke ciki",
  "hero.chooseDuty": "Zaɓi aikin gwamnati a ƙasa",
  "how.title": "Yadda ake yi",
  "how.1": "Zaɓi aikin gwamnati.",
  "how.2": "Sanya ofis ɗin da ke da alhaki — ko ka ce ba ka tabbata ba.",
  "how.3": "Sanya jiharka (da LGA idan ka sani).",
  "how.4": "Rubuta buƙata ɗaya bayyananne.",
  "how.5": "Aika. Za ka sami lambar matsayi. Ya kasance New har ISEYC ta duba.",
  "how.6": "Kawai Published ne ke bayyana a Civic Pulse da State Civic Brief.",
  "form.title": "Bayyana buƙatar jama'a",
  "form.office": "Wane ofis ne zai kawo wannan?",
  "form.demand": "Me dole su kawo?",
  "form.submit": "Aika buƙata",
  "success.title": "An aika don dubawa",
  "success.body":
    "Buƙatarka ba ta bayyana ba tukuna. Za ta bayyana a Civic Pulse bayan ISEYC ta sa Published.",
  "form.emergency":
    "Wannan ba taimakon gaggawa ba ne. Ba ya bayar da aiki, abinci, lafiya, ko tsaro. Idan kana cikin haɗari, kira gaggawa na gida.",
};

const yo: Dict = {
  ...en,
  "header.tagline": "Ohun èlò ìjọba orílẹ̀-èdè · kì í ṣe ẹgbẹ́ òṣèlú",
  "hero.title1": "Má ṣe sọ ẹni tí o máa dìbò fún.",
  "hero.title2": "Sọ ohun tí wọ́n gbọ́dọ̀ ṣe.",
  "hero.body":
    "Ìbéèrè kan tó hàn kedere. Ọ́fíìsì tó tọ́. Ìpínlẹ̀ rẹ. ISEYC yóò yẹ̀ẹ́ wò kí ó tó di àkọsílẹ̀ gbogbogbò — kì í ṣe ranking olùdíje.",
  "hero.cta": "Sọ ìbéèrè rẹ",
  "hero.published": "Àwọn ìbéèrè tí a tẹ̀jáde",
  "hero.states": "Àwọn ìpínlẹ̀",
  "hero.chooseDuty": "Yan iṣẹ́ ìjọba ní ìsàlẹ̀",
  "how.title": "Bí ó ṣe ń ṣiṣẹ́",
  "how.1": "Yan iṣẹ́ ìjọba.",
  "how.2": "Sọ ọ́fíìsì tó ní ojúṣe — tàbí sọ pé o kò mọ̀.",
  "how.3": "Fi ìpínlẹ̀ rẹ kun (àti LGA bí o bá mọ̀).",
  "how.4": "Kọ ìbéèrè kan tó hàn kedere.",
  "how.5": "Fi sílẹ̀. O máa gba àmì ipò. Yóò jẹ́ New títí ISEYC yóò fi yẹ̀ẹ́ wò.",
  "how.6": "Published nìkan ni ó hàn lórí Civic Pulse àti State Civic Brief.",
  "form.title": "Sọ ìbéèrè ìjọba rẹ",
  "form.office": "Ọ́fíìsì wo ni ó gbọ́dọ̀ ṣe éyí?",
  "form.demand": "Kí ni wọ́n gbọ́dọ̀ ṣe?",
  "form.submit": "Fi ìbéèrè sílẹ̀",
  "success.title": "A ti gba fún àyẹ̀wò",
  "success.body":
    "Ìbéèrè rẹ kò tíì di gbogbogbò. Yóò hàn lórí Civic Pulse lẹ́yìn tí ISEYC bá fi Published sí i.",
  "form.emergency":
    "Èròjà yìí kì í ṣe ìrànlọ́wọ́ pàjàwìrì. Kò fún ni ní iṣẹ́, oúnjẹ, ìtọ́jú, tàbí ààbò. Bí o bá wà nínú ewu, pe iṣẹ́ pàjàwìrì agbègbè.",
};

const ig: Dict = {
  ...en,
  "header.tagline": "Ngwa ọha mba · ọ bụghị ndọrọndọrọ",
  "hero.title1": "A sịla ha onye ị ga-atụ anya.",
  "hero.title2": "Gwa ha ihe ha ga-eme.",
  "hero.body":
    "Otu arịrịọ doro anya. Ọfịs kwesịrị ekwesị. Steeti gị. ISEYC ga-enyocha tupu ọ banye ndekọ ọha — ọ bụghị ranking ndị na-azọ ọkwa.",
  "hero.cta": "Kwuo arịrịọ gị",
  "hero.published": "Arịrịọ e bipụtara",
  "hero.states": "Steeti dị",
  "hero.chooseDuty": "Họrọ ọrụ gọọmentị n'okpuru",
  "how.title": "Otu o si arụ ọrụ",
  "how.1": "Họrọ ọrụ gọọmentị.",
  "how.2": "Kpọọ ọfịs nwere ọrụ — ma ọ bụ kwuo na ị maghị.",
  "how.3": "Tinye steeti gị (na LGA ma ị mara).",
  "how.4": "Dee otu arịrịọ doro anya.",
  "how.5": "Zipụ. Ị ga-enweta akara ọnọdụ. Ọ ga-anọ New ruo mgbe ISEYC nyochara.",
  "how.6": "Naanị Published ka a na-egosi na Civic Pulse na State Civic Brief.",
  "form.title": "Kwuo arịrịọ ọha gị",
  "form.office": "Kedu ọfịs ga-eme nke a?",
  "form.demand": "Gịnị ka ha ga-eme?",
  "form.submit": "Zipụ arịrịọ m",
  "success.title": "Ezigara maka nyocha",
  "success.body":
    "Arịrịọ gị abụghị nke ọha ma. Ọ ga-apụta na Civic Pulse mgbe ISEYC tinyere Published.",
  "form.emergency":
    "Ngwa a abụghị enyemaka mberede. Ọ naghị enye ọrụ, nri, ahụike, ma ọ bụ nchekwa. Ọ bụrụ na ị nọ n'ihe ize ndụ, kpọọ ọrụ mberede mpaghara.",
};

const TABLES: Record<Locale, Dict> = { en, pcm, ha, yo, ig };

export function t(locale: Locale, key: string): string {
  return TABLES[locale]?.[key] || TABLES.en[key] || key;
}

export function isLocale(v: string): v is Locale {
  return LOCALES.some((l) => l.id === v);
}
