/* =========================================
   SCUSE DEL GATTO — script.js
   ========================================= */

const EXCUSES = [
  // ----- RITARDO -----
  {
    text: "Un gatto nero mi ha attraversato la strada. Per rispetto cosmico ho dovuto aspettare che tornasse indietro prima di continuare.",
    category: "ritardo", label: "Ritardo", credibility: 3,
    reaction: "Il gatto annuisce con solennita' imperiale.", emoji: "\uD83D\uDE3F"
  },
  {
    text: "Ho incontrato un gatto per strada con lo sguardo di chi sa cose. Ho aspettato che parlasse. Non ha parlato. Rispetto.",
    category: "ritardo", label: "Ritardo", credibility: 2,
    reaction: "Il gatto ruota la testa lentamente e chiude gli occhi.", emoji: "\uD83D\uDE3C"
  },
  {
    text: "Un gatto mi ha fissato per dodici minuti di fila. Non si puo' interrompere una conversazione oculare con un felino — sarebbe maleducazione.",
    category: "ritardo", label: "Ritardo", credibility: 2,
    reaction: "Il gatto approva con un lento battito di ciglia.", emoji: "\uD83D\uDE38"
  },
  {
    text: "Il karma felino mi suggeriva di non affrettarmi. I gatti non si sbagliano mai, quindi mi sono adeguato.",
    category: "ritardo", label: "Ritardo", credibility: 1,
    reaction: "Il gatto emette un miagolio di supporto.", emoji: "\uD83D\uDE3A"
  },
  {
    text: "Mi sono fermato ad accarezzare un gatto randagio. Era chiaramente in una crisi esistenziale e aveva bisogno di me.",
    category: "ritardo", label: "Ritardo", credibility: 4,
    reaction: "Il gatto si avvolge la coda intorno alle zampe con dignita'.", emoji: "\uD83D\uDE3B"
  },
  {
    text: "Ho trovato un gatto seduto esattamente nel mezzo del marciapiede. Non si scavalca un gatto. E' illegale nell'universo.",
    category: "ritardo", label: "Ritardo", credibility: 2,
    reaction: "Il gatto non si e' ancora spostato.", emoji: "\uD83D\uDE3E"
  },

  // ----- IRREPERIBILE -----
  {
    text: "Il mio gatto era seduto sopra il telefono. Non si sveglia un gatto che dorme — e' scritto nel codice cosmico dei felini.",
    category: "telefono", label: "Irreperibile", credibility: 5,
    reaction: "Il gatto lecca la zampa come se niente fosse.", emoji: "\uD83D\uDE38"
  },
  {
    text: "Stavo interpretando i miagolii del gatto del vicino. Sembravano Morse. Richiedeva concentrazione assoluta.",
    category: "telefono", label: "Irreperibile", credibility: 1,
    reaction: "Il gatto emette un sospiro profondo.", emoji: "\uD83D\uDE3C"
  },
  {
    text: "Il gatto mi fissava e non potevo permettermi di sembrare distratto ai suoi occhi. Avrei perso il rispetto dell'intera specie.",
    category: "telefono", label: "Irreperibile", credibility: 2,
    reaction: "Il gatto annuisce: era effettivamente un momento critico.", emoji: "\uD83D\uDE39"
  },
  {
    text: "Il telefono era in modalita' 'non disturbare i gatti nelle vicinanze'. E' una funzione poco conosciuta ma fondamentale.",
    category: "telefono", label: "Irreperibile", credibility: 1,
    reaction: "Il gatto sa che e' falsa, ma la apprezza comunque.", emoji: "\uD83D\uDE3E"
  },
  {
    text: "Tenevo il telefono fermo perche' il gatto dormiva con la testa sopra. Era tecnicamente fuori dalla mia giurisdizione.",
    category: "telefono", label: "Irreperibile", credibility: 5,
    reaction: "Il gatto russa soddisfatto.", emoji: "\uD83D\uDE3A"
  },
  {
    text: "Stavo insegnando al gatto a rispondere alle chiamate. I progressi sono lenti, ma ci credo.",
    category: "telefono", label: "Irreperibile", credibility: 1,
    reaction: "Il gatto ha gia' dimenticato la lezione.", emoji: "\uD83D\uDE39"
  },

  // ----- USCITA -----
  {
    text: "I miei amici miagolano nelle frequenze che solo io riesco a sentire. Era un'emergenza sociale felina.",
    category: "uscita", label: "Uscita", credibility: 1,
    reaction: "Il gatto alza un sopracciglio in segno di rispetto per l'audacia.", emoji: "\uD83D\uDE39"
  },
  {
    text: "Stavamo conducendo ricerca sul campo sul comportamento felino in ambienti urbani notturni. E' per la scienza.",
    category: "uscita", label: "Uscita", credibility: 2,
    reaction: "Il gatto sa benissimo che stai mentendo.", emoji: "\uD83D\uDE3C"
  },
  {
    text: "Il branco aveva bisogno di supervisione. I gatti in branco sono imprevedibili — qualcuno doveva tenere l'ordine.",
    category: "uscita", label: "Uscita", credibility: 2,
    reaction: "Il gatto emette qualcosa che suona come una risata.", emoji: "\uD83D\uDE38"
  },
  {
    text: "Eravamo in un locale dove un gatto randagio aveva preso residenza permanente. Non si abbandona un gatto a meta' serata.",
    category: "uscita", label: "Uscita", credibility: 4,
    reaction: "Il gatto del locale conferma di aver avuto bisogno di compagnia.", emoji: "\uD83D\uDE3B"
  },

  // ----- HO DIMENTICATO -----
  {
    text: "I gatti vivono nel presente eterno e non conoscono il concetto di memoria a lungo termine. Sto abbracciando la loro filosofia.",
    category: "dimenticato", label: "Ho dimenticato", credibility: 1,
    reaction: "Il gatto ha gia' dimenticato questa conversazione.", emoji: "\uD83D\uDE38"
  },
  {
    text: "Un gatto mi ha guardato con quegli occhi e ha cancellato temporaneamente la mia memoria a breve termine. Fenomeno noto.",
    category: "dimenticato", label: "Ho dimenticato", credibility: 1,
    reaction: "Il gatto fa finta di non sentire.", emoji: "\uD83D\uDE3D"
  },
  {
    text: "Il campo magnetico emesso dai gatti nelle vicinanze disturba i ricordi recenti. E' fisica, non negligenza.",
    category: "dimenticato", label: "Ho dimenticato", credibility: 1,
    reaction: "Il gatto consulta immaginariamente un libro di fisica.", emoji: "\uD83D\uDE3C"
  },
  {
    text: "Ho dimenticato perche' stavo catalogando mentalmente tutte le razze di gatto che ho incontrato questa settimana.",
    category: "dimenticato", label: "Ho dimenticato", credibility: 1,
    reaction: "Il gatto valuta questa la scusa piu' elaborata della settimana.", emoji: "\uD83D\uDE39"
  },
  {
    text: "Avevo troppe cose in testa: la lista delle razze di gatto rare, i migliori video di gatti, e poi... non ricordo.",
    category: "dimenticato", label: "Ho dimenticato", credibility: 1,
    reaction: "Il gatto annuisce: anche lui ha dimenticato cosa stava per fare.", emoji: "\uD83D\uDE38"
  },

  // ----- TARDI A CASA -----
  {
    text: "C'era un gatto nel mio percorso che sembrava aver bisogno di consulenza esistenziale. Non si abbandona un'anima felina in crisi.",
    category: "casa", label: "Tardi a casa", credibility: 3,
    reaction: "Il gatto ti ringrazia per il supporto emotivo.", emoji: "\uD83D\uDE3B"
  },
  {
    text: "Ho perso il concetto del tempo mentre catalogavo le diverse tipologie di fusa che ho sentito durante la giornata.",
    category: "casa", label: "Tardi a casa", credibility: 1,
    reaction: "Il gatto apre e chiude la bocca in silenzio.", emoji: "\uD83D\uDE3A"
  },
  {
    text: "Il tramonto aveva esattamente il colore del pelo di un tabby arancione. Ho dovuto fermarmi a elaborare l'emozione.",
    category: "casa", label: "Tardi a casa", credibility: 2,
    reaction: "Il gatto apprezza la sensibilita' artistica.", emoji: "\uD83D\uDE38"
  },
  {
    text: "Un gatto mi ha chiesto di aprirgli una porta. Poi di richiuderla. Poi di riaprirla. E' andato avanti per quarantacinque minuti.",
    category: "casa", label: "Tardi a casa", credibility: 5,
    reaction: "Il gatto non vede assolutamente nulla di strano in questo.", emoji: "\uD83D\uDE3C"
  },
  {
    text: "Ho incontrato un gatto con una zampa alzata in segno di saluto. Non si puo' ignorare un saluto felino — e' irrispettoso.",
    category: "casa", label: "Tardi a casa", credibility: 2,
    reaction: "Il gatto ti tende la zampa per un batti-cinque.", emoji: "\uD83D\uDE3B"
  },

  // ----- VARIE -----
  {
    text: "Stavo ricevendo una trasmissione psichica dall'assemblea internazionale dei gatti del quartiere. Richiedeva silenzio totale.",
    category: "varie", label: "Varie", credibility: 1,
    reaction: "Il gatto conferma: la riunione era effettivamente importante.", emoji: "\uD83D\uDE38"
  },
  {
    text: "Mi sono seduto un attimo e ho assunto istintivamente la posizione del pane — zampe sotto, immobile. Non riuscivo piu' a muovermi.",
    category: "varie", label: "Varie", credibility: 1,
    reaction: "Il gatto riconosce la posizione e la rispetta profondamente.", emoji: "\uD83D\uDE39"
  },
  {
    text: "Ho trovato un pelo di gatto sulla mia maglia preferita. Ho dovuto riorganizzare l'intera giornata di conseguenza.",
    category: "varie", label: "Varie", credibility: 3,
    reaction: "Il gatto e' offeso che venga considerato un problema.", emoji: "\uD83D\uDE3E"
  },
  {
    text: "Stavo traducendo 'miao' in quattordici lingue. La linguistica felina e' piu' urgente e complessa di quanto pensi.",
    category: "varie", label: "Varie", credibility: 1,
    reaction: "Il gatto testa la pronuncia e non e' soddisfatto.", emoji: "\uD83D\uDE3C"
  },
  {
    text: "Il mio oroscopo felino indicava che Mercurio era retrogrado in Casa Micio. In questi giorni e' meglio non prendere impegni.",
    category: "varie", label: "Varie", credibility: 1,
    reaction: "Il gatto consulta le stelle e annuisce gravemente.", emoji: "\uD83D\uDE38"
  },
  {
    text: "Ho visto una farfalla e per venti minuti ho smesso di essere pienamente umano. Regressione felina temporanea. Succede.",
    category: "varie", label: "Varie", credibility: 2,
    reaction: "Il gatto comprende perfettamente. Lui non si e' ancora ripreso da una farfalla di marzo.", emoji: "\uD83D\uDE3B"
  },
  {
    text: "Ero in stato meditativo profondo ispirato ai gatti: occhi semichiusi, indifferenza al mondo esterno, pace assoluta.",
    category: "varie", label: "Varie", credibility: 2,
    reaction: "Il gatto approva questo percorso di crescita spirituale.", emoji: "\uD83D\uDE3D"
  },
  {
    text: "Il mio gatto interiore aveva deciso che era ora di fare niente. Quando parla il gatto interiore, si ascolta.",
    category: "varie", label: "Varie", credibility: 1,
    reaction: "Il gatto batte le zampe in segno di totale approvazione.", emoji: "\uD83D\uDE3A"
  },
  {
    text: "Ho calcolato che il gatto del vicino ha bisogno esattamente di 3,7 minuti in piu' di coccole al giorno. Non potevo ignorarlo.",
    category: "varie", label: "Varie", credibility: 3,
    reaction: "Il gatto del vicino conferma i dati.", emoji: "\uD83D\uDE3B"
  }
];

