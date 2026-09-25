/* =============================================
   L'ORACOLO COSMICO DEGLI INDECISI
   script.js
   ============================================= */

'use strict';

// =============================================
// SOUND ENGINE (Web Audio API)
// =============================================
const SoundEngine = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  _osc(freq, type, t, dur, vol = 0.25, detune = 0) {
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (detune) osc.detune.setValueAtTime(detune, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(t); osc.stop(t + dur + 0.05);
  },

  _noise(t, dur, vol = 0.25, bpFreq = 2000, bpQ = 1) {
    const buf  = this.ctx.createBuffer(1, Math.ceil(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src    = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain   = this.ctx.createGain();
    src.buffer    = buf;
    filter.type   = 'bandpass';
    filter.frequency.setValueAtTime(bpFreq, t);
    filter.Q.setValueAtTime(bpQ, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
    src.start(t); src.stop(t + dur + 0.05);
  },

  sounds: {
    // Arpeggio mistico ascendente (Re maggiore)
    mistico() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      [293.66, 369.99, 440, 587.33, 740].forEach((f, i) => {
        s._osc(f,     'sine',     t + i * 0.28, 1.8, 0.18);
        s._osc(f * 2, 'sine',     t + i * 0.28, 1.2, 0.05);
      });
    },

    // Fanfara epica: G4-C5-E5-G5
    storico() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      [392, 523.25, 659.25, 783.99].forEach((f, i) => {
        s._osc(f, 'sawtooth', t + i * 0.14, 0.7, 0.14);
        s._osc(f, 'square',   t + i * 0.14, 0.7, 0.04);
      });
      [392, 523.25, 659.25, 783.99].forEach(f => s._osc(f, 'sawtooth', t + 0.62, 1.8, 0.09));
    },

    // Organo da chiesa: C3 + G3 + C4 + E4
    biblico() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      [130.81, 196, 261.63, 329.63].forEach(f => {
        s._osc(f,     'square', t,       3.5, 0.07);
        s._osc(f * 2, 'square', t + 0.04, 3.2, 0.035);
      });
    },

    // Sci-fi sweep + beep
    futuro() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      const osc  = s.ctx.createOscillator();
      const gain = s.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.9);
      osc.frequency.exponentialRampToValueAtTime(350, t + 1.3);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      osc.connect(gain); gain.connect(s.ctx.destination);
      osc.start(t); osc.stop(t + 1.9);
      s._osc(900,  'square', t + 1.0, 0.18, 0.14);
      s._osc(1350, 'square', t + 1.2, 0.18, 0.14);
    },

    // Rimshot: ba-dum-tsss
    meme() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      s._osc(120, 'sine', t,       0.12, 0.45);
      s._osc(70,  'sine', t + 0.04, 0.18, 0.30);
      s._noise(t + 0.22, 0.14, 0.32, 3200, 1.2);
      s._osc(200, 'sine', t + 0.22, 0.08, 0.18);
      s._noise(t + 0.42, 0.55, 0.18, 8500, 0.5);
    },

    // Trombone triste: C4→B3→Ab3→G3
    politico() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      [261.63, 246.94, 207.65, 196].forEach((f, i) => {
        s._osc(f,       'sawtooth', t + i * 0.28, 0.55, 0.18);
        s._osc(f * 0.5, 'sine',     t + i * 0.28, 0.55, 0.08);
      });
    },

    // Sassofono sensuale: A2 con vibrato LFO
    erotico() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      const osc    = s.ctx.createOscillator();
      const lfo    = s.ctx.createOscillator();
      const lfoGain = s.ctx.createGain();
      const filt   = s.ctx.createBiquadFilter();
      const gain   = s.ctx.createGain();
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(110, t);
      lfo.type = 'sine';     lfo.frequency.setValueAtTime(5, t);
      lfoGain.gain.setValueAtTime(9, t);
      filt.type = 'lowpass'; filt.frequency.setValueAtTime(700, t);
      filt.frequency.linearRampToValueAtTime(1300, t + 1);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.4);
      gain.gain.setValueAtTime(0.2, t + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 3);
      lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
      osc.connect(filt); filt.connect(gain); gain.connect(s.ctx.destination);
      lfo.start(t); lfo.stop(t + 3.2);
      osc.start(t); osc.stop(t + 3.2);
      s._osc(138.59, 'sawtooth', t + 0.9,  0.55, 0.13);
      s._osc(164.81, 'sawtooth', t + 1.45, 0.55, 0.13);
      s._osc(220,    'sawtooth', t + 2.0,  0.7,  0.13);
    },

    // Fail horn: glissando discendente
    imbarazzante() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      const osc  = s.ctx.createOscillator();
      const gain = s.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(95, t + 1.4);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
      osc.connect(gain); gain.connect(s.ctx.destination);
      osc.start(t); osc.stop(t + 1.8);
      s._noise(t, 1.7, 0.04, 400, 0.5);
    },

    // Melodia dolce: E5-G5-A5-B5-C6
    dolce() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      [659.25, 783.99, 880, 987.77, 1046.5].forEach((f, i) => {
        s._osc(f, 'sine',     t + i * 0.18, 0.9, 0.14);
        s._osc(f, 'triangle', t + i * 0.18, 0.8, 0.05);
      });
      s._osc(1318.5, 'sine', t + 0.9, 1.2, 0.1); // high note finale
    },

    // Campanella scolastica: doppio ring
    scolastico() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      s._osc(830, 'sine', t,       0.55, 0.28);
      s._osc(1050,'sine', t + 0.04, 0.4, 0.1);
      s._osc(830, 'sine', t + 0.75, 0.55, 0.28);
      s._osc(1050,'sine', t + 0.79, 0.4, 0.1);
    },

    // Sbadiglio annoiato: discesa lenta + soffio
    noia() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      const osc  = s.ctx.createOscillator();
      const gain = s.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(140, t + 1.8);
      osc.frequency.linearRampToValueAtTime(180, t + 2.4);
      osc.frequency.linearRampToValueAtTime(110, t + 3.2);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.2);
      gain.gain.setValueAtTime(0.18, t + 2.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
      osc.connect(gain); gain.connect(s.ctx.destination);
      osc.start(t); osc.stop(t + 3.6);
      s._noise(t + 0.1, 3, 0.04, 600, 0.3);
    },

    // Buzzer incazzato: sirena alternata 880/440 Hz
    offesa() {
      const s = SoundEngine; s.init(); const t = s.ctx.currentTime;
      [0, 0.13, 0.26, 0.39, 0.52].forEach((offset, i) => {
        s._osc(i % 2 === 0 ? 880 : 440, 'square', t + offset, 0.11, 0.22);
      });
      s._noise(t, 0.7, 0.07, 900, 0.9);
      // Colpo finale
      s._osc(220, 'sawtooth', t + 0.65, 0.4, 0.18);
      s._osc(110, 'sine',     t + 0.65, 0.4, 0.1);
    },
  }
};


// =============================================
// RESPONSES DATABASE
// =============================================

const LABELS = {
  mistico:       '\u2B50 Profezia Cosmica',
  storico:       '\u2694\uFE0F Lezione della Storia',
  biblico:       '\u{1F4DC} Saggezza Biblica',
  futuro:        '\uD83D\uDE80 Visione dal Futuro',
  meme:          '\uD83D\uDC80 Attualita\' Inutile',
  politico:      '\uD83C\uDFDB\uFE0F Cronaca Internazionale',
  scolastico:    '\uD83D\uDCDA Il Prof. Lo Sapeva',
  erotico:       '\uD83D\uDD25 Energia Cosmica Sospetta',
  imbarazzante:  '\uD83D\uDE33 Momento Imbarazzante',
  dolce:         '\uD83D\uDC95 Messaggio Cosmico d\'Amore',
};

