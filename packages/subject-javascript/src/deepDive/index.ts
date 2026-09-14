export interface DeepDiveSection {
  heading: string;
  body: string;
  code?: string;
}

export interface DeepDive {
  id: string;
  topicId: string;
  subtopicId?: string;
  title: string;
  sections: DeepDiveSection[];
}

const dd = (topicId: string, title: string, sections: DeepDiveSection[]): DeepDive => ({
  id: `dd-${topicId}`,
  topicId,
  title,
  sections,
});

export const deepDives: DeepDive[] = [
  dd('variables', 'Variabili: let, const e var', [
    {
      heading: "Cos'è una variabile",
      body: 'Una variabile è un nome che punta a un valore. In JavaScript la dichiari con let (valore che può cambiare) o const (binding fisso). var esiste ancora ma è considerato legacy.',
      code: "let punteggio = 0;\npunteggio = 42;\nconst nome = 'Ada';",
    },
    {
      heading: 'let vs const',
      body: 'Usa const come default: rende chiaro che il binding non cambia. Passa a let solo quando devi riassegnare. Attenzione: const impedisce la riassegnazione, non la mutazione interna di oggetti e array.',
    },
    {
      heading: 'var e hoisting',
      body: 'var ha scope di funzione e viene "sollevata": la dichiarazione si sposta in cima, il valore no. Leggerla prima dell\'assegnazione dà undefined invece di un errore — fonte classica di bug.',
      code: 'console.log(x); // undefined\nvar x = 5;',
    },
    {
      heading: 'Temporal Dead Zone',
      body: 'let e const esistono dalla riga di dichiarazione: prima, sono nella TDZ e leggerle lancia ReferenceError. È un comportamento più sicuro dell\'hoisting di var.',
    },
    {
      heading: 'Errori comuni',
      body: 'Riassegnare una const (TypeError), leggere una let prima di dichiararla (ReferenceError), usare var aspettandosi lo scope di blocco.',
    },
  ]),
  dd('primitive-types', 'I tipi primitivi e typeof', [
    {
      heading: 'I sette primitivi',
      body: 'string, number, bigint, boolean, undefined, symbol, null. Tutto il resto (array, oggetti, funzioni) è di tipo object o function.',
    },
    {
      heading: 'typeof',
      body: 'typeof valore restituisce una stringa con il nome del tipo: "number", "string", "boolean", "undefined", "object", "function", "symbol", "bigint".',
      code: 'typeof 42 // "number"\ntypeof "ciao" // "string"',
    },
    {
      heading: 'I casi strani',
      body: 'typeof null === "object" (bug storico), typeof NaN === "number" (NaN è numerico), typeof [] === "object" (gli array sono oggetti).',
    },
    {
      heading: 'Quando usarlo',
      body: 'Per controlli di tipo sui primitivi typeof è lo strumento giusto: funziona sempre e non lancia errori, anche su variabili non definite.',
    },
  ]),
  dd('strings', 'Stringhe', [
    {
      heading: 'Creare e concatenare',
      body: 'Stringhe con apici singoli, doppi o backtick. Concatenazione con + o interpolazione con `${}` nei template literal.',
      code: "const nome = 'Ada';\n`Ciao ${nome}!` // template literal",
    },
    {
      heading: 'Immutabilità',
      body: 'Le stringhe non si modificano: ogni metodo (toUpperCase, slice, trim…) ritorna una NUOVA stringa. Assegna il risultato se vuoi tenerlo.',
    },
    {
      heading: 'Metodi essenziali',
      body: 'length (lunghezza), slice(a, b) (estrae, b escluso, negativi contano dalla fine), includes/indexOf (cerca), toUpperCase/toLowerCase, trim, split.',
      code: "'javascript'.slice(0, 4) // 'java'\n'  x '.trim() // 'x'",
    },
    {
      heading: 'Errori comuni',
      body: 'Aspettarsi che i metodi modifichino la stringa; includere il carattere finale in slice; usare virgolette invece di backtick per ${}.',
    },
  ]),
  dd('numbers', 'Numeri', [
    {
      heading: 'Un solo tipo numerico',
      body: 'In JavaScript interi e decimali sono entrambi number (double a 64 bit). Esiste anche bigint per interi enormi.',
    },
    {
      heading: 'Operatori',
      body: '+ - * / e in più % (resto) e ** (potenza). Attenzione a + con le stringhe: concatena invece di sommare.',
      code: '7 % 3 // 1\n2 ** 10 // 1024\n"5" + 3 // "53"',
    },
    {
      heading: 'Math',
      body: 'Math.floor (giù), Math.round (più vicino), Math.ceil (su), Math.trunc (taglia i decimali), Math.max/min, Math.random.',
    },
    {
      heading: 'Conversioni e NaN',
      body: 'Number("42") → 42; parseInt("12px") → 12 (legge le cifre iniziali). Operazioni impossibili danno NaN; Number("abc") → NaN.',
    },
    {
      heading: 'Errori comuni',
      body: 'Dimenticare la coercion di +; confrontare NaN con === (NaN !== NaN: usa Number.isNaN).',
    },
  ]),
  dd('booleans-null-undefined', 'Booleani, null e undefined', [
    {
      heading: 'Truthy e falsy',
      body: 'Falsy: false, 0, "", null, undefined, NaN. Tutto il resto — inclusi "0", "false" e [] — è truthy. Le condizioni valutano questa "verità implicita".',
      code: 'if ("0") { /* eseguito: "0" è truthy */ }',
    },
    {
      heading: 'undefined',
      body: 'Il valore delle variabili dichiarate e non inizializzate, dei parametri mancanti, delle proprietà inesistenti e delle funzioni senza return.',
    },
    {
      heading: 'null',
      body: 'Assenza intenzionale di valore: lo assegni tu. typeof null è "object" (bug storico).',
    },
    {
      heading: 'null vs undefined',
      body: 'null == undefined → true (unica eccezione utile del ==). null === undefined → false. Per coprire entrambi: x == null.',
    },
  ]),
  dd('operators', 'Operatori', [
    {
      heading: 'Assegnazione composta',
      body: 'x += n equivale a x = x + n; esistono anche -=, *=, /=, %=. Occhio a =+ che invece assegna +n.',
    },
    {
      heading: 'Incremento e decremento',
      body: 'x++ e ++x incrementano di 1. La differenza: x++ restituisce il valore PRIMA dell\'incremento, ++x DOPO.',
      code: 'let a = 1; let b = a++; // b=1, a=2\nlet c = 1; let d = ++c; // d=2, c=2',
    },
    {
      heading: 'Logici',
      body: '&& richiede entrambi veri, || ne basta uno, ! nega. Restituiscono il valore che decide il risultato (non per forza un booleano).',
    },
    {
      heading: 'Precedenza',
      body: '* e / prima di + e -; le parentesi risolvono ogni dubbio. In caso di dubbio, usa le parentesi: chiarezza > concisione.',
      code: '2 + 3 * 4 // 14\n(2 + 3) * 4 // 20',
    },
  ]),
  dd('comparisons', 'Confronti: == vs ===', [
    {
      heading: '=== stretto',
      body: 'Confronta tipo e valore senza conversioni: 5 === "5" è false. È il confronto da usare sempre.',
    },
    {
      heading: '== debole',
      body: 'Converte i tipi prima di confrontare: 5 == "5" è true, 0 == "" è true. Regole complesse e controintuitive: evita, salvo x == null.',
      code: '5 == "5"   // true\n5 === "5"  // false\nnull == undefined // true',
    },
    {
      heading: 'Ordine',
      body: '<, >, <=, >= su numeri funzionano come atteso; sulle stringhe confrontano lessicograficamente ("10" < "9" è true!).',
    },
    {
      heading: 'Errori comuni',
      body: 'Scrivere = in una condizione (assegna, non confronta); confrontare stringhe numeriche con < aspettandosi il confronto numerico.',
    },
  ]),
  dd('conditionals', 'if/else, ternario e switch', [
    {
      heading: 'if / else if / else',
      body: 'Le condizioni si valutano dall\'alto: il primo ramo vero vince e gli altri si saltano. else cattura tutto il resto.',
    },
    {
      heading: 'Ternario',
      body: 'cond ? a : b è un\'espressione: produce un valore. Ottimo per assegnazioni brevi, pessimo per logiche complesse.',
      code: 'const msg = x > 10 ? "grande" : "piccolo";',
    },
    {
      heading: 'switch',
      body: 'Confronta un valore con molti casi. Ogni case vuole il break: senza, l\'esecuzione "cade" nel caso successivo (fallthrough). default copre gli altri casi.',
      code: 'switch (g) {\n  case 1: console.log("lun"); break;\n  default: console.log("altro");\n}',
    },
    {
      heading: 'Quale scegliere',
      body: 'if/else per condizioni generiche, ternario per scelte a due vie corte, switch per molti valori discreti di una stessa variabile.',
    },
  ]),
  dd('loops', 'Cicli: for, while, for...of', [
    {
      heading: 'for classico',
      body: 'for (inizializzazione; condizione; incremento): il ciclo più controllabile. Per gli array la condizione è i < arr.length.',
      code: 'for (let i = 0; i < a.length; i++) { console.log(a[i]); }',
    },
    {
      heading: 'while e do...while',
      body: 'while ripete finché la condizione è vera (può non partire mai); do...while esegue il corpo almeno una volta.',
    },
    {
      heading: 'for...of',
      body: 'Scorre direttamente i valori di un iterabile: niente indici, niente off-by-one. for...in invece scorre le chiavi — non usarlo sugli array.',
    },
    {
      heading: 'break e continue',
      body: 'break esce subito dal ciclo; continue salta all\'iterazione successiva.',
    },
    {
      heading: 'Errori comuni',
      body: 'i <= length (un elemento in più → undefined); while senza incremento (infinito); modificare l\'array mentre lo scorri.',
    },
  ]),
  dd('functions', 'Funzioni', [
    {
      heading: 'Dichiarare e chiamare',
      body: 'function nome(a, b) { corpo }. Si invoca con nome(argomenti): senza () ottieni la funzione stessa, non il risultato.',
      code: 'function somma(a, b) {\n  return a + b;\n}\nsomma(2, 3); // 5',
    },
    {
      heading: 'return',
      body: 'return produce il risultato e TERMINA la funzione: il codice dopo non viene eseguito. Senza return la funzione restituisce undefined.',
    },
    {
      heading: 'Parametri e argomenti',
      body: 'I parametri sono i nomi nella definizione; gli argomenti i valori passati. Argomenti mancanti → undefined; si risolve con i default: function f(x = 0).',
    },
    {
      heading: 'Errori comuni',
      body: 'Dimenticare il return; chiamare senza (); codice dopo return; confondere parametri e argomenti.',
    },
  ]),
  dd('scope-basics', 'Scope: dove vivono le variabili', [
    {
      heading: 'Scope di blocco',
      body: 'let e const esistono solo tra le graffe che le contengono: if, for, { } isolato. Fuori → ReferenceError.',
      code: 'if (true) { let x = 1; }\nconsole.log(x); // ReferenceError',
    },
    {
      heading: 'Scope di funzione (var)',
      body: 'var ignora i blocchi e vale in tutta la funzione (o globalmente). Per questo si preferisce let.',
    },
    {
      heading: 'Shadowing',
      body: 'Una variabile interna con lo stesso nome "fa ombra" a quella esterna: dentro il blocco vince la più vicina; fuori l\'esterna è intatta.',
      code: 'let n = 1;\n{ let n = 2; console.log(n); } // 2\nconsole.log(n); // 1',
    },
    {
      heading: 'TDZ',
      body: 'Prima della riga di dichiarazione, let/const sono nella Temporal Dead Zone: leggerle lancia ReferenceError (non undefined come var).',
    },
  ]),
  dd('arrays-basics', 'Array: indici e metodi base', [
    {
      heading: 'Indici e length',
      body: 'Gli indici partono da 0: a[0] primo, a[a.length - 1] ultimo. a[a.length] è sempre undefined — il classico off-by-one.',
    },
    {
      heading: 'Aggiungere e togliere',
      body: 'push/pop in coda, unshift/shift in testa. push ritorna la nuova length; pop e shift ritornano l\'elemento rimosso.',
      code: 'const a = [1, 2];\na.push(3); // a = [1,2,3], ritorna 3\na.pop();   // ritorna 3, a = [1,2]',
    },
    {
      heading: 'Cercare',
      body: 'includes(x) → true/false (presenza); indexOf(x) → posizione o -1. Per la sola presenza preferisci includes.',
    },
    {
      heading: 'Errori comuni',
      body: 'Aspettarsi un errore per indici fuori range (undefined); confondere il valore ritornato da push/pop.',
    },
  ]),
  dd('objects-basics', 'Oggetti: chiavi e valori', [
    {
      heading: 'Dot vs bracket',
      body: 'obj.chiave per chiavi note e valide; obj["chiave"] quando la chiave è in una variabile o contiene spazi/simboli.',
      code: 'const k = "nome";\nobj[k]   // legge obj["nome"]\nobj.k    // cerca la chiave letterale "k"',
    },
    {
      heading: 'Mutare le proprietà',
      body: 'obj.nuova = valore aggiunge; delete obj.chiave rimuove. Le proprietà mancanti si leggono come undefined.',
    },
    {
      heading: 'Metodi e in',
      body: 'Una funzione come proprietà è un metodo: si invoca con (). "chiave" in oggetto verifica se esiste.',
      code: '"nome" in { nome: "Ada" } // true',
    },
    {
      heading: 'Errori comuni',
      body: 'obj.variabile invece di obj[variabile]; metodo senza (); confondere chiave e valore.',
    },
  ]),
  dd('array-methods', 'map, filter, find, reduce', [
    {
      heading: 'map',
      body: 'Trasforma ogni elemento e ritorna un nuovo array della stessa lunghezza. La callback deve ritornare il valore trasformato.',
      code: '[1,2,3].map(n => n * 2) // [2,4,6]',
    },
    {
      heading: 'filter e find',
      body: 'filter tiene gli elementi che superano il test (nuovo array, anche vuoto); find ritorna il PRIMO che lo supera (o undefined).',
    },
    {
      heading: 'reduce',
      body: 'Comprime l\'array in un valore: reduce((acc, el) => ..., iniziale). Dai sempre il valore iniziale.',
      code: '[1,2,3].reduce((s, n) => s + n, 0) // 6',
    },
    {
      heading: 'forEach non è map',
      body: 'forEach esegue side-effect e ritorna undefined: non usarlo per costruire array.',
    },
    {
      heading: 'Non mutano',
      body: 'map/filter/find/reduce lasciano l\'array originale intatto — a differenza di push, sort, splice.',
    },
  ]),
  dd('destructuring', 'Destructuring', [
    {
      heading: 'Oggetti',
      body: 'const { a, b } = obj crea le variabili a e b dalle proprietà omonime. Rinomina con { a: nuovoNome }, default con { a = 1 }.',
      code: 'const { nome, eta = 18 } = utente;',
    },
    {
      heading: 'Array',
      body: 'const [x, y] = arr estrae per posizione. La virgola vuota salta elementi: const [, secondo] = arr.',
      code: 'const [primo, , terzo] = [1, 2, 3];',
    },
    {
      heading: 'Nei parametri',
      body: 'function f({ nome, eta }) destruttura l\'argomento: pattern potentissimo per le "options".',
    },
    {
      heading: 'Errori comuni',
      body: 'Invertire la rinomina ({ a: b } crea b, non a); destrutturare null/undefined (TypeError); pensare che il default scatti con null (scatta solo con undefined).',
    },
  ]),
  dd('closures-advanced', 'Closure avanzate', [
    {
      heading: "Cos'è una closure",
      body: 'Una funzione che mantiene accesso alle variabili dello scope lessicale in cui è stata definita, anche quando quello scope è finito.',
      code: 'function counter() {\n  let n = 0;\n  return () => ++n;\n}',
    },
    {
      heading: 'Cattura la variabile, non il valore',
      body: 'La closure vede la variabile viva: se cambia, vede il nuovo valore.',
    },
    {
      heading: 'Stato privato',
      body: 'Ogni chiamata della factory crea uno scope nuovo: due counter() hanno n indipendenti. È incapsulamento senza classi.',
    },
    {
      heading: 'Il problema classico dei cicli',
      body: 'Con var in un for tutte le closure condividono la stessa variabile (trovano il valore finale). let crea un binding per iterazione: ogni closure ha il suo i.',
      code: 'for (let i = 0; i < 3; i++) { fns.push(() => i); } // 0, 1, 2',
    },
  ]),
];

const byId = new Map(deepDives.map((d) => [d.id, d]));

export function getDeepDive(ref: string): DeepDive | undefined {
  return byId.get(ref);
}