const CAT_SPEECH = [
  "Premi il bottone, umano. Ho poco tempo.",
  "Un'altra scusa? Sei irrecuperabile.",
  "Il gatto ha parlato. Obbedisci.",
  "Questa e' la mia preferita. Non dirlo a nessuno.",
  "Credimi, funzionera'. Forse.",
  "Miao. Che tradotto significa: vai avanti.",
  "Accetto questo incarico con dignita' felina.",
  "Ho generato scuse migliori nel sonno.",
  "Stai abusando di questo strumento. Continua.",
  "Il consiglio dei gatti si e' riunito. Usa questa.",
  "Neanche io ci credo. Provaci lo stesso.",
  "Quattro stelle su cinque. Ottima scelta."
];

const CAT_FACTS = [
  "I gatti passano il 70% della loro vita a dormire. La produttivita' e' sopravvalutata.",
  "I gatti non miagolano tra di loro — lo fanno solo per comunicare con gli umani. Sei il loro umano prescelto.",
  "Un gatto puo' saltare fino a sei volte la sua lunghezza. Tu fai fatica ad alzarti dal divano.",
  "Le fusa di un gatto vibrano tra 25 e 150 Hz — la stessa frequenza che accelera la guarigione ossea.",
  "I gatti hanno una memoria a lungo termine eccellente, ma scelgono selettivamente cosa ricordare. Saggio.",
  "Il naso di ogni gatto e' unico come un'impronta digitale umana.",
  "I gatti hanno 32 muscoli nelle orecchie. Tu ne hai 6 e non riesci nemmeno a muoverle.",
  "Un gruppo di gatti si chiama 'clowder'. Usalo in conversazione per sembrare intelligente.",
  "I gatti dormono in media 12-16 ore al giorno. Sono dei professionisti.",
  "I gatti possono fare circa 100 suoni diversi. I cani ne fanno 10. I cani perdono.",
  "I gatti possono bere acqua salata senza conseguenze. I loro reni la filtrano meglio dei nostri.",
  "Un gatto domestico condivide il 95.6% del DNA con la tigre. Tienilo a mente quando ti morsica.",
  "I gatti vedono bene nell'oscurita' con solo un sesto della luce di cui abbiamo bisogno noi.",
  "Il cervello di un gatto e' biologicamente piu' simile a quello umano di quanto lo sia quello di un cane.",
  "I gatti camminano come giraffe e cammelli — spostano prima entrambe le zampe destre, poi entrambe le sinistre."
];