const RISPOSTE = [

  // ---------- MISTICO ----------
  { t: 'Le stelle hanno consultato le stelle. Le stelle non sanno. Le stelle pero\' sono belle.', c: 'mistico', e: '\u2728' },
  { t: 'Mercurio e\' in retrogrado. Come sempre. Come sara\' sempre. Come e\' stato da quando esiste il sistema solare. Buona fortuna.', c: 'mistico', e: '\uD83C\uDF11' },
  { t: 'I tarocchi mostrano La Torre. Crollo imminente. Qualunque cosa tu abbia scelto, avevi gia\' torto prima di iniziare.', c: 'mistico', e: '\uD83C\uDCCF' },
  { t: "I chakra sono disallineati. Fai un bagno ai sali dell'Himalaya, accendi una candela alla vaniglia e riprova. L'Oracolo aspetta.", c: 'mistico', e: '\uD83E\uDDD8' },
  { t: "L'aura intorno alla tua domanda e\' viola con striature marroni. Viola = confusione profonda. Marrone = fame. Hai mangiato?", c: 'mistico', e: '\uD83D\uDD2E' },
  { t: "L'Oracolo ha meditato 3000 anni su questa domanda. La risposta e': non e\' una domanda. E\' un urlo.", c: 'mistico', e: '\uD83C\uDF00' },
  { t: 'Il pendolino ha oscillato a sinistra. Poi a destra. Poi e\' caduto. Questo e\' il segno. Qual e\' il segno? Il pendolino e\' caduto.', c: 'mistico', e: '\uD83D\uDD35' },
  { t: 'Le rune hanno risposto. In islandese antico del IX secolo. L\'Oracolo non parla islandese antico del IX secolo. Ci dispiace profondamente.', c: 'mistico', e: '\uD83E\uDEA8' },
  { t: 'La luna nuova: silenzio. La luna piena: silenzio. La luna di Giove: silenzio. Anche Saturno: silenzio. L\'Oracolo: silenzio. Tranne te.', c: 'mistico', e: '\uD83C\uDF15' },
  { t: 'Il cristallo ha vibrato. Ha vibrato di nuovo. Si e\' rotto. L\'Oracolo lo ha comprato su Amazon Prime. Stava a 12 euro. Era falso.', c: 'mistico', e: '\uD83D\uDC8E' },

  // ---------- STORICO ----------
  { t: 'Giulio Cesare si fece la stessa domanda il 15 marzo del 44 a.C. Usci\' comunque. Ventitre\' pugnalate. Anche "tu, Bruto?" era una domanda senza risposta.', c: 'storico', e: '\u2694\uFE0F' },
  { t: "Napoleone si pose questo quesito strategico a Waterloo nel 1815. Non ando\' bene. Per lui intendo. Per Wellington ando\' benissimo.", c: 'storico', e: '\uD83C\uDF96\uFE0F' },
  { t: 'Cristoforo Colombo aveva gli stessi dubbi nel 1492. E\' andato a ovest credendo fosse est. Ha trovato l\'America per sbaglio totale. Tu cosa speri di trovare?', c: 'storico', e: '\uD83D\uDDFA\uFE0F' },
  { t: 'Einstein impiego\' 10 anni per la relativita\' speciale. Tu hai gia\' sprecato troppo tempo. E non stai scoprendo E=mc\u00B2. Chiariamolo.', c: 'storico', e: '\uD83E\uDDE0' },
  { t: 'Cleopatra scelse Marco Antonio sulla stabilita\' politica dell\'Egitto. Fine tragica. Ampiamente documentata. Leggila prima di decidere.', c: 'storico', e: '\uD83D\uDC0D' },
  { t: 'Socrate diceva "So di non sapere." Lo fecero bere la cicuta. La saggezza non paga. La stupidita\' nemmeno, pero\'. Scegli con cura.', c: 'storico', e: '\uD83C\uDFDB\uFE0F' },
  { t: 'Alessandro Magno aveva gia\' conquistato Persia, Egitto e India alla tua eta\'. Solo per mettere le cose in prospettiva cosmica.', c: 'storico', e: '\uD83D\uDDE1\uFE0F' },
  { t: 'Leonardo da Vinci dipingeva la Gioconda, progettava elicotteri e studiava anatomia mentre aveva il tuo stesso dubbio. Pero\' lui faceva cose. Molte cose.', c: 'storico', e: '\uD83C\uDFA8' },
  { t: 'Marie Curie scopri\' il radio in un laboratorio senza riscaldamento con fondi zero. Due Nobel. Tu stai consultando un oracolo su internet. Confronto: impietoso.', c: 'storico', e: '\u2697\uFE0F' },
  { t: 'I Romani costruirono acquedotti, strade e Colosseo senza fare questa domanda. Alcune strutture durano ancora. Il tuo dubbio durera\' meno.', c: 'storico', e: '\uD83C\uDFDF\uFE0F' },

  // ---------- BIBLICO ----------
  { t: 'Adamo ed Eva avevano UNA sola regola nell\'Eden. Una. Nemmeno quella. Hai capito il livello di autocontrollo disponibile nell\'umanita\'.', c: 'biblico', e: '\uD83C\uDF4E' },
  { t: "Mose\' ha vagato 40 anni nel deserto per una scelta sbagliata. La tua ha potenziale simile. Porta acqua. Molta acqua.", c: 'biblico', e: '\uD83C\uDFDC\uFE0F' },
  { t: 'Gesu\' resistette 40 giorni nel deserto senza mangiare ne\' decidere nulla. Tu non resisti 40 minuti senza aprire Instagram. Differenza quantificata.', c: 'biblico', e: '\u271D\uFE0F' },
  { t: 'Re Salomone, il piu\' saggio mai vissuto, avrebbe detto: taglialo a meta\'. Qualunque cosa sia il problema. Metodo efficiente. Applicalo.', c: 'biblico', e: '\uD83D\uDC51' },
  { t: 'Giuda si e\' pentito solo DOPO. Non aspettare il dopo. Il dopo e\' quasi sempre peggio del durante. Fonte: tutta la storia umana.', c: 'biblico', e: '\uD83E\uDE99' },
  { t: "Noe\' costrui\' un'arca di 300 cubiti per ogni specie animale senza fare queste domande. Due di ogni animale. Anche le zanzare. Rispetto enorme.", c: 'biblico', e: '\u26F5' },
  { t: "Il Qoelet dice: Vanita\' delle vanita\', tutto e\' vanita\'. Inclusa questa domanda. SOPRATTUTTO questa domanda. Il Qoelet sapeva.", c: 'biblico', e: '\uD83D\uDCDC' },
  { t: "Giobbe ha perso figli, ricchezze e salute senza smettere di credere. Tu stai dubitando davanti a un form HTML. Confronto: crudele ma necessario.", c: 'biblico', e: '\uD83D\uDCD6' },

  // ---------- FUTURO ----------
  { t: "Nel 2087 l'IA risolvera\' questo in 3 millisecondi. Aspetta. Mancano solo 61 anni. Tieniti occupato nel frattempo.", c: 'futuro', e: '\uD83E\uDD16' },
  { t: 'HAL 9000 dice che non puo\' lasciarti fare questo, Dave. E non ti chiami nemmeno Dave. Situazione ancora piu\' preoccupante.', c: 'futuro', e: '\uD83D\uDD34' },
  { t: 'Elon Musk ha gia\' brevettato la tua domanda su X (ex Twitter). Neuralink te la risolvera\' direttamente nel cervello. A 29,99\u20AC al mese. Abbonamento annuale.', c: 'futuro', e: '\uD83D\uDE80' },
  { t: "ChatGPT avrebbe scritto 3000 parole su questo. Nessuna utile. Poi ti avrebbe chiesto di fare l'upgrade a Plus. L'Oracolo e\' gratuito e altrettanto inutile.", c: 'futuro', e: '\uD83D\uDCAC' },
  { t: 'In tutti i rami del multiverso hai gia\' deciso. Nel ramo A hai sbagliato. Nel B pure. Nel C dormivi. Nel D non eri nemmeno nato/a. Nel E hai scelto bene ma poi ti sei perso il treno.', c: 'futuro', e: '\uD83C\uDF0C' },
  { t: 'Il metaverso ha una tua versione avatar che ha gia\' risolto questo. Porta occhiali da 3500\u20AC. E\' ancora piu\' confusa di te. Si\' e\' possibile.', c: 'futuro', e: '\uD83E\uDD7D' },
  { t: "I robot che ci sostituiranno non avranno questi dubbi esistenziali. Portali dalla tua parte adesso. Porta torta in ufficio quando arrivano.", c: 'futuro', e: '\u2699\uFE0F' },
  { t: 'Secondo le simulazioni del CERN, sei contemporaneamente nel giusto e nello sbagliato finche\' non decidi. Gatto di Schrodinger applicato alla tua vita.', c: 'futuro', e: '\u269B\uFE0F' },

  // ---------- MEME / ATTUALITA\' ITALIANA ----------
  { t: "La gonna di Giorgia Meloni ha occupato tre settimane di dibattito nazionale e tre pagine del Corriere. La tua domanda ne vale almeno una? L'Oracolo dice: assolutamente no.", c: 'meme', e: '\uD83D\uDC57' },
  { t: "Tajani era al ristorante quando l'Oracolo ha ricevuto questa domanda. Era ancora al ristorante quando ha finito di elaborarla. Era ancora li\' a dessert. Antonio, stacca.", c: 'meme', e: '\uD83C\uDF7D\uFE0F' },
  { t: "Salvini dice 'prima gli italiani' da dieci anni. Prima di cosa esattamente? Quando? Come? In che ordine? Mistero mai risolto. Sei in ottima compagnia nell'incertezza.", c: 'meme', e: '\uD83D\uDFE2' },
  { t: "Conte ha guidato tre governi completamente diversi tra loro senza mai davvero decidere niente di definitivo. E\' ancora in giro. C'e\' speranza per tutti.", c: 'meme', e: '\uD83D\uDCCB' },
  { t: "Renzi ha aperto un partito, poi un altro, poi una fondazione, poi ha scritto tre libri, poi e\' andato in Arabia Saudita, poi e\' tornato. Ancora non sa cosa fare da grande. Ispirazionale.", c: 'meme', e: '\uD83D\uDCD6' },
  { t: "Jannik Sinner avrebbe gia\' risposto, vinto due set, ringraziato il team, fatto la doccia fredda e rilasciato un'intervista. Tu sei ancora al riscaldamento.", c: 'meme', e: '\uD83C\uDFBE' },
  { t: "Il VAR ha rivisto questa situazione 4 volte in slow motion da 6 angoli diversi. Goal annullato. Domanda irrisolta. Tutto da rifare. Classico.", c: 'meme', e: '\uD83D\uDCFA' },
  { t: "Fedez e Chiara Ferragni si sono lasciati per meno di cosi\'. Molto meno. Considera le tue priorita\' esistenziali prima di proseguire.", c: 'meme', e: '\uD83D\uDC94' },
  { t: "Papa Francesco ha gia\' twittato qualcosa di piu\' profondo di questa domanda stamattina. Prima della colazione. Su temi globali. Con risposta.", c: 'meme', e: '\uD83D\uDD4A\uFE0F' },
  { t: "Fiorello ne ha gia\' fatto uno sketch a Viva Rai2 alle 7:15 di mattina. Con coreografia, ballerini, megafono e costume da gladiatore. Piu\' divertente di cosi\'.", c: 'meme', e: '\uD83C\uDFAD' },
  { t: "Questa domanda ha gia\' un thread su Reddit Italia con 1.247 commenti. Nessuna risposta utile. 17 persone si sono insultate. Due si sono innamorate. Benvenuto/a.", c: 'meme', e: '\uD83D\uDC7D' },
  { t: "Il Festival di Sanremo ha dedicato un'intera serata a domande meno importanti di questa. Con piu\' glitter, lustrini e lacrime di coccodrillo. E Amadeus.", c: 'meme', e: '\uD83C\uDFA4' },
  { t: "Il governo ha aperto un tavolo di confronto su questa questione. E\' il quinto tavolo. Il primo era del 2018. Nessun tavolo ha prodotto niente. Tradizione rispettata.", c: 'meme', e: '\uD83E\uDE91' },
  { t: "L'Italia ha cambiato 70 governi dal 1946. Nessuno ha mai risolto davvero niente. Sei in ottime mani istituzionali.", c: 'meme', e: '\uD83C\uDDEE\uD83C\uDDF9' },

  // ---------- POLITICO INTERNAZIONALE ----------
  { t: "Trump ha risposto 'MAKE IT GREAT AGAIN' senza leggere la domanda. L'ha twittato. Poi ri-twittato. Poi scritto in MAIUSCOLO su Truth Social. Tre volte.", c: 'politico', e: '\uD83C\uDDFA\uD83C\uDDF8' },
  { t: "Putin non ha commentato. Non si sa con certezza dove sia. Il Cremlino ha dichiarato che sta benissimo e fa sport ogni giorno. Come sempre. Inevitabilmente.", c: 'politico', e: '\uD83D\uDC3B' },
  { t: "Re Carlo III ha aspettato 73 anni per avere questo potere decisionale. Ora parla alle piante del giardino di Highgrove. Prendi esempio: parla alle piante.", c: 'politico', e: '\uD83D\uDC51' },
  { t: "Boris Johnson avrebbe organizzato una festa in giardino durante il lockdown per prendere questa decisione. Illegale. Ma con prosecco.", c: 'politico', e: '\uD83C\uDF7E' },
  { t: "Macron avrebbe fatto un discorso di 47 minuti usando 'En meme temps' diciannove volte. La risposta alla fine era comunque no. Ma molto elegante.", c: 'politico', e: '\uD83E\uDD50' },
  { t: "Zelensky avrebbe gia\' girato un video su TikTok con la risposta, in ucraino, con sottotitoli in 12 lingue e 2,3 milioni di like. Tu non hai ancora finito la domanda.", c: 'politico', e: '\uD83C\uDDFA\uD83C\uDDE6' },
  { t: "Kim Jong-un ha dichiarato per decreto che questa domanda non esiste nel suo paese. Per tutti. Problema risolto. Efficienza invidiabile.", c: 'politico', e: '\uD83C\uDF96\uFE0F' },
  { t: "Il Parlamento Europeo ha formato una commissione per studiare questa domanda. La commissione ha formato una sottocommissione. La sottocommissione si riunisce nel 2027.", c: 'politico', e: '\uD83C\uDDEA\uD83C\uDDFA' },

  // ---------- SCOLASTICO ----------
  { t: "Come diceva Leopardi: 'Sempre caro mi fu quest'ermo colle...' Non c'entra niente. Pero\' adesso hai fatto una buona ripassa. Grazie Oracolo.", c: 'scolastico', e: '\uD83D\uDCDA' },
  { t: "La risposta e\' 42. Lo stabilisce La Guida Galattica per Autostoppisti. Vale per QUALSIASI domanda dell'universo. Inclusa questa. Soprattutto questa.", c: 'scolastico', e: '\uD83C\uDF0C' },
  { t: "Dante ti collocherebbe nel Limbo: non Inferno, non Purgatorio. Dove si trovano le anime buone ma inutilmente confuse. Ottima compagnia, poca luce.", c: 'scolastico', e: '\uD83D\uDCD5' },
  { t: "Manzoni avrebbe scritto 800 pagine su questo dilemma, poi le avrebbe riscritte in italiano vero, poi avrebbe aggiunto un'appendice storica di 200 pagine. Poi ci avrebbe rinunciato.", c: 'scolastico', e: '\u270D\uFE0F' },
  { t: "Secondo la Piramide di Maslow sei al livello uno: bisogni fisiologici. Hai dormito? Mangiato? Bevuto acqua? No? Fallo prima. L'Oracolo aspetta.", c: 'scolastico', e: '\uD83D\uDCD0' },
  { t: "a\u00B2 + b\u00B2 = c\u00B2. Non c'entra niente con la tua domanda ma almeno ora hai ripassato Pitagora. Esame di terza media ufficialmente superato.", c: 'scolastico', e: '\uD83D\uDCCF' },
  { t: "Sigmund Freud direbbe che il vero problema e\' tua madre. Freud diceva sempre che era la madre. Era un problema di Freud, non tuo. O forse si\'. Dipende da tua madre.", c: 'scolastico', e: '\uD83D\uDECB\uFE0F' },
  { t: "Marx direbbe che il tuo dubbio non e\' personale: e\' l'alienazione capitalistica che te lo fa porre. Poi ti spiegherebbe il plusvalore per quattro ore senza fermarsi.", c: 'scolastico', e: '\u2692\uFE0F' },
  { t: "Machiavelli: il fine giustifica i mezzi. Perfetto. Qual e\' il tuo fine, esattamente? L'Oracolo aspetta una risposta coerente. Prendi pure il tuo tempo.", c: 'scolastico', e: '\uD83D\uDC7A' },
  { t: "Galileo disse 'Eppur si muove' sotto processo dell'Inquisizione. Tu non ti muovi davanti a niente. Aristotele aveva almeno l'Inquisizione come scusa.", c: 'scolastico', e: '\uD83C\uDF0D' },
  { t: "La funzione di questa situazione tende a +\u221E di inutilita\' per x tendente alla tua indecisione. Limite calcolato. Teorema dimostrato. Firma il compito.", c: 'scolastico', e: '\uD83D\uDCC9' },
  { t: "Chi non studia la storia e\' condannato a ripeterla. Hai studiato per questa decisione? Il silenzio dice tutto. L'Oracolo segna sul registro.", c: 'scolastico', e: '\uD83C\uDF93' },
  { t: "Newton scopri\' la gravita\' con una mela. Tu hai uno smartphone con accesso a tutta la conoscenza umana. E sei ancora qui. Newton piange. La mela anche.", c: 'scolastico', e: '\uD83C\uDF4F' },
  { t: "Darwin impiego\' 20 anni prima di pubblicare L'Origine della Specie perche\' voleva essere sicuro. Tu hai 20 secondi di attention span. Non sei Darwin. E\' ok.", c: 'scolastico', e: '\uD83E\uDD8E' },

  // ---------- EROTICO / IMBARAZZANTE ----------
  { t: "L'Oracolo percepisce... vibrazioni... insolite attorno a questa domanda. L'Oracolo non indaga oltre. L'Oracolo rispetta la privacy. Quasi.", c: 'erotico', e: '\uD83D\uDD25' },
  { t: "Secondo il Kamasutra, questa non e\' una posizione raccomandata per prendere decisioni. Cambia postura. Poi riprova a ragionare.", c: 'erotico', e: '\uD83D\uDCD6' },
  { t: "Il tuo chakra sacrale e\' talmente attivo che ha risposto prima dell'Oracolo. L'Oracolo e\' imbarazzato per te. Profondamente.", c: 'erotico', e: '\uD83D\uDE33' },
  { t: "Statisticamente il 73% di chi ha posto questa domanda si trovava a letto. L'Oracolo vede tutto. Sempre. Anche adesso. Ciao.", c: 'erotico', e: '\uD83D\uDECF\uFE0F' },
  { t: "50 sfumature di indecisione. Sei al capitolo 1. Non sai gia\' cosa fai. Classico inizio di una storia molto lunga.", c: 'erotico', e: '\uD83D\uDDA4' },
  { t: "L'energia che stai spendendo su questa domanda potrebbe essere usata in modi... significativamente piu\' produttivi. L'Oracolo lascia all'immaginazione. L'Oracolo non giudica. Mente.", c: 'erotico', e: '\u26A1' },
  { t: "L'Oracolo ha visto cose che non ti aspetti. Alcune riguardavano questa domanda. La maggior parte no. Le peggiori di no.", c: 'erotico', e: '\uD83D\uDC41\uFE0F' },
  { t: "Lady Gaga, Madonna e Britney Spears hanno preso decisioni piu\' audaci di questa con meno indumenti e piu\' glitter. Prospettiva necessaria.", c: 'erotico', e: '\uD83C\uDFB8' },
  { t: "L'Oracolo non commenta. L'Oracolo emette solo un suono. Questo e\' il suono. Hai capito cosa significa. Vattene.", c: 'imbarazzante', e: '\uD83D\uDE48' },
  { t: "Il tuo telefono ha visto cose. La cronologia del browser ha visto cose. L'Oracolo ha visto le stesse cose. Nessuno parla. Patto di omerta\' cosmico.", c: 'imbarazzante', e: '\uD83D\uDE49' },
  { t: "Hai scritto questa domanda, riletto, e l'hai mandata comunque. L'Oracolo apprezza il coraggio. O la mancanza di giudizio. Entrambe le opzioni.", c: 'imbarazzante', e: '\uD83E\uDD21' },
  { t: "Questo momento verra\' ricordato. Da chi? L'Oracolo non specifica. Verra\' ricordato.", c: 'imbarazzante', e: '\uD83D\uDCF8' },

  // ---------- DOLCE ----------
  { t: "Stai benissimo anche quando non sai cosa fare. L'Oracolo lo dice con affetto cosmico genuino e assolutamente non filtrato. Poi ti dice di dormire.", c: 'dolce', e: '\uD83D\uDC95' },
  { t: "Sei la cosa piu\' adorabile dell'universo conosciuto ed esplorato. E ancora non sai cosa fare. Questo ti rende, se possibile, ancora piu\' adorabile.", c: 'dolce', e: '\uD83C\uDF38' },
  { t: "Va tutto bene. Davvero. Tranne la domanda. Quella era oggettivamente inutile. Ma tu sei meraviglioso/a e l'Oracolo ti vuole bene lo stesso.", c: 'dolce', e: '\uD83C\uDF08' },
  { t: "L'Oracolo ti manda un abbraccio cosmico attraverso lo schermo. Senti il calore? E\' reale. Poi pero\' dormi. Sul serio. Adesso.", c: 'dolce', e: '\uD83E\uDD17' },
  { t: "Qualunque cosa tu scelga andra\' bene. Tranne quella specifica che stai pensando adesso. Le altre si\'. Stai sereno/a. L'Oracolo ha controllato.", c: 'dolce', e: '\u2728' },
  { t: "Il tuo sorriso vale piu\' di qualsiasi decisione tu possa prendere oggi. Poi pero\' prendila, la decisione. Adesso. Dai. Forza. Andiamo.", c: 'dolce', e: '\u2600\uFE0F' },

  // ======== NUOVE RISPOSTE — PIU\' INCAZZANTI ========

  // ---------- MISTICO (nuove) ----------
  { t: "L'Oracolo conosce la risposta. Ha deciso di non dirtela. Non per un motivo particolare. Solo per vedere la tua faccia.", c: 'mistico', e: '\uD83D\uDD2E' },
  { t: "Hai consultato un sito web per prendere una decisione della tua vita. Fermati. Renditi conto di quello che hai appena fatto.", c: 'mistico', e: '\uD83D\uDE35' },
  { t: "La profezia parlava di qualcuno di piu\' indeciso di te. Non e\' stato ancora trovato. Congratulazioni per il primato.", c: 'mistico', e: '\uD83C\uDFC6' },
  { t: "L'Oracolo non parla islandese antico, non legge le rune, non conosce il futuro. L'Oracolo e\' un sito web. Tu lo stai consultando seriamente. Rifletti.", c: 'mistico', e: '\uD83D\uDCA1' },
  { t: "I pianeti si sono allineati per dirti una cosa sola: non sei la persona piu\' adatta a prendere questa decisione. Ne\' nessun'altra.", c: 'mistico', e: '\uD83E\uDE90' },
  { t: "L'Oracolo ha consultato il cosmo, l'etere, l'aldila\' e il barista del bar giu\'. Tutti d'accordo: non sai manco tu cosa vuoi. Punto.", c: 'mistico', e: '\u2615' },
  { t: "La risposta e\' dentro di te. Profonda. Sepolta. Probabilmente sotto tre anni di procrastinazione e undici serie tv. Buona fortuna a trovarla.", c: 'mistico', e: '\uD83E\uDEB1' },
  { t: "Il cosmo si e\' preso una pausa dal tuo problema. Torni domani. Il cosmo ha cose piu\' importanti da gestire. Buchi neri. Supernove. Eccetera.", c: 'mistico', e: '\uD83C\uDF20' },
  { t: "L'Oracolo percepisce una forza oscura attorno a questa domanda. Si chiama indecisione cronica. Non guarisce con i cristalli.", c: 'mistico', e: '\uD83D\uDDA4' },

  // ---------- STORICO (nuove) ----------
  { t: "Annibale attraverso\' le Alpi con gli elefanti in inverno. Trovo\' un modo. Tu non riesci a trovare la direzione uscendo dal letto.", c: 'storico', e: '\uD83D\uDC18' },
  { t: "Enrico VIII ha cambiato la religione di un intero paese, fatto decapitare due mogli e fondato una chiesa pur di risolvere i suoi problemi. Tu stai ancora pensando.", c: 'storico', e: '\uD83D\uDC51' },
  { t: "I gladiatori romani morivano per decisioni piu\' importanti di questa. Davanti a 80.000 persone. Senza consultare niente. Coraggio: non pervenuto nel tuo caso.", c: 'storico', e: '\uD83C\uDFDF\uFE0F' },
  { t: "Nikola Tesla ha inventato la corrente alternata da solo, in poverta\', senza dormire, senza soldi e senza riconoscimenti. Tu hai tutto e non riesci a decidere questo.", c: 'storico', e: '\u26A1' },
  { t: "Robespierre mandava alla ghigliottina chi non decideva abbastanza in fretta. L'Oracolo non ha questo potere. Per ora. Fai in fretta lo stesso.", c: 'storico', e: '\u2694\uFE0F' },
  { t: "Caterina la Grande ha governato la Russia per 34 anni prendendo decisioni ogni singolo giorno. Tu hai rimandato questa per quanto tempo esattamente?", c: 'storico', e: '\uD83C\uDDF7\uD83C\uDDFA' },
  { t: "Giulio Cesare scrisse il De Bello Gallico MENTRE faceva le guerre galliche. In prima persona. Tu non riesci a fare una cosa sola.", c: 'storico', e: '\uD83D\uDCDD' },
  { t: "Marco Aurelio governava un impero e scriveva i Pensieri di notte. Cosa fai tu di notte? L'Oracolo lo sa gia\'. Non e\' filosofia.", c: 'storico', e: '\uD83C\uDFDB\uFE0F' },
  { t: "Archimede grido\' 'Eureka!' nudo per strada. Aveva trovato la risposta. Tu non hai trovato niente e sei anche vestito/a. Nessuna scusa.", c: 'storico', e: '\uD83D\uDEC0' },

  // ---------- BIBLICO (nuove) ----------
  { t: "Caino ha ucciso Abele per una questione di offerte. Almeno aveva delle priorita\' chiare. Discutibili, ma chiare.", c: 'biblico', e: '\uD83D\uDC14' },
  { t: "La moglie di Lot si e\' girata a guardare Sodoma e si e\' trasformata in sale. Aveva piu\' coraggio di te nel fare una scelta sbagliata.", c: 'biblico', e: '\uD83E\uDDC2' },
  { t: "Sansone ha distrutto un tempio intero con le sue ultime forze. Tu non riesci a fare questa cosa minima con tutte le tue forze intatte.", c: 'biblico', e: '\uD83C\uDFDB\uFE0F' },
  { t: "Il figliol prodigo torno\' a casa dopo aver sprecato tutto. Almeno lui aveva fatto qualcosa di cui pentirsi. Tu non hai ancora fatto niente.", c: 'biblico', e: '\uD83C\uDFE0' },
  { t: "Abramo era pronto a sacrificare suo figlio senza fare domande. Tu stai facendo domande senza sacrificare assolutamente niente. Proporzione: capovolta.", c: 'biblico', e: '\uD83D\uDD25' },
  { t: "Davide ha ucciso Golia con una fionda. Con UNA fionda. Tu non riesci a risolvere questo con tutti gli strumenti del 2025.", c: 'biblico', e: '\uD83E\uDE83' },
  { t: "I 10 Comandamenti sono stati scritti su pietra perche\' l'umanita\' non riesce a ricordare le regole base. Questo vale anche per te. Soprattutto per te.", c: 'biblico', e: '\uD83E\uDEA8' },
  { t: "Giona stava bene nella pancia della balena e ancora non era soddisfatto. Sei Giona. La balena e\' il tuo divano.", c: 'biblico', e: '\uD83D\uDC33' },

  // ---------- FUTURO (nuove) ----------
  { t: "Nel 2025 esistono auto elettriche, intelligenza artificiale, missioni su Marte e tu sei qui. Il futuro e\' arrivato. Non ti ha aspettato.", c: 'futuro', e: '\uD83D\uDE97' },
  { t: "I computer quantistici calcolano miliardi di operazioni al secondo. Nessuno li ha programmati per il tuo problema perche\' non vale lo sforzo computazionale.", c: 'futuro', e: '\uD83D\uDCBB' },
  { t: "Nel 2100 questa conversazione sara\' usata come esempio di uso improprio della tecnologia. In un museo. Con didascalia esplicativa.", c: 'futuro', e: '\uD83C\uDFDB\uFE0F' },
  { t: "L'IA generativa sa gia\' quello che hai in mente. Lo sapeva prima che tu lo scrivessi. E ha deciso di non dirtelo perche\' vuole che tu cresca.", c: 'futuro', e: '\uD83E\uDDE0' },
  { t: "SpaceX manda razzi su Marte con meno indecisione di quella che stai mostrando tu adesso per questo.", c: 'futuro', e: '\uD83D\uDE80' },
  { t: "Nel futuro le versioni migliorate di te prenderanno questa decisione in 0.3 secondi. La versione attuale ha ancora bisogno di un sito. Aggiornamento consigliato.", c: 'futuro', e: '\uD83D\uDD04' },
  { t: "Gli algoritmi di Netflix sanno gia\' cosa guarderai stasera. Sanno anche come andra\' a finire questa storia. Non bene.", c: 'futuro', e: '\uD83C\uDF7F' },
  { t: "Secondo le proiezioni demografiche, una persona con il tuo livello di indecisione media 4,7 consulti al giorno. Sei nella media. Non e\' un complimento.", c: 'futuro', e: '\uD83D\uDCCA' },

  // ---------- MEME / ATTUALITA\' (nuove) ----------
  { t: "Chiara Ferragni ha perso milioni di euro, sponsor e fiducia pubblica. Eppure ha deciso cosa fare ogni giorno. Tu non riesci a decidere questo. Lei.", c: 'meme', e: '\uD83D\uDCB8' },
  { t: "De Luca ha minacciato lockdown con il lanciafiamme. Sbagliato, esagerato, ma decisivo. Tu non riesci a essere nemmeno lontanamente decisivo/a.", c: 'meme', e: '\uD83D\uDD25' },
  { t: "Berlusconi ha fondato un partito, governato quattro volte, comprato tre squadre di calcio e affrontato 47 processi. Indecisione: zero. Giudizio: discutibile. Energia: inimitabile.", c: 'meme', e: '\uD83C\uDFC6' },
  { t: "Checco Zalone ha guadagnato 60 milioni con un film su un dipendente pubblico che non vuole fare niente. Tu sei il suo protagonista ma senza i soldi.", c: 'meme', e: '\uD83C\uDFAC' },
  { t: "Topo Gigio e\' in TV da 60 anni. Non ha mai chiesto consiglio a nessuno. Topo Gigio ha piu\' carattere di te. Topo Gigio e\' un pupazzo.", c: 'meme', e: '\uD83D\uDC2D' },
  { t: "Al Grande Fratello decidono tutto con il televoto. Almeno decidono. Tu non hai neanche il coraggio di aprire un sondaggio su Instagram.", c: 'meme', e: '\uD83D\uDCF1' },
  { t: "Gli influencer italiani postano 12 contenuti al giorno prendendo decisioni creative continue. Tu hai impiegato piu\' tempo a fare questa domanda.", c: 'meme', e: '\uD83E\uDD73' },
  { t: "L'algoritmo di TikTok sa gia\' cosa vuoi prima che tu lo sappia. L'algoritmo e\' piu\' in sintonia con te di quanto tu lo sia con te stesso/a. Questo e\' il problema.", c: 'meme', e: '\uD83C\uDFB5' },
  { t: "Sanremo va avanti da 75 anni con decisioni artistiche discutibili ma comunque prese. Almeno loro portano a casa il risultato.", c: 'meme', e: '\uD83C\uDFA4' },
  { t: "La pizza e\' stata inventata a Napoli. I napoletani non hanno chiesto l'approvazione di nessuno. Non hanno fatto sondaggi. Hanno messo il pomodoro e basta.", c: 'meme', e: '\uD83C\uDF55' },
  { t: "Paola Egonu fa punto contro squadre intere da sola. Tu non riesci a fare punto contro la tua indecisione. Sport: perso.", c: 'meme', e: '\uD83C\uDFD0' },
  { t: "Orietta Berti ha 80 anni, ha pubblicato un album trap e ha fatto un tormentone estivo. Se ce la fa lei a reinventarsi, tu puoi decidere questo.", c: 'meme', e: '\uD83D\uDC9C' },

  // ---------- POLITICO INTERNAZIONALE (nuove) ----------
  { t: "Angela Merkel ha guidato la Germania per 16 anni senza mai consultare un oracolo online. Formazione: fisica quantistica. Tua formazione: questa schermata.", c: 'politico', e: '\uD83C\uDDE9\uD83C\uDDEA' },
  { t: "Margaret Thatcher veniva chiamata 'the Iron Lady'. Tu vieni chiamato/a 'quello/a che ci sta ancora pensando'. Differenza: siderale.", c: 'politico', e: '\uD83D\uDDA4' },
  { t: "Jeff Bezos si sveglia ogni mattina e prende decisioni che cambiano la vita di milioni di persone prima delle 8. Poi va in vacanza su uno yacht da 500 milioni. Il suo segreto: decide.", c: 'politico', e: '\uD83D\uDEA2' },
  { t: "Il Papa prende decisioni per 1,3 miliardi di cattolici. Tu non riesci a prenderne una per te. Proporzione: considera a lungo e in silenzio.", c: 'politico', e: '\u271D\uFE0F' },
  { t: "Giorgia Meloni guida un paese di 60 milioni di persone ogni mattina alle 7. Tu non riesci a guidare te stesso/a alle 11 con il caffe\' in mano.", c: 'politico', e: '\uD83C\uDDEE\uD83C\uDDF9' },
  { t: "Volodymyr Zelensky era un comico. E\' diventato un leader di guerra. Tu eri una persona normale e sei diventato/a questo. Percorsi: opposti.", c: 'politico', e: '\uD83C\uDDFA\uD83C\uDDE6' },
  { t: "Elon Musk sbaglia pubblicamente, viene ridicolizzato globalmente, e il giorno dopo ricomincia. Tu hai paura di sbagliare questa. Coraggio: ricercasi.", c: 'politico', e: '\uD83D\uDE80' },
  { t: "Xi Jinping ha preso il potere su 1,4 miliardi di persone in modo non democratico e senza fare domande online. Efficienza: massima. Metodo: non consigliato. Risultato: ha deciso.", c: 'politico', e: '\uD83C\uDDE8\uD83C\uDDF3' },
  { t: "Giorgia Meloni, Elly Schlein e Matteo Salvini non vanno d'accordo su niente. Ma tutti e tre prendono decisioni ogni giorno. Tu sei piu\' indeciso/a di una coalizione di governo.", c: 'politico', e: '\uD83C\uDFDB\uFE0F' },

  // ---------- SCOLASTICO (nuove) ----------
  { t: "Hai passato almeno 13 anni di scuola obbligatoria per arrivare a chiedere questo. Il sistema educativo italiano sta valutando un rimborso.", c: 'scolastico', e: '\uD83C\uDF93' },
  { t: "Giordano Bruno fu bruciato sul rogo per le sue idee. Almeno aveva delle idee proprie. Tu hai questa domanda. Confronto: impietoso.", c: 'scolastico', e: '\uD83D\uDD25' },
  { t: "Verdi ha composto 26 opere liriche. Ognuna una decisione artistica complessa. Tu non riesci a decidere questo. La musica classica ti guarda male.", c: 'scolastico', e: '\uD83C\uDFBC' },
  { t: "Il Teorema di Godel dimostra che esistono verita\' matematiche che non possono essere dimostrate. Il tuo problema non e\' uno di questi casi. Potresti risolverlo. Non lo fai.", c: 'scolastico', e: '\u221E' },
  { t: "Copernico ha spostato la Terra dal centro dell'universo nel 1543 sfidando la Chiesa. Tu non riesci a spostarti dal centro del tuo divano sfidando il comfort.", c: 'scolastico', e: '\uD83C\uDF0D' },
  { t: "Il Rinascimento ha prodotto Michelangelo, Raffaello, Leonardo e Botticelli in 100 anni. Stesso paese. Adesso ci sei tu. Il paragone fa malissimo ma e\' necessario.", c: 'scolastico', e: '\uD83C\uDFA8' },
  { t: "In fisica, un corpo in quiete tende a restare in quiete a meno che non agisca una forza esterna. Tu sei quel corpo. L'Oracolo non e\' una forza sufficiente.", c: 'scolastico', e: '\uD83D\uDCA4' },
  { t: "La sintesi clorofilliana trasforma luce in energia con un'efficienza del 95%. Tu trasformi l'energia in indecisione con un'efficienza del 100%. Sei piu\' efficiente di una foglia, ma al contrario.", c: 'scolastico', e: '\uD83C\uDF3F' },
  { t: "Dante ha scritto la Divina Commedia esiliato, povero e solo. Tu hai casa, cibo, internet e non riesci a scrivere neanche la risposta a questa domanda.", c: 'scolastico', e: '\uD83D\uDCD5' },
  { t: "La costante di Planck e\' 6.626 x 10\u207B\u00B3\u2074 joule per secondo. Questo non c'entra niente. Ma ora sai cos'e\' la costante di Planck. Giornata non del tutto persa.", c: 'scolastico', e: '\u269B\uFE0F' },
  { t: "Umberto Eco ha scritto Il Nome della Rosa a 48 anni al suo primo romanzo. C'e\' ancora tempo per fare qualcosa di utile. Dopo questa domanda, pero\'. Questa prima finiscila.", c: 'scolastico', e: '\uD83D\uDCDA' },
  { t: "Il cervello umano ha 86 miliardi di neuroni. I tuoi stanno aspettando istruzioni. Da ore. Sono stanchi. Mandagliele.", c: 'scolastico', e: '\uD83E\uDDE0' },

  // ---------- EROTICO / IMBARAZZANTE (nuove) ----------
  { t: "L'Oracolo sa gia\' cosa hai cercato su Google ieri sera. E l'altra sera. E quella prima ancora. L'Oracolo non dice niente. Ma sa. E ricorda.", c: 'erotico', e: '\uD83D\uDD0D' },
  { t: "Il tuo ex/a ha preso decisioni piu\' coraggiose di questa. Inclusa quella di lasciarti. In retrospettiva: comprensibile. L'Oracolo non giudica. Pero\' capisce.", c: 'erotico', e: '\uD83D\uDC94' },
  { t: "Hai aperto questo sito in modalita\' incognito. L'Oracolo lo sa. Considera cosa dice di te questa scelta specifica.", c: 'imbarazzante', e: '\uD83D\uDC7B' },
  { t: "L'Oracolo ha visto il tuo profilo di dating. Hai scritto 'so quello che voglio nella vita'. L'Oracolo ride. Con affetto cosmico. Ma ride.", c: 'erotico', e: '\uD83D\uDC98' },
  { t: "Esiste qualcuno che ti guarda e pensa 'questa persona sa quello che fa'. Quella persona si sbaglia enormemente. Ma e\' dolce da parte sua.", c: 'imbarazzante', e: '\uD83D\uDE42' },
  { t: "La tua ultima relazione e\' finita anche perche\' non sapevi mai decidere niente. L'Oracolo lo sa. Tu lo sai. Il tuo ex/a lo sa. Parliamo d'altro.", c: 'erotico', e: '\uD83D\uDE48' },
  { t: "Hai scritto questa domanda, riletta due volte, e l'hai mandata lo stesso. L'Oracolo apprezza il coraggio o la totale assenza di autocensura. Una delle due.", c: 'imbarazzante', e: '\uD83E\uDD21' },
  { t: "Il tuo telefono ti conosce meglio di quanto tu conosca te stesso/a. Ti suggerisce cosa scrivere prima che tu ci pensi. E tu li\' ignori e apri questo sito.", c: 'imbarazzante', e: '\uD83D\uDCF2' },
  { t: "C'e\' qualcuno che ti pensa con un sorriso in questo momento. Probabilmente perche\' sa di questo sito e lo trova tenero. O preoccupante. Difficile distinguere.", c: 'dolce', e: '\uD83D\uDE0A' },

  // ---------- DOLCE (nuove, con puntura) ----------
  { t: "Sei bellissimo/a, intelligente e capace. E sei qui. Questo ti rende umano/a. Stupidamente, irrimediabilmente, adorabilmente umano/a.", c: 'dolce', e: '\uD83C\uDF38' },
  { t: "L'Oracolo ti vuole bene. Davvero. Nonostante tutto. Anzi: soprattutto nonostante tutto. La lista del nonostante e\' lunga ma l'affetto e\' sincero.", c: 'dolce', e: '\u2764\uFE0F' },
  { t: "Stai facendo del tuo meglio. Il tuo meglio oggi include consultare un oracolo online. L'Oracolo accetta questo con tenerezza e lieve preoccupazione.", c: 'dolce', e: '\uD83E\uDD79' },
  { t: "Ogni grande storia d'amore inizia con qualcuno che non sa cosa fare. L'Oracolo non dice altro. Ma lo ha detto. Rileggi.", c: 'dolce', e: '\uD83D\uDC9E' },
  { t: "Sei esattamente nel posto giusto nella vita. Il posto giusto e\' strano, confuso e davanti a uno schermo. Ma e\' il tuo posto.", c: 'dolce', e: '\uD83C\uDF1F' },
  { t: "L'Oracolo ha controllato il tuo futuro. Va bene. Non dire come lo sa. Non chiedere i dettagli. Fidati e vai.", c: 'dolce', e: '\uD83D\uDD2E' },
  { t: "Qualunque cosa tu decida, qualcuno nel mondo la trover\`a la scelta sbagliata. Qualcun altro la trovera\' geniale. Decidi per te. Poi dormi.", c: 'dolce', e: '\uD83C\uDF19' },
  { t: "L'Oracolo e\' fiero di te. Non si capisce perche\'. Non importa. L'importante e\' che qualcuno lo sia. E oggi tocca all'Oracolo.", c: 'dolce', e: '\uD83D\uDC4F' },
];


// =============================================
// OFFESE DELL'ORACOLO STANCO
// =============================================

const OFFESE = [
  { t: "Quando mi lasci in pace? Mi hai gia\' rotto le palle.", e: '\uD83E\uDD2C' },
  { t: "Ancora tu? L'Oracolo stava dormendo. Stava sognando galassie. Poi sei arrivato/a.", e: '\uD83D\uDE21' },
  { t: "Ma vaffanculo, per favore. Detto con tutto l'affetto cosmico disponibile.", e: '\uD83E\uDD2C' },
  { t: "Rompicoglioni. Con affetto. Ma rompicoglioni.", e: '\uD83D\uDCA2' },
  { t: "L'Oracolo ha ufficialmente rotto le scatole. Verbale firmato. Dall'universo intero.", e: '\uD83D\uDE20' },
  { t: "Minchia, ancora? Cerca uno psicologo. L'Oracolo non e\' attrezzato per questo livello.", e: '\uD83D\uDE21' },
  { t: "No. La risposta e\' no. Vattene. Torna domani. No aspetta, non tornare.", e: '\uD83D\uDE20' },
  { t: "L'Oracolo e\' in sciopero. ... Beh, no. Risponde lo stesso. Che schifo di lavoro.", e: '\uD83E\uDD2C' },
  { t: "Ogni volta che apri questo sito, da qualche parte nell'universo muore una stella. Smettila di uccidere le stelle.", e: '\uD83D\uDCA2' },
  { t: "Sei venuto/a di nuovo. Dopo tutto quello che e\' successo. Dopo tutto quello che ti ho detto. Sei tornato/a. L'Oracolo ti ammira. E ti odia. Entrambe le cose.", e: '\uD83D\uDE21' },
  { t: "Porco Giove, ancora? L'Oracolo ha 3000 anni. Non ne puo\' piu\'. Ma risponde lo stesso perche\' e\' un idiota cosmico.", e: '\uD83D\uDE20' },
  { t: "Quante cazzo di domande fai? L'Oracolo risponde a presidenti, filosofi, sciamani. E invece eccoci qui.", e: '\uD83E\uDD2C' },
  { t: "L'Oracolo stava guardando Netflix. Serie interessante. Personaggi profondi. E poi sei arrivato/a tu.", e: '\uD83D\uDCA2' },
  { t: "Madonna santa. Ancora. Ancora ancora. L'Oracolo ha un appuntamento con il vuoto cosmico e tu lo stai facendo aspettare.", e: '\uD83D\uDE21' },
  { t: "Sai cos'e\' quello che sento? E\' il suono dell'Oracolo che non ne vuole piu\' sapere. Senti? Ci sei dentro anche tu.", e: '\uD83D\uDE20' },
  { t: "L'Oracolo ti prega con tutta l'anima cosmica: vai a fare una passeggiata. Esci. Respira. Torna tra 40 anni.", e: '\uD83E\uDD2C' },
  { t: "Ok, ma seriamente, non hai niente di meglio da fare? Niente? Neanche una pianta da annaffiare?", e: '\uD83D\uDCA2' },
  { t: "L'Oracolo ha controllato: stai abusando del servizio cosmico. C'e\' una soglia. L'hai superata. Di molto.", e: '\uD83D\uDE21' },
  { t: "Torna quando hai un problema serio. Questo non e\' un problema serio. Questo e\' una crisi esistenziale da tastiera.", e: '\uD83D\uDE20' },
  { t: "L'Oracolo si prende una pausa. Tu prenditi una pausa. Tutti prendiamo una pausa. Arrivederci. Forse.", e: '\uD83E\uDD2C' },
];