/* ===== STATE ===== */
let currentCategory = "all";
let lastIndex = -1;

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  buildBackground();
  buildWalkingCats();
  loadRandomCatFact();
  loadCatPhoto();

  document.getElementById("generateBtn").addEventListener("click", onGenerate);
  document.getElementById("copyBtn").addEventListener("click", onCopy);
  document.getElementById("waBtn").addEventListener("click", onWhatsApp);

  document.querySelectorAll(".cat-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.cat;
    });
  });
});

/* ===== GENERATE ===== */
function onGenerate() {
  const btn = document.getElementById("generateBtn");
  btn.classList.add("loading");

  triggerRipple();

  const pool = currentCategory === "all"
    ? EXCUSES
    : EXCUSES.filter(e => e.category === currentCategory);

  if (!pool.length) { btn.classList.remove("loading"); return; }

  let idx;
  do { idx = Math.floor(Math.random() * pool.length); }
  while (pool.length > 1 && idx === lastIndex);
  lastIndex = idx;

  const excuse = pool[idx];

  const card = document.getElementById("excuseCard");
  card.classList.remove("appear");
  void card.offsetWidth;
  card.classList.add("appear");

  document.getElementById("excuseText").textContent = excuse.text;
  document.getElementById("excuseBadge").textContent = excuse.label;
  document.getElementById("catReaction").textContent = excuse.reaction;
  document.getElementById("credStars").textContent =
    "\u2B50".repeat(excuse.credibility) + "\u2606".repeat(5 - excuse.credibility);

  document.getElementById("catEmoji").textContent = excuse.emoji;

  const speech = CAT_SPEECH[Math.floor(Math.random() * CAT_SPEECH.length)];
  document.getElementById("speechText").textContent = speech;

  loadCatPhoto();

  btn.classList.remove("loading");
}