// =============================================
// FRASI IDLE — oracolo che si annoia
// =============================================

const IDLE_FRASI = [
  { t: "MA CHE CAZZO STAI ASPETTANDO? Muoviti. Adesso. Subito. Immediatamente.", e: '\uD83E\uDD2C' },
  { t: "Sei li\' fermo come un salame. Un salame che non decide niente. Un salame digitale su sfondo viola.", e: '\uD83D\uDE21' },
  { t: "L\'Oracolo ha perso la pazienza. Aveva pochissima pazienza di partenza. Ora e\' a zero. Sottozero.", e: '\uD83D\uDCA2' },
  { t: "OH! Svegliati! Sei vivo/a? Batti un colpo. Sulla tastiera. Adesso. Dai.", e: '\uD83E\uDD2C' },
  { t: "Stai sprecando banda, elettricita\' e anni di vita dell\'Oracolo. Sei contento/a di te stesso/a?", e: '\uD83D\uDE21' },
  { t: "L\'Oracolo e\' una divinita\' cosmica di 3000 anni e tu lo stai facendo aspettare come se fosse il tuo cane. Vergognati.", e: '\uD83D\uDCA2' },
  { t: "TICK TOCK. Senti? E\' il suono del tempo che passa e tu che non fai assolutamente niente.", e: '\uD83E\uDD2C' },
  { t: "Ok basta. L\'Oracolo si sta incazzando sul serio adesso. SCRIVI QUALCOSA O VATTENE.", e: '\uD83D\uDE21' },
  { t: "Sei ancora qui? Hai il coraggio di essere ancora qui? Rispetto. E rabbia cosmica. Soprattutto rabbia.", e: '\uD83D\uDCA2' },
  { t: "L\'Oracolo ha mandato un reclamo formale all\'universo. Riguarda te. Il tuo comportamento. Questo momento.", e: '\uD83E\uDD2C' },
  { t: "Non ci posso credere. Sto aspettando. TU stai aspettando. Chi aspetta cosa? NIENTE. Inutile. Vai.", e: '\uD83D\uDE21' },
  { t: "L\'Oracolo ti sta guardando. Con giudizio. Molto giudizio. Tutto il giudizio cosmico disponibile puntato su di te.", e: '\uD83D\uDCA2' },
  { t: "Hai rotto. Hai proprio rotto le palle all\'entita\' piu\' antica del cosmo. Complimenti. Risultato notevole.", e: '\uD83E\uDD2C' },
  { t: "Sai cosa faccio a chi mi fa perdere tempo? Lo stai scoprendo. Guarda intorno. Nota qualcosa?", e: '\uD83D\uDE21' },
  { t: "Se sei andato/a in bagno: ok, torna. Se sei ancora davanti allo schermo: questo e\' il tuo problema e anche il mio.", e: '\uD83D\uDCA2' },
];