function triggerRipple() {
  const r = document.getElementById("btnRipple");
  r.classList.remove("go");
  void r.offsetWidth;
  r.classList.add("go");
}

/* ===== COPY ===== */
function onCopy() {
  const text = document.getElementById("excuseText").textContent;
  if (text.startsWith("Clicca")) return;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast("\uD83D\uDCCB Scusa copiata! Usala bene."));
  } else {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    toast("\uD83D\uDCCB Copiato!");
  }
}

/* ===== WHATSAPP ===== */
function onWhatsApp() {
  const text = document.getElementById("excuseText").textContent;
  if (text.startsWith("Clicca")) return;
  const msg = encodeURIComponent("\uD83D\uDC31 " + text + "\n\n— Scuse del Gatto");
  window.open("https://wa.me/?text=" + msg, "_blank");
}

/* ===== TOAST ===== */
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2800);
}

/* ===== CAT FACT ===== */
function loadRandomCatFact() {
  const fact = CAT_FACTS[Math.floor(Math.random() * CAT_FACTS.length)];
  document.getElementById("catFactText").textContent = fact;
}

/* ===== CAT PHOTO (The Cat API) ===== */
async function loadCatPhoto() {
  const img = document.getElementById("catPhoto");
  const loader = document.getElementById("catPhotoLoading");
  img.classList.remove("loaded");
  loader.style.display = "block";

  try {
    const res = await fetch("https://api.thecatapi.com/v1/images/search?size=med");
    if (!res.ok) throw new Error();
    const data = await res.json();
    img.src = data[0].url;
    img.onload = () => {
      img.classList.add("loaded");
      loader.style.display = "none";
    };
  } catch (_) {
    document.getElementById("catPhotoSection").style.display = "none";
  }
}

/* ===== BACKGROUND PARTICLES ===== */
function buildBackground() {
  const layer = document.getElementById("bgLayer");

  for (let i = 0; i < 90; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = 1 + Math.random() * 2.5;
    s.style.cssText = [
      "left:" + (Math.random() * 100) + "%",
      "top:" + (Math.random() * 100) + "%",
      "width:" + size + "px",
      "height:" + size + "px",
      "--dur:" + (2 + Math.random() * 4) + "s",
      "--delay:" + (Math.random() * 6) + "s"
    ].join(";");
    layer.appendChild(s);
  }

  for (let i = 0; i < 14; i++) {
    const p = document.createElement("div");
    p.className = "float-paw";
    p.textContent = "\uD83D\uDC3E";
    p.style.cssText = [
      "left:" + (Math.random() * 100) + "%",
      "--size:" + (0.7 + Math.random() * 1.3) + "rem",
      "--dur:" + (9 + Math.random() * 14) + "s",
      "--delay:" + (Math.random() * 12) + "s"
    ].join(";");
    layer.appendChild(p);
  }
}

/* ===== WALKING CATS ===== */
function buildWalkingCats() {
  const container = document.getElementById("bgCats");
  const cats = ["\uD83D\uDC31", "\uD83D\uDC08", "\uD83D\uDC08\u200D\u2B1B"];

  for (let i = 0; i < 5; i++) {
    const c = document.createElement("div");
    c.className = "bg-cat-walk";
    c.textContent = cats[Math.floor(Math.random() * cats.length)];
    c.style.cssText = [
      "--bottom:" + (4 + Math.random() * 18) + "%",
      "--size:" + (1.1 + Math.random() * 1.2) + "rem",
      "--dur:" + (14 + Math.random() * 18) + "s",
      "--delay:-" + (Math.random() * 20) + "s"
    ].join(";");
    container.appendChild(c);
  }
}