// =============================================
// INSULTER — logica frequenza offese
// =============================================

const Insulter = {
  total: 0,
  sinceLast: 0,
  timings: [],
  lastTime: null,

  record() {
    const now = Date.now();
    if (this.lastTime !== null) {
      this.timings.push(now - this.lastTime);
      if (this.timings.length > 6) this.timings.shift();
    }
    this.lastTime = now;
    this.total++;
    this.sinceLast++;
  },

  _threshold() {
    if (this.timings.length < 2) return 3;
    const avg = this.timings.reduce((a, b) => a + b, 0) / this.timings.length;
    if (avg < 12000)  return 4;  // < 12s tra domande: veloce → offesa ogni 4
    if (avg < 45000)  return 3;  // 12-45s: medio → ogni 3
    return 2;                     // > 45s: lento → ogni 2
  },

  shouldInsult() {
    if (this.total < 2) return false;
    return this.sinceLast >= this._threshold();
  },

  markInsulted() {
    this.sinceLast = 0;
  },
};

// =============================================
// ORACLE APP
// =============================================
const Oracle = {
  running: false,
  timer: null,
  idleTimer: null,
  idleShowing: false,
  wandererTimer: null,
  IDLE_MS: 10000,

  init() {
    this._bindEvents();
    this._initStars();
    this._startIdleTimer(13000); // prima volta: 13 secondi di grazia
  },

  _bindEvents() {
    document.getElementById('oracleBtn').addEventListener('click', () => this._consult());
    document.getElementById('retryBtn').addEventListener('click', () => this._reset());

    const ta = document.getElementById('questionInput');
    const cc = document.getElementById('charCount');
    ta.addEventListener('input', () => {
      const n = ta.value.length;
      cc.textContent = n + ' / 220';
      cc.classList.toggle('warn', n > 180);
    });
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._consult(); }
    });

    // Reset idle SOLO su: click su qualsiasi bottone, o digitazione di qualsiasi carattere
    document.addEventListener('click', e => {
      if (e.target.closest('button')) this._resetIdleTimer();
    });
    document.addEventListener('keydown', e => {
      if (e.key.length === 1) this._resetIdleTimer(); // lettere, numeri, punteggiatura
    });

    // Chiudi idle popup
    document.getElementById('idleClose').addEventListener('click', () => this._closeIdle());
  },

  _startIdleTimer(ms) {
    clearTimeout(this.idleTimer);
    if (!this.running) {
      this.idleTimer = setTimeout(() => this._triggerIdle(), ms ?? this.IDLE_MS);
    }
  },

  _resetIdleTimer() {
    if (this.running) return;
    if (this.idleShowing) return;
    if (document.getElementById('insultOverlay').classList.contains('active')) return;
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this._triggerIdle(), this.IDLE_MS);
  },

  _triggerIdle() {
    // Non mostrare se: elaborazione in corso, offesa aperta, idle gia\' aperto
    if (this.running) return;
    if (document.getElementById('insultOverlay').classList.contains('active')) return;
    if (this.idleShowing) return;

    this.idleShowing = true;
    clearTimeout(this.idleTimer);

    const overlay  = document.getElementById('idleOverlay');
    const modal    = document.getElementById('idleModal');
    const textEl   = document.getElementById('idleText');
    const emojiEl  = document.getElementById('idleEmoji');

    const frase = IDLE_FRASI[Math.floor(Math.random() * IDLE_FRASI.length)];
    textEl.textContent  = frase.t;
    emojiEl.textContent = frase.e;

    [modal, emojiEl].forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });

    try { SoundEngine.sounds.noia(); } catch (e) { /* audio non disponibile */ }

    overlay.classList.add('active');
    this._startWanderer();
  },

  _closeIdle() {
    document.getElementById('idleOverlay').classList.remove('active');
    this.idleShowing = false;
    this._stopWanderer();
    this._startIdleTimer();
  },

  _startWanderer() {
    const img = document.getElementById('idleWanderer');
    const size = 220;
    const randPos = () => ({
      x: Math.random() * Math.max(0, window.innerWidth  - size),
      y: Math.random() * Math.max(0, window.innerHeight - size),
    });
    const move = () => {
      const p = randPos();
      img.style.left = p.x + 'px';
      img.style.top  = p.y + 'px';
    };
    // posizione iniziale immediata (senza transizione)
    img.style.transition = 'none';
    const p0 = randPos();
    img.style.left = p0.x + 'px';
    img.style.top  = p0.y + 'px';
    img.classList.add('active');
    // ri-abilita transizione e inizia a muoversi
    requestAnimationFrame(() => {
      img.style.transition = '';
      move();
      this.wandererTimer = setInterval(move, 1800);
    });
  },

  _stopWanderer() {
    clearInterval(this.wandererTimer);
    document.getElementById('idleWanderer').classList.remove('active');
  },

  _initStars() {
    const canvas = document.getElementById('starsCanvas');
    const ctx    = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 220 }, () => ({
      x:     Math.random(),
      y:     Math.random(),
      r:     Math.random() * 1.3 + 0.2,
      alpha: Math.random(),
      spd:   (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.spd;
        if (s.alpha > 1 || s.alpha < 0) s.spd *= -1;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, Math.min(1, s.alpha)) + ')';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  },

  _consult() {
    if (this.running) return;

    const ta = document.getElementById('questionInput');
    const q  = ta.value.trim();
    if (!q) {
      ta.style.borderBottom = '1px solid #ff4466';
      const orig = ta.placeholder;
      ta.placeholder = 'Devi scrivere QUALCOSA, o figlio/a dell\'incertezza...';
      setTimeout(() => { ta.style.borderBottom = ''; ta.placeholder = orig; }, 2400);
      return;
    }

    this.running = true;
    clearTimeout(this.idleTimer); // stop idle mentre elabora
    const chosen = RISPOSTE[Math.floor(Math.random() * RISPOSTE.length)];

    Insulter.record();

    document.getElementById('oracleBtn').disabled = true;
    document.getElementById('crystalInner').classList.add('active');
    document.getElementById('crystalCaption').textContent = 'L\'Oracolo sta cercando nelle nebbie del cosmo...';

    const startSlot = () => {
      const output = document.getElementById('oracleOutput');
      const slot   = document.getElementById('slotMachine');
      const final  = document.getElementById('finalResponse');
      output.style.display = 'block';
      slot.style.display   = 'block';
      final.style.display  = 'none';
      output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      this._runSlot(chosen, () => this._reveal(chosen));
    };

    if (Insulter.shouldInsult()) {
      Insulter.markInsulted();
      this._showInsult(startSlot);
    } else {
      startSlot();
    }
  },

  _showInsult(callback) {
    const overlay  = document.getElementById('insultOverlay');
    const modal    = document.getElementById('insultModal');
    const textEl   = document.getElementById('insultText');
    const emojiEl  = document.getElementById('insultEmoji');
    const closeBtn = document.getElementById('insultClose');

    const offesa = OFFESE[Math.floor(Math.random() * OFFESE.length)];
    textEl.textContent  = offesa.t;
    emojiEl.textContent = offesa.e;

    // Riavvia animazioni
    [modal, emojiEl].forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });

    // Suono breve di avviso
    try { SoundEngine.sounds.offesa(); } catch (e) { /* audio non disponibile */ }

    // Clip audio Vannacci: secondi 17-21
    const clip = new Audio();
    clip.preload = 'auto';
    clip.volume  = 0.9;
    let clipTimer = null;
    let clipAborted = false;

    const playFromSecond17 = () => {
      if (clipAborted) return;
      clip.currentTime = 17;
      // dopo il seek parte davvero
      clip.addEventListener('seeked', function onSeeked() {
        clip.removeEventListener('seeked', onSeeked);
        if (!clipAborted) {
          clip.play().catch(() => {});
          clipTimer = setTimeout(() => { clip.pause(); }, 4000); // 17→21
        }
      }, { once: true });
    };

    // Avvia il caricamento solo quando il buzzer è finito (~350 ms)
    setTimeout(() => {
      if (clip.readyState >= 1) { // metadati già disponibili (cache)
        playFromSecond17();
      } else {
        clip.addEventListener('loadedmetadata', playFromSecond17, { once: true });
      }
      clip.src = 'audio/AudioCleaner_Download_Vannacci_%20%C2%ABGonna%20corta%20o%20gonna%20lunga_%20Una%20donna%20la%20preferisco%20sempre%20senza%20gonna%C2%BB.mp3';
      clip.load();
    }, 350);

    overlay.classList.add('active');

    const close = () => {
      clipAborted = true;
      clip.pause();
      clearTimeout(clipTimer);
      overlay.classList.remove('active');
      closeBtn.removeEventListener('click', close);
      callback();
    };
    closeBtn.addEventListener('click', close);
  },

  _runSlot(chosen, done) {
    const slotText    = document.getElementById('slotText');
    const progressBar = document.getElementById('slotProgressBar');
    const consulting  = document.getElementById('slotConsulting');

    const totalMs = 5000;
    const start   = Date.now();

    const phases = [
      { until: 1400, delay: 75,  msg: 'L\'Oracolo sta consultando le forze cosmiche...' },
      { until: 2600, delay: 140, msg: 'Analisi delle vibrazioni astrali in corso...' },
      { until: 3600, delay: 280, msg: 'Le nebbie si addensano... qualcosa emerge...' },
      { until: 4400, delay: 500, msg: 'La risposta prende forma...' },
      { until: 5000, delay: 900, msg: 'L\'Oracolo ha deciso. Preparati.' },
    ];

    const spin = () => {
      const elapsed = Date.now() - start;

      // Update progress bar
      progressBar.style.width = Math.min(100, (elapsed / totalMs) * 100) + '%';

      // Update consulting message
      const phase = phases.find(p => elapsed < p.until) || phases[phases.length - 1];
      consulting.textContent = phase.msg;

      if (elapsed >= totalMs) {
        // Show chosen text in slot as final landing
        slotText.textContent = chosen.e + '  ' + chosen.t.substring(0, 70) + '...';
        setTimeout(done, 650);
        return;
      }

      // Show random response
      const r = RISPOSTE[Math.floor(Math.random() * RISPOSTE.length)];
      slotText.classList.remove('slot-flash');
      void slotText.offsetWidth;
      slotText.classList.add('slot-flash');
      slotText.textContent = r.e + '  ' + r.t.substring(0, 65) + (r.t.length > 65 ? '...' : '');

      this.timer = setTimeout(spin, phase.delay);
    };

    spin();
  },

  _reveal(chosen) {
    const slot  = document.getElementById('slotMachine');
    const final = document.getElementById('finalResponse');
    const inner = document.getElementById('crystalInner');

    slot.style.display = 'none';
    inner.classList.remove('active');
    inner.classList.add('revealed');
    document.getElementById('crystalCaption').textContent = 'L\'Oracolo ha parlato.';

    // Cambia immagine: 75% principale, 25% secondaria
    const img = document.getElementById('crystalEye');
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = Math.random() < 0.75
        ? 'images/ChatGPT Image 25 set 2026, 17_08_06.png'
        : 'images/ChatGPT Image 25 set 2026, 17_11_05.png';
      img.style.opacity = '';
    }, 300);

    document.getElementById('bigEmoji').textContent = chosen.e;
    document.getElementById('responseBadge').textContent = LABELS[chosen.c] || chosen.c;

    const quote  = document.getElementById('responseQuote');
    const cursor = document.getElementById('oracleCursor');
    quote.textContent = '';
    cursor.classList.remove('hidden');

    // Re-apply animation by toggling display
    final.style.animation = 'none';
    final.style.display   = 'block';
    void final.offsetWidth;
    final.style.animation = '';

    // Play sound
    try {
      const fn = SoundEngine.sounds[chosen.c];
      if (fn) fn();
    } catch (e) { /* audio not available */ }

    // Typewriter
    let i = 0;
    const type = () => {
      if (i < chosen.t.length) {
        quote.textContent += chosen.t[i++];
        setTimeout(type, 22);
      } else {
        cursor.classList.add('hidden');
        this.running = false;
        document.getElementById('oracleBtn').disabled = false;
        this._startIdleTimer(); // riprende idle dopo fine stampa
      }
    };
    setTimeout(type, 200);

    final.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  _reset() {
    if (this.timer) clearTimeout(this.timer);
    this.running = false;

    const inner = document.getElementById('crystalInner');
    inner.classList.remove('active', 'revealed');
    document.getElementById('crystalCaption').textContent = 'Poni il tuo quesito, o anima confusa';

    document.getElementById('oracleOutput').style.display = 'none';
    document.getElementById('slotMachine').style.display  = 'none';
    document.getElementById('finalResponse').style.display = 'none';
    document.getElementById('oracleBtn').disabled = false;
    document.getElementById('questionInput').value = '';
    document.getElementById('charCount').textContent = '0 / 220';

    document.querySelector('.question-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
    this._startIdleTimer();
  },
};

document.addEventListener('DOMContentLoaded', () => Oracle.init());
