// GENERATED FILE — non modificare a mano: rigenerato da `npm run content:approve`.
import type { BankQuestion } from './types.js';

export const bankQuestions: BankQuestion[] = [
  {
    "id": "array-methods-fb-0001",
    "topicId": "array-methods",
    "subtopicId": "array-methods-map",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "map",
      "trasformazione elemento"
    ],
    "prompt": "Il seguente codice dovrebbe restituire un array con i numeri raddoppiati, ma invece stampa [ undefined, undefined, undefined ]. Qual è la causa?",
    "code": "const numeri = [2, 4, 6];\nconst doppi = numeri.map(function(n) {\n  n * 2;\n});\nconsole.log(doppi);",
    "options": [
      {
        "id": "a",
        "text": "La callback non restituisce un valore esplicitamente"
      },
      {
        "id": "b",
        "text": "map modifica l'array originale invece di restituirne uno nuovo"
      },
      {
        "id": "c",
        "text": "La funzione deve accettare due argomenti invece di uno"
      },
      {
        "id": "d",
        "text": "Il metodo corretto sarebbe forEach anziché map"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Se la callback di map non restituisce nulla, nell'array risultante ci saranno undefined.",
      "whyCorrect": "L'assenza di return nella funzione di callback fa sì che ogni chiamata restituisca undefined; map raccoglie questi undefined e li mette nel nuovo array.",
      "whyOthersWrong": {
        "b": "map non muta l'array originale ma ne crea sempre uno nuovo; la modifica dell'array di partenza non c'entra con l'output undefined.",
        "c": "La callback di map può accettare uno, due o tre argomenti, ma ne basta uno solo; il problema è la mancanza di return, non il numero di parametri.",
        "d": "forEach serve a iterare, ma non restituisce un array; il problema non è la scelta del metodo, ma come viene scritta la callback di map."
      },
      "concept": "Return nella callback di map",
      "commonMistake": "Dimenticare il return nella funzione passata a map.",
      "example": "[2, 4, 6].map(n => n * 2)"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:23.573Z"
  },
  {
    "id": "array-methods-fb-0002",
    "topicId": "array-methods",
    "subtopicId": "array-methods-map",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "map",
      "immutabilità",
      "output"
    ],
    "prompt": "Il codice dovrebbe stampare un array con i nomi in maiuscolo, ma invece stampa ['mario', 'luigi', 'peach']. Qual è l'errore?",
    "code": "const nomi = ['mario', 'luigi', 'peach'];\nnomi.map(nome => nome.toUpperCase());\nconsole.log(nomi);",
    "options": [
      {
        "id": "a",
        "text": "map non modifica l'array originale"
      },
      {
        "id": "b",
        "text": "toUpperCase restituisce sempre undefined"
      },
      {
        "id": "c",
        "text": "La callback di map è scritta in modo errato"
      },
      {
        "id": "d",
        "text": "map va usato solo su array di numeri"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "map restituisce un nuovo array, non muta quello originale.",
      "whyCorrect": "map non muta l'array su cui viene chiamato: produce un nuovo array con i risultati, ma qui non viene usato e quindi nomi rimane uguale.",
      "whyOthersWrong": {
        "b": "toUpperCase restituisce la stringa in maiuscolo e non undefined; il problema è che il risultato di map viene ignorato.",
        "c": "La callback di map è corretta: nome => nome.toUpperCase() restituisce la stringa in maiuscolo. Il problema è l'uso del risultato.",
        "d": "map si usa con array di qualsiasi tipo di elemento, non solo numeri; non è questo il limite rilevante qui."
      },
      "concept": "Immutabilità di map",
      "commonMistake": "Aspettarsi che map modifichi l'array originale.",
      "example": "const maiuscoli = nomi.map(n => n.toUpperCase());"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:23.574Z"
  },
  {
    "id": "array-methods-fb-0003",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "filter",
      "condizione"
    ],
    "prompt": "Questo codice dovrebbe restituire tutti i numeri maggiori di 5, ma invece restituisce sempre un array vuoto. Dove sta l'errore?",
    "code": "const numeri = [3, 8, 1, 6];\nconst grandi = numeri.filter(function(n) {\n  n > 5;\n});\nconsole.log(grandi);",
    "options": [
      {
        "id": "a",
        "text": "La callback non restituisce il valore di confronto"
      },
      {
        "id": "b",
        "text": "filter richiede una funzione freccia"
      },
      {
        "id": "c",
        "text": "filter non si usa su numeri"
      },
      {
        "id": "d",
        "text": "La condizione va scritta tra parentesi quadre"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Se la callback di filter non restituisce nulla, nessun elemento viene tenuto.",
      "whyCorrect": "La funzione di callback non restituisce espressamente il valore booleano della condizione, quindi filter riceve undefined e nessun elemento passa il filtro.",
      "whyOthersWrong": {
        "b": "filter accetta sia funzioni tradizionali che frecce; non è obbligatorio usare una funzione freccia.",
        "c": "filter si usa perfettamente anche con array di numeri; il tipo degli elementi non è rilevante.",
        "d": "La condizione va espressa come espressione booleana, non tra parentesi quadre; non è un array di condizioni."
      },
      "concept": "Return nella callback di filter",
      "commonMistake": "Dimenticare il return nella funzione passata a filter.",
      "example": "numeri.filter(n => n > 5)"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:23.574Z"
  },
  {
    "id": "array-methods-fb-0004",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "find",
      "differenza tra find e filter"
    ],
    "prompt": "Il codice dovrebbe restituire tutti i prodotti con prezzo superiore a 20, ma invece restituisce solo uno di essi (il primo che trova). Perché?",
    "code": "const prodotti = [\n  { nome: 'penna', prezzo: 10 },\n  { nome: 'libro', prezzo: 25 },\n  { nome: 'zaino', prezzo: 30 }\n];\nconst costosi = prodotti.find(p => p.prezzo > 20);\nconsole.log(costosi);",
    "options": [
      {
        "id": "a",
        "text": "find restituisce solo il primo elemento trovato"
      },
      {
        "id": "b",
        "text": "La condizione è scritta in modo sbagliato"
      },
      {
        "id": "c",
        "text": "find non si usa sugli oggetti"
      },
      {
        "id": "d",
        "text": "Serve una callback con due parametri"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "find restituisce solo il primo elemento che passa la condizione.",
      "whyCorrect": "find restituisce il primo elemento che soddisfa la condizione, mentre per restituire tutti serve filter.",
      "whyOthersWrong": {
        "b": "La condizione è corretta e filtra per prezzo maggiore di 20; il comportamento dipende dal metodo usato.",
        "c": "find si usa anche su array di oggetti, purché la callback ritorni un valore booleano.",
        "d": "La callback di find può prendere anche un solo parametro; non è richiesto il secondo parametro."
      },
      "concept": "Differenza tra find e filter",
      "commonMistake": "Usare find al posto di filter per ottenere più risultati.",
      "example": "prodotti.filter(p => p.prezzo > 20)"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:23.574Z"
  },
  {
    "id": "array-methods-fb-0005",
    "topicId": "array-methods",
    "subtopicId": "array-methods-reduce",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "reduce",
      "valore iniziale",
      "array vuoto"
    ],
    "prompt": "Il codice dovrebbe restituire la somma dei numeri, ma lanciando un errore se l'array è vuoto. Perché succede?",
    "code": "const numeri = [];\nconst somma = numeri.reduce((acc, n) => acc + n);\nconsole.log(somma);",
    "options": [
      {
        "id": "a",
        "text": "Manca un valore iniziale per reduce"
      },
      {
        "id": "b",
        "text": "La callback di reduce è scritta male"
      },
      {
        "id": "c",
        "text": "reduce non funziona con array di numeri"
      },
      {
        "id": "d",
        "text": "Serve una variabile globale per l'accumulatore"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "reduce senza valore iniziale su array vuoto lancia TypeError.",
      "whyCorrect": "reduce senza secondo argomento come valore iniziale non sa cosa usare per l'accumulatore se l'array è vuoto, perciò lancia un TypeError.",
      "whyOthersWrong": {
        "b": "La callback è corretta: acc + n somma i numeri; il problema è l'assenza del valore iniziale.",
        "c": "reduce è stato progettato per funzionare proprio con array di numeri (o di altro tipo).",
        "d": "Non serve nessuna variabile globale: reduce gestisce internamente l'accumulatore."
      },
      "concept": "reduce e valore iniziale",
      "commonMistake": "Omettere il valore iniziale di reduce su un array che può essere vuoto.",
      "example": "numeri.reduce((acc, n) => acc + n, 0)"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:23.575Z"
  },
  {
    "id": "array-methods-fb-0006",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "filter",
      "immutabilità"
    ],
    "prompt": "Il codice dovrebbe rimuovere le parole più corte di 5 lettere dall'array, ma invece l'array originale rimane invariato. Quale spiegazione è corretta?",
    "code": "const parole = ['casa', 'scuola', 'libro', 'telefono'];\nparole.filter(p => p.length >= 5);\nconsole.log(parole);",
    "options": [
      {
        "id": "a",
        "text": "filter non modifica l'array originale"
      },
      {
        "id": "b",
        "text": "La condizione nella callback non funziona"
      },
      {
        "id": "c",
        "text": "filter non può essere usato su stringhe"
      },
      {
        "id": "d",
        "text": "Serve il return nella callback"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "filter restituisce un nuovo array e non muta quello originale.",
      "whyCorrect": "filter restituisce un nuovo array con gli elementi filtrati; se non si assegna il risultato a una variabile, l'array di partenza resta invariato.",
      "whyOthersWrong": {
        "b": "La condizione nella callback funziona correttamente: p.length >= 5 filtra bene le parole con almeno 5 lettere.",
        "c": "filter funziona su qualsiasi array, incluse stringhe come elementi.",
        "d": "La callback è una funzione freccia che restituisce implicitamente il risultato della condizione, quindi il return non manca."
      },
      "concept": "Immutabilità di filter",
      "commonMistake": "Aspettarsi che filter modifichi l'array originale.",
      "example": "const soloLunghe = parole.filter(p => p.length >= 5);"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:23.575Z"
  },
  {
    "id": "array-methods-fb-0007",
    "topicId": "array-methods",
    "subtopicId": "array-methods-map",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "individuare return mancanti",
      "debuggare trasformazioni con map"
    ],
    "prompt": "Questo codice dovrebbe creare un nuovo array con le lunghezze di ciascuna parola, ma stampa [ undefined, undefined, undefined ]. Qual è il problema?",
    "code": "const parole = [\"cane\", \"gatto\", \"topo\"];\nconst lunghezze = parole.map((parola) => {\n  parola.length;\n});\nconsole.log(lunghezze);",
    "options": [
      {
        "id": "a",
        "text": "Manca il return nella funzione di map"
      },
      {
        "id": "b",
        "text": "Serve forEach invece di map"
      },
      {
        "id": "c",
        "text": "Bisogna usare parole.lunghezza invece di parola.length"
      },
      {
        "id": "d",
        "text": "Map modifica accidentalmente l’array originale"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Nel corpo della callback manca il return: senza di esso, ogni iterazione restituisce undefined invece della lunghezza della parola.",
      "whyCorrect": "Nella callback passata a map, senza un return esplicito, la funzione restituisce undefined per ogni elemento. Per ottenere le lunghezze bisogna scrivere `return parola.length;` oppure usare la sintassi compatta senza parentesi graffe.",
      "whyOthersWrong": {
        "b": "forEach non restituisce alcun array, quindi anche sostituendo map con forEach non si otterrebbe il risultato voluto, ma semplicemente undefined.",
        "c": "Non esiste la proprietà lunghezza su parole; bisogna accedere a length su ciascuna parola, come già avviene. La proprietà corretta è parola.length.",
        "d": "map non muta mai l’array originale, ma restituisce un nuovo array. Il problema non è la mutazione, ma il valore restituito dalla callback."
      },
      "concept": "return nella callback di map",
      "commonMistake": "Scrivere una callback con le graffe ma senza return, pensando che l’ultima espressione venga restituita automaticamente.",
      "example": "[\"ciao\"].map(parola => parola.length) // [4]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:27.717Z"
  },
  {
    "id": "array-methods-fg-0002",
    "topicId": "array-methods",
    "subtopicId": "array-methods-map",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "usare map"
    ],
    "prompt": "Completa la callback per ottenere un array di stringhe 'valore: X'.",
    "code": "const valori = [5, 6];\nconst stringhe = valori.map(v => ___ );\nconsole.log(stringhe);",
    "options": [
      {
        "id": "a",
        "text": "`valore: ${v}`"
      },
      {
        "id": "b",
        "text": "'valore: v'"
      },
      {
        "id": "c",
        "text": "'valore:' + valori"
      },
      {
        "id": "d",
        "text": "v + ' : valore'"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le stringhe dinamiche si creano con il template literal `${v}`.",
      "whyCorrect": "L'espressione `valore: ${v}` inserisce il valore attuale nella stringa come richiesto.",
      "whyOthersWrong": {
        "b": "Le virgolette singole racchiudono solo il testo letterale, quindi v non viene interpolato.",
        "c": "valori rappresenta l'intero array, non il singolo elemento v, e la sintassi non è richiesta.",
        "d": "L'ordine è sbagliato: la stringa risultante sarebbe '5 : valore' invece di 'valore: 5'."
      },
      "concept": "map: template literal",
      "commonMistake": "Dimenticare l'interpolazione per inserire variabili nelle stringhe.",
      "example": "[1, 2].map(x => `valore: ${x}`)"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:17.747Z"
  },
  {
    "id": "array-methods-fg-0003",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "usare find"
    ],
    "prompt": "Completa la funzione per ottenere il primo nome con più di 4 lettere.",
    "code": "const nomi = [\"Ana\", \"Marco\", \"Lisa\"];\nconst risultato = nomi.find(nome => ___ );\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "nome.length > 4"
      },
      {
        "id": "b",
        "text": "nome.length >= 4"
      },
      {
        "id": "c",
        "text": "nome.length == 4"
      },
      {
        "id": "d",
        "text": "nome.length < 4"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "find restituisce il primo elemento che rispetta la condizione.",
      "whyCorrect": "nome.length > 4 trova il primo nome con più di 4 lettere, ovvero 'Marco'.",
      "whyOthersWrong": {
        "b": "nome.length >= 4 includerebbe anche 'Lisa', che però non ha più di 4 lettere.",
        "c": "nome.length == 4 trova solo 'Lisa', non nomi più lunghi di 4 lettere.",
        "d": "nome.length < 4 trova solo 'Ana', che non soddisfa il criterio richiesto."
      },
      "concept": "find: prima corrispondenza",
      "commonMistake": "Usare >= al posto di > o confondere find con filter.",
      "example": "[\"Ada\", \"Marco\", \"Lisa\"].find(n => n.length > 4)"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:17.748Z"
  },
  {
    "id": "array-methods-fg-0005",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "filtrare array",
      "usare filter"
    ],
    "prompt": "Completa la callback per ottenere solo i numeri maggiori di 5.",
    "code": "const numeri = [2, 6, 8, 3];\nconst grandi = numeri.filter(n => ___ );\nconsole.log(grandi);",
    "options": [
      {
        "id": "a",
        "text": "n > 5"
      },
      {
        "id": "b",
        "text": "n >= 8"
      },
      {
        "id": "c",
        "text": "n < 5"
      },
      {
        "id": "d",
        "text": "n === 5"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "`n > 5` seleziona i numeri desiderati con filter.",
      "whyCorrect": "`filter` passa solo gli elementi per cui la condizione è vera: qui, i maggiori di 5 sono 6 e 8.",
      "whyOthersWrong": {
        "b": "`n >= 8` filtra solo gli 8, quindi il risultato sarebbe [8], non tutti i numeri maggiori di 5.",
        "c": "`n < 5` seleziona quelli minori di 5 (2 e 3), il contrario di quanto richiesto.",
        "d": "`n === 5` prende solo i 5, che nell'array non ci sono: risultato []."
      },
      "concept": "filter: selezione tramite condizione",
      "commonMistake": "Sbagliare la condizione logica nella callback di filter.",
      "example": "[2, 6, 8, 3].filter(n => n > 5) // [6, 8]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:29.631Z"
  },
  {
    "id": "array-methods-fg-0006",
    "topicId": "array-methods",
    "subtopicId": "array-methods-reduce",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "usare reduce",
      "aggregare valori"
    ],
    "prompt": "Completa la chiamata per calcolare la somma dei numeri con reduce.",
    "code": "const numeri = [1, 2, 3];\nconst somma = numeri.reduce((totale, n) => totale + n, ___ );\nconsole.log(somma);",
    "options": [
      {
        "id": "a",
        "text": "0"
      },
      {
        "id": "b",
        "text": "1"
      },
      {
        "id": "c",
        "text": "undefined"
      },
      {
        "id": "d",
        "text": "null"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il valore iniziale corretto per la somma è 0.",
      "whyCorrect": "Passando 0 come valore iniziale, la somma si calcola partendo da zero e include tutti gli elementi.",
      "whyOthersWrong": {
        "b": "Con 1 come iniziale il risultato sarebbe maggiore di quanto atteso (aggiunge 1 in più).",
        "c": "Se passi undefined come iniziale, il primo elemento viene usato come accumulatore ma non va bene per somme generiche, e su array vuoti causa errore.",
        "d": "Usare null non è corretto: la somma parte da null e i risultati sarebbero errati (null + n = NaN)."
      },
      "concept": "reduce: valore iniziale dell'accumulatore",
      "commonMistake": "Omettere o usare il valore iniziale sbagliato in reduce.",
      "example": "[1, 2, 3].reduce((a, n) => a + n, 0) // 6"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:29.631Z"
  },
  {
    "id": "array-methods-fg-0007",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "usare find",
      "ricercare elemento"
    ],
    "prompt": "Completa la chiamata per trovare il primo nome di 4 lettere.",
    "code": "const nomi = ['Luca', 'Anna', 'Paolo'];\nconst trovato = nomi.find(nome => ___ );\nconsole.log(trovato);",
    "options": [
      {
        "id": "a",
        "text": "nome.length === 4"
      },
      {
        "id": "b",
        "text": "nome.length > 4"
      },
      {
        "id": "c",
        "text": "nome.length !== 4"
      },
      {
        "id": "d",
        "text": "nome.length < 4"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La condizione corretta è `nome.length === 4`.",
      "whyCorrect": "Con `find`, serve la condizione esatta che seleziona solo i nomi di 4 lettere, quindi 'Luca'.",
      "whyOthersWrong": {
        "b": "`nome.length > 4` filtra solo i nomi più lunghi, quindi 'Paolo', che però ha 5 lettere.",
        "c": "`nome.length !== 4` esclude proprio i nomi di 4 lettere, restituendo invece un nome diverso o undefined.",
        "d": "`nome.length < 4` selezionerebbe solo nomi più corti, che in questo array non ci sono."
      },
      "concept": "find: trovare il primo che soddisfa una condizione",
      "commonMistake": "Confondere la condizione e ottenere l'elemento sbagliato.",
      "example": "['Luca', 'Anna', 'Paolo'].find(n => n.length === 4) // 'Luca'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:29.631Z"
  },
  {
    "id": "array-methods-po-0008",
    "topicId": "array-methods",
    "subtopicId": "array-methods-map",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "map",
      "trasformazione elemento per elemento"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const parole = [\"gatto\", \"cane\", \"lupo\"];\nconst maiuscole = parole.map((p) => p.toUpperCase());\nconsole.log(maiuscole);",
    "options": [
      {
        "id": "a",
        "text": "[ 'GATTO', 'CANE', 'LUPO' ]"
      },
      {
        "id": "b",
        "text": "[ 'gatto', 'cane', 'lupo' ]"
      },
      {
        "id": "c",
        "text": "[ 'Gatto', 'Cane', 'Lupo' ]"
      },
      {
        "id": "d",
        "text": "[ undefined, undefined, undefined ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il metodo map applica `.toUpperCase()` a ogni parola e restituisce un nuovo array con tutte le parole in maiuscolo.",
      "whyCorrect": "Il metodo `map` chiama la funzione passata su ogni elemento, restituendo un array dove ogni parola è stata convertita in maiuscolo tramite `toUpperCase()`.",
      "whyOthersWrong": {
        "b": "Senza una trasformazione, `map` restituirebbe l'array originale, ma qui ogni elemento viene realmente trasformato in maiuscolo.",
        "c": "La funzione `toUpperCase()` restituisce tutte le lettere maiuscole, non solo l'iniziale.",
        "d": "Questo succede solo se la funzione non restituisce nulla (dimenticando il return), ma qui il valore è ritornato correttamente."
      },
      "concept": "map e trasformazione degli elementi",
      "commonMistake": "Dimenticare che la funzione di map deve ritornare il valore trasformato.",
      "example": "[1,2,3].map(n => n * 2) // [2,4,6]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:47.978Z"
  },
  {
    "id": "array-methods-po-0009",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "filter",
      "selezione condizionale"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const numeri = [3, 7, 2, 9, 5];\nconst maggioriDiCinque = numeri.filter((n) => n > 5);\nconsole.log(maggioriDiCinque);",
    "options": [
      {
        "id": "a",
        "text": "[ 7, 9 ]"
      },
      {
        "id": "b",
        "text": "[ 7, 2, 9, 5 ]"
      },
      {
        "id": "c",
        "text": "[ 9 ]"
      },
      {
        "id": "d",
        "text": "[ 3, 7, 2, 9, 5 ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Filter restituisce un array con solo gli elementi che soddisfano la condizione `n > 5`, cioè 7 e 9.",
      "whyCorrect": "La funzione di callback di `filter` tiene solo i numeri maggiori di 5. Nell'array, questi sono 7 e 9.",
      "whyOthersWrong": {
        "b": "Questa opzione include numeri che non sono maggiori di 5, come 2 e 5.",
        "c": "`filter` seleziona tutti gli elementi che soddisfano la condizione, non solo il primo.",
        "d": "Qui si mostra l'array originale, ma filter restituisce solo gli elementi che rispettano la condizione."
      },
      "concept": "filter per selezionare elementi",
      "commonMistake": "Confondere filter con find e aspettarsi solo il primo elemento.",
      "example": "[1,2,3,4].filter(x => x % 2 === 0) // [2, 4]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:47.978Z"
  },
  {
    "id": "array-methods-po-0010",
    "topicId": "array-methods",
    "subtopicId": "array-methods-map",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "map",
      "uso dell'indice"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const lettere = [\"a\", \"b\", \"c\"];\nconst conIndice = lettere.map((l, i) => l + i);\nconsole.log(conIndice);",
    "options": [
      {
        "id": "a",
        "text": "[ 'a0', 'b1', 'c2' ]"
      },
      {
        "id": "b",
        "text": "[ 'a1', 'b2', 'c3' ]"
      },
      {
        "id": "c",
        "text": "[ 0, 1, 2 ]"
      },
      {
        "id": "d",
        "text": "[ 'a', 'b', 'c' ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Map passa anche l'indice all'interno della funzione, quindi ogni lettera viene concatenata al suo indice.",
      "whyCorrect": "La funzione di `map` aggiunge all'elemento corrente il suo indice, quindi si ottiene 'a0', 'b1' e 'c2'.",
      "whyOthersWrong": {
        "b": "Gli indici in JavaScript partono da 0, quindi 'a1' sarebbe solo se l'indice partisse da 1.",
        "c": "Qui viene restituito solo l'indice, ma la funzione concatena lettera e indice.",
        "d": "Questo sarebbe il risultato se la funzione non facesse alcuna trasformazione."
      },
      "concept": "map e parametri callback",
      "commonMistake": "Dimenticare che il secondo argomento della funzione di map è l'indice, che parte da 0.",
      "example": "[ 'x', 'y' ].map((v,i) => v+i) // [ 'x0', 'y1' ]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:47.979Z"
  },
  {
    "id": "array-methods-po-0011",
    "topicId": "array-methods",
    "subtopicId": "array-methods-reduce",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "reduce",
      "valore iniziale",
      "concatenazione stringhe"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const nomi = [\"Anna\", \"Luca\", \"Rita\"];\nconst frase = nomi.reduce((acc, nome) => acc + \"-\" + nome);\nconsole.log(frase);",
    "options": [
      {
        "id": "a",
        "text": "Anna-Luca-Rita"
      },
      {
        "id": "b",
        "text": "undefined-Anna-Luca-Rita"
      },
      {
        "id": "c",
        "text": "AnnaRita"
      },
      {
        "id": "d",
        "text": "Luca-Rita"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Reduce concatena i nomi separandoli con un trattino, iniziando dal primo elemento (se non viene fornito valore iniziale).",
      "whyCorrect": "Senza valore iniziale, acc prende il primo elemento, poi concatena gli altri con il trattino, risultando in 'Anna-Luca-Rita'.",
      "whyOthersWrong": {
        "b": "Il valore iniziale non è undefined: reduce usa il primo elemento come base se non specificato.",
        "c": "Riduce concatena tutti i nomi, non solo il primo e l'ultimo. Il trattino viene sempre aggiunto.",
        "d": "Questa sarebbe la concatenazione solo degli ultimi due nomi, non di tutti."
      },
      "concept": "reduce senza valore iniziale",
      "commonMistake": "Pensare che reduce inizi con undefined o salti elementi.",
      "example": "[\"a\",\"b\",\"c\"].reduce((a,b) => a + \",\" + b) // 'a,b,c'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:47.979Z"
  },
  {
    "id": "array-methods-po-0012",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "filter",
      "condizione su proprietà oggetto"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const libri = [\n  { titolo: \"JS Facile\", pagine: 120 },\n  { titolo: \"JS Avanzato\", pagine: 320 },\n  { titolo: \"CSS\", pagine: 200 }\n];\nconst voluminosi = libri.filter(libro => libro.pagine > 150);\nconsole.log(voluminosi.map(libro => libro.titolo));",
    "options": [
      {
        "id": "a",
        "text": "[ 'JS Avanzato', 'CSS' ]"
      },
      {
        "id": "b",
        "text": "[ 'JS Facile', 'JS Avanzato', 'CSS' ]"
      },
      {
        "id": "c",
        "text": "[ 'JS Avanzato' ]"
      },
      {
        "id": "d",
        "text": "[ 'CSS' ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Filter seleziona i libri con più di 150 pagine, quindi solo 'JS Avanzato' e 'CSS' vengono inclusi nell'output.",
      "whyCorrect": "Vengono selezionati i libri con più di 150 pagine: 'JS Avanzato' (320) e 'CSS' (200). 'JS Facile' ha solo 120 pagine.",
      "whyOthersWrong": {
        "b": "Questa opzione include anche 'JS Facile', che non supera le 150 pagine.",
        "c": "Questa opzione considera solo 'JS Avanzato', ma anche 'CSS' ha più di 150 pagine.",
        "d": "'CSS' è incluso, ma manca anche 'JS Avanzato', che rispetta la condizione."
      },
      "concept": "filter su array di oggetti",
      "commonMistake": "Dimenticare di applicare la condizione corretta su una proprietà dell'oggetto.",
      "example": "[{a:1},{a:2}].filter(o => o.a>1) // [{a:2}]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:47.979Z"
  },
  {
    "id": "array-methods-po-0014",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "filter",
      "predicate",
      "array"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const studenti = [\n  { nome: 'Anna', voto: 28 },\n  { nome: 'Luca', voto: 18 },\n  { nome: 'Sara', voto: 30 }\n];\nconst promossi = studenti.filter(studente => studente.voto >= 28);\nconsole.log(promossi.length);",
    "options": [
      {
        "id": "a",
        "text": "3"
      },
      {
        "id": "b",
        "text": "1"
      },
      {
        "id": "c",
        "text": "2"
      },
      {
        "id": "d",
        "text": "0"
      }
    ],
    "correctOptionId": "c",
    "explanation": {
      "short": "La funzione filter seleziona gli oggetti con voto almeno 28, quindi due studenti risultano promossi.",
      "whyCorrect": "Sia 'Anna' (28) che 'Sara' (30) hanno voto >= 28, quindi filter restituisce due elementi: promossi.length vale 2.",
      "whyOthersWrong": {
        "a": "Filter restituisce solo gli elementi che soddisfano la condizione, non tutti. Tre sarebbe la lunghezza senza alcun filtro.",
        "b": "Solo uno studente ha 30, ma la condizione include anche chi ha 28, quindi sono due.",
        "d": "Ci sono due studenti con voto almeno 28: il risultato non può essere zero."
      },
      "concept": "filter su array di oggetti",
      "commonMistake": "Credere che filter cerchi solo valori strettamente maggiori, o solo il massimo.",
      "example": "[{v:2},{v:5}].filter(x => x.v > 2) // [{v:5}]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:54.723Z"
  },
  {
    "id": "array-methods-fg-0019",
    "topicId": "array-methods",
    "subtopicId": "array-methods-map",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "array-map",
      "callback-function"
    ],
    "prompt": "Completa la callback per ottenere un nuovo array con ogni numero aumentato di 10.",
    "code": "const numeri = [2, 4, 6];\nconst risultato = numeri.map(num => ___);\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "num + 10"
      },
      {
        "id": "b",
        "text": "numeri + 10"
      },
      {
        "id": "c",
        "text": "num => num + 10"
      },
      {
        "id": "d",
        "text": "num * 10"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Per trasformare ogni elemento, va restituito `num + 10` nella callback di map.",
      "whyCorrect": "La funzione map applica la callback a ogni elemento dell'array, quindi scrivere `num + 10` restituisce per ogni elemento il valore desiderato incrementato di 10.",
      "whyOthersWrong": {
        "b": "Qui si usa `numeri`, che rappresenta l'intero array, non il singolo elemento. La callback deve usare il parametro ricevuto (`num`).",
        "c": "Qui si tenta di restituire una funzione invece di un valore numerico. Map si aspetta che la callback restituisca un valore, non una funzione.",
        "d": "Questo moltiplica ogni numero per 10, non lo incrementa di 10 come richiesto dal prompt."
      },
      "concept": "Sintassi di map con callback",
      "commonMistake": "Usare l'intero array o una funzione invece di restituire il valore trasformato.",
      "example": "[1, 2].map(x => x + 10) // [11, 12]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:46:32.231Z"
  },
  {
    "id": "array-methods-fg-0020",
    "topicId": "array-methods",
    "subtopicId": "array-methods-filter-find",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "array-filter",
      "callback-function"
    ],
    "prompt": "Completa la condizione nella callback per filtrare solo i numeri dispari.",
    "code": "const numeri = [1, 2, 3, 4];\nconst dispari = numeri.filter(n => ___);\nconsole.log(dispari);",
    "options": [
      {
        "id": "a",
        "text": "n % 2 === 1"
      },
      {
        "id": "b",
        "text": "n % 2 == 0"
      },
      {
        "id": "c",
        "text": "n > 1"
      },
      {
        "id": "d",
        "text": "n != 3"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il filtro per i numeri dispari è `n % 2 === 1`.",
      "whyCorrect": "L'operatore modulo restituisce il resto della divisione, quindi per i numeri dispari il resto di n diviso 2 è 1.",
      "whyOthersWrong": {
        "b": "Questa condizione seleziona i numeri pari, perché il resto della divisione per 2 è zero solo per i numeri pari.",
        "c": "Questo seleziona solo i numeri maggiori di 1, includendo sia pari che dispari, quindi non filtra i dispari.",
        "d": "Questa condizione esclude solo il numero 3, ma non filtra tutti e soli i numeri dispari."
      },
      "concept": "Uso di filter con condizioni",
      "commonMistake": "Confondere il resto per i numeri pari e dispari.",
      "example": "[1,2,3,4].filter(n => n % 2 === 1) // [1,3]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:46:32.232Z"
  },
  {
    "id": "array-methods-fg-0021",
    "topicId": "array-methods",
    "subtopicId": "array-methods-reduce",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "array-reduce",
      "accumulatore"
    ],
    "prompt": "Completa la chiamata per calcolare il prodotto di tutti i numeri dell'array.",
    "code": "const valori = [2, 3, 4];\nconst prodotto = valori.reduce((acc, n) => ___, 1);\nconsole.log(prodotto);",
    "options": [
      {
        "id": "a",
        "text": "acc * n"
      },
      {
        "id": "b",
        "text": "acc + n"
      },
      {
        "id": "c",
        "text": "acc / n"
      },
      {
        "id": "d",
        "text": "n * n"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Per il prodotto di tutti gli elementi si usa `acc * n`.",
      "whyCorrect": "Con `reduce`, per calcolare il prodotto bisogna moltiplicare l'accumulatore per ogni valore e restituire il risultato a ogni passaggio.",
      "whyOthersWrong": {
        "b": "Questa callback esegue una somma, non un prodotto, quindi restituirebbe la somma totale invece del prodotto.",
        "c": "Qui si divide l'accumulatore per il valore corrente, ottenendo un risultato completamente diverso dal prodotto.",
        "d": "Questa espressione moltiplica ogni valore per se stesso, non accumula il prodotto di tutti gli elementi."
      },
      "concept": "Uso di reduce per aggregazioni",
      "commonMistake": "Usare un'operazione diversa (somma/divisione) invece della moltiplicazione.",
      "example": "[2, 3, 4].reduce((acc, n) => acc * n, 1) // 24"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:46:32.233Z"
  },
  {
    "id": "dates-math-fg-0001",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "uso Math.max",
      "funzioni statiche Math"
    ],
    "prompt": "Completa la riga per trovare il valore massimo tra 5, 10 e 7.",
    "code": "const massimo = ___;\nconsole.log(massimo);",
    "options": [
      {
        "id": "a",
        "text": "Math.max(5, 10, 7)"
      },
      {
        "id": "b",
        "text": "Math.maximum(5, 10, 7)"
      },
      {
        "id": "c",
        "text": "max(5, 10, 7)"
      },
      {
        "id": "d",
        "text": "Math.max[5, 10, 7]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.max calcola il massimo tra i numeri dati.",
      "whyCorrect": "Math.max è il metodo corretto per ottenere il massimo tra i valori forniti come argomenti separati.",
      "whyOthersWrong": {
        "b": "Math.maximum non esiste: la funzione giusta per il massimo è Math.max.",
        "c": "max non è definita come funzione globale in JavaScript, serve Math.max.",
        "d": "Math.max si usa con le parentesi tonde e argomenti separati, non con le quadre e array."
      },
      "concept": "Math.max",
      "commonMistake": "Confondere Math.max con una funzione chiamata maximum o usare sintassi errata.",
      "example": "Math.max(4, 8, 1) // 8"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:27:33.887Z"
  },
  {
    "id": "dates-math-fg-0002",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "Math.random",
      "numeri casuali"
    ],
    "prompt": "Completa per ottenere un numero casuale compreso tra 0 (incluso) e 1 (escluso).",
    "code": "const casuale = ___;\nconsole.log(typeof casuale);",
    "options": [
      {
        "id": "a",
        "text": "Math.random()"
      },
      {
        "id": "b",
        "text": "random()"
      },
      {
        "id": "c",
        "text": "Math.rand()"
      },
      {
        "id": "d",
        "text": "Math.random"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.random() restituisce un float casuale tra 0 e 1.",
      "whyCorrect": "Math.random() va chiamato con le parentesi per ottenere il numero casuale; non è necessario passare argomenti.",
      "whyOthersWrong": {
        "b": "random() non è definita come funzione globale: serve sempre Math.random().",
        "c": "Math.rand non esiste in JavaScript, la funzione si chiama Math.random.",
        "d": "Math.random senza parentesi è la funzione stessa, non il suo risultato."
      },
      "concept": "Math.random",
      "commonMistake": "Dimenticare le parentesi o confondere il nome della funzione.",
      "example": "let x = Math.random();"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:27:33.888Z"
  },
  {
    "id": "dates-math-fg-0003",
    "topicId": "dates-math",
    "subtopicId": "dates-math-number",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "isInteger",
      "controllo tipo"
    ],
    "prompt": "Completa per controllare se il valore 7 è un numero intero.",
    "code": "const risultato = ___;\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "Number.isInteger(7)"
      },
      {
        "id": "b",
        "text": "Number.isInt(7)"
      },
      {
        "id": "c",
        "text": "isInteger(7)"
      },
      {
        "id": "d",
        "text": "Number.isInteger('7')"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Number.isInteger verifica se il valore è un intero.",
      "whyCorrect": "Number.isInteger(7) restituisce true perché 7 è effettivamente un numero intero.",
      "whyOthersWrong": {
        "b": "Number.isInt non esiste: la funzione corretta è Number.isInteger.",
        "c": "isInteger non è definita globalmente senza il prefisso Number.",
        "d": "Number.isInteger('7') restituisce false perché '7' è una stringa."
      },
      "concept": "Number.isInteger",
      "commonMistake": "Confondere il nome della funzione o passare una stringa invece di un numero.",
      "example": "Number.isInteger(3.5) // false"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:27:33.889Z"
  },
  {
    "id": "dates-math-fg-0006",
    "topicId": "dates-math",
    "subtopicId": "dates-math-date",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "creare date",
      "mesi 0-based"
    ],
    "prompt": "Vuoi creare una data che rappresenta il primo maggio 2024. Quale valore completa correttamente il mese?",
    "code": "const d = new Date(2024, ___, 1);",
    "options": [
      {
        "id": "a",
        "text": "4"
      },
      {
        "id": "b",
        "text": "5"
      },
      {
        "id": "c",
        "text": "3"
      },
      {
        "id": "d",
        "text": "1"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il mese di maggio corrisponde a 4 perché i mesi partono da 0.",
      "whyCorrect": "In JavaScript il mese 4 corrisponde a maggio, perché gennaio è 0 e aprile è 3.",
      "whyOthersWrong": {
        "b": "Il valore 5 produce giugno, perché i mesi partono da 0 e 5 è il sesto mese.",
        "c": "3 indica aprile, non maggio, a causa dell'indicizzazione da zero.",
        "d": "1 indica febbraio, poiché 0 è gennaio e 1 è il secondo mese."
      },
      "concept": "Mesi 0-based in Date",
      "commonMistake": "Dimenticare che i mesi vanno da 0 a 11.",
      "example": "new Date(2022, 11, 25) // 25 dicembre 2022"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:27:44.377Z"
  },
  {
    "id": "dates-math-fb-0001",
    "topicId": "dates-math",
    "subtopicId": "dates-math-date",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "costruzione oggetti Date",
      "mesi 0-based"
    ],
    "prompt": "Il codice dovrebbe creare una data rappresentante il 10 maggio 2024, ma la data ottenuta non è quella prevista. Qual è la causa?",
    "code": "const data = new Date(2024, 5, 10);\nconsole.log(data);",
    "options": [
      {
        "id": "a",
        "text": "Il mese impostato è giugno invece di maggio"
      },
      {
        "id": "b",
        "text": "Il giorno impostato parte da 0 invece che da 1"
      },
      {
        "id": "c",
        "text": "L'anno parte da zero e quindi è sbagliato"
      },
      {
        "id": "d",
        "text": "Il costruttore Date richiede stringhe, non numeri"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "I mesi in JavaScript partono da zero: 5 indica giugno, non maggio.",
      "whyCorrect": "Il costruttore `Date` usa mesi 0-based, quindi il mese 5 corrisponde a giugno. Per maggio bisogna passare 4 come secondo argomento.",
      "whyOthersWrong": {
        "b": "I giorni nei costruttori `Date` partono da 1, non da 0, quindi il giorno 10 rappresenta davvero il 10 del mese.",
        "c": "L'anno è espresso con il valore reale, non parte da zero: 2024 è effettivamente il 2024.",
        "d": "Il costruttore `Date` accetta anche parametri numerici, non obbligatoriamente stringhe."
      },
      "concept": "Date e mesi 0-based",
      "commonMistake": "Dimenticare che i mesi vanno da 0 (gennaio) a 11 (dicembre).",
      "example": "new Date(2024, 4, 10) // 10 maggio 2024"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:27:40.437Z"
  },
  {
    "id": "dates-math-fb-0002",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "uso corretto di Math.max/min",
      "spread operator"
    ],
    "prompt": "Il codice dovrebbe trovare il valore massimo nell'array numeri, ma stampa NaN. Qual è il problema?",
    "code": "const numeri = [9, 2, 13, 7];\nconst massimo = Math.max(numeri);\nconsole.log(massimo);",
    "options": [
      {
        "id": "a",
        "text": "Math.max applicato a un array restituisce NaN"
      },
      {
        "id": "b",
        "text": "L'array contiene un valore non numerico"
      },
      {
        "id": "c",
        "text": "Math.max restituisce undefined se l'array è vuoto"
      },
      {
        "id": "d",
        "text": "Math.max estrae solo il primo elemento dell'array"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.max richiede numeri separati, non un array.",
      "whyCorrect": "Passando l'intero array come singolo argomento a `Math.max`, il valore è trattato come NaN perché non è un numero. Serve lo spread operator per passare i valori singolarmente.",
      "whyOthersWrong": {
        "b": "Tutti gli elementi dell'array sono numeri. Il problema non è dovuto a valori non numerici.",
        "c": "Se l'array fosse vuoto, non si otterrebbe undefined, ma comunque NaN passando un array. Inoltre l'array non è vuoto.",
        "d": "Math.max non estrae il primo elemento se riceve un array, tratta l'intero array come un argomento unico e quindi restituisce NaN."
      },
      "concept": "Math.max e spread operator",
      "commonMistake": "Dimenticare di usare ... per passare i valori dell'array.",
      "example": "Math.max(...[9, 2, 13, 7]) // 13"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:27:40.438Z"
  },
  {
    "id": "dates-math-fb-0004",
    "topicId": "dates-math",
    "subtopicId": "dates-math-date",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "confronto date",
      "confronto oggetti"
    ],
    "prompt": "Il codice dovrebbe verificare se due date rappresentano lo stesso giorno, ma restituisce sempre false anche quando le date coincidono. Qual è l'errore?",
    "code": "const d1 = new Date(2024, 3, 5);\nconst d2 = new Date(2024, 3, 5);\nconsole.log(d1 === d2);",
    "options": [
      {
        "id": "a",
        "text": "Confronta gli oggetti, non i valori delle date"
      },
      {
        "id": "b",
        "text": "Confronta solo il mese, non tutto l'oggetto"
      },
      {
        "id": "c",
        "text": "Dimentica di convertire le date in stringa"
      },
      {
        "id": "d",
        "text": "Crea due istanze della stessa data per riferimento"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il confronto === controlla il riferimento, non il valore.",
      "whyCorrect": "Due oggetti Date diversi non sono mai strettamente uguali, anche se rappresentano lo stesso momento. Bisogna confrontare i valori restituiti da getTime().",
      "whyOthersWrong": {
        "b": "Il confronto non riguarda solo il mese, ma l'intero riferimento dell'oggetto: non c'entra il campo specifico.",
        "c": "Convertire le date in stringa può funzionare, ma il problema è il confronto tra oggetti, non la mancata conversione.",
        "d": "Anche creando due istanze identiche, sono oggetti distinti in memoria, quindi === restituisce sempre false."
      },
      "concept": "Confronto tra oggetti Date",
      "commonMistake": "Usare === tra due oggetti Date invece di confrontare i valori numerici con getTime().",
      "example": "d1.getTime() === d2.getTime()"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:27:40.438Z"
  },
  {
    "id": "dates-math-fb-0006",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "Math.random",
      "range interi",
      "arrotondamenti"
    ],
    "prompt": "Il codice dovrebbe stampare un intero casuale da 1 a 6 incluso, come un dado. Ma a volte stampa 0 o 6 escluso. Individua l'errore.",
    "code": "const lancio = Math.floor(Math.random() * 6);\nconsole.log(lancio);",
    "options": [
      {
        "id": "a",
        "text": "Math.random() * 6 produce numeri da 0 a 5.999"
      },
      {
        "id": "b",
        "text": "Math.floor non include mai il 6"
      },
      {
        "id": "c",
        "text": "Bisogna usare Math.ceil invece di Math.floor"
      },
      {
        "id": "d",
        "text": "Math.random restituisce solo valori interi"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.random() * 6 genera valori da 0 a 5.999..., arrotondando con floor si ottiene 0–5.",
      "whyCorrect": "Con questa formula si producono numeri interi da 0 a 5. Bisogna sommare 1 per spostare il range da 1 a 6.",
      "whyOthersWrong": {
        "b": "Math.floor arrotonda per difetto, ma il problema non è il metodo, è la formula che parte da 0.",
        "c": "Math.ceil produrrebbe un range sbilanciato, includendo il 6 solo raramente e mai restituendo 0.",
        "d": "Math.random restituisce valori decimali tra 0 incluso e 1 escluso, non interi."
      },
      "concept": "Math.random e generazione interi in range",
      "commonMistake": "Dimenticare di aggiungere 1 per includere l'estremo superiore.",
      "example": "Math.floor(Math.random() * 6) + 1"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:27:40.439Z"
  },
  {
    "id": "dates-math-po-0015",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "Math.abs",
      "Math.floor"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "let x = -7.8;\nlet y = Math.abs(x);\nconsole.log(Math.floor(y));",
    "options": [
      {
        "id": "a",
        "text": "7"
      },
      {
        "id": "b",
        "text": "8"
      },
      {
        "id": "c",
        "text": "-7"
      },
      {
        "id": "d",
        "text": "-8"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.abs converte il numero in positivo e Math.floor tronca verso il basso.",
      "whyCorrect": "Math.abs(-7.8) restituisce 7.8, Math.floor(7.8) porta a 7 perché floor arrotonda sempre verso il basso all'intero più vicino.",
      "whyOthersWrong": {
        "b": "Math.floor non arrotonda all'intero più vicino, ma al più basso, quindi 7.8 diventa 7 e non 8.",
        "c": "Math.abs rende il numero positivo, quindi il risultato non può essere negativo.",
        "d": "Math.abs converte in positivo e Math.floor non scende a -8 perché il valore di partenza dopo abs è positivo."
      },
      "concept": "Math.abs e Math.floor",
      "commonMistake": "Confondere floor con round o tralasciare abs.",
      "example": "Math.floor(Math.abs(-3.4)) // 3"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:46.765Z"
  },
  {
    "id": "dates-math-po-0016",
    "topicId": "dates-math",
    "subtopicId": "dates-math-number",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "parseInt",
      "parseFloat",
      "conversioni"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "let s = '12.7abc';\nconsole.log(parseInt(s), parseFloat(s));",
    "options": [
      {
        "id": "a",
        "text": "12 12.7"
      },
      {
        "id": "b",
        "text": "NaN NaN"
      },
      {
        "id": "c",
        "text": "12.7 12.7"
      },
      {
        "id": "d",
        "text": "12 NaN"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "parseInt estrae la parte intera, parseFloat la parte decimale.",
      "whyCorrect": "parseInt preleva i caratteri numerici iniziali e si ferma al punto, quindi restituisce 12. parseFloat legge fino a dove il numero è valido come float, quindi restituisce 12.7.",
      "whyOthersWrong": {
        "b": "Entrambe le funzioni restituiscono NaN solo se la stringa non inizia con una cifra (qui inizia con 12).",
        "c": "parseInt tronca al primo carattere non valido per un intero, quindi restituisce 12 e non 12.7.",
        "d": "parseFloat accetta la parte decimale, legge 12.7 e non si ferma alla parte intera."
      },
      "concept": "parseInt vs parseFloat",
      "commonMistake": "Aspettarsi che parseInt legga anche i decimali.",
      "example": "parseInt('5.9abc') // 5, parseFloat('5.9abc') // 5.9"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:46.767Z"
  },
  {
    "id": "dates-math-po-0017",
    "topicId": "dates-math",
    "subtopicId": "dates-math-date",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "Date",
      "mesi 0-based",
      "getMonth"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const d = new Date(2024, 4, 15);\nconsole.log(d.getMonth());",
    "options": [
      {
        "id": "a",
        "text": "4"
      },
      {
        "id": "b",
        "text": "5"
      },
      {
        "id": "c",
        "text": "3"
      },
      {
        "id": "d",
        "text": "15"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "I mesi partono da 0, quindi getMonth restituisce il valore fornito.",
      "whyCorrect": "La data creata con mese 4 rappresenta maggio, e getMonth restituisce 4 perché i mesi vanno da 0 (gennaio) a 11 (dicembre).",
      "whyOthersWrong": {
        "b": "Scegliere 5 confonde il numero del mese umano (maggio come 5) con quello usato da Date, che è 0-based.",
        "c": "3 sarebbe aprile: qui invece è stato passato 4, che indica maggio.",
        "d": "15 è il giorno fornito, mentre getMonth restituisce solo l'indice del mese."
      },
      "concept": "Date e mesi 0-based",
      "commonMistake": "Dimenticare che getMonth e costruttore usano 0-based.",
      "example": "new Date(2024, 0, 1).getMonth() // 0 (gennaio)"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:46.767Z"
  },
  {
    "id": "dates-math-po-0018",
    "topicId": "dates-math",
    "subtopicId": "dates-math-date",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "Date",
      "getDate",
      "getDay"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const data = new Date(2024, 3, 7);\nconsole.log(data.getDate(), data.getDay());",
    "options": [
      {
        "id": "a",
        "text": "7 0"
      },
      {
        "id": "b",
        "text": "7 7"
      },
      {
        "id": "c",
        "text": "3 7"
      },
      {
        "id": "d",
        "text": "7 6"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "getDate restituisce il giorno del mese, getDay il giorno della settimana (domenica=0).",
      "whyCorrect": "new Date(2024, 3, 7) rappresenta il 7 aprile 2024, che è una domenica. getDate() è 7 (giorno del mese), getDay() è 0 (domenica).",
      "whyOthersWrong": {
        "b": "getDay restituisce valori da 0 (domenica) a 6 (sabato), mai 7.",
        "c": "Il numero '3' come giorno del mese è errato: 3 è il mese (aprile, 0-based).",
        "d": "getDay=6 sarebbe sabato, ma il 7 aprile 2024 cade di domenica (0)."
      },
      "concept": "Date: getDate vs getDay",
      "commonMistake": "Confondere getDay (giorno settimana) e getDate (del mese).",
      "example": "new Date(2024, 0, 1).getDay() // 1 (lunedì)"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:46.767Z"
  },
  {
    "id": "dates-math-po-0019",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "Math.abs",
      "differenze tra numeri negativi e positivi"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "let a = -7;\nlet b = 3;\nlet diff = Math.abs(a - b);\nconsole.log(diff);",
    "options": [
      {
        "id": "a",
        "text": "10"
      },
      {
        "id": "b",
        "text": "4"
      },
      {
        "id": "c",
        "text": "7"
      },
      {
        "id": "d",
        "text": "3"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.abs calcola il valore assoluto della differenza tra i due numeri.",
      "whyCorrect": "La differenza tra -7 e 3 è -10, ma poi viene passato a Math.abs, che lo trasforma in 10.",
      "whyOthersWrong": {
        "b": "Questo valore deriva dalla differenza 7 - 3, ma l'operazione svolta qui è -7 - 3, non 7 - 3.",
        "c": "Questo è semplicemente il valore assoluto di a, mentre qui si calcola la differenza tra a e b.",
        "d": "Questo è il valore assoluto di b, ma la funzione applicata è Math.abs(a - b), non Math.abs(b)."
      },
      "concept": "Math.abs e differenze numeriche",
      "commonMistake": "Confondere ordine e segno nella sottrazione.",
      "example": "Math.abs(-4 - 2) // 6"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:56.590Z"
  },
  {
    "id": "dates-math-po-0020",
    "topicId": "dates-math",
    "subtopicId": "dates-math-number",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "parseInt",
      "parseFloat",
      "conversioni di stringhe con caratteri speciali"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "let testo = '17.5px';\nconsole.log(parseInt(testo));\nconsole.log(parseFloat(testo));",
    "options": [
      {
        "id": "a",
        "text": "17\n17.5"
      },
      {
        "id": "b",
        "text": "17.5\nNaN"
      },
      {
        "id": "c",
        "text": "NaN\n17.5"
      },
      {
        "id": "d",
        "text": "17\nNaN"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "parseInt estrae la parte intera, parseFloat quella decimale finché trova cifre.",
      "whyCorrect": "parseInt legge fino al punto decimale e si ferma, restituendo 17. parseFloat legge anche il punto e il numero dopo, restituendo 17.5.",
      "whyOthersWrong": {
        "b": "parseInt non restituisce 17.5: si ferma prima del punto decimale e restituisce solo la parte intera.",
        "c": "parseInt non restituisce NaN in questo caso, perché la stringa inizia con cifre valide. parseFloat converte correttamente in 17.5.",
        "d": "parseFloat riesce a leggere il valore decimale perché la stringa inizia con numeri validi, quindi non restituisce NaN."
      },
      "concept": "parseInt e parseFloat su stringhe miste",
      "commonMistake": "Aspettarsi che parseInt restituisca la parte decimale.",
      "example": "parseInt('23.8kg') // 23, parseFloat('23.8kg') // 23.8"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:31:56.590Z"
  },
  {
    "id": "dates-math-fg-0015",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "uso Math.abs"
    ],
    "prompt": "Completa per ottenere il valore assoluto di -20.",
    "code": "let risultato = ___(-20);",
    "options": [
      {
        "id": "a",
        "text": "Math.abs"
      },
      {
        "id": "b",
        "text": "Math.abs()"
      },
      {
        "id": "c",
        "text": "Math.absolute"
      },
      {
        "id": "d",
        "text": "abs"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.abs restituisce il valore assoluto di un numero.",
      "whyCorrect": "Math.abs è il metodo corretto per ottenere il valore assoluto di un numero: accetta un argomento numerico e restituisce sempre un valore positivo.",
      "whyOthersWrong": {
        "b": "Math.abs() senza argomento restituisce 0, non calcola il valore assoluto del numero specificato.",
        "c": "Math.absolute non esiste in JavaScript: il metodo corretto è Math.abs.",
        "d": "abs non è una funzione globale in JavaScript; serve il prefisso Math. e il nome esatto abs."
      },
      "concept": "Math.abs per valori assoluti",
      "commonMistake": "Usare un nome metodo scorretto o non anteporre Math.",
      "example": "Math.abs(-5) // 5"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:46:32.823Z"
  },
  {
    "id": "dates-math-fg-0018",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "utilizzo Math.abs"
    ],
    "prompt": "Vuoi ottenere il valore assoluto di un numero negativo. Quale funzione completa la riga?",
    "code": "const risultato = Math.___(-8);\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "abs"
      },
      {
        "id": "b",
        "text": "max"
      },
      {
        "id": "c",
        "text": "ceil"
      },
      {
        "id": "d",
        "text": "floor"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.abs restituisce il valore assoluto di un numero, cioè sempre non negativo.",
      "whyCorrect": "Math.abs trasforma sempre il numero fornito nel suo valore assoluto. Nel caso di -8, restituisce 8.",
      "whyOthersWrong": {
        "b": "Math.max restituisce il massimo tra i parametri forniti, non il valore assoluto di uno solo.",
        "c": "Math.ceil arrotonda per eccesso, ma su -8 non ha effetto, restituisce -8.",
        "d": "Math.floor arrotonda per difetto, ma con -8 dà comunque -8, non cambia segno."
      },
      "concept": "Math.abs: valore assoluto",
      "commonMistake": "Confondere abs con le funzioni di arrotondamento come ceil o floor.",
      "example": "Math.abs(-5) // 5"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:46:39.488Z"
  },
  {
    "id": "dates-math-fb-0015",
    "topicId": "dates-math",
    "subtopicId": "dates-math-number",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "parsing numeri",
      "differenza parseInt/Number",
      "gestione stringhe"
    ],
    "prompt": "Il codice dovrebbe convertire una stringa come '25.7kg' in un numero decimale, ma ottiene sempre NaN. Qual è la causa?",
    "code": "const input = '25.7kg';\nconst valore = Number(input);\nconsole.log(valore);",
    "options": [
      {
        "id": "a",
        "text": "Number restituisce NaN se la stringa contiene testo extra"
      },
      {
        "id": "b",
        "text": "parseInt converte i decimali in modo errato"
      },
      {
        "id": "c",
        "text": "La stringa deve essere convertita prima in array"
      },
      {
        "id": "d",
        "text": "Math.floor avrebbe arrotondato correttamente"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Number restituisce NaN se la stringa contiene caratteri non numerici, mentre parseFloat o parseInt interpretano la parte iniziale numerica.",
      "whyCorrect": "Number tenta di convertire l'intera stringa: non essendo un numero valido a causa del suffisso 'kg', restituisce NaN. parseFloat('25.7kg') invece avrebbe prodotto 25.7.",
      "whyOthersWrong": {
        "b": "parseInt avrebbe restituito 25, scartando la parte decimale e il testo, ma qui non viene usato parseInt: il problema è proprio l'uso di Number.",
        "c": "Non è necessario convertire la stringa in array per estrarre il numero: la conversione numerica è indipendente dalla rappresentazione interna della stringa.",
        "d": "Math.floor può arrotondare solo un valore già numerico, ma qui Number restituisce NaN, quindi Math.floor(NaN) resterebbe comunque NaN."
      },
      "concept": "parseInt/parseFloat vs Number",
      "commonMistake": "Usare Number invece di parseInt o parseFloat su stringhe con testo misto.",
      "example": "parseFloat('25.7kg') // 25.7"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:46:49.089Z"
  },
  {
    "id": "dates-math-fb-0016",
    "topicId": "dates-math",
    "subtopicId": "dates-math-date",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "creazione date",
      "mesi 0-based",
      "ordine degli argomenti"
    ],
    "prompt": "Il codice dovrebbe creare una data rappresentante il 20 novembre 2023, ma la data ottenuta è errata (un altro mese viene visualizzato). Qual è il problema?",
    "code": "const data = new Date(2023, 11, 20);\nconsole.log(data.toLocaleDateString('it-IT'));",
    "options": [
      {
        "id": "a",
        "text": "Il valore del mese è 0-based, 11 è dicembre"
      },
      {
        "id": "b",
        "text": "I giorni in Date partono da zero"
      },
      {
        "id": "c",
        "text": "Gli anni in Date sono 0-based"
      },
      {
        "id": "d",
        "text": "L'ordine dei parametri di Date è errato"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il parametro mese in Date parte da 0: 11 corrisponde a dicembre, non a novembre.",
      "whyCorrect": "In JavaScript il secondo parametro di Date (mese) è 0-based, quindi 11 indica dicembre. Per novembre bisognava scrivere 10.",
      "whyOthersWrong": {
        "b": "I giorni partono da 1, quindi il terzo parametro 20 indica correttamente il ventesimo giorno del mese.",
        "c": "L'anno in Date è sempre il valore numerico completo (es. 2023) e non è 0-based.",
        "d": "L'ordine dei parametri (anno, mese, giorno) è corretto secondo la documentazione Date."
      },
      "concept": "Date: mesi 0-based",
      "commonMistake": "Dimenticare che il parametro mese parte da 0 e non da 1.",
      "example": "new Date(2023, 10, 20) // 20 novembre 2023"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:46:49.090Z"
  },
  {
    "id": "dates-math-fb-0017",
    "topicId": "dates-math",
    "subtopicId": "dates-math-math",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "Math.max/min",
      "spread operator",
      "uso array"
    ],
    "prompt": "Il codice dovrebbe stampare il valore minimo in un array di numeri, ma stampa NaN. Qual è la causa?",
    "code": "const numeri = [4, 2, 8, 5];\nconst minimo = Math.min(numeri);\nconsole.log(minimo);",
    "options": [
      {
        "id": "a",
        "text": "Math.min non accetta array come singolo argomento"
      },
      {
        "id": "b",
        "text": "Math.min può gestire solo due argomenti"
      },
      {
        "id": "c",
        "text": "L'array contiene un valore undefined"
      },
      {
        "id": "d",
        "text": "Bisogna usare Math.floor sull'array"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Math.min richiede argomenti separati, non un array; passato un array, restituisce NaN.",
      "whyCorrect": "Math.min(numeri) tenta di convertire l'intero array in numero, ottenendo NaN: bisogna usare lo spread operator (...numeri) per passare i valori separatamente.",
      "whyOthersWrong": {
        "b": "Math.min accetta qualsiasi numero di argomenti, non solo due: il problema è che l'array non viene 'spacchettato'.",
        "c": "L'array non contiene valori undefined: tutti gli elementi sono numeri validi.",
        "d": "Math.floor serve ad arrotondare, ma qui l'errore è nel passaggio dell'array al posto degli argomenti."
      },
      "concept": "Math.min/max con array",
      "commonMistake": "Dimenticare che Math.min/max non accettano array come unico argomento.",
      "example": "Math.min(...[4,2,8,5]) // 2"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:46:49.090Z"
  },
  {
    "id": "destructuring-fb-0006",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "destructuring oggetti",
      "parametri funzione"
    ],
    "prompt": "La funzione accetta un oggetto opzioni e dovrebbe estrarre livello con default 1, ma lancia TypeError se si chiama senza argomenti.",
    "code": "function imposta({ livello = 1 }) {\n  console.log(livello);\n}\nimposta();",
    "options": [
      {
        "id": "a",
        "text": "Serve un default per tutto il parametro"
      },
      {
        "id": "b",
        "text": "Livello deve essere passato sempre"
      },
      {
        "id": "c",
        "text": "La destructuring va fatta dentro la funzione"
      },
      {
        "id": "d",
        "text": "La funzione deve restituire livello"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Destrutturare undefined causa TypeError: serve un default.",
      "whyCorrect": "Quando si destruttura direttamente un parametro, bisogna dargli un default come `{ livello = 1 } = {}` per gestire il caso senza argomenti.",
      "whyOthersWrong": {
        "b": "Non è obbligatorio passare sempre livello: un valore di default nel destructuring permette di non specificarlo.",
        "c": "La destructuring nei parametri funzione è corretta ed è una pratica comune.",
        "d": "Restituire livello non risolve il problema del TypeError, che nasce dalla destrutturazione di undefined."
      },
      "concept": "Default nel destructuring parametri funzione",
      "commonMistake": "Dimenticare di fornire un oggetto vuoto come default per destrutturare parametri opzionali.",
      "example": "function f({ x = 1 } = {}) { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:28:19.779Z"
  },
  {
    "id": "destructuring-fb-0007",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "destructuring oggetti",
      "rinominare proprietà",
      "default in destructuring"
    ],
    "prompt": "Il codice vuole estrarre la proprietà `età` dall'oggetto `persona`, assegnarla a una variabile `anni`, e se non c'è, usare il default 18. Tuttavia, il risultato non è quello voluto: stampando, ottiene undefined invece di 18. Dov'è l'errore?",
    "code": "const persona = {};\nconst { anni: età = 18 } = persona;\nconsole.log(età);",
    "options": [
      {
        "id": "a",
        "text": "Rinominato nella direzione sbagliata: 'anni: età'"
      },
      {
        "id": "b",
        "text": "Default applicato solo se tutta la variabile manca"
      },
      {
        "id": "c",
        "text": "Serve usare [età] per estrarre la proprietà"
      },
      {
        "id": "d",
        "text": "La sintassi va usata solo nei parametri di funzione"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La sintassi di rinomina va da proprietà originale a nuovo nome: andava scritto { età: anni = 18 }.",
      "whyCorrect": "La sintassi di destructuring per rinominare è { proprietà: variabile }, quindi per assegnare il valore di età a anni scriveremmo { età: anni = 18 }. Nel codice, 'anni: età' cerca una proprietà 'anni' che non esiste.",
      "whyOthersWrong": {
        "b": "Il default viene applicato quando la proprietà manca o vale undefined, non quando manca la variabile creata.",
        "c": "I nomi tra parentesi quadre servono per gli array, non per gli oggetti: qui va usata la sintassi con parentesi graffe.",
        "d": "Il destructuring è valido sia nelle dichiarazioni che nei parametri di funzione; non c'è questa limitazione."
      },
      "concept": "Rinominare proprietà in destructuring oggetti",
      "commonMistake": "Invertire l'ordine proprietà:variabile nella rinomina.",
      "example": "const { età: anni = 18 } = {};\nconsole.log(anni); // 18"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:28:28.646Z"
  },
  {
    "id": "destructuring-fg-0001",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "estrarre proprietà da oggetto"
    ],
    "prompt": "Completa il destructuring per ottenere la proprietà 'età' dall'oggetto.",
    "code": "const persona = { nome: 'Leo', età: 25 };\nconst { ___ } = persona;\nconsole.log(età);",
    "options": [
      {
        "id": "a",
        "text": "età"
      },
      {
        "id": "b",
        "text": "[età]"
      },
      {
        "id": "c",
        "text": "persona.età"
      },
      {
        "id": "d",
        "text": "età: persona"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Con il destructuring si usano le parentesi graffe e il nome della proprietà.",
      "whyCorrect": "La sintassi corretta per estrarre la proprietà 'età' è { età }, che crea una variabile con lo stesso nome.",
      "whyOthersWrong": {
        "b": "Le parentesi quadre vengono usate solo per destrutturare array, non oggetti. Qui servono le graffe.",
        "c": "Scrivere persona.età è la notazione per accedere direttamente, ma nel destructuring si usa solo il nome della proprietà.",
        "d": "La sintassi età: persona tenta di rinominare, ma qui si vuole solo estrarre 'età'; la variabile si chiamerebbe persona, non ha senso."
      },
      "concept": "Destructuring oggetti base",
      "commonMistake": "Usare la sintassi degli array o notazione proprietà.",
      "example": "const { nome } = { nome: 'Ada' };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:28:16.672Z"
  },
  {
    "id": "destructuring-fg-0002",
    "topicId": "destructuring",
    "subtopicId": "destructuring-arrays",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "rest operator",
      "destructuring array"
    ],
    "prompt": "Completa per mettere il primo elemento in uno e i restanti in altri.",
    "code": "const lettere = [\"a\", \"b\", \"c\"];\nconst [ uno, ___ ] = lettere;",
    "options": [
      {
        "id": "a",
        "text": "...altri"
      },
      {
        "id": "b",
        "text": "altri"
      },
      {
        "id": "c",
        "text": "[ ...altri ]"
      },
      {
        "id": "d",
        "text": "{ ...altri }"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Per raccogliere gli elementi restanti si usa ...nome.",
      "whyCorrect": "La sintassi ...altri raccoglie gli elementi dopo il primo in un array chiamato altri.",
      "whyOthersWrong": {
        "b": "altri senza ... raccoglierebbe solo il secondo elemento, non tutti i restanti.",
        "c": "[ ...altri ] non è corretto: le parentesi quadre qui sarebbero annidate inutilmente.",
        "d": "{ ...altri } è sintassi di oggetti, non di array: ... si può usare solo in array qui."
      },
      "concept": "Rest operator nel destructuring array",
      "commonMistake": "Dimenticare i ... o usarli nella sintassi degli oggetti.",
      "example": "const [ primo, ...resto ] = arr;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:28:31.189Z"
  },
  {
    "id": "destructuring-fg-0003",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "default proprietà oggetto",
      "destructuring base"
    ],
    "prompt": "Completa per assegnare 5 a 'valore' se la proprietà valore non è presente nell'oggetto dati.",
    "code": "const dati = {};\nconst { valore = ___ } = dati;\nconsole.log(valore);",
    "options": [
      {
        "id": "a",
        "text": "5"
      },
      {
        "id": "b",
        "text": "\"valore\""
      },
      {
        "id": "c",
        "text": "undefined"
      },
      {
        "id": "d",
        "text": "default"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Per assegnare un default nel destructuring, si usa il valore desiderato dopo il segno =.",
      "whyCorrect": "Scrivendo 5 dopo il segno = si assegna a valore questo valore quando la proprietà manca.",
      "whyOthersWrong": {
        "b": "La stringa \"valore\" non è il valore numerico di default richiesto.",
        "c": "undefined è già il valore predefinito quando la proprietà manca; bisogna impostare un valore concreto.",
        "d": "default non è una parola chiave valida nella sintassi di default del destructuring."
      },
      "concept": "Valori di default nel destructuring oggetti",
      "commonMistake": "Confondere il default con la stringa della proprietà o con parole chiave inesistenti.",
      "example": "const { a = 1 } = {};"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:28:42.779Z"
  },
  {
    "id": "destructuring-po-0011",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "rinominare proprietà",
      "default nel destructuring",
      "lettura di oggetti"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const dati = { x: 7 };\nconst { x: y = 10, z = 3 } = dati;\nconsole.log(y);\nconsole.log(z);",
    "options": [
      {
        "id": "a",
        "text": "7\n3"
      },
      {
        "id": "b",
        "text": "10\nundefined"
      },
      {
        "id": "c",
        "text": "7\nundefined"
      },
      {
        "id": "d",
        "text": "undefined\n3"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La variabile y prende valore 7 dalla proprietà x, mentre z prende il default 3.",
      "whyCorrect": "Nel destructuring, `x: y = 10` significa che y prende il valore di x; dato che x c'è ed è 7, y vale 7. La proprietà z non esiste, quindi usa il default e z vale 3.",
      "whyOthersWrong": {
        "b": "z ha un valore di default specificato (3), quindi non può essere undefined.",
        "c": "Il default su z assicura che abbia sempre un valore, e y prende il 7 dalla proprietà x.",
        "d": "La proprietà x è presente, quindi y non è undefined, e z prende il default 3."
      },
      "concept": "Destructuring oggetti con rinomina e default",
      "commonMistake": "Confondere l'ordine della rinomina o pensare che il default si applichi anche se la proprietà esiste.",
      "example": "const { a: nuovo = 1 } = { a: 5 }; // nuovo = 5"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:16.101Z"
  },
  {
    "id": "destructuring-po-0012",
    "topicId": "destructuring",
    "subtopicId": "destructuring-arrays",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "assegnamento per posizione",
      "default di elemento mancante"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const arr = [1];\nconst [primo, secondo = 42, terzo = 99] = arr;\nconsole.log(primo);\nconsole.log(secondo);\nconsole.log(terzo);",
    "options": [
      {
        "id": "a",
        "text": "1\n42\n99"
      },
      {
        "id": "b",
        "text": "1\nundefined\nundefined"
      },
      {
        "id": "c",
        "text": "1\nundefined\n99"
      },
      {
        "id": "d",
        "text": "1\n42\nundefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Manca il secondo e terzo elemento, quindi i default vengono usati.",
      "whyCorrect": "L'array ha solo un elemento, quindi secondo e terzo non sono definiti; entrambi prendono il valore di default specificato nel destructuring.",
      "whyOthersWrong": {
        "b": "Il default viene usato quando manca un elemento, quindi secondo e terzo non possono essere undefined.",
        "c": "Solo il secondo elemento manca, ma anche il terzo manca, quindi anche terzo prende il default.",
        "d": "Il terzo elemento manca e ha un default, quindi non può essere undefined."
      },
      "concept": "Destructuring array con valori di default",
      "commonMistake": "Pensare che i default valgano solo per il primo elemento mancante.",
      "example": "const [a, b = 2] = [1]; // a = 1, b = 2"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:16.102Z"
  },
  {
    "id": "destructuring-po-0013",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "destructuring parametri funzione",
      "default nei parametri"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "function saluta({ nome = 'Mario', saluto = 'Ciao' }) {\n  console.log(saluto + ', ' + nome);\n}\nsaluta({ nome: 'Luisa' });",
    "options": [
      {
        "id": "a",
        "text": "Ciao, Luisa"
      },
      {
        "id": "b",
        "text": "undefined, Luisa"
      },
      {
        "id": "c",
        "text": "Ciao, Mario"
      },
      {
        "id": "d",
        "text": "undefined, Mario"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La funzione usa 'Luisa' e il default 'Ciao' per saluto.",
      "whyCorrect": "L'oggetto passato ha solo la proprietà nome, quindi saluto prende il valore di default 'Ciao' e nome prende 'Luisa'.",
      "whyOthersWrong": {
        "b": "Il valore di default per saluto è 'Ciao', quindi non può essere undefined.",
        "c": "La proprietà nome è fornita ('Luisa'), quindi il default 'Mario' non viene usato.",
        "d": "Sia nome che saluto hanno default, ma almeno uno viene fornito nell'oggetto, quindi non sono undefined."
      },
      "concept": "Default nel destructuring nei parametri funzione",
      "commonMistake": "Pensare che i default non si applichino se la proprietà manca solo nell'oggetto passato.",
      "example": "function f({x = 1}) { console.log(x); } f({}); // 1"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:16.103Z"
  },
  {
    "id": "destructuring-po-0014",
    "topicId": "destructuring",
    "subtopicId": "destructuring-arrays",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "rest operator",
      "destructuring array"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const numeri = [4, 5, 6, 7];\nconst [primo, ...altri] = numeri;\nconsole.log(primo);\nconsole.log(altri);",
    "options": [
      {
        "id": "a",
        "text": "4\n[ 5, 6, 7 ]"
      },
      {
        "id": "b",
        "text": "4\n5"
      },
      {
        "id": "c",
        "text": "4\n[ 4, 5, 6, 7 ]"
      },
      {
        "id": "d",
        "text": "4\nundefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il rest operator prende tutti gli elementi dopo il primo.",
      "whyCorrect": "Il primo elemento va in primo, il resto dell'array viene raccolto nell'array altri tramite il rest operator.",
      "whyOthersWrong": {
        "b": "Il rest operator raccoglie in un array, non un singolo valore.",
        "c": "Il rest operator prende solo gli elementi successivi, non tutto l'array.",
        "d": "Il rest operator crea sempre un array, anche se vuoto, non undefined."
      },
      "concept": "Rest operator nel destructuring array",
      "commonMistake": "Pensare che il rest operator prenda solo il prossimo elemento o tutto l'array.",
      "example": "const [a, ...b] = [1,2,3]; // a=1, b=[2,3]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:16.103Z"
  },
  {
    "id": "destructuring-po-0015",
    "topicId": "destructuring",
    "subtopicId": "destructuring-arrays",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "salto di elementi",
      "assegnamento posizionale"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const valori = [10, 20, 30, 40];\nconst [ , secondo, , quarto ] = valori;\nconsole.log(secondo);\nconsole.log(quarto);",
    "options": [
      {
        "id": "a",
        "text": "20\n40"
      },
      {
        "id": "b",
        "text": "20\n30"
      },
      {
        "id": "c",
        "text": "10\n40"
      },
      {
        "id": "d",
        "text": "10\n30"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Gli elementi saltati vengono ignorati, secondo e quarto prendono la posizione.",
      "whyCorrect": "Il primo e il terzo elemento sono saltati: secondo prende il secondo valore (20) e quarto prende il quarto valore (40).",
      "whyOthersWrong": {
        "b": "Il terzo elemento (30) non viene assegnato a quarto, ma il quarto (40).",
        "c": "Il secondo prende il secondo valore, non il primo; quarto prende il quarto.",
        "d": "Né il secondo né il quarto valore corrispondono a queste posizioni."
      },
      "concept": "Destructuring array saltando elementi",
      "commonMistake": "Dimenticare che le virgole vuote saltano la posizione corrispondente.",
      "example": "const [ , b, , d ] = [1,2,3,4]; // b=2, d=4"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:16.103Z"
  },
  {
    "id": "destructuring-po-0016",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "destructuring oggetti",
      "rinomina",
      "valori di default"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const animale = { specie: 'gatto', zampe: 4 };\nconst { specie: tipo, colore = 'nero' } = animale;\nconsole.log(tipo);\nconsole.log(colore);",
    "options": [
      {
        "id": "a",
        "text": "gatto\nnero"
      },
      {
        "id": "b",
        "text": "specie\nnero"
      },
      {
        "id": "c",
        "text": "gatto\nundefined"
      },
      {
        "id": "d",
        "text": "tipo\nnero"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La proprietà specie viene rinominata in tipo, colore prende il default.",
      "whyCorrect": "La proprietà specie dell'oggetto viene estratta e rinominata in tipo, quindi tipo vale 'gatto'. Colore non esiste nell'oggetto, quindi riceve il valore di default 'nero'.",
      "whyOthersWrong": {
        "b": "La variabile tipo contiene il valore di specie ('gatto'), non il nome della proprietà ('specie').",
        "c": "Colore non viene lasciata undefined: non trovandola nell'oggetto prende il valore di default specificato, cioè 'nero'.",
        "d": "Console.log stampa i valori delle variabili, non i loro nomi; tipo vale 'gatto', non 'tipo'."
      },
      "concept": "Destructuring oggetti con rinomina e default",
      "commonMistake": "Confondere il nome della proprietà con quello della variabile di destinazione o trascurare il default.",
      "example": "const { a: nuovoNome = 42 } = {}; // nuovoNome = 42"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:22.808Z"
  },
  {
    "id": "destructuring-po-0017",
    "topicId": "destructuring",
    "subtopicId": "destructuring-arrays",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "destructuring",
      "default values",
      "array manipulation"
    ],
    "prompt": "Cosa stampa questo codice che usa il destructuring di array con valori di default e rest?",
    "code": "const arr = [undefined, 3, 5];\nconst [a = 1, b = 2, ...rest] = arr;\nconsole.log(a);\nconsole.log(b);\nconsole.log(rest);",
    "options": [
      {
        "id": "a",
        "text": "1\n3\n[ 5 ]"
      },
      {
        "id": "b",
        "text": "undefined\n3\n[ 5 ]"
      },
      {
        "id": "c",
        "text": "1\n2\n[ 3, 5 ]"
      },
      {
        "id": "d",
        "text": "undefined\n2\n[ 5 ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il valore undefined attiva il default per 'a', mentre 'b' prende il secondo elemento. Il rest raccoglie il restante.",
      "whyCorrect": "'a' assume il valore 1 perché nella posizione 0 di arr c'è undefined e quindi scatta il valore di default. 'b' prende 3, il valore alla posizione 1. Il rest operator raccoglie il valore rimanente (5) in un array.",
      "whyOthersWrong": {
        "b": "Se il primo elemento fosse undefined senza default, avremmo undefined, ma qui 'a = 1' fornisce il valore di default.",
        "c": "'b' prende il secondo elemento dell'array, cioè 3, non il valore di default 2. Il rest parte dalla terza posizione, quindi raccoglie solo 5, non 3 e 5.",
        "d": "'a' avrebbe undefined solo senza valore di default, ma qui il default è 1. 'b' prende comunque 3, non 2, e il rest parte dalla terza posizione."
      },
      "concept": "Destructuring di array: default e rest",
      "commonMistake": "Credere che undefined non attivi il valore di default, o che rest prenda più elementi di quanti ne restino.",
      "example": "const [a = 1, b = 2, ...rest] = [undefined, 3, 5];"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:27.758Z"
  },
  {
    "id": "destructuring-fg-0013",
    "topicId": "destructuring",
    "subtopicId": "destructuring-arrays",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "array destructuring"
    ],
    "prompt": "Completa il destructuring per estrarre il secondo elemento dell'array `colori` in una variabile chiamata `secondo`.",
    "code": "const colori = [\"rosso\", \"verde\", \"blu\"];\nconst [___] = colori;\nconsole.log(secondo);",
    "options": [
      {
        "id": "a",
        "text": ", secondo"
      },
      {
        "id": "b",
        "text": "secondo"
      },
      {
        "id": "c",
        "text": "secondo,"
      },
      {
        "id": "d",
        "text": "[secondo]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Per estrarre il secondo elemento si scrive una virgola prima della variabile: `[ , secondo ]`.",
      "whyCorrect": "La virgola salta il primo elemento, quindi il secondo valore dell'array va nella variabile `secondo`. La sintassi `[ , secondo ] = colori` assegna `\"verde\"` a `secondo`.",
      "whyOthersWrong": {
        "b": "Scrivendo solo `secondo` senza la virgola, si assegna il primo elemento, non il secondo, quindi `secondo` sarebbe \"rosso\".",
        "c": "Mettendo la virgola dopo `secondo`, JavaScript cerca un terzo elemento e `secondo` riceve il primo valore, non il secondo.",
        "d": "Usare `[secondo]` crea una variabile chiamata `secondo`, ma assegna comunque solo il primo elemento, non il secondo."
      },
      "concept": "Destructuring di array: salto di elementi",
      "commonMistake": "Dimenticare la virgola per saltare elementi nell'array.",
      "example": "const [ , secondo ] = [1, 2, 3]; // secondo = 2"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:07.893Z"
  },
  {
    "id": "destructuring-fg-0014",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "object destructuring",
      "property renaming"
    ],
    "prompt": "Completa il destructuring per estrarre la proprietà `nome` dall'oggetto `persona` e assegnarla a una variabile chiamata `n`.",
    "code": "const persona = { nome: \"Luca\", età: 22 };\nconst { ___ } = persona;\nconsole.log(n);",
    "options": [
      {
        "id": "a",
        "text": "nome: n"
      },
      {
        "id": "b",
        "text": "n: nome"
      },
      {
        "id": "c",
        "text": "nome as n"
      },
      {
        "id": "d",
        "text": "nome = n"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La sintassi per rinominare è `{ originale: nuovoNome }`, quindi `{ nome: n }`.",
      "whyCorrect": "Per estrarre la proprietà `nome` in una variabile chiamata `n`, si usa `{ nome: n }`. Così, `persona.nome` viene assegnato a `n`.",
      "whyOthersWrong": {
        "b": "Invertire l'ordine (`n: nome`) cerca una proprietà `n` e la mette in `nome`, che non è l'obiettivo né la sintassi corretta.",
        "c": "La sintassi `as` non esiste in JavaScript per il destructuring; è tipica di altri linguaggi come TypeScript.",
        "d": "L'uguale (`=`) serve solo per assegnare valori di default, non per rinominare variabili."
      },
      "concept": "Destructuring oggetti: rinomina proprietà",
      "commonMistake": "Invertire l'ordine nella rinomina, usando `{ nuovoNome: originale }`.",
      "example": "const { x: y } = { x: 1 }; // y = 1"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:07.895Z"
  },
  {
    "id": "destructuring-fg-0015",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "object destructuring",
      "default values"
    ],
    "prompt": "Completa il destructuring per estrarre la proprietà `livello` dall'oggetto `utente`, usando 5 come valore di default se non è presente.",
    "code": "const utente = { nome: \"Paola\" };\nconst { livello = ___ } = utente;\nconsole.log(livello);",
    "options": [
      {
        "id": "a",
        "text": "5"
      },
      {
        "id": "b",
        "text": "\"livello\""
      },
      {
        "id": "c",
        "text": "utente.livello"
      },
      {
        "id": "d",
        "text": "null"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Serve il valore di default nella sintassi: `{ livello = 5 }`.",
      "whyCorrect": "Se `utente` non ha la proprietà `livello`, verrà usato il valore dopo `=`, cioè 5. Quindi `livello` sarà 5.",
      "whyOthersWrong": {
        "b": "Scrivere la stringa \"livello\" assegna la stringa stessa, non un numero né il valore della proprietà.",
        "c": "Usando `utente.livello` si ottiene undefined, perché la proprietà non esiste sull'oggetto.",
        "d": "`null` non è il valore di default richiesto; serve assegnare 5."
      },
      "concept": "Destructuring oggetti: valori di default",
      "commonMistake": "Mettere il nome della proprietà o un'espressione invece del valore di default.",
      "example": "const { a = 10 } = {}; // a = 10"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:07.895Z"
  },
  {
    "id": "destructuring-fg-0016",
    "topicId": "destructuring",
    "subtopicId": "destructuring-arrays",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "array destructuring"
    ],
    "prompt": "Completa il destructuring per assegnare il primo elemento dell'array `numeri` a `primo` e il secondo a `secondo`.",
    "code": "const numeri = [8, 9, 10];\nconst [___] = numeri;\nconsole.log(primo, secondo);",
    "options": [
      {
        "id": "a",
        "text": "primo, secondo"
      },
      {
        "id": "b",
        "text": "secondo, primo"
      },
      {
        "id": "c",
        "text": "[primo, secondo]"
      },
      {
        "id": "d",
        "text": "primo & secondo"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La sintassi corretta per il destructuring di due elementi è `[primo, secondo]`.",
      "whyCorrect": "`[primo, secondo]` assegna il primo valore a `primo` e il secondo a `secondo`.",
      "whyOthersWrong": {
        "b": "Invertendo l'ordine, `secondo` riceverà 8 e `primo` il valore 9, scambiando i risultati desiderati.",
        "c": "Le parentesi quadre interne non sono necessarie: serve solo separare i nomi delle variabili.",
        "d": "L'operatore `&` non ha alcun significato nel destructuring degli array."
      },
      "concept": "Destructuring array: estrazione posizionale",
      "commonMistake": "Invertire l'ordine delle variabili o usare una sintassi non valida.",
      "example": "const [a, b] = [1, 2]; // a = 1, b = 2"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:07.896Z"
  },
  {
    "id": "destructuring-fg-0017",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "estrazione proprietà oggetto",
      "rinomina variabili"
    ],
    "prompt": "Completa la dichiarazione per estrarre la proprietà 'titolo' dall'oggetto libro, assegnandola a una nuova variabile chiamata 'nomeLibro'.",
    "code": "const libro = { titolo: \"Il Principito\", autore: \"Saint-Exupéry\" };\nconst { ___ } = libro;\nconsole.log(nomeLibro);",
    "options": [
      {
        "id": "a",
        "text": "titolo: nomeLibro"
      },
      {
        "id": "b",
        "text": "nomeLibro: titolo"
      },
      {
        "id": "c",
        "text": "titolo as nomeLibro"
      },
      {
        "id": "d",
        "text": "nomeLibro = titolo"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La sintassi corretta per rinominare una proprietà durante il destructuring è proprietà: nuovoNome.",
      "whyCorrect": "Scrivendo 'titolo: nomeLibro' si estrae la proprietà 'titolo' dall'oggetto e la si assegna alla variabile 'nomeLibro', che poi sarà usata nel console.log.",
      "whyOthersWrong": {
        "b": "La sintassi 'nomeLibro: titolo' cerca una proprietà chiamata 'nomeLibro' nell'oggetto, che non esiste, e la assegna a una variabile 'titolo', quindi nomeLibro sarà undefined.",
        "c": "'as' non è una parola chiave valida in questo contesto JavaScript; questa sintassi non è supportata nel destructuring.",
        "d": "L'uguale '=' non è usato per la rinomina nel destructuring. Qui verrebbe interpretato come un valore di default, non una rinomina della variabile."
      },
      "concept": "rinomina proprietà oggetto",
      "commonMistake": "Invertire la sintassi di rinomina ({ nuovo: vecchio }) o usare parole chiave sbagliate.",
      "example": "const { x: y } = { x: 10 }; // y = 10"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:11.565Z"
  },
  {
    "id": "destructuring-fb-0015",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "destructuring",
      "oggetti",
      "valori di default"
    ],
    "prompt": "La funzione `saluta` dovrebbe estrarre il campo `nome` dall'oggetto `persona`, e se il campo manca, usare il default 'Anonimo'. Tuttavia, chiamando `saluta({})`, ottiene `undefined` invece di 'Anonimo'. Qual è il problema?",
    "code": "function saluta(persona) {\n  const { nome } = persona || { nome: 'Anonimo' };\n  console.log(nome);\n}\nsaluta({});",
    "options": [
      {
        "id": "a",
        "text": "Il default non si applica quando la proprietà esiste"
      },
      {
        "id": "b",
        "text": "Il valore di default va impostato nel destructuring"
      },
      {
        "id": "c",
        "text": "Serve l'operatore && anziché ||"
      },
      {
        "id": "d",
        "text": "Deve usare un array invece di un oggetto"
      }
    ],
    "correctOptionId": "b",
    "explanation": {
      "short": "Il default va messo nel destructuring, come `{ nome = 'Anonimo' }`.",
      "whyCorrect": "L'oggetto passato non è undefined o null, quindi l'operatore || non scatta: solo il default nel destructuring copre il caso di proprietà mancante.",
      "whyOthersWrong": {
        "a": "Il default si applica solo se la proprietà manca o è undefined: in questo caso manca, ma non è stato specificato un valore di default nel destructuring.",
        "c": "L'operatore && non aiuterebbe: non serve una condizione logica, ma specificare un valore di default per la proprietà assente.",
        "d": "Qui serve destrutturare un oggetto, non un array. La struttura dati non è il problema."
      },
      "concept": "Valore di default nelle proprietà oggetto",
      "commonMistake": "Mettere il default fuori dal destructuring invece che nella variabile.",
      "example": "const { nome = 'Anonimo' } = persona;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:20.747Z"
  },
  {
    "id": "destructuring-fb-0016",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "destructuring",
      "parametri funzione",
      "oggetti"
    ],
    "prompt": "La funzione `sommaProprieta` dovrebbe ricevere un oggetto con proprietà `a` e `b` e restituire la loro somma. Se una proprietà manca dovrebbe usare 0 come default. Tuttavia, chiamando con `{ a: 5 }`, genera `NaN`. Cosa non va?",
    "code": "function sommaProprieta({ a, b }) {\n  return a + b;\n}\nconsole.log(sommaProprieta({ a: 5 }));",
    "options": [
      {
        "id": "a",
        "text": "I default non sono specificati nel destructuring"
      },
      {
        "id": "b",
        "text": "Serve il destructuring dentro il corpo della funzione"
      },
      {
        "id": "c",
        "text": "Ha dimenticato il rest operator nel destructuring"
      },
      {
        "id": "d",
        "text": "Non si possono sommare proprietà mancanti"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "I default vanno messi direttamente nei parametri destrutturati: `{ a = 0, b = 0 }`.",
      "whyCorrect": "Se una proprietà manca, il valore sarà undefined, e `5 + undefined` dà NaN. Serve assegnare 0 come default nel destructuring.",
      "whyOthersWrong": {
        "b": "Non è necessario spostare il destructuring dentro il corpo: si può (anzi, spesso si deve) usare nel parametro.",
        "c": "Il rest operator serve solo per raccogliere il resto delle proprietà, non per default.",
        "d": "Si possono sommare proprietà mancanti se si fornisce un valore di default nel destructuring."
      },
      "concept": "Default nei parametri destrutturati",
      "commonMistake": "Dimenticare il default nei parametri: proprietà undefined causano NaN.",
      "example": "function sommaProprieta({ a = 0, b = 0 }) { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:20.748Z"
  },
  {
    "id": "destructuring-fb-0018",
    "topicId": "destructuring",
    "subtopicId": "destructuring-arrays",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "destructuring",
      "array destructuring",
      "rest operator"
    ],
    "prompt": "Il codice vuole estrarre il primo elemento di un array in una variabile chiamata `primo` e il resto degli elementi in una variabile `resto`, poi stamparli. Tuttavia, il risultato non è quello voluto: `resto` non contiene gli altri elementi ma invece il secondo. Dov'è il problema?",
    "code": "const numeri = [4, 5, 6, 7];\nconst [primo, resto] = numeri;\nconsole.log(primo);\nconsole.log(resto);",
    "options": [
      {
        "id": "a",
        "text": "Manca l'operatore ... prima di resto nel destructuring"
      },
      {
        "id": "b",
        "text": "Serve usare {} invece di [] per estrarre resto"
      },
      {
        "id": "c",
        "text": "Bisogna scrivere resto, primo per invertire l'ordine"
      },
      {
        "id": "d",
        "text": "Il destructuring non funziona con array di numeri"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Senza l'operatore ... la variabile `resto` prende solo il secondo elemento, non tutti gli altri.",
      "whyCorrect": "Per ottenere tutti gli elementi rimanenti nel destructuring di array bisogna usare l'operatore rest (`...resto`). Senza di esso, la seconda variabile riceve solo il secondo elemento.",
      "whyOthersWrong": {
        "b": "Usare le parentesi graffe ({}) serve per il destructuring di oggetti, non di array: con gli array si devono usare sempre le parentesi quadre ([]) e l'operatore ... per rest.",
        "c": "Invertire l'ordine delle variabili non cambia il fatto che senza ..., la seconda prende solo il secondo elemento, non tutti gli altri. L'ordine nel destructuring corrisponde alla posizione degli elementi.",
        "d": "Il destructuring di array funziona perfettamente anche con array di numeri; il tipo degli elementi non influisce sulla sintassi di destructuring."
      },
      "concept": "Rest operator nel destructuring di array",
      "commonMistake": "Dimenticare l'operatore ... davanti alla variabile rest e aspettarsi comunque un array con tutti gli elementi restanti.",
      "example": "const [primo, ...resto] = numeri;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:31.044Z"
  },
  {
    "id": "destructuring-fb-0019",
    "topicId": "destructuring",
    "subtopicId": "destructuring-objects",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "destructuring oggetti",
      "rinomina",
      "valori di default"
    ],
    "prompt": "Il codice vuole estrarre la proprietà `codice` da un oggetto `prodotto`, assegnarla a una variabile `idProdotto` e usare 'N/A' come default se la proprietà manca. Tuttavia, stampando `idProdotto` quando `prodotto` non ha la proprietà `codice`, viene `undefined` invece di 'N/A'. Qual è il problema?",
    "code": "const prodotto = {}; \nconst { idProdotto: codice = 'N/A' } = prodotto;\nconsole.log(codice);",
    "options": [
      {
        "id": "a",
        "text": "Ha invertito nome originale e rinominato"
      },
      {
        "id": "b",
        "text": "Ha usato = nel posto sbagliato"
      },
      {
        "id": "c",
        "text": "Serve la sintassi [] anziché {}"
      },
      {
        "id": "d",
        "text": "Manca una virgola tra le proprietà"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Chi ha invertito ordine in `{ idProdotto: codice }` non ottiene né la rinomina né il default: bisogna scrivere `{ codice: idProdotto = 'N/A' }`.",
      "whyCorrect": "Il destructuring oggetti usa la sintassi `{ originale: nuovoNome = default }`. Qui ha scritto `{ idProdotto: codice = 'N/A' }`, ma `idProdotto` non è una proprietà dell'oggetto, quindi `codice` riceve undefined. Bisogna scrivere `{ codice: idProdotto = 'N/A' }`.",
      "whyOthersWrong": {
        "b": "Il problema non è la posizione del `=`, ma l'ordine tra nome originale e rinominato: il default è scritto nel punto giusto.",
        "c": "La sintassi con le parentesi quadre `[]` serve per destrutturare array, non oggetti: qui serve proprio `{}`.",
        "d": "Non manca una virgola: c'è una sola proprietà nel destructuring, quindi la sintassi è formalmente corretta."
      },
      "concept": "Destructuring oggetti con rinomina e default",
      "commonMistake": "Invertire nome originale e nuovo nome nella sintassi `{ originale: nuovoNome }`.",
      "example": "const { a: b = 1 } = {}; // b = 1"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:58:48.935Z"
  },
  {
    "id": "errors-po-0004",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "flusso try/catch/finally",
      "gestione errori",
      "ordine esecuzione blocchi"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "function f() {\n  try {\n    console.log('inizio');\n    throw new Error('errore');\n  } catch (e) {\n    console.log(e.message);\n  } finally {\n    console.log('sempre');\n  }\n}\nf();",
    "options": [
      {
        "id": "a",
        "text": "inizio\nerrore\nsempre"
      },
      {
        "id": "b",
        "text": "inizio\nsempre"
      },
      {
        "id": "c",
        "text": "errore\ninizio\nsempre"
      },
      {
        "id": "d",
        "text": "inizio\nsempre\nerrore"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Dopo il throw, si entra nel catch (che stampa 'errore'), poi finalmente esegue il blocco finally.",
      "whyCorrect": "Il blocco try stampa 'inizio', poi viene lanciato un errore. Si entra nel catch che stampa il messaggio 'errore', e infine il blocco finally viene eseguito sempre, stampando 'sempre'.",
      "whyOthersWrong": {
        "b": "Senza il catch, il messaggio d'errore non verrebbe stampato. In realtà, 'errore' compare per via del catch.",
        "c": "'errore' non viene mai stampato prima di 'inizio', perché 'inizio' è il primo console.log eseguito.",
        "d": "'errore' viene stampato subito dopo 'inizio', prima di 'sempre'; 'sempre' non anticipa il messaggio d'errore."
      },
      "concept": "Esecuzione completa di try/catch/finally",
      "commonMistake": "Pensare che finally venga eseguito solo se non c'è errore o che catch non venga raggiunto.",
      "example": "try { ... } catch(e) { ... } finally { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:22:13.396Z"
  },
  {
    "id": "errors-po-0005",
    "topicId": "errors",
    "subtopicId": "errors-throw",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "lanciare errori",
      "uso di throw",
      "oggetto Error"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  throw new Error('fallito');\n} catch (e) {\n  console.log(typeof e);\n  console.log(e.name);\n  console.log(e.message);\n}",
    "options": [
      {
        "id": "a",
        "text": "object\nError\nfallito"
      },
      {
        "id": "b",
        "text": "string\nError\nfallito"
      },
      {
        "id": "c",
        "text": "object\nTypeError\nfallito"
      },
      {
        "id": "d",
        "text": "object\nError\nundefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "throw new Error crea un oggetto di tipo Error con name 'Error' e message 'fallito'.",
      "whyCorrect": "Il tipo di e è object, il suo name è 'Error' (valore predefinito del costruttore Error) e message è 'fallito', quindi vengono stampate queste tre righe esattamente.",
      "whyOthersWrong": {
        "b": "Se si lancia una stringa, typeof sarebbe 'string', ma qui viene lanciato un oggetto Error.",
        "c": "Il name è Error, non TypeError, perché viene costruito con Error e non TypeError.",
        "d": "Il message è esplicitamente impostato su 'fallito', non è undefined."
      },
      "concept": "throw new Error e proprietà name/message",
      "commonMistake": "Scambiare il tipo o confondere le proprietà dell'oggetto Error.",
      "example": "throw new Error('test'); // e.message === 'test'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:22:13.397Z"
  },
  {
    "id": "errors-po-0006",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "errori nativi",
      "riconoscere ReferenceError",
      "scope delle variabili"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  let x = y + 1;\n} catch (e) {\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "ReferenceError"
      },
      {
        "id": "b",
        "text": "TypeError"
      },
      {
        "id": "c",
        "text": "SyntaxError"
      },
      {
        "id": "d",
        "text": "RangeError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Accedere a una variabile mai definita lancia ReferenceError.",
      "whyCorrect": "La variabile y non è mai stata dichiarata, quindi valutare y + 1 genera un ReferenceError, che viene catturato e il suo name stampato.",
      "whyOthersWrong": {
        "b": "TypeError si verifica per operazioni su tipi errati (es. chiamare qualcosa che non è funzione), non per variabili non definite.",
        "c": "SyntaxError avviene già in fase di parsing, ma qui la sintassi è corretta: l'errore avviene in esecuzione.",
        "d": "RangeError si verifica per valori fuori intervallo, ad esempio in array o funzioni matematiche."
      },
      "concept": "ReferenceError e variabili non definite",
      "commonMistake": "Scambiare ReferenceError con TypeError per variabili mancanti.",
      "example": "console.log(a); // ReferenceError"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:22:13.398Z"
  },
  {
    "id": "errors-po-0007",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "flusso finally",
      "try/catch senza errori",
      "ordine esecuzione"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "let risorsa = [];\ntry {\n  risorsa.push('aperta');\n  console.log('dentro try');\n} finally {\n  risorsa.push('chiusa');\n}\nconsole.log(risorsa.join('-'));",
    "options": [
      {
        "id": "a",
        "text": "dentro try\naperta-chiusa"
      },
      {
        "id": "b",
        "text": "dentro try\naperta"
      },
      {
        "id": "c",
        "text": "aperta-chiusa\ndentro try"
      },
      {
        "id": "d",
        "text": "dentro try\nchiusa-aperta"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "finally viene eseguito anche se non ci sono errori, aggiornando l'array.",
      "whyCorrect": "Il corpo del try stampa 'dentro try' e aggiunge 'aperta', il finally aggiunge 'chiusa', quindi l'array finale sarà 'aperta-chiusa'.",
      "whyOthersWrong": {
        "b": "Manca il push dentro finally, che viene comunque eseguito e aggiunge 'chiusa'.",
        "c": "L'ordine delle stampe è sbagliato: il console.log nel try viene eseguito prima del join.",
        "d": "La sequenza dei push è 'aperta' poi 'chiusa', non il contrario."
      },
      "concept": "finally sempre eseguito",
      "commonMistake": "Credere che finally giri solo con errori o scambiare l’ordine delle istruzioni.",
      "example": "try { ... } finally { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:22:13.398Z"
  },
  {
    "id": "errors-po-0009",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "errori nativi",
      "comprendere ReferenceError e TypeError"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  y++;\n} catch (e) {\n  console.log(e.name);\n}\ntry {\n  (3)();\n} catch (e) {\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "ReferenceError\nTypeError"
      },
      {
        "id": "b",
        "text": "TypeError\nReferenceError"
      },
      {
        "id": "c",
        "text": "ReferenceError\nReferenceError"
      },
      {
        "id": "d",
        "text": "TypeError\nTypeError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "`y` non è definito (ReferenceError), chiamare `3()` è un TypeError.",
      "whyCorrect": "L'espressione `y++` tenta di usare una variabile mai dichiarata, generando un ReferenceError. `(3)()` tenta di invocare un numero come funzione, quindi genera un TypeError.",
      "whyOthersWrong": {
        "b": "L'invocazione di un numero genera TypeError, ma la prima eccezione riguarda una variabile non dichiarata, che è ReferenceError.",
        "c": "La seconda eccezione non è ReferenceError: `3` esiste (è un numero), ma non è una funzione, quindi il problema è di tipo.",
        "d": "La prima eccezione è ReferenceError poiché `y` non è definita, non TypeError."
      },
      "concept": "Errori nativi ReferenceError e TypeError",
      "commonMistake": "Confondere ReferenceError (variabile non dichiarata) con TypeError (operazione su tipo sbagliato).",
      "example": "try { z++ } catch(e) { console.log(e.name) }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:22:26.247Z"
  },
  {
    "id": "errors-fg-0009",
    "topicId": "errors",
    "subtopicId": "errors-throw",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "creazione Error",
      "uso di throw"
    ],
    "prompt": "Completa la riga per sollevare un errore generico con il messaggio 'Errore di accesso'.",
    "code": "___ new Error('Errore di accesso');",
    "options": [
      {
        "id": "a",
        "text": "throw"
      },
      {
        "id": "b",
        "text": "raise"
      },
      {
        "id": "c",
        "text": "except"
      },
      {
        "id": "d",
        "text": "error"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La parola chiave per sollevare errori in JavaScript è `throw`.",
      "whyCorrect": "In JavaScript si usa `throw` per sollevare (lanciare) un errore e interrompere il flusso normale di esecuzione.",
      "whyOthersWrong": {
        "b": "`raise` è usato in altri linguaggi come Python, ma non funziona in JavaScript.",
        "c": "`except` serve in Python per gestire, non sollevare errori; in JavaScript non è riconosciuto.",
        "d": "`error` non è una parola chiave: bisogna scrivere `throw` per lanciare l’eccezione."
      },
      "concept": "Throw e oggetto Error",
      "commonMistake": "Confondere la sintassi di altri linguaggi con quella di JavaScript.",
      "example": "throw new Error('qualcosa è andato storto');"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:13.360Z"
  },
  {
    "id": "errors-fg-0010",
    "topicId": "errors",
    "subtopicId": "errors-throw",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "creazione Error",
      "informazioni su Error"
    ],
    "prompt": "Completa l’istruzione per mostrare solo il messaggio dell’errore appena catturato.",
    "code": "try {\n  throw new Error('Messaggio di errore');\n} catch (e) {\n  console.log(e.___);\n}",
    "options": [
      {
        "id": "a",
        "text": "message"
      },
      {
        "id": "b",
        "text": "msg"
      },
      {
        "id": "c",
        "text": "text"
      },
      {
        "id": "d",
        "text": "desc"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La proprietà standard per il testo dell’errore è `message`.",
      "whyCorrect": "La proprietà `message` dell’oggetto Error contiene il testo fornito in fase di creazione.",
      "whyOthersWrong": {
        "b": "`msg` non è una proprietà standard dell’oggetto Error; viene spesso usata in altri contesti ma non qui.",
        "c": "`text` non è una proprietà di default di Error in JavaScript.",
        "d": "`desc` non ha alcun ruolo negli oggetti Error standard di JavaScript."
      },
      "concept": "Proprietà Error",
      "commonMistake": "Assumere che la proprietà si chiami come in altri linguaggi o come abbreviazione.",
      "example": "console.log(e.message);"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:13.360Z"
  },
  {
    "id": "errors-fg-0011",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "RangeError",
      "errori nativi"
    ],
    "prompt": "Completa la riga per generare un errore se l’indice richiesto è fuori dal range consentito.",
    "code": "if (indice < 0 || indice >= array.length) {\n  throw new ___('Indice fuori range');\n}",
    "options": [
      {
        "id": "a",
        "text": "RangeError"
      },
      {
        "id": "b",
        "text": "IndexError"
      },
      {
        "id": "c",
        "text": "LimitError"
      },
      {
        "id": "d",
        "text": "BoundaryError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "RangeError segnala valori fuori dagli intervalli leciti.",
      "whyCorrect": "`RangeError` è l’errore previsto in JavaScript per valori numerici al di fuori dei limiti consentiti.",
      "whyOthersWrong": {
        "b": "`IndexError` è tipico di Python, ma non esiste in JavaScript.",
        "c": "`LimitError` non è una classe standard di errore in JavaScript.",
        "d": "`BoundaryError` potrebbe sembrare plausibile ma non è presente tra gli errori nativi."
      },
      "concept": "Errori standard: RangeError",
      "commonMistake": "Cercare classi di errore simili a quelle di altri linguaggi.",
      "example": "throw new RangeError('indice non valido');"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:13.361Z"
  },
  {
    "id": "errors-fg-0013",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "try/catch/finally",
      "cleanup risorse"
    ],
    "prompt": "Completa il codice per eseguire sempre la funzione chiudiConnessione, sia che avvenga un errore sia che tutto vada a buon fine.",
    "code": "try {\n  inviaDati();\n} catch (e) {\n  console.log('Errore: ' + e.message);\n} ___ {\n  chiudiConnessione();\n}",
    "options": [
      {
        "id": "a",
        "text": "finally"
      },
      {
        "id": "b",
        "text": "atLast"
      },
      {
        "id": "c",
        "text": "end"
      },
      {
        "id": "d",
        "text": "after"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La clausola finally viene sempre eseguita.",
      "whyCorrect": "La parola chiave finally permette di eseguire codice sia dopo il successo che dopo un errore, garantendo il cleanup delle risorse.",
      "whyOthersWrong": {
        "b": "atLast non è una parola chiave riconosciuta da JavaScript, quindi genera un errore di sintassi.",
        "c": "end non esiste nella sintassi di try/catch/finally: non viene riconosciuta e causa errore.",
        "d": "after non è una clausola valida in JavaScript in questo contesto, quindi è un errore di sintassi."
      },
      "concept": "try/catch/finally",
      "commonMistake": "Confondere la sintassi delle clausole di gestione errori.",
      "example": "try { ... } finally { risorsa.chiudi(); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:20.736Z"
  },
  {
    "id": "errors-fb-0014",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "flusso try/catch/finally",
      "gestione errori"
    ],
    "prompt": "Questo codice dovrebbe sempre stampare 'Cleanup eseguito', sia che si verifichi un errore che no. Tuttavia, a volte la riga non viene stampata. Individua il problema.",
    "code": "function operazione() {\n  try {\n    JSON.parse('{ invalid json }');\n  } catch (e) {\n    console.log('Errore catturato');\n    return;\n  }\n  console.log('Cleanup eseguito');\n}\noperazione();",
    "options": [
      {
        "id": "a",
        "text": "Il cleanup non è nel blocco finally"
      },
      {
        "id": "b",
        "text": "Manca il controllo sul tipo dell’errore"
      },
      {
        "id": "c",
        "text": "Il catch non gestisce correttamente l’errore"
      },
      {
        "id": "d",
        "text": "Il try non include abbastanza codice"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il blocco 'finally' garantisce che il cleanup venga eseguito sempre, anche dopo un 'return' nel catch.",
      "whyCorrect": "Se il cleanup non è messo in un blocco 'finally', non viene eseguito se c'è un 'return' dentro il catch. Solo 'finally' garantisce l'esecuzione in ogni caso.",
      "whyOthersWrong": {
        "b": "Controllare il tipo dell’errore non influisce sulla stampa del cleanup: il problema è che la pulizia non viene mai eseguita se il flusso esce dal catch con return.",
        "c": "Il catch cattura e gestisce l’errore correttamente, stampando il messaggio; il vero problema è che la pulizia non è garantita dopo il return.",
        "d": "Il try include tutto il codice che può generare un errore; spostare più codice nel try non risolve la mancata esecuzione del cleanup."
      },
      "concept": "Blocco finally in try/catch",
      "commonMistake": "Ignorare che 'finally' si esegue anche in presenza di return.",
      "example": "try { ... } finally { cleanup(); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:44.005Z"
  },
  {
    "id": "errors-fb-0015",
    "topicId": "errors",
    "subtopicId": "errors-throw",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "throw errori corretti",
      "creazione oggetto Error"
    ],
    "prompt": "Il codice dovrebbe sollevare un errore personalizzato con nome e messaggio, ma alcune informazioni si perdono. Qual è il problema?",
    "code": "function calcola(x) {\n  if (typeof x !== 'number') {\n    throw 'Parametro non valido';\n  }\n  return x * 2;\n}\ntry {\n  calcola('ciao');\n} catch (e) {\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "Si lancia una stringa invece di Error"
      },
      {
        "id": "b",
        "text": "Il messaggio d’errore è troppo generico"
      },
      {
        "id": "c",
        "text": "La funzione non restituisce il valore corretto"
      },
      {
        "id": "d",
        "text": "Il catch dovrebbe essere prima della chiamata"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lanciare una stringa fa perdere le proprietà name e stack dell’oggetto Error.",
      "whyCorrect": "Lanciando una stringa si perde il nome e lo stack dell'errore; solo un oggetto Error fornisce queste informazioni standard.",
      "whyOthersWrong": {
        "b": "Il testo del messaggio può essere migliorato, ma non è questo il problema che fa perdere nome e stack.",
        "c": "La funzione non arriva mai a restituire un valore perché viene lanciato un errore prima di ogni return in caso di parametro non valido.",
        "d": "Il catch non può precedere la chiamata: la struttura try/catch è già corretta nel codice dato."
      },
      "concept": "throw con oggetto Error",
      "commonMistake": "Lanciare stringhe invece di oggetti Error.",
      "example": "throw new Error('Parametro non valido');"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:44.007Z"
  },
  {
    "id": "errors-fb-0016",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "riconoscere errori nativi",
      "differenza ReferenceError/TypeError"
    ],
    "prompt": "Il seguente codice dovrebbe gestire il caso di una proprietà non esistente sull’oggetto, ma si verifica un errore diverso dal previsto. Qual è la causa?",
    "code": "let persona = null;\ntry {\n  console.log(persona.nome);\n} catch (e) {\n  if (e.name === 'ReferenceError') {\n    console.log('Variabile non definita');\n  } else {\n    console.log('Altro errore');\n  }\n}",
    "options": [
      {
        "id": "a",
        "text": "Si verifica un TypeError, non ReferenceError"
      },
      {
        "id": "b",
        "text": "Il try/catch non cattura gli errori"
      },
      {
        "id": "c",
        "text": "La variabile persona non è dichiarata"
      },
      {
        "id": "d",
        "text": "La proprietà nome non esiste su persona"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Accedere a una proprietà di null genera TypeError, non ReferenceError.",
      "whyCorrect": "Cercare di accedere a una proprietà su null produce sempre un TypeError, perché null non è un oggetto.",
      "whyOthersWrong": {
        "b": "Il blocco try/catch cattura l’errore, ma il nome dell’errore è diverso da quello atteso.",
        "c": "La variabile persona è dichiarata ed è null; l’errore non riguarda la dichiarazione.",
        "d": "Il problema non è solo l’inesistenza della proprietà, ma che il valore sia null: è qui che si genera un TypeError."
      },
      "concept": "TypeError vs ReferenceError",
      "commonMistake": "Credere che accedere a proprietà di null produca ReferenceError.",
      "example": "console.log(null.foo); // TypeError"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:44.007Z"
  },
  {
    "id": "errors-fb-0017",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "catch errori",
      "gestione errori"
    ],
    "prompt": "Il codice dovrebbe notificare ogni errore, ma durante i test non viene stampato nulla in caso di errore. Qual è il problema?",
    "code": "function sommaNumeri(a, b) {\n  if (typeof a !== 'number' || typeof b !== 'number') {\n    throw new Error('Parametri non numerici');\n  }\n  return a + b;\n}\ntry {\n  sommaNumeri('uno', 'due');\n} catch (e) {\n  // errore ignorato\n}",
    "options": [
      {
        "id": "a",
        "text": "L’errore viene catturato ma non gestito"
      },
      {
        "id": "b",
        "text": "I parametri non sono mai controllati"
      },
      {
        "id": "c",
        "text": "Il try non copre la funzione"
      },
      {
        "id": "d",
        "text": "Il throw è fuori dalla funzione"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il catch non gestisce l’errore: viene ignorato, quindi non si ha notifica.",
      "whyCorrect": "L’errore viene effettivamente catturato, ma il blocco catch è vuoto: per notificare l’errore, bisognerebbe almeno stampare un messaggio all’interno.",
      "whyOthersWrong": {
        "b": "I parametri sono controllati correttamente e, se non numerici, viene lanciato un errore.",
        "c": "Il try include la chiamata a sommaNumeri, quindi copre la funzione coinvolta nell’errore.",
        "d": "Il throw si trova correttamente all’interno della funzione e viene eseguito quando serve."
      },
      "concept": "Importanza della gestione nel blocco catch",
      "commonMistake": "Lasciare il blocco catch vuoto rende invisibili gli errori.",
      "example": "catch (e) { console.log(e.message); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:44.008Z"
  },
  {
    "id": "errors-fb-0018",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "riconoscere errori nativi",
      "differenza RangeError/TypeError"
    ],
    "prompt": "L'obiettivo è generare un RangeError per un indice fuori limite, ma viene prodotto un errore diverso. Dov’è il bug?",
    "code": "let arr = [10, 20, 30];\ntry {\n  console.log(arr[5].toString());\n} catch (e) {\n  if (e instanceof RangeError) {\n    console.log('Indice fuori range');\n  } else {\n    console.log('Altro errore');\n  }\n}",
    "options": [
      {
        "id": "a",
        "text": "Si ottiene un TypeError, non un RangeError"
      },
      {
        "id": "b",
        "text": "L’indice 5 non esiste nell’array"
      },
      {
        "id": "c",
        "text": "La verifica dell’indice è nel posto sbagliato"
      },
      {
        "id": "d",
        "text": "Manca il controllo sul tipo di arr"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Accedere a una proprietà su undefined genera TypeError, non RangeError.",
      "whyCorrect": "Quando si accede a arr[5], si ottiene undefined: chiamare un metodo su undefined produce un TypeError, non RangeError.",
      "whyOthersWrong": {
        "b": "Il problema non è solo l’inesistenza dell’indice, ma il fatto che si chiama un metodo su un valore undefined.",
        "c": "La verifica dell’indice sarebbe utile ma non è la causa dell’errore nativo diverso.",
        "d": "Il tipo di arr è corretto; il problema nasce quando si tenta di usare toString su undefined."
      },
      "concept": "TypeError vs RangeError su array",
      "commonMistake": "Confondere errori generati da accessi invalidi sugli array.",
      "example": "([1][5]).toString() // TypeError"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:44.008Z"
  },
  {
    "id": "errors-fb-0019",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "flusso finally",
      "cleanup risorse"
    ],
    "prompt": "Il seguente codice dovrebbe sempre chiudere la connessione, anche se si verifica un errore. In alcuni casi, però, la funzione di chiusura non viene richiamata. Qual è l’errore?",
    "code": "function connetti() {\n  // ...\n}\nfunction chiudi() {\n  console.log('Connessione chiusa');\n}\ntry {\n  connetti();\n  throw new Error('Errore simulato');\n  chiudi();\n} catch (e) {\n  console.log('Errore!');\n}",
    "options": [
      {
        "id": "a",
        "text": "chiudi deve essere in finally per eseguirsi sempre"
      },
      {
        "id": "b",
        "text": "chiudi dovrebbe essere nel blocco catch"
      },
      {
        "id": "c",
        "text": "chiudi va chiamata prima di throw"
      },
      {
        "id": "d",
        "text": "Il try deve includere solo la connessione"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Solo finally garantisce l’esecuzione della chiusura anche in presenza di errori.",
      "whyCorrect": "Il blocco finally si esegue sempre, sia in caso di errore che di successo. Solo mettendo chiudi() in finally si garantisce la chiusura della risorsa.",
      "whyOthersWrong": {
        "b": "Chiamare chiudi solo nel catch non garantisce nulla se non si verifica l’errore, quindi rischia di mancare la chiusura.",
        "c": "Se si chiama chiudi prima di throw, la risorsa si chiuderebbe anche se l’operazione non è finita, non risolvendo il problema generale.",
        "d": "Limitare il try non risolve la necessità di chiudere la connessione in tutti i casi: serve finally."
      },
      "concept": "Cleanup con finally",
      "commonMistake": "Dimenticare finally per cleanup garantito.",
      "example": "try { ... } finally { chiudi(); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:44.008Z"
  },
  {
    "id": "errors-fb-0020",
    "topicId": "errors",
    "subtopicId": "errors-throw",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "sollevare errori con throw",
      "usare oggetto Error correttamente"
    ],
    "prompt": "Una funzione dovrebbe sollevare un errore descrittivo quando il parametro passato non è una stringa. Attualmente il codice stampa solo il messaggio dell’errore, ma manca un’informazione utile per chi lo intercetta. Qual è il problema?",
    "code": "function verificaNome(nome) {\n  if (typeof nome !== 'string') {\n    throw 'Parametro non valido';\n  }\n  // altro codice\n}\n\ntry {\n  verificaNome(42);\n} catch (e) {\n  console.log(e);\n}",
    "options": [
      {
        "id": "a",
        "text": "Viene lanciata una stringa invece di un oggetto Error"
      },
      {
        "id": "b",
        "text": "L’errore non viene mai effettivamente sollevato"
      },
      {
        "id": "c",
        "text": "La funzione dovrebbe restituire false invece di lanciare errori"
      },
      {
        "id": "d",
        "text": "Il controllo typeof è scritto in modo errato"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lanciare una stringa fa perdere informazioni importanti come nome dell’errore e stack. Bisognerebbe lanciare sempre un oggetto Error.",
      "whyCorrect": "L’attuale throw usa una semplice stringa, che non porta con sé il name e lo stack dell’errore, rendendo più difficile il debugging. Lanciare un oggetto Error consente di ottenere un messaggio e uno stack più utili.",
      "whyOthersWrong": {
        "b": "Il throw viene eseguito se il parametro non è una stringa, quindi l’errore viene effettivamente sollevato e catturato dal blocco catch.",
        "c": "Restituire false non segnala chiaramente un errore, soprattutto se chi usa la funzione si aspetta un’eccezione in caso di parametro non valido.",
        "d": "Il controllo typeof nome !== 'string' è corretto per verificare che nome sia una stringa, quindi qui non c’è nessun errore di sintassi o logica."
      },
      "concept": "throw con oggetto Error",
      "commonMistake": "Lanciare una stringa invece di un oggetto Error, perdendo proprietà utili.",
      "example": "throw new Error('Parametro non valido');"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:32:48.296Z"
  },
  {
    "id": "errors-po-0021",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "try/catch annidati",
      "flusso finally",
      "gestione avanzata errori"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  try {\n    throw new Error('Errore interno');\n  } catch (e) {\n    throw new Error('Errore esterno');\n  } finally {\n    console.log('Cleanup interno');\n  }\n} catch (e) {\n  console.log(e.message);\n} finally {\n  console.log('Cleanup esterno');\n}",
    "options": [
      {
        "id": "a",
        "text": "Cleanup interno\nErrore esterno\nCleanup esterno"
      },
      {
        "id": "b",
        "text": "Errore interno\nCleanup interno\nCleanup esterno"
      },
      {
        "id": "c",
        "text": "Cleanup interno\nCleanup esterno"
      },
      {
        "id": "d",
        "text": "Cleanup interno\nCleanup esterno\nErrore esterno"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il finally interno si esegue sempre, poi l'errore rilanciato viene catturato fuori e si esegue anche il finally esterno.",
      "whyCorrect": "Il finally interno stampa 'Cleanup interno', poi l'errore rilanciato viene catturato dal catch esterno che stampa 'Errore esterno', e infine il finally esterno stampa 'Cleanup esterno'.",
      "whyOthersWrong": {
        "b": "Il messaggio 'Errore interno' non viene mai stampato perché il catch interno rilancia direttamente un nuovo errore con messaggio diverso.",
        "c": "Manca la stampa del messaggio d'errore perché il catch esterno stampa sempre il messaggio di errore rilanciato.",
        "d": "La sequenza non è corretta: il catch esterno stampa l'errore prima del finally esterno, quindi 'Errore esterno' si trova in seconda posizione."
      },
      "concept": "try/catch/finally annidati",
      "commonMistake": "Pensare che il catch interno gestisca tutto e che finally influenzi il flusso d'errore.",
      "example": "try { ... } catch (e) { throw new Error('nuovo'); } finally { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:36:40.551Z"
  },
  {
    "id": "errors-po-0022",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "finally interrompe return",
      "precedenza tra return e finally"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "function prova() {\n  try {\n    return 'A';\n  } finally {\n    return 'B';\n  }\n}\nconsole.log(prova());",
    "options": [
      {
        "id": "a",
        "text": "B"
      },
      {
        "id": "b",
        "text": "A"
      },
      {
        "id": "c",
        "text": "undefined"
      },
      {
        "id": "d",
        "text": "TypeError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il return nel finally sovrascrive quello del try: si ottiene 'B'.",
      "whyCorrect": "In JavaScript, un return nel blocco finally sovrascrive qualsiasi return precedente nel try o catch. Quindi, il risultato finale di prova() è 'B' e quello viene stampato.",
      "whyOthersWrong": {
        "b": "Il return nel try viene ignorato perché il finally ha il suo return, che lo sovrascrive.",
        "c": "La funzione restituisce sempre una stringa, mai undefined, perché ogni percorso termina con return.",
        "d": "Non c'è alcun errore di tipo: il codice è valido e produce un risultato ben definito."
      },
      "concept": "finally e precedenza return",
      "commonMistake": "Pensare che il return nel try abbia priorità sul finally.",
      "example": "try { return 1; } finally { return 2; }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:36:40.552Z"
  },
  {
    "id": "errors-po-0023",
    "topicId": "errors",
    "subtopicId": "errors-throw",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "throw stringa vs throw Error",
      "proprietà oggetto Error"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  throw 'errore semplice';\n} catch (e) {\n  console.log(typeof e);\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "string\nundefined"
      },
      {
        "id": "b",
        "text": "object\nError"
      },
      {
        "id": "c",
        "text": "string\nstring"
      },
      {
        "id": "d",
        "text": "object\nundefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lanciando una stringa, il tipo è 'string' e non c'è proprietà 'name'.",
      "whyCorrect": "Se si lancia una stringa, il valore catturato è letteralmente la stringa stessa, quindi typeof e è 'string' e e.name è undefined.",
      "whyOthersWrong": {
        "b": "Qui non viene lanciato un oggetto Error, quindi typeof restituisce 'string' e non 'object'; inoltre, la proprietà name non esiste.",
        "c": "typeof di una stringa è 'string', ma e.name non restituisce 'string', perché la stringa non ha tale proprietà.",
        "d": "typeof sarebbe 'string', non 'object', dato che si lancia una stringa."
      },
      "concept": "throw e oggetto Error",
      "commonMistake": "Lanciare una stringa e aspettarsi un oggetto Error con proprietà name.",
      "example": "throw new Error('errore'); // e.name === 'Error'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:36:40.552Z"
  },
  {
    "id": "errors-po-0024",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "RangeError",
      "ricorsione non terminante"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "function ricorsiva() {\n  return ricorsiva();\n}\ntry {\n  ricorsiva();\n} catch (e) {\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "RangeError"
      },
      {
        "id": "b",
        "text": "TypeError"
      },
      {
        "id": "c",
        "text": "ReferenceError"
      },
      {
        "id": "d",
        "text": "SyntaxError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "L'eccesso di ricorsione porta a un RangeError.",
      "whyCorrect": "In caso di stack overflow per ricorsione senza termine, JavaScript solleva un RangeError.",
      "whyOthersWrong": {
        "b": "TypeError riguarda operazioni su tipi sbagliati, non stack overflow.",
        "c": "ReferenceError si verifica se si usa una variabile non definita, non per ricorsione.",
        "d": "SyntaxError si verifica in fase di parsing, non durante l'esecuzione ricorsiva."
      },
      "concept": "Errori nativi: RangeError",
      "commonMistake": "Confondere RangeError con TypeError per errori di chiamata funzione.",
      "example": "function f() { f(); } // RangeError per stack overflow"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:36:40.553Z"
  },
  {
    "id": "errors-po-0025",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "gestione errori",
      "flusso finally",
      "side effect"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "function controlla() {\n  try {\n    throw new Error('primo');\n  } catch (e) {\n    throw new Error('secondo');\n  } finally {\n    console.log('chiusura');\n  }\n}\n\ntry {\n  controlla();\n} catch (e) {\n  console.log(e.message);\n}",
    "options": [
      {
        "id": "a",
        "text": "chiusura\nsecondo"
      },
      {
        "id": "b",
        "text": "chiusura\nprimo"
      },
      {
        "id": "c",
        "text": "secondo\nchiusura"
      },
      {
        "id": "d",
        "text": "primo\nchiusura"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il finally viene eseguito comunque, poi l'errore lanciato dal catch viene intercettato e se ne stampa il messaggio.",
      "whyCorrect": "La funzione solleva prima un errore ('primo'), ma il catch subito lo cattura e ne rilancia uno nuovo ('secondo'). Il blocco finally viene sempre eseguito, quindi 'chiusura' viene stampato per primo. Il nuovo errore viene poi intercettato dal catch esterno, che stampa il messaggio 'secondo'.",
      "whyOthersWrong": {
        "b": "Il catch interno lancia 'secondo', quindi il catch esterno non può ricevere il messaggio 'primo'. 'chiusura' resta corretta, ma il messaggio stampato non corrisponde.",
        "c": "L'ordine di stampa è sbagliato: il finally si esegue prima che il catch esterno stampi il nuovo messaggio d'errore, quindi 'chiusura' viene sempre prima.",
        "d": "Il messaggio 'primo' non può raggiungere il catch esterno perché viene sovrascritto dal nuovo errore lanciato nel catch interno. L'ordine sarebbe comunque sbagliato."
      },
      "concept": "try/catch/finally e rilancio errori",
      "commonMistake": "Pensare che finally esegua dopo il catch esterno oppure che il primo errore sia visibile fuori.",
      "example": "try { throw new Error('a') } catch { throw new Error('b') } finally { console.log('c') }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:36:51.628Z"
  },
  {
    "id": "errors-fg-0023",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "try/catch",
      "gestione errori"
    ],
    "prompt": "Completa il blocco per catturare un errore durante il parsing di una stringa JSON.",
    "code": "try {\n  JSON.parse(dati);\n} ___ (e) {\n  console.log('Errore nel parsing');\n}",
    "options": [
      {
        "id": "a",
        "text": "catch"
      },
      {
        "id": "b",
        "text": "error"
      },
      {
        "id": "c",
        "text": "except"
      },
      {
        "id": "d",
        "text": "handle"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La parola chiave catch serve per intercettare errori nei blocchi try.",
      "whyCorrect": "catch è la parola chiave giusta per intercettare un’eccezione in JavaScript. Il parametro tra parentesi sarà l’oggetto errore generato dall’istruzione nel blocco try.",
      "whyOthersWrong": {
        "b": "error non è una parola chiave JavaScript: non introduce un blocco di gestione delle eccezioni.",
        "c": "except è usato in Python, non in JavaScript: qui bisogna usare catch.",
        "d": "handle non è una parola riservata per la gestione degli errori in JavaScript."
      },
      "concept": "try/catch per intercettare errori",
      "commonMistake": "Confondere catch con except o altri nomi usati in altri linguaggi.",
      "example": "try { ... } catch (e) { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:25.826Z"
  },
  {
    "id": "errors-fg-0025",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "errori nativi",
      "ReferenceError",
      "TypeError"
    ],
    "prompt": "Completa la riga per verificare se l’errore catturato è di tipo ReferenceError.",
    "code": "try {\n  usaVariabileNonDefinita();\n} catch (e) {\n  if (___) {\n    console.log('Variabile non definita');\n  }\n}",
    "options": [
      {
        "id": "a",
        "text": "e instanceof ReferenceError"
      },
      {
        "id": "b",
        "text": "e.name === 'TypeError'"
      },
      {
        "id": "c",
        "text": "e instanceof TypeError"
      },
      {
        "id": "d",
        "text": "typeof e === 'ReferenceError'"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "instanceof ReferenceError controlla il tipo nativo dell’errore.",
      "whyCorrect": "Con instanceof ReferenceError verifichiamo che l'errore sia effettivamente di quel tipo: è il modo più affidabile e idiomatico per distinguere i diversi errori nativi.",
      "whyOthersWrong": {
        "b": "Questo controllo verifica se il nome dell’errore è TypeError, quindi non corrisponde al ReferenceError richiesto.",
        "c": "instanceof TypeError controlla un altro tipo di errore, non ReferenceError: non rileva il caso voluto.",
        "d": "typeof su un oggetto restituisce 'object', non il nome della classe: questa condizione è sempre falsa."
      },
      "concept": "Errori nativi: ReferenceError",
      "commonMistake": "Confondere TypeError con ReferenceError o usare typeof sugli errori.",
      "example": "if (e instanceof TypeError) { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:25.826Z"
  },
  {
    "id": "errors-po-0026",
    "topicId": "errors",
    "subtopicId": "errors-try-catch",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "flow-control",
      "error-handling",
      "finally-block"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "function calcola(x) {\n  try {\n    if (x < 0) throw new Error('Negativo');\n    return x * 2;\n  } catch (e) {\n    return 'Errore';\n  } finally {\n    console.log('Cleanup');\n  }\n}\nconsole.log(calcola(-1));\nconsole.log(calcola(2));",
    "options": [
      {
        "id": "a",
        "text": "Cleanup\nErrore\nCleanup\n4"
      },
      {
        "id": "b",
        "text": "Errore\nCleanup\n4\nCleanup"
      },
      {
        "id": "c",
        "text": "Errore\n4\nCleanup\nCleanup"
      },
      {
        "id": "d",
        "text": "Cleanup\nErrore\n4\nCleanup"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il blocco finally viene eseguito sempre, prima che la funzione restituisca, sia in caso di errore che di successo.",
      "whyCorrect": "Quando `calcola(-1)` lancia, si entra nel catch che ritorna 'Errore', ma il finally stampa prima 'Cleanup'. Su `calcola(2)`, non c'è errore: il finally stampa 'Cleanup' e poi si ritorna 4. Quindi l'output è 'Cleanup\\nErrore\\nCleanup\\n4'.",
      "whyOthersWrong": {
        "b": "Qui l'ordine tra 'Cleanup' e i valori restituiti è sbagliato: il finally esegue sempre prima del return, quindi 'Cleanup' precede sia 'Errore' sia '4' sulle rispettive chiamate.",
        "c": "In questo caso, 'Cleanup' appare solo dopo entrambe le chiamate. Invece il finally viene eseguito ogni volta, subito prima della restituzione, e quindi deve comparire due volte alternato alle altre stampe.",
        "d": "L'ordine suggerisce che 'Cleanup' venga stampato prima sia di 'Errore' che di '4', come se fosse fuori dalla funzione, invece il finally è all'interno e si esegue ogni volta prima del return del singolo calcolo."
      },
      "concept": "Ordine esecuzione try/catch/finally",
      "commonMistake": "Pensare che il finally venga eseguito solo dopo tutto il codice, non ad ogni chiamata prima del return.",
      "example": "try { ... } finally { console.log('cleanup'); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:37.214Z"
  },
  {
    "id": "errors-po-0027",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "error-types",
      "reference-vs-type-error"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  let res = valoreNonDefinito * 2;\n  console.log('Risultato:', res);\n} catch (e) {\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "ReferenceError"
      },
      {
        "id": "b",
        "text": "TypeError"
      },
      {
        "id": "c",
        "text": "Risultato: NaN"
      },
      {
        "id": "d",
        "text": "undefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Accedere a una variabile non dichiarata genera un ReferenceError.",
      "whyCorrect": "La variabile 'valoreNonDefinito' non esiste, quindi JavaScript lancia subito un ReferenceError, che viene catturato dal catch. Nel blocco catch stampiamo il suo name, cioè 'ReferenceError'.",
      "whyOthersWrong": {
        "b": "TypeError si verifica su operazioni invalidi di tipo, ma qui l'errore è che la variabile non è definita: viene prima ReferenceError.",
        "c": "L'operazione non arriva mai a produrre NaN perché il codice fallisce già alla lettura della variabile, quindi non si stampa 'Risultato: NaN'.",
        "d": "Il catch stampa il nome della classe d’errore, non il valore undefined. Nessuna variabile in gioco vale undefined in questa stampa."
      },
      "concept": "Errori nativi: ReferenceError vs TypeError",
      "commonMistake": "Aspettarsi un TypeError o NaN perché l'operazione è aritmetica, senza considerare che la variabile non è proprio dichiarata.",
      "example": "console.log(nomeNonDefinito) // ReferenceError"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:37.217Z"
  },
  {
    "id": "errors-po-0028",
    "topicId": "errors",
    "subtopicId": "errors-throw",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "throw",
      "error-object-properties"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  throw { name: 'MioErrore', message: 'Qualcosa non va' };\n} catch (e) {\n  console.log(e instanceof Error);\n  console.log(e.name);\n  console.log(e.message);\n}",
    "options": [
      {
        "id": "a",
        "text": "false\nMioErrore\nQualcosa non va"
      },
      {
        "id": "b",
        "text": "true\nMioErrore\nQualcosa non va"
      },
      {
        "id": "c",
        "text": "false\nError\nundefined"
      },
      {
        "id": "d",
        "text": "true\nError\nQualcosa non va"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lanciando un oggetto letterale, il tipo non è Error e non eredita proprietà/metodi di Error.",
      "whyCorrect": "L'oggetto lanciato non è un'istanza di Error ma solo un oggetto con le proprietà name e message. Quindi instanceof Error dà false, e.name e e.message sono presenti e stampano i valori dati.",
      "whyOthersWrong": {
        "b": "L'oggetto non è costruito con new Error, quindi instanceof Error restituisce false, non true.",
        "c": "L'oggetto lanciato non ha name = 'Error', ma 'MioErrore' e ha message valorizzato.",
        "d": "Come prima, instanceof Error restituisce false, mai true, se si lancia un oggetto generico."
      },
      "concept": "Lanciare oggetti Error vs oggetti generici",
      "commonMistake": "Pensare che qualsiasi oggetto con name e message sia automaticamente un Error vero e proprio.",
      "example": "throw new Error('messaggio'); // instanceof Error === true"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:37.217Z"
  },
  {
    "id": "errors-po-0029",
    "topicId": "errors",
    "subtopicId": "errors-throw",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "gestione errori",
      "throw",
      "oggetto Error"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "function controllaValore(x) {\n  if (typeof x !== 'number') {\n    throw new TypeError('atteso un numero');\n  }\n  return x * 2;\n}\n\ntry {\n  console.log(controllaValore('5'));\n} catch (errore) {\n  console.log(errore.name);\n  console.log(errore.message);\n}",
    "options": [
      {
        "id": "a",
        "text": "TypeError\natteso un numero"
      },
      {
        "id": "b",
        "text": "TypeError\nundefined"
      },
      {
        "id": "c",
        "text": "ReferenceError\natteso un numero"
      },
      {
        "id": "d",
        "text": "TypeError\ncontrollaValore is not a function"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La funzione lancia un TypeError personalizzato: il catch stampa nome e messaggio.",
      "whyCorrect": "Il blocco `try` invoca la funzione con una stringa, attivando il ramo di errore che lancia un `TypeError` con messaggio 'atteso un numero'. Il catch stampa prima `name` (TypeError) e poi `message` (atteso un numero).",
      "whyOthersWrong": {
        "b": "La proprietà `message` di un oggetto `Error` personalizzato contiene il messaggio specificato ('atteso un numero'), non `undefined`.",
        "c": "Viene lanciato un `TypeError` perché il valore passato non è di tipo numero, non un `ReferenceError` che riguarda nomi non definiti.",
        "d": "Il messaggio 'controllaValore is not a function' sarebbe generato se si tentasse di chiamare qualcosa che non è una funzione, ma qui la funzione esiste e viene chiamata."
      },
      "concept": "throw e oggetto Error",
      "commonMistake": "Pensare che il messaggio di errore venga ignorato o che si generi un altro tipo di errore.",
      "example": "throw new TypeError('Parametro non valido');"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:41.462Z"
  },
  {
    "id": "errors-po-0030",
    "topicId": "errors",
    "subtopicId": "errors-native",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "errori nativi",
      "ReferenceError",
      "scope delle variabili"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  let x = 3;\n  console.log(y);\n} catch (e) {\n  console.log(e.name);\n}\nconsole.log('dopo');",
    "options": [
      {
        "id": "a",
        "text": "ReferenceError\ndopo"
      },
      {
        "id": "b",
        "text": "TypeError\ndopo"
      },
      {
        "id": "c",
        "text": "ReferenceError"
      },
      {
        "id": "d",
        "text": "dopo\nReferenceError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Stampando una variabile non dichiarata si genera ReferenceError, poi il programma continua.",
      "whyCorrect": "L’accesso a `y` (non dichiarato) genera un `ReferenceError`, il cui nome viene stampato nel catch. Dopo il blocco try/catch, viene stampato 'dopo'.",
      "whyOthersWrong": {
        "b": "Un `TypeError` si verifica quando si fa qualcosa di non valido su un tipo, non quando manca una variabile.",
        "c": "Dopo il blocco catch, il codice prosegue e viene stampato anche 'dopo'.",
        "d": "L’ordine è quello del flusso di esecuzione: prima l’errore nel catch, poi 'dopo'."
      },
      "concept": "Errori nativi: ReferenceError",
      "commonMistake": "Confondere ReferenceError (variabile non definita) con TypeError o pensare che l’errore interrompa il resto del programma.",
      "example": "try { console.log(foo); } catch(e) { console.log(e.name); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:41.464Z"
  },
  {
    "id": "json-fg-0001",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "serializzazione oggetti",
      "comportamento undefined"
    ],
    "prompt": "Completa il codice per serializzare l'oggetto in JSON, sapendo che la proprietà con valore undefined NON deve apparire nel risultato.",
    "code": "const oggetto = { nome: \"Luca\", età: undefined };\nconst testo = ___;\nconsole.log(testo);",
    "options": [
      {
        "id": "a",
        "text": "JSON.stringify(oggetto)"
      },
      {
        "id": "b",
        "text": "JSON.parse(oggetto)"
      },
      {
        "id": "c",
        "text": "oggetto.toString()"
      },
      {
        "id": "d",
        "text": "JSON.encode(oggetto)"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Solo JSON.stringify serializza correttamente l'oggetto eliminando le proprietà undefined.",
      "whyCorrect": "JSON.stringify converte l'oggetto in una stringa JSON e, come da specifica, omette le proprietà con valore undefined.",
      "whyOthersWrong": {
        "b": "JSON.parse accetta solo stringhe JSON, non oggetti: dà errore di tipo e non esegue la serializzazione.",
        "c": "toString su un oggetto restituisce '[object Object]', non una rappresentazione JSON.",
        "d": "JSON.encode non esiste in JavaScript: è un nome che può confondere con altre librerie."
      },
      "concept": "JSON.stringify e proprietà undefined",
      "commonMistake": "Usare metodi inesistenti o aspettarsi che toString serializzi un oggetto.",
      "example": "JSON.stringify({ a: 1, b: undefined }) // '{\"a\":1}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:04.913Z"
  },
  {
    "id": "json-fg-0002",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "parse JSON",
      "accesso proprietà"
    ],
    "prompt": "Completa il codice per ottenere il valore della proprietà x dall'oggetto JSON fornito come stringa.",
    "code": "const json = '{\"x\": 7}';\nconst oggetto = ___;\nconsole.log(oggetto.x);",
    "options": [
      {
        "id": "a",
        "text": "JSON.parse(json)"
      },
      {
        "id": "b",
        "text": "JSON.stringify(json)"
      },
      {
        "id": "c",
        "text": "json.parse()"
      },
      {
        "id": "d",
        "text": "parseJSON(json)"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "JSON.parse trasforma la stringa in oggetto, restituendo l'accesso a x.",
      "whyCorrect": "JSON.parse converte la stringa in un oggetto JavaScript, così si può accedere direttamente alla proprietà x.",
      "whyOthersWrong": {
        "b": "JSON.stringify trasformerebbe 'json' in una stringa letterale, non in un oggetto.",
        "c": "json.parse non è una funzione valida: 'json' è una stringa, non un oggetto con metodi.",
        "d": "parseJSON non è definita in JavaScript standard, anche se il nome può trarre in inganno."
      },
      "concept": "Uso di JSON.parse",
      "commonMistake": "Confondere parse e stringify, o usare nomi di funzioni inesistenti.",
      "example": "JSON.parse('{\"a\":2}') // { a: 2 }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:04.913Z"
  },
  {
    "id": "json-fg-0003",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "gestione errori",
      "try-catch",
      "parse JSON"
    ],
    "prompt": "Completa il codice per evitare che un errore blocchi il programma quando si effettua il parse di testo JSON non valido.",
    "code": "const input = \"{ nome: 'Anna' }\";\nlet risultato;\ntry {\n  risultato = ___;\n} catch (e) {\n  risultato = 'Errore';\n}\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "JSON.parse(input)"
      },
      {
        "id": "b",
        "text": "parseJSON(input)"
      },
      {
        "id": "c",
        "text": "JSON.stringify(input)"
      },
      {
        "id": "d",
        "text": "input.toJSON()"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Solo JSON.parse può lanciare errori su testo non valido.",
      "whyCorrect": "JSON.parse genera un errore se il formato non rispetta la sintassi JSON, quindi va usato nel blocco try/catch.",
      "whyOthersWrong": {
        "b": "parseJSON non è una funzione standard: produce ReferenceError.",
        "c": "JSON.stringify converte in stringa ma non lancia errori su formato errato.",
        "d": "input è una stringa, non ha il metodo toJSON, quindi si ottiene TypeError."
      },
      "concept": "Gestione errori su JSON.parse",
      "commonMistake": "Usare funzioni non standard o metodi non esistenti sulle stringhe.",
      "example": "try { JSON.parse('testo') } catch (e) { /* gestisci errore */ }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:04.914Z"
  },
  {
    "id": "json-fg-0006",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "serializzare funzioni",
      "comportamento JSON"
    ],
    "prompt": "Completa il codice per serializzare l'oggetto senza includere la funzione come proprietà.",
    "code": "const dati = { nome: \"Sara\", saluta: function() { return \"ciao\"; } };\nconst stringa = ___;\nconsole.log(stringa); // Deve stampare '{\"nome\":\"Sara\"}'",
    "options": [
      {
        "id": "a",
        "text": "JSON.stringify(dati)"
      },
      {
        "id": "b",
        "text": "JSON.stringify(dati.saluta)"
      },
      {
        "id": "c",
        "text": "JSON.stringify(Object.keys(dati))"
      },
      {
        "id": "d",
        "text": "JSON.stringify([dati])"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "JSON.stringify ignora le proprietà funzione negli oggetti.",
      "whyCorrect": "Quando si serializza un oggetto con proprietà funzione, queste vengono omesse e non appaiono nella stringa JSON risultante.",
      "whyOthersWrong": {
        "b": "Serializzare una funzione restituisce undefined, quindi la stringa risultante sarebbe undefined.",
        "c": "Serializzare Object.keys(dati) crea una stringa JSON con le chiavi come array, non con i valori.",
        "d": "Serializzare un array con dati produce una rappresentazione JSON di un array, non dell'oggetto stesso."
      },
      "concept": "Funzioni omesse da JSON.stringify",
      "commonMistake": "Pensare che le funzioni vengano incluse o convertite.",
      "example": "JSON.stringify({ a: 1, f: () => 2 }) // '{\"a\":1}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:18.773Z"
  },
  {
    "id": "json-fg-0007",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "Serializzare oggetti con JSON.stringify"
    ],
    "prompt": "Completare il codice per ottenere una stringa JSON che rappresenta l'oggetto `dati`.",
    "code": "const dati = { nome: \"Luca\", età: 30 };\nconst risultato = ___;\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "JSON.stringify(dati)"
      },
      {
        "id": "b",
        "text": "JSON.parse(dati)"
      },
      {
        "id": "c",
        "text": "String(dati)"
      },
      {
        "id": "d",
        "text": "dati.toString()"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "JSON.stringify converte un oggetto JavaScript in una stringa JSON.",
      "whyCorrect": "JSON.stringify è il metodo corretto per serializzare oggetti JavaScript in formato JSON. Con questo metodo otteniamo una stringa rappresentazione dell'oggetto.",
      "whyOthersWrong": {
        "b": "JSON.parse converte una stringa JSON in un oggetto, ma qui serve l’operazione inversa: serializzare, non deserializzare.",
        "c": "String applicato a un oggetto restituisce '[object Object]', non una stringa JSON valida.",
        "d": "toString sugli oggetti restituisce '[object Object]', che non è una rappresentazione JSON."
      },
      "concept": "Serializzazione con JSON.stringify",
      "commonMistake": "Usare String o toString invece di JSON.stringify per serializzare oggetti.",
      "example": "JSON.stringify({ a: 1 }) // '{\"a\":1}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:22.261Z"
  },
  {
    "id": "json-fb-0001",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "serializzazione oggetti",
      "gestione valori non serializzabili"
    ],
    "prompt": "Questo codice dovrebbe serializzare un oggetto includendo tutte le sue proprietà, ma la proprietà 'b' sparisce dal risultato.",
    "code": "const obj = { a: 1, b: undefined };\nconst testo = JSON.stringify(obj);\nconsole.log(testo);",
    "options": [
      {
        "id": "a",
        "text": "Le proprietà con undefined non vengono incluse"
      },
      {
        "id": "b",
        "text": "JSON.stringify non gestisce oggetti annidati"
      },
      {
        "id": "c",
        "text": "Serve passare un replacer per vedere tutto"
      },
      {
        "id": "d",
        "text": "Manca l'opzione per le proprietà nulle"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "JSON.stringify omette le proprietà con valore undefined.",
      "whyCorrect": "Quando si serializza un oggetto, tutte le proprietà che hanno valore undefined vengono omesse dall'output JSON. Quindi 'b' non compare nella stringa risultante.",
      "whyOthersWrong": {
        "b": "JSON.stringify serializza perfettamente oggetti annidati finché tutte le proprietà sono serializzabili; il problema qui non riguarda l'annidamento.",
        "c": "Un replacer permette di filtrare o modificare le proprietà, ma il comportamento standard senza replacer è già corretto: undefined viene omesso comunque.",
        "d": "Non esiste alcuna opzione che includa le proprietà nulle: null viene serializzato, undefined viene omesso, ed è proprio questo il caso."
      },
      "concept": "Serializzazione di proprietà undefined",
      "commonMistake": "Aspettarsi che undefined venga convertito in null o una stringa.",
      "example": "JSON.stringify({ x: undefined, y: 2 }) // '{\"y\":2}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:21.246Z"
  },
  {
    "id": "json-fb-0002",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "serializzazione funzioni",
      "differenza tra valori serializzabili e non"
    ],
    "prompt": "Si vorrebbe includere una funzione nell'oggetto serializzato, ma nell'output la proprietà 'metodo' non appare affatto.",
    "code": "const persona = {\n  nome: 'Luca',\n  metodo: function() { return 'ciao'; }\n};\nconsole.log(JSON.stringify(persona));",
    "options": [
      {
        "id": "a",
        "text": "Le funzioni vengono omesse dalla serializzazione"
      },
      {
        "id": "b",
        "text": "Le funzioni vengono convertite in stringhe"
      },
      {
        "id": "c",
        "text": "Serve passare la funzione come stringa"
      },
      {
        "id": "d",
        "text": "Il metodo va invocato prima di serializzare"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le funzioni non vengono incluse da JSON.stringify.",
      "whyCorrect": "Durante la serializzazione con JSON.stringify, le proprietà il cui valore è una funzione vengono completamente ignorate: non compaiono affatto nel risultato.",
      "whyOthersWrong": {
        "b": "Se ci si aspetta che le funzioni vengano convertite automaticamente in stringhe, si sbaglia: vengono semplicemente omesse.",
        "c": "Convertire la funzione in stringa manualmente cambierebbe il tipo, ma di default JSON.stringify non fa questa conversione.",
        "d": "Invocare il metodo prima della serializzazione serve solo a ottenere il risultato della funzione, non a includerla come funzione nell'oggetto."
      },
      "concept": "Serializzazione delle funzioni",
      "commonMistake": "Credere che le funzioni vengano incluse come stringhe o oggetti.",
      "example": "JSON.stringify({ f: () => 1 }) // '{}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:21.246Z"
  },
  {
    "id": "json-fb-0003",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "parsing JSON",
      "gestione errori sintassi"
    ],
    "prompt": "Si vuole convertire una stringa JSON in oggetto, ma il codice lancia un errore invece di restituire il risultato desiderato.",
    "code": "const testo = \"{'a': 1, 'b': 2}\";\nconst oggetto = JSON.parse(testo);\nconsole.log(oggetto);",
    "options": [
      {
        "id": "a",
        "text": "Il JSON valido richiede virgolette doppie"
      },
      {
        "id": "b",
        "text": "JSON.parse non gestisce numeri"
      },
      {
        "id": "c",
        "text": "Le parentesi graffe non sono permesse"
      },
      {
        "id": "d",
        "text": "Serve parseInt prima di JSON.parse"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le chiavi e le stringhe JSON usano sempre virgolette doppie.",
      "whyCorrect": "Il formato JSON ammette solo virgolette doppie per chiavi e stringhe. Usando virgolette singole, JSON.parse solleva un SyntaxError.",
      "whyOthersWrong": {
        "b": "JSON.parse gestisce perfettamente i numeri nel formato JSON corretto; l'errore qui è dovuto alla sintassi, non ai numeri.",
        "c": "Le parentesi graffe sono richieste per gli oggetti JSON; il problema non è questo.",
        "d": "parseInt serve per convertire stringhe numeriche in numeri, ma qui si sta cercando di parsare un oggetto."
      },
      "concept": "Regole di sintassi del JSON",
      "commonMistake": "Usare virgolette singole pensando siano valide in JSON.",
      "example": "JSON.parse('{\"a\": 1}') // { a: 1 }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:21.247Z"
  },
  {
    "id": "json-fb-0004",
    "topicId": "json",
    "subtopicId": "json-deep-copy",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "deep copy",
      "limiti della serializzazione"
    ],
    "prompt": "L'obiettivo era clonare in profondità un oggetto che contiene una data, ma nell'oggetto clonato la data non è più una istanza di Date.",
    "code": "const originale = { data: new Date('2022-01-01') };\nconst copia = JSON.parse(JSON.stringify(originale));\nconsole.log(copia.data instanceof Date);",
    "options": [
      {
        "id": "a",
        "text": "JSON non conserva i tipi Date: diventano stringhe"
      },
      {
        "id": "b",
        "text": "La funzione JSON.stringify non copia i metodi"
      },
      {
        "id": "c",
        "text": "Bisogna serializzare la data manualmente"
      },
      {
        "id": "d",
        "text": "Le istanze di Date sono bloccate da JSON.parse"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le date diventano stringhe con JSON, non oggetti Date.",
      "whyCorrect": "JSON.stringify serializza le Date come stringhe ISO, e JSON.parse ricostruisce una stringa, non una vera istanza di Date.",
      "whyOthersWrong": {
        "b": "Non sono i metodi a mancare, ma proprio la natura di Date: quell'attributo è ora una stringa.",
        "c": "Serializzare manualmente la data non risolve perché la questione è la ricostruzione dell'oggetto Date, che richiede una conversione esplicita dopo il parse.",
        "d": "JSON.parse non blocca le Date: non ha semplicemente modo di distinguere una stringa che rappresenta una data da una qualsiasi altra stringa."
      },
      "concept": "Limitazioni della copia profonda via JSON",
      "commonMistake": "Aspettarsi che Date rimanga di tipo Date dopo la copia.",
      "example": "JSON.parse(JSON.stringify({ d: new Date() })).d // stringa"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:21.247Z"
  },
  {
    "id": "json-fb-0005",
    "topicId": "json",
    "subtopicId": "json-deep-copy",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "deep copy",
      "gestione strutture cicliche"
    ],
    "prompt": "Si prova a clonare un oggetto che fa riferimento a sé stesso, ma il codice provoca un errore invece di restituire la copia.",
    "code": "const oggetto = {};\noggetto.me = oggetto;\nconst copia = JSON.parse(JSON.stringify(oggetto));",
    "options": [
      {
        "id": "a",
        "text": "JSON.stringify lancia su oggetti con riferimenti ciclici"
      },
      {
        "id": "b",
        "text": "Serve un replacer per i riferimenti ciclici"
      },
      {
        "id": "c",
        "text": "JSON.parse non gestisce le proprietà ricorsive"
      },
      {
        "id": "d",
        "text": "Manca un'opzione deepClone in JSON.stringify"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "JSON.stringify non può serializzare riferimenti ciclici: lancia TypeError.",
      "whyCorrect": "Se si prova a serializzare un oggetto con riferimenti ciclici, JSON.stringify solleva un TypeError e l'operazione si interrompe.",
      "whyOthersWrong": {
        "b": "Un replacer personalizzato potrebbe aiutare a filtrare i riferimenti ciclici, ma non risolve automaticamente il problema: di default l'errore si verifica comunque.",
        "c": "L'errore si verifica già durante la serializzazione e JSON.parse non entra proprio in gioco.",
        "d": "Non esiste alcuna opzione 'deepClone' integrata in JSON.stringify; la funzione serve solo a serializzare."
      },
      "concept": "Riferimenti ciclici e serializzazione JSON",
      "commonMistake": "Tentare di clonare strutture cicliche con JSON.stringify.",
      "example": "const a = {}; a.me = a; JSON.stringify(a) // TypeError"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:21.247Z"
  },
  {
    "id": "json-fb-0006",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "analizzare codice",
      "riconoscere limiti di JSON.stringify"
    ],
    "prompt": "Un programmatore vuole serializzare un oggetto che contiene una funzione e una proprietà `undefined`, per inviarlo tramite AJAX. Tuttavia, nota che il risultato della serializzazione non è come si aspettava: alcune informazioni mancano nel testo JSON prodotto. Individua il problema.",
    "code": "const utente = {\n  nome: \"Mario\",\n  saluta: function() { return \"Ciao\"; },\n  cognome: undefined\n};\nconst dati = JSON.stringify(utente);\nconsole.log(dati);",
    "options": [
      {
        "id": "a",
        "text": "Le proprietà funzione e undefined vengono omesse"
      },
      {
        "id": "b",
        "text": "La funzione viene serializzata come stringa"
      },
      {
        "id": "c",
        "text": "La proprietà undefined diventa null"
      },
      {
        "id": "d",
        "text": "Viene lanciato un errore di serializzazione"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le funzioni e le proprietà `undefined` vengono ignorate da `JSON.stringify`, quindi non compaiono nel testo prodotto.",
      "whyCorrect": "Nel processo di serializzazione con `JSON.stringify`, sia le proprietà che contengono funzioni sia quelle con valore `undefined` vengono completamente omesse dal risultato. Nel JSON finale resta solo la proprietà `nome`.",
      "whyOthersWrong": {
        "b": "Le funzioni non vengono mai convertite in stringa da `JSON.stringify`; vengono semplicemente scartate senza apparire nel testo serializzato.",
        "c": "Le proprietà `undefined` non vengono trasformate in `null`, ma omesse del tutto dal JSON risultante. Solo se il valore fosse esplicitamente `null` verrebbe incluso.",
        "d": "Non si verifica alcun errore: `JSON.stringify` gestisce normalmente funzioni e `undefined` omettendole, senza interrompere il programma."
      },
      "concept": "Omissione di tipi non supportati da JSON",
      "commonMistake": "Credere che funzioni o `undefined` vengano serializzati come stringa o `null`.",
      "example": "JSON.stringify({ ok: undefined, foo: function() {}, x: 1 }) // '{\"x\":1}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:29.916Z"
  },
  {
    "id": "json-fb-0007",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "debugging JSON.parse",
      "gestione degli errori di parsing"
    ],
    "prompt": "Un utente riceve una stringa JSON da un servizio esterno e vuole convertirla in oggetto JavaScript. Tuttavia, il codice va in errore appena eseguito. Qual è la causa più probabile del problema?",
    "code": "const risposta = \"{'id': 123, 'attivo': true}\";\nconst obj = JSON.parse(risposta);\nconsole.log(obj.id);",
    "options": [
      {
        "id": "a",
        "text": "Le virgolette usate sono singole invece che doppie"
      },
      {
        "id": "b",
        "text": "Il valore booleano non è scritto in maiuscolo"
      },
      {
        "id": "c",
        "text": "Manca una virgola tra le proprietà"
      },
      {
        "id": "d",
        "text": "Le chiavi dovrebbero essere senza virgolette"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il formato JSON richiede virgolette doppie per le chiavi e le stringhe, altrimenti `JSON.parse` lancia un errore di sintassi.",
      "whyCorrect": "In JSON valido, tutte le chiavi e le stringhe vanno racchiuse tra virgolette doppie. Usando virgolette singole, `JSON.parse` lancia un `SyntaxError` senza nemmeno iniziare il parsing.",
      "whyOthersWrong": {
        "b": "Il valore booleano `true` è corretto in minuscolo in JSON; il problema non è la capitalizzazione, ma l'uso delle virgolette.",
        "c": "Nel testo fornito la virgola tra le proprietà è presente; l'errore non dipende dalla punteggiatura, ma dalla sintassi delle stringhe.",
        "d": "In JSON le chiavi devono sempre essere tra doppie virgolette, non senza. Senza virgolette sarebbe sintassi JavaScript valida (oggetto letterale), non JSON."
      },
      "concept": "Sintassi corretta del formato JSON",
      "commonMistake": "Usare virgolette singole nelle chiavi o nei valori JSON.",
      "example": "JSON.parse('{\"id\": 123}') // corretto; JSON.parse('{id: 123}') // errore"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:29.916Z"
  },
  {
    "id": "json-po-0008",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "serializzazione",
      "tipi avanzati",
      "omissioni JSON"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const dati = {\n  oggi: new Date('2024-01-01T12:00:00Z'),\n  attivo: true,\n  mappa: new Map([[\"chiave\", 42]])\n};\nconsole.log(JSON.stringify(dati));",
    "options": [
      {
        "id": "a",
        "text": "{\"oggi\":\"2024-01-01T12:00:00.000Z\",\"attivo\":true,\"mappa\":{}}"
      },
      {
        "id": "b",
        "text": "{\"oggi\":1704110400000,\"attivo\":true,\"mappa\":{\"chiave\":42}}"
      },
      {
        "id": "c",
        "text": "{\"oggi\":\"Mon Jan 01 2024 13:00:00 GMT+0100\",\"attivo\":true,\"mappa\":{}}"
      },
      {
        "id": "d",
        "text": "{\"oggi\":{\"date\":\"2024-01-01\"},\"attivo\":true,\"mappa\":{}}"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "JSON.stringify trasforma Date in stringa ISO e Map in oggetto vuoto.",
      "whyCorrect": "Un oggetto Date viene serializzato come stringa ISO, mentre una Map diventa un oggetto vuoto perché JSON.stringify non sa serializzarla. Boolean e altre proprietà primitive restano invariati.",
      "whyOthersWrong": {
        "b": "Date non viene convertito in timestamp numerico, e Map non diventa oggetto con chiavi e valori: entrambi sono trattamenti non previsti da JSON.stringify.",
        "c": "Date non viene serializzato come stringa locale, ma sempre come stringa ISO (formato internazionale), e Map resta un oggetto vuoto.",
        "d": "Date non viene trasformato in oggetto con proprietà date; JSON.stringify restituisce semplicemente la stringa ISO, e Map rimane vuota."
      },
      "concept": "Serializzazione di tipi speciali",
      "commonMistake": "Aspettarsi che Map venga serializzata come oggetto chiave/valore.",
      "example": "JSON.stringify({ data: new Date(), m: new Map() })"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:46.861Z"
  },
  {
    "id": "json-po-0009",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "parsing",
      "errori sintassi",
      "virgolette"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  console.log(JSON.parse(\"{ x: 1 }\"));\n} catch (e) {\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "SyntaxError"
      },
      {
        "id": "b",
        "text": "{ x: 1 }"
      },
      {
        "id": "c",
        "text": "{ x: undefined }"
      },
      {
        "id": "d",
        "text": "{ x: null }"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "JSON richiede virgolette doppie per i nomi delle proprietà.",
      "whyCorrect": "La stringa non è un JSON valido perché mancano le virgolette doppie intorno alla chiave; JSON.parse lancia un SyntaxError.",
      "whyOthersWrong": {
        "b": "La sintassi non è accettata in JSON, solo in oggetti letterali JS. Il parser lancia errore.",
        "c": "undefined non è ammesso come valore in JSON; inoltre la sintassi della chiave è scorretta.",
        "d": "La chiave senza virgolette blocca il parser prima di poter convertire alcun valore."
      },
      "concept": "Parsiing JSON e sintassi valida",
      "commonMistake": "Usare nomi proprietà senza virgolette doppie in JSON.",
      "example": "JSON.parse('{ \"a\": 1 }') // { a: 1 }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:46.862Z"
  },
  {
    "id": "json-po-0010",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "serializzazione",
      "array",
      "undefined e funzioni"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const arr = [42, undefined, function() {}, null];\nconsole.log(JSON.stringify(arr));",
    "options": [
      {
        "id": "a",
        "text": "[42,null,null,null]"
      },
      {
        "id": "b",
        "text": "[42,,null]"
      },
      {
        "id": "c",
        "text": "[42,undefined,null,null]"
      },
      {
        "id": "d",
        "text": "[42,null,null]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "undefined e funzioni in array diventano null nel JSON.",
      "whyCorrect": "Negli array, undefined e funzioni vengono serializzati come null, quindi ogni elemento mantiene la sua posizione e il risultato contiene null dove servono.",
      "whyOthersWrong": {
        "b": "JSON.stringify mantiene la posizione degli elementi e inserisce null, non lascia buchi.",
        "c": "undefined non è una stringa JSON valida, quindi viene convertito in null.",
        "d": "L'array originale ha quattro elementi, non tre: null sostituisce undefined e la funzione."
      },
      "concept": "Serializzazione di array con tipi speciali",
      "commonMistake": "Pensare che undefined scompaia o che il buco resti vuoto.",
      "example": "JSON.stringify([1, undefined, function(){}, null]) // '[1,null,null,null]'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:46.862Z"
  },
  {
    "id": "json-po-0011",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "parsing",
      "numeri speciali",
      "notazione scientifica",
      "NaN"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  const x = JSON.parse('{\"n\":NaN}');\n  console.log(x.n);\n} catch(e) {\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "SyntaxError"
      },
      {
        "id": "b",
        "text": "NaN"
      },
      {
        "id": "c",
        "text": "undefined"
      },
      {
        "id": "d",
        "text": "null"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "NaN non è un valore valido nel testo JSON.",
      "whyCorrect": "Solo numeri decimali, stringhe, null, true e false sono permessi come valori letterali JSON; NaN non è riconosciuto e genera SyntaxError.",
      "whyOthersWrong": {
        "b": "NaN non può apparire come valore in JSON: il parser si blocca prima e lancia errore.",
        "c": "Nessun valore viene restituito, perché avviene un errore di parse.",
        "d": "Se il valore fosse null, tutto funzionerebbe, ma qui la sintassi è illegale e non si arriva mai a leggere la proprietà."
      },
      "concept": "Parsing e valori ammessi in JSON",
      "commonMistake": "Aspettarsi che NaN sia supportato come valore JSON.",
      "example": "JSON.parse('{\"x\":null}') // { x: null }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:46.863Z"
  },
  {
    "id": "json-po-0012",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "Serializzare oggetti complessi",
      "Conoscere limiti di JSON.stringify"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const ogg = {\n  uno: 1,\n  due: undefined,\n  tre: Symbol('a'),\n  quattro: function() {},\n  cinque: [2, undefined, function(){}, Symbol('b')]\n};\nconsole.log(JSON.stringify(ogg));",
    "options": [
      {
        "id": "a",
        "text": "{\"uno\":1,\"cinque\":[2,null,null,null]}"
      },
      {
        "id": "b",
        "text": "{\"uno\":1,\"cinque\":[2,null,null]}"
      },
      {
        "id": "c",
        "text": "{\"uno\":1,\"cinque\":[2,null,null,null],\"due\":null}"
      },
      {
        "id": "d",
        "text": "{\"uno\":1,\"cinque\":[2,null,null],\"tre\":null}"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "undefined, funzioni e Symbol vengono omessi negli oggetti ma diventano null negli array.",
      "whyCorrect": "In un oggetto, le proprietà con undefined, Symbol e funzioni vengono completamente omesse. In un array, questi valori vengono sostituiti con null, quindi l'array mantiene la lunghezza ma con null dove c'erano undefined, funzioni o Symbol.",
      "whyOthersWrong": {
        "b": "L'array 'cinque' ha quattro elementi; anche se i valori non sono serializzabili, i posti nell'array vengono riempiti con null, quindi serve un array con quattro elementi.",
        "c": "La proprietà 'due' ha valore undefined e quindi viene completamente omessa, non sostituita con null.",
        "d": "La proprietà 'tre' è Symbol e quindi viene omessa, ma l'array 'cinque' deve contenere quattro elementi, non tre."
      },
      "concept": "Cosa viene serializzato con JSON.stringify",
      "commonMistake": "Aspettarsi che undefined e funzioni diventino null anche nelle proprietà oggetto.",
      "example": "JSON.stringify({a: undefined, b: [1, undefined]}) // '{\"b\":[1,null]}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:56.640Z"
  },
  {
    "id": "json-po-0014",
    "topicId": "json",
    "subtopicId": "json-deep-copy",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "Copia profonda di oggetti",
      "Gestione riferimenti ciclici"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const oggetto = {};\noggetto.meStesso = oggetto;\nconsole.log(JSON.stringify(oggetto));",
    "options": [
      {
        "id": "a",
        "text": "TypeError"
      },
      {
        "id": "b",
        "text": "{}"
      },
      {
        "id": "c",
        "text": "{\"meStesso\":null}"
      },
      {
        "id": "d",
        "text": "{\"meStesso\":{}}"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "JSON.stringify lancia TypeError su riferimenti ciclici.",
      "whyCorrect": "La presenza di riferimenti circolari (l'oggetto si riferisce a sé stesso) fa sì che JSON.stringify sollevi un TypeError, perché non può rappresentare cicli in JSON.",
      "whyOthersWrong": {
        "b": "Se non ci fosse alcun ciclo, verrebbe stampato '{}', ma qui il ciclo genera un errore.",
        "c": "I riferimenti ciclici non vengono sostituiti con null; viene lanciato un errore invece di produrre output.",
        "d": "JSON.stringify non crea nuovi oggetti annidati per i cicli; si blocca con un errore invece di serializzare."
      },
      "concept": "Limiti di JSON.stringify sui riferimenti ciclici",
      "commonMistake": "Pensare che i cicli vengano ignorati o sostituiti, invece generano errore.",
      "example": "const a = {}; a.b = a; JSON.stringify(a); // TypeError"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:56.641Z"
  },
  {
    "id": "json-po-0015",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "JSON.stringify",
      "valori speciali",
      "serializzazione oggetti"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const oggetto = { nome: \"Mario\", eta: undefined, attivo: true };\nconsole.log(JSON.stringify(oggetto));",
    "options": [
      {
        "id": "a",
        "text": "{\"nome\":\"Mario\",\"attivo\":true}"
      },
      {
        "id": "b",
        "text": "{\"nome\":\"Mario\",\"eta\":null,\"attivo\":true}"
      },
      {
        "id": "c",
        "text": "{\"nome\":\"Mario\",\"eta\":undefined,\"attivo\":true}"
      },
      {
        "id": "d",
        "text": "{\"nome\":\"Mario\",\"eta\":false,\"attivo\":true}"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "I valori `undefined` vengono omessi da `JSON.stringify` negli oggetti.",
      "whyCorrect": "La proprietà `eta` con valore `undefined` viene ignorata durante la serializzazione di un oggetto, quindi il risultato include solo `nome` e `attivo`.",
      "whyOthersWrong": {
        "b": "Se una proprietà ha valore `undefined` in un oggetto, `JSON.stringify` la elimina completamente invece di convertirla in `null`.",
        "c": "Il testo `undefined` non è mai prodotto da `JSON.stringify` come valore letterale in JSON.",
        "d": "Non avviene nessuna conversione automatica da `undefined` a `false` nella serializzazione JSON degli oggetti."
      },
      "concept": "Omissione di proprietà undefined",
      "commonMistake": "Aspettarsi che `undefined` venga convertito in `null` o serializzato letteralmente.",
      "example": "JSON.stringify({ x: undefined, y: 2 }) // '{\"y\":2}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:48.726Z"
  },
  {
    "id": "json-po-0016",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "array e JSON.stringify",
      "elementi undefined",
      "serializzazione JSON"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const arr = [1, undefined, 3];\nconsole.log(JSON.stringify(arr));",
    "options": [
      {
        "id": "a",
        "text": "[1,null,3]"
      },
      {
        "id": "b",
        "text": "[1,3]"
      },
      {
        "id": "c",
        "text": "[1,undefined,3]"
      },
      {
        "id": "d",
        "text": "[1,0,3]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Negli array, `undefined` viene trasformato in `null` nel JSON.",
      "whyCorrect": "Quando un elemento di un array è `undefined`, `JSON.stringify` lo converte in `null` invece di ometterlo, mantenendo la posizione.",
      "whyOthersWrong": {
        "b": "Gli array serializzati mantengono il numero di elementi, anche se alcuni sono null o undefined.",
        "c": "`undefined` non è un valore valido in JSON e viene sostituito da `null` negli array.",
        "d": "Nessuna conversione automatica di `undefined` in `0` avviene durante la serializzazione."
      },
      "concept": "undefined negli array JSON",
      "commonMistake": "Pensare che `undefined` venga rimosso o serializzato letteralmente.",
      "example": "JSON.stringify([2, undefined]) // '[2,null]'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:48.727Z"
  },
  {
    "id": "json-po-0017",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "JSON.parse",
      "parsing array",
      "accedere ai dati"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const testo = '[10, 20, 30]';\nconst arr = JSON.parse(testo);\nconsole.log(arr[1]);",
    "options": [
      {
        "id": "a",
        "text": "20"
      },
      {
        "id": "b",
        "text": "[10,20,30]"
      },
      {
        "id": "c",
        "text": "1"
      },
      {
        "id": "d",
        "text": "undefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "`JSON.parse` trasforma la stringa in array, accessibile normalmente.",
      "whyCorrect": "La stringa rappresenta un array di numeri; dopo il parse, `arr[1]` corrisponde al secondo elemento, cioè `20`.",
      "whyOthersWrong": {
        "b": "L'output sarebbe questo solo se si stampasse direttamente l'array, non uno dei suoi elementi.",
        "c": "L'indice 1 non restituisce la posizione, ma il valore all'indice.",
        "d": "L'array ha effettivamente tre elementi, con indice 1 valido."
      },
      "concept": "Parsing di array JSON",
      "commonMistake": "Confondere l'indice con il valore o aspettarsi l'intero array come output.",
      "example": "JSON.parse('[1,2,3]')[2] // 3"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:48.728Z"
  },
  {
    "id": "json-po-0018",
    "topicId": "json",
    "subtopicId": "json-deep-copy",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "deep copy con JSON",
      "Date e JSON",
      "tipi speciali"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const orig = { data: new Date(\"2023-01-01T00:00:00Z\") };\nconst copia = JSON.parse(JSON.stringify(orig));\nconsole.log(typeof copia.data);",
    "options": [
      {
        "id": "a",
        "text": "string"
      },
      {
        "id": "b",
        "text": "object"
      },
      {
        "id": "c",
        "text": "date"
      },
      {
        "id": "d",
        "text": "undefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le date diventano stringhe ISO dopo la copia via JSON.",
      "whyCorrect": "Una proprietà Date viene serializzata in una stringa; dopo il parse, il valore non è più un oggetto Date ma una stringa, quindi `typeof copia.data` restituisce `string`.",
      "whyOthersWrong": {
        "b": "Il valore non è più un oggetto, ma una semplice stringa che rappresenta la data.",
        "c": "`typeof` non restituisce mai `date`, il tipo `Date` non è riconosciuto nativamente come tipo.",
        "d": "La proprietà `data` viene copiata come stringa e non risulta mai undefined."
      },
      "concept": "Limiti del deep copy con JSON e i tipi speciali",
      "commonMistake": "Aspettarsi che gli oggetti Date restino tali dopo un deep copy via JSON.",
      "example": "typeof JSON.parse(JSON.stringify({ d: new Date() })).d // 'string'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:48.728Z"
  },
  {
    "id": "json-po-0019",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "serializzazione oggetti",
      "comportamento proprietà speciali",
      "lettura output JSON"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const persona = {\n  nome: \"Anna\",\n  saluta: function() { return \"Ciao\"; },\n  età: undefined,\n  hobby: [\"lettura\", undefined, \"sport\"]\n};\nconsole.log(JSON.stringify(persona));",
    "options": [
      {
        "id": "a",
        "text": "{\"nome\":\"Anna\",\"hobby\":[\"lettura\",null,\"sport\"]}"
      },
      {
        "id": "b",
        "text": "{\"nome\":\"Anna\",\"saluta\":null,\"età\":null,\"hobby\":[\"lettura\",null,\"sport\"]}"
      },
      {
        "id": "c",
        "text": "{\"nome\":\"Anna\",\"saluta\":\"Ciao\",\"hobby\":[\"lettura\",null,\"sport\"]}"
      },
      {
        "id": "d",
        "text": "{\"nome\":\"Anna\",\"saluta\":null,\"hobby\":[\"lettura\",\"sport\"]}"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le proprietà con funzioni e undefined vengono omesse, mentre gli undefined nell'array diventano null.",
      "whyCorrect": "Le proprietà `saluta` (funzione) e `età` (undefined) vengono omesse nell'oggetto serializzato. Tuttavia, gli elementi undefined nell'array vengono convertiti in null. Il risultato finale contiene solo le proprietà serializzabili e l'array con null al posto di undefined.",
      "whyOthersWrong": {
        "b": "Qui le proprietà `saluta` e `età` vengono serializzate come null, ma in realtà JSON.stringify le omette del tutto se sono funzioni o undefined in oggetti, quindi non appaiono nell'output.",
        "c": "La proprietà `saluta` non viene serializzata come stringa con il valore restituito dalla funzione, perché JSON.stringify ignora direttamente le proprietà funzione.",
        "d": "L'array `hobby` perde l'elemento undefined, ma in JSON.stringify viene invece convertito in null e mantenuto nella stessa posizione."
      },
      "concept": "Omissione di proprietà non serializzabili",
      "commonMistake": "Pensare che undefined o funzioni vengano serializzati come null o stringhe.",
      "example": "JSON.stringify({ a: 1, b: undefined, c: function(){} }) // '{\"a\":1}'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:59.116Z"
  },
  {
    "id": "json-po-0020",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "gestione errori",
      "parsing",
      "sintassi JSON",
      "lettura di errori"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "try {\n  const x = JSON.parse('{ nome: \"Marco\" }');\n  console.log(x.nome);\n} catch (e) {\n  console.log(e.name);\n}",
    "options": [
      {
        "id": "a",
        "text": "SyntaxError"
      },
      {
        "id": "b",
        "text": "Marco"
      },
      {
        "id": "c",
        "text": "undefined"
      },
      {
        "id": "d",
        "text": "ReferenceError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le chiavi JSON devono essere tra virgolette doppie: senza, JSON.parse lancia SyntaxError.",
      "whyCorrect": "In JSON, le chiavi degli oggetti devono essere stringhe racchiuse tra virgolette doppie. Qui non lo sono, quindi JSON.parse lancia SyntaxError. Il blocco catch stampa il nome dell'errore.",
      "whyOthersWrong": {
        "b": "Non viene stampato il valore di `nome` perché il parsing fallisce prima di assegnare la variabile `x`.",
        "c": "Il blocco try fallisce subito a causa dell'errore di sintassi nel testo JSON, quindi `x` non viene mai definito.",
        "d": "ReferenceError viene lanciato solo in caso di variabili non definite o errori simili, ma qui il problema è la sintassi del JSON."
      },
      "concept": "Parsing e sintassi JSON",
      "commonMistake": "Dimenticare le virgolette doppie sulle chiavi JSON.",
      "example": "JSON.parse('{\"x\":1}') // { x: 1 }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:59.116Z"
  },
  {
    "id": "json-po-0021",
    "topicId": "json",
    "subtopicId": "json-deep-copy",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "copia profonda",
      "serializzazione oggetti complessi",
      "limiti JSON"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const mappa = { a: 1 };\nconst dati = {\n  titolo: \"libro\",\n  data: new Date(2022, 0, 1),\n  info: mappa\n};\nconst copia = JSON.parse(JSON.stringify(dati));\nconsole.log(typeof copia.data);\nconsole.log(copia.data instanceof Date);\nconsole.log(copia.info === mappa);",
    "options": [
      {
        "id": "a",
        "text": "string\nfalse\nfalse"
      },
      {
        "id": "b",
        "text": "object\ntrue\ntrue"
      },
      {
        "id": "c",
        "text": "string\ntrue\nfalse"
      },
      {
        "id": "d",
        "text": "object\nfalse\ntrue"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La proprietà `data` diventa stringa, non più Date, e gli oggetti sono copiati profondamente.",
      "whyCorrect": "Dopo la serializzazione, la proprietà `data` è una stringa, quindi `typeof` restituisce 'string' e non è più un'istanza di Date. Inoltre, la proprietà `info` è un nuovo oggetto, quindi non è strettamente uguale all'originale.",
      "whyOthersWrong": {
        "b": "La proprietà `data` non resta oggetto né istanza di Date: diventa una stringa. Inoltre, `info` non è uguale all'originale a causa della copia profonda.",
        "c": "`copia.data` è una stringa, ma il controllo `instanceof Date` restituisce false, non true.",
        "d": "Come sopra: dopo la copia, `data` è una stringa, non un oggetto, e `info` non è lo stesso riferimento dell'originale."
      },
      "concept": "Copia profonda via JSON",
      "commonMistake": "Dimenticare che Date diventa stringa e oggetti vengono copiati.",
      "example": "JSON.parse(JSON.stringify({ x: new Date() })).x instanceof Date // false"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:33:59.117Z"
  },
  {
    "id": "json-fg-0026",
    "topicId": "json",
    "subtopicId": "json-stringify",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "api-recognition",
      "serializzazione-oggetti"
    ],
    "prompt": "Completa il codice per ottenere la rappresentazione JSON dell'array `numeri`.",
    "code": "const numeri = [1, 2, 3];\nconst json = ___;",
    "options": [
      {
        "id": "a",
        "text": "JSON.stringify(numeri)"
      },
      {
        "id": "b",
        "text": "numeri.toJSON()"
      },
      {
        "id": "c",
        "text": "JSON.parse(numeri)"
      },
      {
        "id": "d",
        "text": "String(numeri)"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La funzione `JSON.stringify` trasforma un array in una stringa JSON, che può essere trasmessa o salvata.",
      "whyCorrect": "`JSON.stringify(numeri)` genera la stringa '[1,2,3]', rappresentazione JSON dell'array. È il metodo standard per serializzare strutture in formato JSON.",
      "whyOthersWrong": {
        "b": "`numeri.toJSON()` non è definito sugli array standard, quindi restituisce undefined o lancia un errore in ambienti stretti.",
        "c": "`JSON.parse` si usa con una stringa JSON come input, non con array: qui genera un errore perché `numeri` non è una stringa.",
        "d": "`String(numeri)` restituisce '1,2,3', che non è una stringa JSON valida ma solo la rappresentazione con virgole degli elementi."
      },
      "concept": "Serializzare array con JSON.stringify",
      "commonMistake": "Confondere metodi di serializzazione e conversione in stringa.",
      "example": "JSON.stringify([1, 2, 3]) // '[1,2,3]'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:46.775Z"
  },
  {
    "id": "json-fg-0027",
    "topicId": "json",
    "subtopicId": "json-parse",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "api-recognition",
      "deserializzazione"
    ],
    "prompt": "Completa il codice per ottenere un oggetto a partire dalla stringa JSON specificata.",
    "code": "const stringa = '{\"nome\":\"Luca\"}';\nconst oggetto = ___;",
    "options": [
      {
        "id": "a",
        "text": "JSON.parse(stringa)"
      },
      {
        "id": "b",
        "text": "stringa.parse()"
      },
      {
        "id": "c",
        "text": "JSON.stringify(stringa)"
      },
      {
        "id": "d",
        "text": "Object.create(stringa)"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La funzione `JSON.parse` converte una stringa JSON in un oggetto JavaScript.",
      "whyCorrect": "`JSON.parse(stringa)` analizza la stringa JSON e produce l'oggetto corrispondente, permettendo di accedere alle sue proprietà in JavaScript.",
      "whyOthersWrong": {
        "b": "`stringa.parse()` non è un metodo esistente sulle stringhe JavaScript e produrrebbe un errore.",
        "c": "`JSON.stringify(stringa)` produce una stringa tra virgolette doppie, non un oggetto: serializza, non deserializza.",
        "d": "`Object.create(stringa)` crea un nuovo oggetto con `stringa` come prototipo, ma non analizza il JSON né restituisce le proprietà desiderate."
      },
      "concept": "Deserializzare testo JSON in oggetto",
      "commonMistake": "Usare stringify o metodi inesistenti invece di parse.",
      "example": "JSON.parse('{\"a\":1}') // { a: 1 }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:46.776Z"
  },
  {
    "id": "objects-advanced-po-0001",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "computed property names",
      "object shorthand",
      "template literals"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const prefisso = 'id';\nconst numero = 7;\nconst utente = {\n  nome: 'Luca',\n  [prefisso + numero]: 42\n};\nconsole.log(Object.keys(utente));",
    "options": [
      {
        "id": "a",
        "text": "[ 'nome', 'id7' ]"
      },
      {
        "id": "b",
        "text": "[ 'nome', 'prefisso7' ]"
      },
      {
        "id": "c",
        "text": "[ 'nome', '7' ]"
      },
      {
        "id": "d",
        "text": "[ 'nome', 'id' ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le chiavi computate con [expr] valutano l'espressione come nome della proprietà.",
      "whyCorrect": "La chiave computata [prefisso + numero] produce 'id7'. Quindi l'oggetto ha le chiavi 'nome' e 'id7'.",
      "whyOthersWrong": {
        "b": "'prefisso' non viene usato come stringa letterale, ma come variabile. La chiave è 'id7', non 'prefisso7'.",
        "c": "La chiave non è solo il numero, ma il risultato della concatenazione.",
        "d": "Viene concatenato anche '7', quindi la chiave non è solo 'id' ma 'id7'."
      },
      "concept": "Chiavi computate nei letterali oggetto",
      "commonMistake": "Dimenticare che [variabile] calcola l'espressione, non prende il nome letterale.",
      "example": "const o = { [prefix + 1]: 'x' };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:17.372Z"
  },
  {
    "id": "objects-advanced-po-0002",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-chaining",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "optional chaining",
      "nullish coalescing",
      "default values"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const libro = { titolo: '1984', autore: { nome: 'Orwell' } };\nconsole.log(libro.autore?.cognome ?? 'sconosciuto');",
    "options": [
      {
        "id": "a",
        "text": "sconosciuto"
      },
      {
        "id": "b",
        "text": "undefined"
      },
      {
        "id": "c",
        "text": "null"
      },
      {
        "id": "d",
        "text": "[object Object]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Optional chaining restituisce undefined per proprietà mancanti e ?? fornisce un default.",
      "whyCorrect": "libro.autore?.cognome è undefined, quindi l'operatore ?? restituisce 'sconosciuto' come valore di default.",
      "whyOthersWrong": {
        "b": "Il valore undefined viene rimpiazzato da 'sconosciuto' a causa dell'operatore ??.",
        "c": "Solo null o undefined attivano l'operatore ??, ma il valore di default è 'sconosciuto', non null.",
        "d": "Non viene mai restituito l'oggetto autore, ma la proprietà 'cognome', che non esiste."
      },
      "concept": "Optional chaining e nullish coalescing",
      "commonMistake": "Dimenticare che ?? vale per undefined e null, non per tutti i falsy.",
      "example": "utente.dati?.email ?? 'manca'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:17.373Z"
  },
  {
    "id": "objects-advanced-po-0003",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "object property shorthand",
      "object literals"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const nome = 'Arianna';\nconst persona = { nome };\nconsole.log(persona);",
    "options": [
      {
        "id": "a",
        "text": "{ nome: 'Arianna' }"
      },
      {
        "id": "b",
        "text": "{ 'nome': nome }"
      },
      {
        "id": "c",
        "text": "{ nome: nome }"
      },
      {
        "id": "d",
        "text": "{ 'Arianna': nome }"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La shorthand nelle proprietà oggetto usa il valore della variabile come valore della proprietà.",
      "whyCorrect": "Utilizzando la shorthand, la chiave è 'nome' e il valore è il contenuto della variabile nome, ovvero 'Arianna'.",
      "whyOthersWrong": {
        "b": "Questo rappresenta un oggetto con chiave 'nome' e valore la stringa 'nome', non il contenuto della variabile.",
        "c": "Anche se valido, console.log mostra comunque { nome: 'Arianna' } perché nome ha valore 'Arianna'.",
        "d": "Qui la chiave sarebbe 'Arianna', ma la shorthand crea la chiave col nome della variabile, non col suo valore."
      },
      "concept": "Shorthand delle proprietà oggetto",
      "commonMistake": "Pensare che la shorthand usi il nome della variabile come valore.",
      "example": "const u = { id }; // equivale a { id: id }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:17.373Z"
  },
  {
    "id": "objects-advanced-po-0004",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-chaining",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "optional chaining",
      "nested object access"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const dati = {};\nconsole.log(dati.utente?.email);",
    "options": [
      {
        "id": "a",
        "text": "undefined"
      },
      {
        "id": "b",
        "text": "TypeError"
      },
      {
        "id": "c",
        "text": "null"
      },
      {
        "id": "d",
        "text": "[object Object]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "L'optional chaining restituisce undefined se la proprietà mancante.",
      "whyCorrect": "dati.utente è undefined, quindi dati.utente?.email restituisce undefined senza errore.",
      "whyOthersWrong": {
        "b": "Senza l'optional chaining ci sarebbe un TypeError, ma qui viene restituito undefined.",
        "c": "La proprietà mancante porta a undefined, non a null, a meno che non sia esplicitamente null.",
        "d": "Non viene restituito un oggetto, ma il valore della proprietà, che è undefined."
      },
      "concept": "Optional chaining sugli oggetti",
      "commonMistake": "Aspettarsi un errore quando una proprietà non esiste senza considerare l'optional chaining.",
      "example": "utente?.indirizzo // undefined se utente manca"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:17.373Z"
  },
  {
    "id": "objects-advanced-po-0005",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "Object.entries",
      "iterazione oggetti",
      "destructuring"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const animale = { specie: \"gatto\", zampe: 4 };\nfor (const [chiave, valore] of Object.entries(animale)) {\n  console.log(chiave + \":\" + valore);\n}",
    "options": [
      {
        "id": "a",
        "text": "specie:gatto\nzampe:4"
      },
      {
        "id": "b",
        "text": "gatto:specie\n4:zampe"
      },
      {
        "id": "c",
        "text": "['specie', 'gatto']\n['zampe', 4]"
      },
      {
        "id": "d",
        "text": "[specie]:gatto\n[zampe]:4"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Object.entries restituisce array di [chiave, valore], che vengono destrutturati nella for-of.",
      "whyCorrect": "Il ciclo scorre su ogni coppia [chiave, valore] dell'oggetto e concatena i valori, ottenendo specie:gatto e zampe:4.",
      "whyOthersWrong": {
        "b": "Invertire chiave e valore è un errore comune, ma l'ordine di destrutturazione è [chiave, valore], non il contrario.",
        "c": "console.log stampa stringhe, non array letterali, quindi non vengono stampati array ma stringhe formattate.",
        "d": "Le parentesi quadre non fanno parte dell'output: compaiono solo in letterali array o chiavi computate, non nella stampa di stringhe."
      },
      "concept": "Object.entries e destrutturazione",
      "commonMistake": "Confondere l'ordine di chiave e valore o aspettarsi la stampa di array.",
      "example": "for (const [k, v] of Object.entries(o)) { console.log(k + ':' + v); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:26.179Z"
  },
  {
    "id": "objects-advanced-po-0006",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "shorthand proprietà",
      "chiavi computate",
      "letterali oggetto"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const chiave = \"colore\";\nconst valore = \"rosso\";\nconst auto = { tipo: \"SUV\", [chiave]: valore };\nconsole.log(Object.keys(auto));",
    "options": [
      {
        "id": "a",
        "text": "[ 'tipo', 'colore' ]"
      },
      {
        "id": "b",
        "text": "[ 'tipo', 'chiave' ]"
      },
      {
        "id": "c",
        "text": "[ 'tipo', 'valore' ]"
      },
      {
        "id": "d",
        "text": "[ 'tipo', 'rosso' ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La chiave computata usa il valore di chiave come nome della proprietà.",
      "whyCorrect": "La chiave tra parentesi quadre viene valutata e il suo valore, 'colore', diventa il nome della proprietà nell'oggetto.",
      "whyOthersWrong": {
        "b": "Senza parentesi quadre, 'chiave' sarebbe il nome letterale, ma qui viene valutata come variabile.",
        "c": "Qui viene confuso il concetto di chiave (nome proprietà) con il valore associato.",
        "d": "Il valore 'rosso' è il valore della proprietà, non il suo nome; solo le chiavi compaiono in Object.keys."
      },
      "concept": "Chiavi computate nei letterali oggetto",
      "commonMistake": "Dimenticare che le parentesi quadre valutano l'espressione, non usano il nome letterale.",
      "example": "const o = { [chiave]: valore };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:26.180Z"
  },
  {
    "id": "objects-advanced-po-0007",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-chaining",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "optional chaining",
      "operatori nullish",
      "valori di default"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const persona = {\n  nome: \"Laura\",\n  indirizzo: { citta: \"Milano\" }\n};\nconsole.log(persona.indirizzo?.citta ?? \"sconosciuta\");\nconsole.log(persona.telefono?.numero ?? \"nessun numero\");",
    "options": [
      {
        "id": "a",
        "text": "Milano\nnessun numero"
      },
      {
        "id": "b",
        "text": "Milano\nundefined"
      },
      {
        "id": "c",
        "text": "undefined\nnessun numero"
      },
      {
        "id": "d",
        "text": "sconosciuta\nnessun numero"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il chaining accede in sicurezza e ?? fornisce il default solo se null o undefined.",
      "whyCorrect": "La città è presente e stampata, mentre persona.telefono è undefined, quindi il secondo log fornisce il valore di default.",
      "whyOthersWrong": {
        "b": "Il secondo log usa ??, quindi stampa 'nessun numero' se il valore è undefined, non undefined letterale.",
        "c": "La città esiste: optional chaining non restituisce undefined qui, quindi la prima riga non può essere undefined.",
        "d": "\"sconosciuta\" sarebbe stampato solo se persona.indirizzo fosse null o undefined, ma non lo è."
      },
      "concept": "Optional chaining e nullish coalescing",
      "commonMistake": "Aspettarsi che ?? agisca anche su valori falsy come stringhe vuote.",
      "example": "utente.info?.email ?? 'non disponibile'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:26.180Z"
  },
  {
    "id": "objects-advanced-fg-0008",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "object-to-array",
      "iteration"
    ],
    "prompt": "Completa il codice per ottenere un array con i nomi delle proprietà dell'oggetto `persona`.",
    "code": "const persona = { nome: \"Luca\", età: 28 };\nconst chiavi = ___(persona);\nconsole.log(chiavi);",
    "options": [
      {
        "id": "a",
        "text": "Object.keys"
      },
      {
        "id": "b",
        "text": "Object.values"
      },
      {
        "id": "c",
        "text": "Object.entries"
      },
      {
        "id": "d",
        "text": "Array.from"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Object.keys restituisce un array con i nomi delle proprietà.",
      "whyCorrect": "Con Object.keys otteniamo un array che contiene tutte le chiavi (nomi delle proprietà) proprie e enumerabili dell'oggetto, come richiesto dal prompt.",
      "whyOthersWrong": {
        "b": "Object.values restituisce i valori delle proprietà, non i loro nomi: avresti ottenuto ['Luca', 28].",
        "c": "Object.entries restituisce un array di coppie [chiave, valore], non solo le chiavi.",
        "d": "Array.from genera un array da un iterabile, ma un oggetto semplice non lo è senza un metodo specifico."
      },
      "concept": "Object.keys",
      "commonMistake": "Confondere tra keys, values ed entries.",
      "example": "Object.keys({ a: 1, b: 2 }) // ['a', 'b']"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:13.173Z"
  },
  {
    "id": "objects-advanced-fg-0009",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "object-to-array",
      "iteration"
    ],
    "prompt": "Compila la riga che trasforma l'oggetto `auto` in array di valori.",
    "code": "const auto = { marca: \"Fiat\", anno: 2020 };\nconst valori = ___(auto);\nconsole.log(valori);",
    "options": [
      {
        "id": "a",
        "text": "Object.values"
      },
      {
        "id": "b",
        "text": "Object.keys"
      },
      {
        "id": "c",
        "text": "Object.entries"
      },
      {
        "id": "d",
        "text": "Array.of"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Object.values restituisce i valori delle proprietà.",
      "whyCorrect": "Object.values crea un array contenente i valori delle proprietà enumerabili di un oggetto, esattamente come richiesto nel prompt.",
      "whyOthersWrong": {
        "b": "Object.keys restituisce solo le chiavi (nomi delle proprietà), non i valori.",
        "c": "Object.entries restituisce array di coppie [chiave, valore].",
        "d": "Array.of crea un array dagli argomenti forniti, non legge le proprietà dell'oggetto."
      },
      "concept": "Object.values",
      "commonMistake": "Scambiare values con keys o entries.",
      "example": "Object.values({ x: 5, y: 6 }) // [5, 6]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:13.174Z"
  },
  {
    "id": "objects-advanced-fg-0010",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "computed-properties"
    ],
    "prompt": "Completa per usare una chiave computata basata sulla variabile `chiaveDinamica`.",
    "code": "const chiaveDinamica = \"eta\";\nconst persona = { nome: \"Anna\", ___: 32 };\nconsole.log(persona);",
    "options": [
      {
        "id": "a",
        "text": "[chiaveDinamica]"
      },
      {
        "id": "b",
        "text": "chiaveDinamica"
      },
      {
        "id": "c",
        "text": "{chiaveDinamica}"
      },
      {
        "id": "d",
        "text": "(chiaveDinamica)"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le chiavi computate vanno tra parentesi quadre.",
      "whyCorrect": "Le parentesi quadre fanno valutare il valore della variabile come nome della proprietà, non la stringa \"chiaveDinamica\".",
      "whyOthersWrong": {
        "b": "Senza le parentesi, la chiave sarà letteralmente chiamata 'chiaveDinamica', non 'eta'.",
        "c": "{chiaveDinamica} non è sintassi valida per una chiave di oggetto.",
        "d": "(chiaveDinamica) è una semplice espressione e non definisce una proprietà nell'oggetto."
      },
      "concept": "Chiavi computate",
      "commonMistake": "Dimenticare le parentesi quadre nella definizione.",
      "example": "const k = 'id'; const o = { [k]: 42 };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:13.175Z"
  },
  {
    "id": "objects-advanced-fg-0011",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-chaining",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "nullish-coalescing"
    ],
    "prompt": "Completa per assegnare 'ospite' solo se il valore di `nome` è null o undefined.",
    "code": "const nome = null;\nconst nomeFinale = nome ___ \"ospite\";\nconsole.log(nomeFinale);",
    "options": [
      {
        "id": "a",
        "text": "??"
      },
      {
        "id": "b",
        "text": "||"
      },
      {
        "id": "c",
        "text": "&"
      },
      {
        "id": "d",
        "text": "&&"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "?? verifica solo null o undefined, non tutti i valori falsy.",
      "whyCorrect": "L'operatore ?? restituisce il valore a sinistra se non è null/undefined, altrimenti quello a destra. Così 'ospite' si ottiene solo nei casi indicati.",
      "whyOthersWrong": {
        "b": "|| restituisce il valore di destra anche se nome è '', 0 o false, valori che potrebbero essere legittimi.",
        "c": "& è un operatore bitwise e non serve per i valori di default.",
        "d": "&& restituisce il primo valore falsy o quello a destra, non è usato per i default."
      },
      "concept": "Nullish coalescing (??)",
      "commonMistake": "Usare || e perdere valori falsy validi.",
      "example": "nome ?? 'ospite'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:13.176Z"
  },
  {
    "id": "objects-advanced-fb-0008",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "Object.entries",
      "for...of",
      "iterare oggetti"
    ],
    "prompt": "Il seguente codice vuole stampare ogni coppia chiave/valore dell'oggetto `utente` su una riga, ma invece ottiene un errore. Dove si trova il problema?",
    "code": "const utente = { nome: \"Sofia\", eta: 31 };\nfor (const [chiave, valore] of utente) {\n  console.log(chiave, valore);\n}",
    "options": [
      {
        "id": "a",
        "text": "Un oggetto non è iterabile direttamente"
      },
      {
        "id": "b",
        "text": "Le coppie chiave/valore non vengono destrutturate"
      },
      {
        "id": "c",
        "text": "for...of non si può usare con const"
      },
      {
        "id": "d",
        "text": "Le chiavi non sono stringhe"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Gli oggetti non sono iterabili con for...of: serve Object.entries.",
      "whyCorrect": "Il ciclo for...of funziona solo su oggetti iterabili come array. Un oggetto standard non lo è, quindi bisogna usare Object.entries per ottenere le coppie come array.",
      "whyOthersWrong": {
        "b": "La destrutturazione [chiave, valore] sarebbe corretta se si iterasse su un array di coppie, ma qui il problema è che utente non è iterabile.",
        "c": "Non c'è nessun problema a usare const nel ciclo for...of; i valori vengono dichiarati come const ad ogni iterazione.",
        "d": "Le chiavi degli oggetti in JavaScript sono sempre stringhe, ma questo non causa errori di iterazione."
      },
      "concept": "Iterazione di oggetti con entries",
      "commonMistake": "Provare a iterare un oggetto con for...of senza Object.entries.",
      "example": "for (const [k, v] of Object.entries(obj)) { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:21.279Z"
  },
  {
    "id": "objects-advanced-fb-0009",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "computed property",
      "letterali oggetto",
      "sintassi"
    ],
    "prompt": "Questo codice vuole creare un oggetto con una chiave dinamica, ma non ottiene il risultato atteso. Dove sta l'errore?",
    "code": "const campo = \"eta\";\nconst persona = {\n  campo: 29\n};\nconsole.log(persona);",
    "options": [
      {
        "id": "a",
        "text": "La chiave dinamica va messa tra parentesi quadre"
      },
      {
        "id": "b",
        "text": "Manca il valore per la proprietà 'campo'"
      },
      {
        "id": "c",
        "text": "Bisogna usare una funzione per le chiavi dinamiche"
      },
      {
        "id": "d",
        "text": "Le parentesi graffe non sono corrette"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Per una chiave dinamica serve la sintassi [campo], non campo.",
      "whyCorrect": "Scrivere campo come chiave crea sempre la proprietà 'campo', non la variabile. Bisogna usare parentesi quadre: {[campo]: 29}.",
      "whyOthersWrong": {
        "b": "Un valore c'è: 29. Il problema è nella chiave non dinamica, non nel valore.",
        "c": "Non serve alcuna funzione per creare chiavi dinamiche, basta la sintassi con parentesi quadre.",
        "d": "La struttura delle parentesi graffe è corretta per i letterali oggetto; l'errore è nella chiave."
      },
      "concept": "Chiavi computate nei letterali oggetto",
      "commonMistake": "Dimenticare le parentesi quadre per le chiavi dinamiche.",
      "example": "const obj = { [chiave]: valore }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:21.280Z"
  },
  {
    "id": "objects-advanced-fb-0011",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-chaining",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "nullish coalescing",
      "default values",
      "coercion"
    ],
    "prompt": "Il codice vuole mostrare un messaggio di default se `utente.email` è assente, ma finisce per sostituire anche valori validi come stringa vuota. Dov'è l'errore?",
    "code": "const utente = { email: \"\" };\nconst email = utente.email || \"Nessuna email\";\nconsole.log(email);",
    "options": [
      {
        "id": "a",
        "text": "Usa || invece di ?? per il valore di default"
      },
      {
        "id": "b",
        "text": "Deve controllare se utente esiste"
      },
      {
        "id": "c",
        "text": "Serve l'optional chaining sull'email"
      },
      {
        "id": "d",
        "text": "Deve usare Object.hasOwnProperty"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "|| scarta anche valori falsy come la stringa vuota.",
      "whyCorrect": "L'operatore || restituisce il default non solo per null/undefined ma anche per '', 0, false: per i soli nullish bisogna usare ?? .",
      "whyOthersWrong": {
        "b": "utente esiste, e il problema non è la presenza di utente ma il comportamento di ||.",
        "c": "L'optional chaining serve solo se utente potrebbe essere undefined; qui c'è sempre.",
        "d": "Object.hasOwnProperty non risolve il problema del fallback sul valore vuoto."
      },
      "concept": "Differenza tra || e ??",
      "commonMistake": "Usare || per i default e perdere valori falsy legittimi.",
      "example": "const email = utente.email ?? 'Nessuna email';"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:21.280Z"
  },
  {
    "id": "objects-advanced-po-0015",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "Object.entries",
      "array destructuring",
      "iterazione"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const dati = { x: 2, y: 3 };\nfor (const [chiave, valore] of Object.entries(dati)) {\n  console.log(chiave + valore);\n}",
    "options": [
      {
        "id": "a",
        "text": "x2\ny3"
      },
      {
        "id": "b",
        "text": "xy\n23"
      },
      {
        "id": "c",
        "text": "x,y\n2,3"
      },
      {
        "id": "d",
        "text": "x:2\ny:3"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Object.entries restituisce array di coppie [chiave, valore], che destrutturiamo in chiave e valore. Concatenando stampiamo prima x2 poi y3.",
      "whyCorrect": "Destrutturando le coppie, otteniamo prima 'x' e 2, poi 'y' e 3, quindi la concatenazione produce 'x2' e 'y3' su due righe.",
      "whyOthersWrong": {
        "b": "Concatenare chiave e valore non produce 'xy' o '23', perché ogni iterazione restituisce una coppia distinta e non aggrega tutto insieme.",
        "c": "Questa risposta riflette le stringhe di array ma il ciclo stampa ogni elemento separatamente, non l'array completo.",
        "d": "Non vengono usati i due punti tra chiave e valore, ma la semplice concatenazione senza caratteri intermedi."
      },
      "concept": "Object.entries e destrutturazione",
      "commonMistake": "Credere che Object.entries restituisca una stringa o che il ciclo produca output con due punti o virgole.",
      "example": "for (const [k, v] of Object.entries({ a: 1 })) { console.log(k + v); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:48.066Z"
  },
  {
    "id": "objects-advanced-po-0016",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "chiavi computate",
      "undefined property",
      "oggetto letterale"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const key = 'eta';\nconst persona = { nome: 'Eva', [key]: 28 };\nconsole.log(persona['nome'] + '-' + persona.eta + '-' + persona[key]);",
    "options": [
      {
        "id": "a",
        "text": "Eva-28-28"
      },
      {
        "id": "b",
        "text": "Eva-undefined-28"
      },
      {
        "id": "c",
        "text": "Eva-28-undefined"
      },
      {
        "id": "d",
        "text": "Eva-undefined-undefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La chiave computata '[key]' viene valutata come 'eta', quindi tutte le modalità di accesso funzionano e restituiscono sempre il valore 28.",
      "whyCorrect": "persona.eta e persona[key] accedono entrambe alla stessa proprietà, quindi entrambe restituiscono 28. 'nome' è sempre 'Eva'.",
      "whyOthersWrong": {
        "b": "persona.eta esiste effettivamente, perché la chiave computata crea la proprietà 'eta'.",
        "c": "persona[key] accede correttamente: key vale 'eta', quindi restituisce 28.",
        "d": "Nessuna delle proprietà usate è undefined: sia la chiave computata sia quella letterale sono presenti."
      },
      "concept": "Chiavi computate nei letterali oggetto",
      "commonMistake": "Pensare che solo la notazione con parentesi quadre possa accedere alla chiave computata.",
      "example": "const o = { [k]: 1 }; o[k]; o.k;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:48.067Z"
  },
  {
    "id": "objects-advanced-po-0017",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-chaining",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "optional chaining",
      "nullish coalescing",
      "default value"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const cliente = { nome: 'Anna', preferenze: null };\nconst res = cliente.preferenze?.colore ?? 'blu';\nconsole.log(res);",
    "options": [
      {
        "id": "a",
        "text": "blu"
      },
      {
        "id": "b",
        "text": "undefined"
      },
      {
        "id": "c",
        "text": "null"
      },
      {
        "id": "d",
        "text": "TypeError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "L'optional chaining su preferenze null restituisce undefined, quindi il valore di default 'blu' viene usato.",
      "whyCorrect": "Dato che 'preferenze' è null, 'preferenze?.colore' restituisce undefined, quindi con '??' viene usato 'blu'.",
      "whyOthersWrong": {
        "b": "'undefined' sarebbe il risultato se non ci fosse l'operatore '??', ma qui il default viene applicato.",
        "c": "'null' non viene mai stampato: la proprietà non viene acceduta perché il valore è null.",
        "d": "Non si verifica alcun errore: l'optional chaining evita il tentativo di accedere a una proprietà su null."
      },
      "concept": "Optional chaining e nullish coalescing",
      "commonMistake": "Credere che ?. su null lanci errore o che ?? non si applichi a undefined.",
      "example": "obj?.prop ?? 'default';"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:48.067Z"
  },
  {
    "id": "objects-advanced-po-0018",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "Object.keys",
      "ordine delle proprietà",
      "proprietà numeriche"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const dati = { 3: 'c', 1: 'a', 2: 'b', z: 'd' };\nconsole.log(Object.keys(dati));",
    "options": [
      {
        "id": "a",
        "text": "[ '1', '2', '3', 'z' ]"
      },
      {
        "id": "b",
        "text": "[ 'z', '3', '1', '2' ]"
      },
      {
        "id": "c",
        "text": "[ '3', '1', '2', 'z' ]"
      },
      {
        "id": "d",
        "text": "[ '1', '2', 'z', '3' ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le chiavi numeriche vengono elencate per ordine crescente, seguite da quelle stringa in ordine di inserimento.",
      "whyCorrect": "Object.keys mette prima le chiavi 'numeriche' (ordinate), poi tutte le altre (inserite dopo), quindi [ '1', '2', '3', 'z' ].",
      "whyOthersWrong": {
        "b": "Qui l'ordine non rispetta la regola di ordinamento speciale per le chiavi numeriche.",
        "c": "Le chiavi numeriche non vengono mantenute nell'ordine di inserimento ma ordinate, quindi non possono essere '3', '1', '2'.",
        "d": "La stringa 'z' viene sempre dopo tutte le chiavi numeriche, non in mezzo a esse."
      },
      "concept": "Ordine delle proprietà con Object.keys",
      "commonMistake": "Aspettarsi l'ordine di inserimento anche per chiavi numeriche.",
      "example": "Object.keys({ 2:'a', 1:'b', x:'c' }) // [ '1', '2', 'x' ]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:48.067Z"
  },
  {
    "id": "objects-advanced-po-0019",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "proprietà shorthand",
      "overwriting",
      "precedenza tra proprietà"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const nome = 'Luca';\nconst utente = { nome: 'Anna', nome };\nconsole.log(utente.nome);",
    "options": [
      {
        "id": "a",
        "text": "Luca"
      },
      {
        "id": "b",
        "text": "Anna"
      },
      {
        "id": "c",
        "text": "undefined"
      },
      {
        "id": "d",
        "text": "nome"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Nel letterale oggetto, la proprietà shorthand 'nome' sovrascrive la precedente, quindi il valore finale è quello della variabile.",
      "whyCorrect": "La proprietà 'nome' impostata con shorthand viene dopo quella letterale, quindi sovrascrive 'Anna' con 'Luca'.",
      "whyOthersWrong": {
        "b": "La proprietà 'nome' letterale viene sovrascritta dalla shorthand, che compare dopo.",
        "c": "La proprietà esiste ed è valorizzata, quindi non è undefined.",
        "d": "Viene stampato il valore associato, non il nome della proprietà."
      },
      "concept": "Shorthand e precedenza nelle proprietà",
      "commonMistake": "Pensare che la prima definizione prevalga sulle successive.",
      "example": "const x = 2; const obj = { x: 1, x };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:48.067Z"
  },
  {
    "id": "objects-advanced-po-0020",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "Object.entries",
      "destructuring",
      "modifica oggetto durante iterazione"
    ],
    "prompt": "Cosa stampa questo codice, considerando come vengono trattate le nuove proprietà aggiunte durante il ciclo?",
    "code": "const dati = { a: 10, b: 20 };\nfor (const [chiave, valore] of Object.entries(dati)) {\n  if (chiave === 'a') {\n    dati.c = 30;\n  }\n  console.log(chiave, valore);\n}",
    "options": [
      {
        "id": "a",
        "text": "a 10\nb 20"
      },
      {
        "id": "b",
        "text": "a 10\nb 20\nc 30"
      },
      {
        "id": "c",
        "text": "a 10\nb 20\nc undefined"
      },
      {
        "id": "d",
        "text": "a 10\nc 30\nb 20"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Object.entries crea l'array prima del ciclo: aggiunte successive non vengono iterate.",
      "whyCorrect": "Quando si invoca Object.entries, viene creato un array con le coppie chiave-valore presenti in quel momento. Le modifiche (come l'aggiunta di `c`) durante il ciclo non influenzano il risultato del ciclo, quindi vengono stampati solo 'a 10' e 'b 20'.",
      "whyOthersWrong": {
        "b": "L'opzione include 'c 30', ma questa chiave viene aggiunta all'oggetto dopo che Object.entries ha già creato l'array iniziale, quindi non può comparire nell'iterazione.",
        "c": "'c undefined' non viene stampato perché 'c' non era presente nell'oggetto al momento della chiamata di Object.entries e quindi non fa parte delle voci iterate.",
        "d": "L'ordine 'a 10', 'c 30', 'b 20' suggerisce un aggiornamento in tempo reale durante l'iterazione, ma Object.entries restituisce una fotografia statica dell'oggetto."
      },
      "concept": "Object.entries e oggetti mutabili",
      "commonMistake": "Pensare che modifiche all'oggetto durante il ciclo influenzino l'array di Object.entries.",
      "example": "for (const [k, v] of Object.entries(obj)) { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:35:04.467Z"
  },
  {
    "id": "objects-advanced-fg-0021",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "Oggetti",
      "Iterazione",
      "Object.entries"
    ],
    "prompt": "Completa per ottenere un array di coppie chiave/valore dell'oggetto `prodotto`.",
    "code": "const prodotto = { nome: \"penna\", prezzo: 2 };\nconst coppie = ___;",
    "options": [
      {
        "id": "a",
        "text": "Object.entries(prodotto)"
      },
      {
        "id": "b",
        "text": "Object.keys(prodotto)"
      },
      {
        "id": "c",
        "text": "Object.values(prodotto)"
      },
      {
        "id": "d",
        "text": "[prodotto]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Object.entries produce array di [chiave, valore] per ogni proprietà.",
      "whyCorrect": "La funzione Object.entries restituisce un array in cui ogni elemento è una coppia [chiave, valore], che permette di iterare facilmente su tutte le proprietà e i loro valori.",
      "whyOthersWrong": {
        "b": "Object.keys restituisce solo i nomi delle proprietà come stringhe, senza i valori associati.",
        "c": "Object.values restituisce solo i valori delle proprietà, non le coppie complete.",
        "d": "Mettere l'oggetto tra parentesi quadre crea un array con l'oggetto come unico elemento, nessuna trasformazione in coppie."
      },
      "concept": "Object.entries",
      "commonMistake": "Confondere Object.keys, Object.values e Object.entries.",
      "example": "Object.entries({ a: 1, b: 2 }) // [['a', 1], ['b', 2]]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:52.467Z"
  },
  {
    "id": "objects-advanced-fg-0022",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "Oggetti",
      "Shorthand proprietà"
    ],
    "prompt": "Completa per usare la shorthand delle proprietà: la chiave e la variabile si chiamano allo stesso modo.",
    "code": "const colore = \"rosso\";\nconst frutta = { nome: \"mela\", ___ };",
    "options": [
      {
        "id": "a",
        "text": "colore"
      },
      {
        "id": "b",
        "text": "colore: colore"
      },
      {
        "id": "c",
        "text": "\"colore\""
      },
      {
        "id": "d",
        "text": "\"colore\": colore"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "La shorthand delle proprietà consente di scrivere solo il nome della variabile.",
      "whyCorrect": "In JavaScript, se la chiave e la variabile hanno lo stesso nome, si può omettere il valore: scrivere solo 'colore' equivale a 'colore: colore'.",
      "whyOthersWrong": {
        "b": "Scrivere 'colore: colore' funziona, ma non usa la shorthand richiesta: il prompt chiede di essere concisi.",
        "c": "Mettere solo '\"colore\"' crea una chiave chiamata 'colore' ma senza valore; serve anche il valore.",
        "d": "Questa sintassi richiede due nomi, non è una shorthand, e non è più breve di 'colore: colore'."
      },
      "concept": "Shorthand delle proprietà",
      "commonMistake": "Scrivere sempre la coppia chiave: valore anche quando non serve.",
      "example": "const persona = { nome, età };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:47:52.468Z"
  },
  {
    "id": "objects-advanced-fb-0022",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-entries",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "Object.keys",
      "iterazione",
      "proprietà oggetto"
    ],
    "prompt": "Il codice dovrebbe stampare tutte le chiavi di `dati` una per riga, ma invece stampa solo i numeri 0 e 1. Dov'è l'errore?",
    "code": "const dati = { x: 10, y: 20 };\nfor (let i in Object.keys(dati)) {\n  console.log(i);\n}",
    "options": [
      {
        "id": "a",
        "text": "Si itera sugli indici dell'array, non sulle chiavi"
      },
      {
        "id": "b",
        "text": "Object.keys non funziona su oggetti con numeri"
      },
      {
        "id": "c",
        "text": "Manca la conversione da oggetto a array"
      },
      {
        "id": "d",
        "text": "La variabile 'dati' deve essere un array"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "'for...in' cicla sugli indici dell'array, non sulle chiavi dell'oggetto.",
      "whyCorrect": "'for...in' restituisce gli indici dell'array prodotto da Object.keys, quindi '0' e '1', invece delle chiavi 'x' e 'y'. Serve 'for...of' per ottenere i valori dell'array.",
      "whyOthersWrong": {
        "b": "Object.keys funziona su oggetti con chiavi stringa o numeriche; il problema non è nei dati.",
        "c": "Object.keys già restituisce un array, quindi non manca alcuna conversione.",
        "d": "Per usare Object.keys l'oggetto può essere anche un oggetto normale, non solo un array."
      },
      "concept": "Usare Object.keys con il ciclo corretto",
      "commonMistake": "Confondere 'for...in' (indici) e 'for...of' (valori) sugli array.",
      "example": "for (const chiave of Object.keys(obj)) { ... }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:07.117Z"
  },
  {
    "id": "objects-advanced-fb-0024",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-chaining",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "optional chaining",
      "proprietà annidate"
    ],
    "prompt": "Il codice vorrebbe leggere la proprietà 'telefono' di `utente.contatti` senza errore se `contatti` non esiste, ma in realtà ottiene un TypeError. Dov'è l'errore?",
    "code": "const utente = { nome: 'Luca' };\nconsole.log(utente.contatti.telefono);",
    "options": [
      {
        "id": "a",
        "text": "Manca l'optional chaining con ?. dopo 'contatti'"
      },
      {
        "id": "b",
        "text": "Si usa '.' invece di '[]' per accedere a 'telefono'"
      },
      {
        "id": "c",
        "text": "La variabile 'utente' non ha la proprietà 'telefono'"
      },
      {
        "id": "d",
        "text": "Doveva essere una funzione, non un oggetto"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Serve il chaining opzionale per evitare l'errore se 'contatti' non c'è.",
      "whyCorrect": "Accedendo a una proprietà di 'undefined', senza l'optional chaining, si ottiene un TypeError. Con 'utente.contatti?.telefono', invece, si ottiene undefined senza errore.",
      "whyOthersWrong": {
        "b": "Sia '.' che '[]' servono per accedere a proprietà, ma il problema non riguarda la notazione.",
        "c": "Il problema non è la mancanza della proprietà 'telefono', ma la mancanza di 'contatti', che causa l'errore accedendo a 'undefined'.",
        "d": "L'oggetto va bene: il problema è l'accesso alla proprietà annidata, non il tipo di 'utente'."
      },
      "concept": "Optional chaining su proprietà annidate",
      "commonMistake": "Dimenticare '?.' quando una proprietà può mancare.",
      "example": "console.log(obj.nodo?.valore);"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:07.117Z"
  },
  {
    "id": "objects-advanced-fb-0026",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-literals",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "proprietà shorthand",
      "chiavi computate"
    ],
    "prompt": "Questo codice vuole creare un oggetto con una proprietà dinamica e una proprietà `eta` usando la shorthand, ma la proprietà dinamica non viene creata con il nome atteso. Dove si trova l'errore?",
    "code": "const chiave = 'ruolo';\nconst eta = 28;\nconst utente = {\n  chiave: 'admin',\n  eta\n};\nconsole.log(utente);",
    "options": [
      {
        "id": "a",
        "text": "Manca l'uso delle parentesi quadre per la chiave computata"
      },
      {
        "id": "b",
        "text": "Si usa la variabile eta senza valore"
      },
      {
        "id": "c",
        "text": "La proprietà ruolo è scritta come stringa invece di variabile"
      },
      {
        "id": "d",
        "text": "Serve Object.assign per ottenere il risultato"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le chiavi computate richiedono le parentesi quadre nel letterale.",
      "whyCorrect": "Per ottenere una chiave dinamica col valore di una variabile bisogna scrivere [chiave]: 'admin'. Scrivere solo chiave: 'admin' crea la proprietà 'chiave', non 'ruolo'.",
      "whyOthersWrong": {
        "b": "La variabile eta è dichiarata e valorizzata; la shorthand funziona correttamente in questo caso.",
        "c": "La proprietà ruolo non viene nemmeno creata: la chiave è sempre 'chiave', non importa se la stringa fosse variabile o meno.",
        "d": "Object.assign non serve per creare una chiave calcolata: il problema è la sintassi delle parentesi quadre."
      },
      "concept": "Chiavi computate nei letterali oggetto",
      "commonMistake": "Dimenticare le parentesi quadre per una chiave calcolata.",
      "example": "const o = { [chiave]: valore };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:59:02.465Z"
  },
  {
    "id": "objects-advanced-fb-0027",
    "topicId": "objects-advanced",
    "subtopicId": "objects-advanced-chaining",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "optional chaining",
      "valori di default"
    ],
    "prompt": "Il codice qui sotto dovrebbe restituire il valore di `utente.info.telefono` se esiste, oppure 'non disponibile' se manca, ma quando `info` manca viene lanciato un errore. Dov'è l'errore nel codice?",
    "code": "const utente = {};\nconst telefono = utente.info.telefono ?? 'non disponibile';\nconsole.log(telefono);",
    "options": [
      {
        "id": "a",
        "text": "Manca l'optional chaining su info"
      },
      {
        "id": "b",
        "text": "Si usa ?? invece di || per il default"
      },
      {
        "id": "c",
        "text": "utente non è definito come oggetto annidato"
      },
      {
        "id": "d",
        "text": "Si cerca di accedere a una proprietà numerica"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Senza ?. su info, accedere a telefono causa errore se info manca.",
      "whyCorrect": "Quando info non esiste, accedere a utente.info.telefono causa un TypeError; serve utente.info?.telefono per evitare l'errore.",
      "whyOthersWrong": {
        "b": "L'operatore ?? è corretto qui perché consente di fornire un default solo se il valore a sinistra è null o undefined.",
        "c": "utente è definito come oggetto, il problema è che info non esiste come proprietà.",
        "d": "Nessuna proprietà numerica viene usata; l'errore non dipende da questo."
      },
      "concept": "Optional chaining per accessi sicuri",
      "commonMistake": "Omettere ?. e causare un TypeError su proprietà annidate.",
      "example": "const tel = utente.info?.telefono ?? 'non disponibile';"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:59:02.465Z"
  },
  {
    "id": "spread-rest-fb-0002",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-params",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "rest parametri",
      "posizione parametro"
    ],
    "prompt": "La funzione vuole sommare tutti i numeri passati, ma genera un errore di sintassi.",
    "code": "function somma(...numeri, extra) {\n  return numeri.reduce((s, n) => s + n, 0) + extra;\n}",
    "options": [
      {
        "id": "a",
        "text": "Il parametro rest deve essere ultimo"
      },
      {
        "id": "b",
        "text": "I parametri non possono avere lo spread"
      },
      {
        "id": "c",
        "text": "Il parametro rest deve essere un array"
      },
      {
        "id": "d",
        "text": "Serve chiamare reduce su arguments"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il parametro rest deve comparire solo come ultimo parametro nella lista dei parametri di una funzione.",
      "whyCorrect": "In JavaScript, il parametro rest deve essere posizionato per ultimo. Metterne altri dopo, come `extra`, porta a un errore di sintassi.",
      "whyOthersWrong": {
        "b": "Il parametro rest si usa solo nei parametri, non negli argomenti. Qui lo spread è usato correttamente.",
        "c": "Il parametro rest diventa automaticamente un array, non occorre specificarlo.",
        "d": "Nelle arrow function `arguments` non esiste e comunque `numeri` è già un array idoneo a chiamare `reduce`."
      },
      "concept": "Rest nei parametri",
      "commonMistake": "Mettere parametri dopo il rest",
      "example": "function fn(a, ...rest) { /* ... */ }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:21.870Z"
  },
  {
    "id": "spread-rest-fb-0003",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-destructuring",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "rest destructuring array",
      "ordine destructuring"
    ],
    "prompt": "Questo codice vuole salvare il primo elemento di un array in `primo` e il resto in `resto`.",
    "code": "const numeri = [1, 2, 3];\nconst [resto, ...primo] = numeri;\nconsole.log(primo);",
    "options": [
      {
        "id": "a",
        "text": "L'ordine di primo e resto è invertito"
      },
      {
        "id": "b",
        "text": "Serve usare lo spread anche su numeri"
      },
      {
        "id": "c",
        "text": "Il rest non funziona sugli array"
      },
      {
        "id": "d",
        "text": "Manca una variabile temporanea"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Nel destructuring, la variabile rest deve essere per ultima: `[primo, ...resto]` raccoglie i restanti elementi in `resto`.",
      "whyCorrect": "In `[resto, ...primo]` si assegna il primo elemento a `resto` e gli altri a `primo`, quindi sono invertiti rispetto allo scopo richiesto.",
      "whyOthersWrong": {
        "b": "Lo spread serve nella dichiarazione delle variabili, non sull'array sorgente.",
        "c": "Il rest operator funziona sia su array sia su oggetti nel destructuring.",
        "d": "Non è necessario introdurre una variabile temporanea, basta ordinare correttamente le variabili nel destructuring."
      },
      "concept": "Rest nel destructuring array",
      "commonMistake": "Invertire l'ordine delle variabili nel destructuring",
      "example": "const [primo, ...resto] = numeri;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:21.871Z"
  },
  {
    "id": "spread-rest-fb-0005",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-params",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "rest parametri",
      "arrow function",
      "arguments"
    ],
    "prompt": "La funzione vuole restituire la somma di tutti gli argomenti passati, ma lancia un errore in esecuzione.",
    "code": "const somma = () => {\n  return arguments[0] + arguments[1];\n};\nconsole.log(somma(2, 3));",
    "options": [
      {
        "id": "a",
        "text": "Le arrow function non hanno arguments"
      },
      {
        "id": "b",
        "text": "Serve il rest operator nei parametri"
      },
      {
        "id": "c",
        "text": "Gli argomenti devono essere numeri"
      },
      {
        "id": "d",
        "text": "Manca il return nel chiamante"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le arrow function non dispongono dell'oggetto `arguments` come le funzioni classiche: bisogna usare i parametri rest per raccogliere gli argomenti.",
      "whyCorrect": "Le arrow function non hanno `arguments`, quindi il riferimento a `arguments[0]` genera un errore.",
      "whyOthersWrong": {
        "b": "Usare il rest operator sarebbe corretto, ma l'errore qui è l'assenza di `arguments` nell'arrow function.",
        "c": "Il problema non riguarda il tipo degli argomenti: anche se fossero stringhe l'errore rimarrebbe.",
        "d": "Il valore di ritorno della funzione viene comunque stampato, il return manca in caso nella funzione stessa."
      },
      "concept": "Rest parametri e arrow function",
      "commonMistake": "Usare `arguments` nelle arrow function",
      "example": "const somma = (...args) => args[0] + args[1];"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:21.871Z"
  },
  {
    "id": "spread-rest-fb-0006",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-destructuring",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "rest destructuring oggetto",
      "proprietà rest"
    ],
    "prompt": "Questo codice intende estrarre la proprietà `nome` da un oggetto e raccogliere il resto in `info`, ma non funziona come atteso.",
    "code": "const persona = { nome: 'Luca', età: 30, città: 'Milano' };\nconst { info, ...nome } = persona;\nconsole.log(nome);",
    "options": [
      {
        "id": "a",
        "text": "Invertire info e nome nel destructuring"
      },
      {
        "id": "b",
        "text": "Lo spread va messo solo su info"
      },
      {
        "id": "c",
        "text": "Serve dichiarare tutte le proprietà"
      },
      {
        "id": "d",
        "text": "Lo spread non funziona sugli oggetti"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Nel destructuring oggetto, la proprietà da estrarre viene indicata per prima, seguita da `...resto` per raccogliere le rimanenti.",
      "whyCorrect": "La sintassi corretta è `{ nome, ...info }`, che estrae `nome` e raccoglie le altre proprietà in `info`.",
      "whyOthersWrong": {
        "b": "Il rest operator va davanti alla variabile che raccoglie le proprietà residue, non alle singole proprietà.",
        "c": "Non è obbligatorio dichiarare tutte le proprietà: il rest raccoglie automaticamente quelle non elencate.",
        "d": "Il rest nel destructuring funziona sia con array che con oggetti."
      },
      "concept": "Rest nel destructuring oggetti",
      "commonMistake": "Invertire nome e variabile rest nel destructuring oggetto",
      "example": "const { nome, ...info } = persona;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:21.871Z"
  },
  {
    "id": "spread-rest-fb-0007",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "spread array",
      "copia superficiale",
      "mutazione array"
    ],
    "prompt": "Il codice vuole copiare un array di oggetti per modificarne uno senza alterare l'originale, ma qualcosa va storto.",
    "code": "const orig = [{ id: 1 }, { id: 2 }];\nconst copia = [...orig];\ncopia[0].id = 99;\nconsole.log(orig[0].id);",
    "options": [
      {
        "id": "a",
        "text": "La copia con spread è solo superficiale"
      },
      {
        "id": "b",
        "text": "Serve JSON.parse(JSON.stringify())"
      },
      {
        "id": "c",
        "text": "Lo spread non copia gli oggetti"
      },
      {
        "id": "d",
        "text": "Bisogna ciclare manualmente sugli oggetti"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread su array crea una copia superficiale: se gli elementi sono oggetti, vengono condivisi tra i due array.",
      "whyCorrect": "Copiare un array con lo spread non copia anche gli oggetti interni: modificare uno di questi oggetti si riflette su entrambi gli array.",
      "whyOthersWrong": {
        "b": "Usare JSON.parse(JSON.stringify()) crea una copia profonda ma può introdurre altri problemi: il punto qui è la superficialità dello spread, non la soluzione alternativa.",
        "c": "Lo spread copia il contenuto dell'array, ma solo i riferimenti agli oggetti, non la struttura interna.",
        "d": "Copiare manualmente ogni oggetto sarebbe una soluzione, ma la domanda verte sulla natura della copia con spread."
      },
      "concept": "Spread e copia superficiale",
      "commonMistake": "Pensare che lo spread faccia copie profonde",
      "example": "const copia = [...array]; // copia superficiale"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:21.871Z"
  },
  {
    "id": "spread-rest-fg-0001",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "spread array",
      "copia superficiale",
      "unione array"
    ],
    "prompt": "Completa la riga per creare una copia indipendente dell'array `lista` usando lo spread.",
    "code": "const lista = [1, 2, 3];\nconst copia = ___;",
    "options": [
      {
        "id": "a",
        "text": "[...lista]"
      },
      {
        "id": "b",
        "text": "lista.slice()"
      },
      {
        "id": "c",
        "text": "{ ...lista }"
      },
      {
        "id": "d",
        "text": "[lista]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread `[...lista]` crea una copia superficiale dell'array.",
      "whyCorrect": "Usare lo spread tra le parentesi quadre espande gli elementi di `lista` in un nuovo array, ottenendo così una copia indipendente degli stessi valori.",
      "whyOthersWrong": {
        "b": "Il metodo `slice()` funziona, ma non usa lo spread come richiesto nel prompt: la domanda chiede esplicitamente l'uso dei tre puntini.",
        "c": "Lo spread tra parentesi graffe crea un oggetto, non un array: il risultato sarebbe un oggetto con chiavi numeriche, non una copia dell'array.",
        "d": "Racchiudere `lista` tra parentesi quadre produce un array annidato, non una copia piatta: il risultato è `[ [1, 2, 3] ]`."
      },
      "concept": "Spread su array",
      "commonMistake": "Confondere la sintassi di spread tra oggetti e array.",
      "example": "const nuovo = [...vecchio];"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:17.566Z"
  },
  {
    "id": "spread-rest-fg-0002",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "spread oggetti",
      "copia oggetto",
      "unione oggetti"
    ],
    "prompt": "Completa la riga per creare un nuovo oggetto che unisce tutte le proprietà di `base` e una proprietà aggiuntiva `visibile: true`.",
    "code": "const base = { a: 1, b: 2 };\nconst nuovo = { ___, visibile: true };",
    "options": [
      {
        "id": "a",
        "text": "...base"
      },
      {
        "id": "b",
        "text": "base"
      },
      {
        "id": "c",
        "text": "[...base]"
      },
      {
        "id": "d",
        "text": "base..."
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread `...base` espande tutte le proprietà dentro il nuovo oggetto.",
      "whyCorrect": "Ponendo `...base` tra le parentesi graffe del nuovo oggetto, tutte le proprietà di `base` vengono copiate nel nuovo oggetto insieme a quelle specificate dopo.",
      "whyOthersWrong": {
        "b": "Scrivere solo `base` inserisce l'intero oggetto come valore di una proprietà, non espande le chiavi: avresti `{ base: { a: 1, b: 2 }, visibile: true }`.",
        "c": "La sintassi `[...base]` funziona solo con array e oggetti iterabili, non con oggetti semplici.",
        "d": "`base...` non è una sintassi valida in JavaScript e genera errore."
      },
      "concept": "Spread su oggetti",
      "commonMistake": "Dimenticare i tre puntini per espandere le proprietà.",
      "example": "const out = { ...oggetto, extra: 1 };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:17.567Z"
  },
  {
    "id": "spread-rest-fg-0003",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-params",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "parametri rest",
      "funzioni variadiche"
    ],
    "prompt": "Completa la dichiarazione per raccogliere tutti gli argomenti passati a `conta` in un array chiamato `parole`.",
    "code": "function conta(___) {\n  return parole.length;\n}",
    "options": [
      {
        "id": "a",
        "text": "...parole"
      },
      {
        "id": "b",
        "text": "parole..."
      },
      {
        "id": "c",
        "text": "parole"
      },
      {
        "id": "d",
        "text": "*parole"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il parametro rest si scrive `...parole` per raccogliere gli argomenti.",
      "whyCorrect": "Usando `...parole` come ultimo parametro, tutti gli argomenti extra sono raccolti in un array chiamato `parole` all'interno della funzione.",
      "whyOthersWrong": {
        "b": "`parole...` non è una sintassi prevista in JavaScript e produce errore.",
        "c": "Senza i tre puntini, `parole` sarebbe solo il primo argomento, non un array di tutti.",
        "d": "`*parole` ricorda la sintassi Python, ma in JavaScript si usano i tre puntini."
      },
      "concept": "Rest nei parametri",
      "commonMistake": "Dimenticare i tre puntini o usare la sintassi di altri linguaggi.",
      "example": "function somma(...numeri) { }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:17.567Z"
  },
  {
    "id": "spread-rest-fg-0004",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "spread array",
      "unione array"
    ],
    "prompt": "Completa la riga per creare un nuovo array che unisce tutti gli elementi di `arr1` e `arr2`.",
    "code": "const arr1 = [1, 2];\nconst arr2 = [3, 4];\nconst insieme = [___];",
    "options": [
      {
        "id": "a",
        "text": "...arr1, ...arr2"
      },
      {
        "id": "b",
        "text": "[...arr1, ...arr2]"
      },
      {
        "id": "c",
        "text": "arr1 + arr2"
      },
      {
        "id": "d",
        "text": "arr1.concat(arr2)"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread `...arr1, ...arr2` espande gli elementi di entrambi gli array.",
      "whyCorrect": "Mettendo `...arr1, ...arr2` tra parentesi quadre, si espandono entrambi gli array dentro un nuovo array, unendo i loro elementi.",
      "whyOthersWrong": {
        "b": "Un array dentro un array porta a una struttura annidata; qui la domanda vuole una sola coppia di parentesi quadre.",
        "c": "L'operatore `+` concatena stringhe, e sugli array produce una stringa come '1,23,4'.",
        "d": "Il metodo `concat` funziona, ma la domanda chiede lo spread, non i metodi legacy."
      },
      "concept": "Spread per unire array",
      "commonMistake": "Usare la sintassi di altri linguaggi o confondere metodi con spread.",
      "example": "const all = [ ...a, ...b ];"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:17.568Z"
  },
  {
    "id": "spread-rest-fg-0005",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "spread array",
      "copia non mutante"
    ],
    "prompt": "Completa la riga per ottenere una copia dell'array `originale`, aggiungendo il numero 5 in fondo.",
    "code": "const originale = [1, 2, 3, 4];\nconst copia = ___;\nconsole.log(copia);",
    "options": [
      {
        "id": "a",
        "text": "[...originale, 5]"
      },
      {
        "id": "b",
        "text": "[originale, 5]"
      },
      {
        "id": "c",
        "text": "originale.push(5)"
      },
      {
        "id": "d",
        "text": "[...originale.push(5)]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread array espande gli elementi dell'originale, a cui si aggiunge il 5.",
      "whyCorrect": "Con `[...originale, 5]` si crea una copia del contenuto di `originale`, aggiungendo 5 in coda, senza mutare l'array originale.",
      "whyOthersWrong": {
        "b": "Senza lo spread, si ottiene un array annidato: `[originale, 5]` produce un array con due elementi, il primo è l'intero array originale.",
        "c": "Il metodo `push` modifica l'array originale invece di crearne una copia; inoltre restituisce la nuova lunghezza, non l'array.",
        "d": "`originale.push(5)` restituisce il numero 5 (nuova lunghezza), e quindi lo spread di un numero genera un errore."
      },
      "concept": "Spread per copiare array",
      "commonMistake": "Dimenticare lo spread e ottenere un array annidato.",
      "example": "const nuovo = [...vecchio, 10];"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:26.498Z"
  },
  {
    "id": "spread-rest-fg-0006",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-params",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "parametro rest",
      "funzione variadica"
    ],
    "prompt": "Completa la definizione per raccogliere tutti gli argomenti passati alla funzione in un array chiamato `valori`.",
    "code": "function somma(___) {\n  return valori.reduce((tot, v) => tot + v, 0);\n}\nconsole.log(somma(2, 3, 5));",
    "options": [
      {
        "id": "a",
        "text": "...valori"
      },
      {
        "id": "b",
        "text": "valori..."
      },
      {
        "id": "c",
        "text": "valori"
      },
      {
        "id": "d",
        "text": "...valori, altro"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il parametro rest raccoglie tutti gli argomenti in un array.",
      "whyCorrect": "Scrivendo `...valori` si usa il parametro rest, che raccoglie tutti gli argomenti della funzione in un array chiamato `valori`.",
      "whyOthersWrong": {
        "b": "La sintassi `valori...` non è valida in JavaScript: i tre puntini devono precedere il nome.",
        "c": "Senza i tre puntini, `valori` riceverebbe solo il primo argomento, non tutti.",
        "d": "Il parametro rest deve stare da solo come ultimo parametro: aggiungere altri parametri dopo causa errore di sintassi."
      },
      "concept": "Rest nei parametri funzione",
      "commonMistake": "Dimenticare i puntini davanti o aggiungere altri parametri dopo il rest.",
      "example": "function somma(...numeri) { return numeri.length; }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:26.498Z"
  },
  {
    "id": "spread-rest-fg-0007",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-destructuring",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "rest destructuring array",
      "estrarre resto"
    ],
    "prompt": "Completa la destrutturazione per mettere il primo elemento di `arr` in `testa` e il resto degli elementi in `coda`.",
    "code": "const arr = [10, 20, 30, 40];\nconst [testa, ___] = arr;\nconsole.log(coda);",
    "options": [
      {
        "id": "a",
        "text": "...coda"
      },
      {
        "id": "b",
        "text": "coda..."
      },
      {
        "id": "c",
        "text": "coda"
      },
      {
        "id": "d",
        "text": "[...coda]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il rest in destrutturazione raccoglie gli elementi rimanenti.",
      "whyCorrect": "Con `...coda` dopo la virgola si raccolgono tutti gli elementi che seguono il primo in un array chiamato `coda`.",
      "whyOthersWrong": {
        "b": "Posizionare i tre puntini dopo il nome non ha senso in questa sintassi, e genera errore.",
        "c": "Senza i tre puntini, si assegna il secondo elemento a `coda`, non il resto.",
        "d": "Usare le parentesi quadre come `[...coda]` qui non è sintassi valida nel pattern della destrutturazione."
      },
      "concept": "Rest in destrutturazione array",
      "commonMistake": "Mettere i puntini nel posto sbagliato o non usarli.",
      "example": "const [primo, ...resto] = numeri;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:26.498Z"
  },
  {
    "id": "spread-rest-po-0001",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "spread su array",
      "copia superficiale array",
      "mutazione"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const originale = [1, { x: 2 }];\nconst copia = [...originale];\ncopia[1].x = 99;\nconsole.log(originale[1].x);",
    "options": [
      {
        "id": "a",
        "text": "99"
      },
      {
        "id": "b",
        "text": "2"
      },
      {
        "id": "c",
        "text": "undefined"
      },
      {
        "id": "d",
        "text": "[object Object]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread su array copia solo i riferimenti degli oggetti interni, quindi modificando `copia[1].x` cambia anche `originale[1].x`.",
      "whyCorrect": "La copia tramite spread è superficiale: sia `originale[1]` che `copia[1]` puntano allo stesso oggetto. Cambiando la proprietà `x` su uno, si riflette anche sull'altro.",
      "whyOthersWrong": {
        "b": "Si otterrebbe 2 solo se lo spread fosse profondo, ma in realtà copia soltanto i riferimenti agli oggetti interni, non li clona.",
        "c": "La proprietà `x` esiste e viene aggiornata, quindi non ritorna undefined.",
        "d": "Questa sarebbe la rappresentazione di un oggetto stampato come stringa, ma `console.log` stampa il valore della proprietà, cioè un numero."
      },
      "concept": "Copia superficiale con spread",
      "commonMistake": "Pensare che lo spread faccia una copia profonda anche degli oggetti annidati.",
      "example": "const copia = [...originale]; // copia superficiale"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:18.429Z"
  },
  {
    "id": "spread-rest-po-0002",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-destructuring",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "rest destructuring array",
      "spread array",
      "rimozione primo elemento"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const arr = [10, 20, 30, 40];\nconst [primo, ...resto] = arr;\nconsole.log(resto);",
    "options": [
      {
        "id": "a",
        "text": "[ 20, 30, 40 ]"
      },
      {
        "id": "b",
        "text": "[ 10, 20, 30, 40 ]"
      },
      {
        "id": "c",
        "text": "[ 30, 40 ]"
      },
      {
        "id": "d",
        "text": "[ 20, 30 ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il rest nel destructuring prende tutti gli elementi dopo il primo, quindi stampa [20, 30, 40].",
      "whyCorrect": "Con `[primo, ...resto]`, la variabile `resto` contiene tutti i valori dopo il primo dell'array originale.",
      "whyOthersWrong": {
        "b": "Include anche il primo elemento, ma con questa sintassi il primo va in `primo`, non in `resto`.",
        "c": "Con questa risposta si salta due elementi, mentre solo il primo viene escluso.",
        "d": "Si ottengono solo due elementi, ma il rest prende tutti tranne il primo, quindi tre."
      },
      "concept": "Rest nel destructuring di array",
      "commonMistake": "Credere che il rest raccolga solo gli ultimi due o che includa il primo elemento.",
      "example": "const [a, ...b] = [1,2,3]; // b = [2,3]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:18.430Z"
  },
  {
    "id": "spread-rest-po-0003",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "spread oggetti",
      "merge oggetti",
      "property overriding"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const base = { a: 1, b: 2 };\nconst extra = { b: 3, c: 4 };\nconst unito = { ...base, ...extra };\nconsole.log(unito);",
    "options": [
      {
        "id": "a",
        "text": "{ a: 1, b: 3, c: 4 }"
      },
      {
        "id": "b",
        "text": "{ a: 1, b: 2, c: 4 }"
      },
      {
        "id": "c",
        "text": "{ b: 3, c: 4 }"
      },
      {
        "id": "d",
        "text": "{ a: 1, b: 2, b: 3, c: 4 }"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le proprietà duplicate vengono sovrascritte da quelle in `extra`, quindi `b` vale 3.",
      "whyCorrect": "Quando si usano più spread su oggetti, le proprietà più a destra sovrascrivono quelle precedenti, quindi `b` prende il valore 3.",
      "whyOthersWrong": {
        "b": "Qui `b` non viene sovrascritta, ma in realtà la seconda occorrenza di `b` sovrascrive la prima.",
        "c": "Così si perdono le proprietà di `base`, mentre lo spread le include comunque.",
        "d": "Gli oggetti non possono avere due proprietà con lo stesso nome, l'ultima sovrascrive la precedente."
      },
      "concept": "Spread per unire oggetti",
      "commonMistake": "Non sapere che le proprietà duplicate vengono sovrascritte dall'ultimo spread.",
      "example": "const c = { ...a, ...b };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:18.430Z"
  },
  {
    "id": "spread-rest-po-0004",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "spread array",
      "costruzione nuovo array",
      "ordine"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const a = [1, 2];\nconst b = [3, ...a, 4];\nconsole.log(b);",
    "options": [
      {
        "id": "a",
        "text": "[ 3, 1, 2, 4 ]"
      },
      {
        "id": "b",
        "text": "[ 1, 2, 3, 4 ]"
      },
      {
        "id": "c",
        "text": "[ 3, [1,2], 4 ]"
      },
      {
        "id": "d",
        "text": "[ 3, 2, 1, 4 ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread espande gli elementi di `a` in posizione, ottenendo [3, 1, 2, 4].",
      "whyCorrect": "Con lo spread, ciascun elemento di `a` viene inserito separatamente tra 3 e 4, rispettando l'ordine.",
      "whyOthersWrong": {
        "b": "Ordine sbagliato: qui 3 viene dopo gli elementi di `a`, ma nel codice viene prima.",
        "c": "Lo spread non inserisce l'array come nested, ma ne espande i valori.",
        "d": "L'ordine degli elementi è invertito rispetto a quello originale."
      },
      "concept": "Spread array con altri valori",
      "commonMistake": "Non notare che lo spread espande l'array, non lo inserisce come elemento singolo.",
      "example": "const b = [1, ...[2,3], 4]; // [1,2,3,4]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:18.431Z"
  },
  {
    "id": "spread-rest-po-0006",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-params",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "parametri rest",
      "funzioni variadiche",
      "array di argomenti"
    ],
    "prompt": "Cosa stampa questo codice che usa i parametri rest in una funzione?",
    "code": "function somma(primo, ...altri) {\n  return altri.reduce((tot, n) => tot + n, primo);\n}\nconsole.log(somma(4, 2, 3));",
    "options": [
      {
        "id": "a",
        "text": "9"
      },
      {
        "id": "b",
        "text": "7"
      },
      {
        "id": "c",
        "text": "4"
      },
      {
        "id": "d",
        "text": "5"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il parametro `primo` prende 4, `altri` è [2, 3], che vengono sommati partendo da 4.",
      "whyCorrect": "La funzione prende il primo argomento come valore iniziale e usa rest per raccogliere gli altri in un array. Viene calcolato 4 + 2 + 3 = 9.",
      "whyOthersWrong": {
        "b": "Qui si sommano solo 4 + 3, probabilmente non si è capito che entrambi 2 e 3 vanno sommati al valore iniziale.",
        "c": "Si ottiene 4 se si pensa che l'array `altri` sia vuoto, ma qui contiene 2 e 3.",
        "d": "Questo risultato deriva forse da 2 + 3, ignorando il parametro `primo` come valore iniziale."
      },
      "concept": "Rest nei parametri di funzione",
      "commonMistake": "Dimenticare che il primo parametro non è incluso nell'array rest.",
      "example": "function foo(a, ...rest) { /* rest è array */ }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:28.078Z"
  },
  {
    "id": "spread-rest-po-0023",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "spread oggetto",
      "ordine proprietà",
      "override"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const base = { id: 1, ruolo: 'user' };\nconst extra = { ruolo: 'admin', attivo: true };\nconst unito = { ...base, ...extra };\nconsole.log(unito);",
    "options": [
      {
        "id": "a",
        "text": "{ id: 1, ruolo: 'admin', attivo: true }"
      },
      {
        "id": "b",
        "text": "{ ruolo: 'user', attivo: true, id: 1 }"
      },
      {
        "id": "c",
        "text": "{ id: 1, ruolo: 'user', attivo: true }"
      },
      {
        "id": "d",
        "text": "{ ruolo: 'admin', id: 1, attivo: true }"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Le proprietà duplicate sono sovrascritte dall’ultimo oggetto espanso.",
      "whyCorrect": "Lo spread espande prima tutte le proprietà di `base`, poi quelle di `extra`. Le chiavi duplicate ('ruolo') vengono sovrascritte dall’ultimo oggetto spread, quindi 'admin' prevale.",
      "whyOthersWrong": {
        "b": "L’ordine delle proprietà segue l’inserimento: prima id, poi ruolo, poi attivo. Inoltre la proprietà ruolo viene sovrascritta con 'admin', non resta 'user'.",
        "c": "La proprietà 'ruolo' deve essere quella dell’oggetto `extra`, quindi 'admin', non 'user'.",
        "d": "L’ordine degli oggetti spread determina anche quello delle proprietà, e la chiave 'id' precede 'ruolo', quindi 'id' viene prima."
      },
      "concept": "Unione oggetti con spread e override",
      "commonMistake": "Non considerare che le proprietà duplicate vengono sovrascritte dall’ultimo oggetto.",
      "example": "const o = { ...a, ...b };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:53.067Z"
  },
  {
    "id": "spread-rest-po-0024",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-destructuring",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "rest array destructuring",
      "destructuring multiplo"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const numeri = [10, 20, 30, 40];\nconst [primo, ...[secondo, ...resto]] = numeri;\nconsole.log(primo, secondo, resto);",
    "options": [
      {
        "id": "a",
        "text": "10 20 [ 30, 40 ]"
      },
      {
        "id": "b",
        "text": "10 undefined [ 20, 30, 40 ]"
      },
      {
        "id": "c",
        "text": "10 30 [ 40 ]"
      },
      {
        "id": "d",
        "text": "10 20 [ 40 ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il rest annidato raccoglie gli ultimi due elementi.",
      "whyCorrect": "Il primo elemento viene assegnato a 'primo'. Poi si destruttura il resto dell’array: 'secondo' prende il primo valore (20), 'resto' riceve i rimanenti (30, 40).",
      "whyOthersWrong": {
        "b": "Il secondo elemento non è undefined: viene estratto tramite la destrutturazione annidata.",
        "c": "Il secondo elemento preso è 20, non 30. Il rest annidato scatta dopo il secondo valore.",
        "d": "Il rest raccoglie entrambi gli ultimi due valori, non solo uno."
      },
      "concept": "Rest annidato in destructuring array",
      "commonMistake": "Credere che il rest raccolga solo un elemento o che la destrutturazione annidata non funzioni.",
      "example": "const [a, ...[b, ...rest]] = arr;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:53.067Z"
  },
  {
    "id": "spread-rest-po-0025",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "spread array",
      "valori primitivi",
      "concatenazione spread"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const uno = [1];\nconst due = [2];\nconst risultato = [...uno, ...due, ...[3, ...uno]];\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "[ 1, 2, 3, 1 ]"
      },
      {
        "id": "b",
        "text": "[ 1, 2, [ 3, 1 ] ]"
      },
      {
        "id": "c",
        "text": "[ 1, 2, 3, [ 1 ] ]"
      },
      {
        "id": "d",
        "text": "[ 1, 2, 3 ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Gli spread annidati vengono risolti completamente in valori piatti.",
      "whyCorrect": "Lo spread interno ...[3, ...uno] produce [3, 1], che viene ulteriormente espanso. Si ottiene quindi [1] + [2] + [3, 1], ovvero [1, 2, 3, 1].",
      "whyOthersWrong": {
        "b": "Se non si espandesse l’array interno, si otterrebbe un array annidato, ma qui lo spread appiattisce tutto.",
        "c": "Si avrebbe un array con un elemento annidato solo se non si usasse lo spread anche su uno.",
        "d": "Vengono uniti anche l’ultimo 1 grazie allo spread annidato, quindi mancherebbe un elemento."
      },
      "concept": "Spread array e concetto di flatness",
      "commonMistake": "Pensare che lo spread annidato crei array dentro array invece di espandere tutto.",
      "example": "const arr = [...a, ...b, ...[c, ...a]];"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:34:53.067Z"
  },
  {
    "id": "spread-rest-po-0026",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "spread array",
      "copia superficiale",
      "mutazione"
    ],
    "prompt": "Cosa stampa questo codice che usa lo spread per copiare un array di array e poi modifica un elemento interno?",
    "code": "const matrice = [[1, 2], [3, 4]];\nconst copia = [...matrice];\ncopia[0][1] = 99;\nconsole.log(matrice[0]);",
    "options": [
      {
        "id": "a",
        "text": "[ 1, 99 ]"
      },
      {
        "id": "b",
        "text": "[ 1, 2 ]"
      },
      {
        "id": "c",
        "text": "[ 99, 2 ]"
      },
      {
        "id": "d",
        "text": "[ 3, 4 ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread copia solo il primo livello: gli array interni sono condivisi tra `matrice` e `copia`, quindi la modifica si riflette su entrambi.",
      "whyCorrect": "Usando lo spread per copiare un array di array si ottiene una copia superficiale: entrambi gli array condividono i sotto-array interni. Modificando `copia[0][1]`, anche `matrice[0][1]` viene aggiornato, quindi `console.log(matrice[0])` stampa `[ 1, 99 ]`.",
      "whyOthersWrong": {
        "b": "La risposta `[ 1, 2 ]` sarebbe corretta solo se lo spread producesse una copia profonda, ma in realtà gli array interni restano condivisi, quindi la modifica si riflette anche sull'originale.",
        "c": "La risposta `[ 99, 2 ]` deriva dall'invertire i valori o da una confusione sugli indici. In realtà viene modificato il secondo elemento, non il primo.",
        "d": "`[ 3, 4 ]` è il secondo sotto-array, che non viene modificato: il `console.log` mostra il primo sotto-array dopo la modifica."
      },
      "concept": "spread copia superficiale",
      "commonMistake": "Pensare che lo spread su array annidati crei copie indipendenti anche degli array interni.",
      "example": "const b = [...a]; b[0][0] = 123; // anche a[0][0]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:35:01.134Z"
  },
  {
    "id": "spread-rest-po-0027",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-destructuring",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "rest destructuring",
      "oggetto",
      "ordine delle proprietà"
    ],
    "prompt": "Cosa stampa questo codice che usa il rest nel destructuring di oggetto dove una proprietà viene ridefinita dopo lo spread?",
    "code": "const persona = { nome: 'Anna', età: 30, città: 'Milano' };\nconst { nome, ...info } = persona;\nconst nuova = { ...info, nome: 'Luca' };\nconsole.log(nuova);",
    "options": [
      {
        "id": "a",
        "text": "{ età: 30, città: 'Milano', nome: 'Luca' }"
      },
      {
        "id": "b",
        "text": "{ nome: 'Anna', età: 30, città: 'Milano' }"
      },
      {
        "id": "c",
        "text": "{ nome: 'Luca', età: 30, città: 'Milano' }"
      },
      {
        "id": "d",
        "text": "{ età: 30, città: 'Milano' }"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Quando si espande prima un oggetto e poi si aggiunge una proprietà con lo stesso nome, quest'ultima sovrascrive il valore precedente.",
      "whyCorrect": "La proprietà `nome` viene esclusa da `info` durante il destructuring, quindi dopo lo spread in `nuova` si aggiunge `nome: 'Luca'`, che viene inserita dopo le altre proprietà. L'oggetto risultante è `{ età: 30, città: 'Milano', nome: 'Luca' }`.",
      "whyOthersWrong": {
        "b": "Qui la proprietà `nome` rimarrebbe 'Anna', ma in realtà viene rimossa da `info` e poi reinserita con valore 'Luca', quindi non può essere 'Anna'.",
        "c": "L'ordine delle proprietà in output riflette l'ordine di inserimento: prima `età` e `città` (dallo spread), poi `nome`. In Node vengono mostrate in quest'ordine.",
        "d": "Questa opzione manca della proprietà `nome`, che viene invece aggiunta esplicitamente dopo lo spread."
      },
      "concept": "rest destructuring oggetti e sovrascrittura",
      "commonMistake": "Credere che lo spread in oggetti mantenga anche le proprietà escluse dal destructuring, o che l'ordine sia diverso.",
      "example": "const nuovo = { ...base, nome: 'Nuovo' };"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:35:01.134Z"
  },
  {
    "id": "spread-rest-po-0029",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "spread array copia",
      "immutabilità superficiale"
    ],
    "prompt": "Cosa stampa questo codice che combina spread su array e modifica successiva?",
    "code": "const nomi = ['Anna', 'Luca'];\nconst copia = [...nomi];\ncopia[0] = 'Paolo';\nconsole.log(nomi);\nconsole.log(copia);",
    "options": [
      {
        "id": "a",
        "text": "[ 'Anna', 'Luca' ]\n[ 'Paolo', 'Luca' ]"
      },
      {
        "id": "b",
        "text": "[ 'Paolo', 'Luca' ]\n[ 'Paolo', 'Luca' ]"
      },
      {
        "id": "c",
        "text": "[ 'Anna', 'Luca' ]\n[ 'Anna', 'Luca' ]"
      },
      {
        "id": "d",
        "text": "[ 'Paolo', 'Luca' ]\n[ 'Anna', 'Luca' ]"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread su array produce una copia superficiale: modificare la copia non cambia l'originale.",
      "whyCorrect": "Lo spread `[...nomi]` crea una copia superficiale e indipendente dell'array `nomi`. Cambiando `copia[0]` a 'Paolo', solo la copia viene modificata. `nomi` resta `[ 'Anna', 'Luca' ]` e `copia` diventa `[ 'Paolo', 'Luca' ]`.",
      "whyOthersWrong": {
        "b": "Modificando la copia non si modifica anche l'array originale: solo la copia cambia, perché lo spread produce un nuovo array.",
        "c": "Dopo l'assegnazione, la copia è modificata in posizione 0, quindi non può essere identica a `nomi`.",
        "d": "L'originale non viene mai cambiato, quindi non può partire con 'Paolo'. Solo la copia riceve la modifica."
      },
      "concept": "Spread per copiare array",
      "commonMistake": "Pensare che la modifica della copia con spread influenzi l'originale.",
      "example": "const b = [...a]; b[0] = 9;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:20.945Z"
  },
  {
    "id": "spread-rest-po-0030",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-params",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "parametri rest",
      "funzioni variadiche",
      "array"
    ],
    "prompt": "Cosa stampa questo codice che usa un parametro rest e calcola la lunghezza?",
    "code": "function contaElementi(...elementi) {\n  console.log(elementi.length);\n}\ncontaElementi('a', 'b', 'c');",
    "options": [
      {
        "id": "a",
        "text": "3"
      },
      {
        "id": "b",
        "text": "undefined"
      },
      {
        "id": "c",
        "text": "['a', 'b', 'c']"
      },
      {
        "id": "d",
        "text": "TypeError"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il parametro rest raccoglie gli argomenti in un array di lunghezza 3.",
      "whyCorrect": "Il parametro `...elementi` raccoglie tutti gli argomenti in un array, quindi `elementi.length` è 3 dato che vengono passati tre valori.",
      "whyOthersWrong": {
        "b": "La proprietà length di un array esiste sempre, anche se è vuoto, e qui vale 3.",
        "c": "Questa è la rappresentazione dell'array, ma la funzione stampa la sua lunghezza, non l'array in sé.",
        "d": "Non viene generato alcun errore: il codice è sintatticamente e semanticamente corretto."
      },
      "concept": "Rest nei parametri di funzione",
      "commonMistake": "Confondere il valore del rest con la sua lunghezza o aspettarsi un errore.",
      "example": "function f(...args) { console.log(args.length); }"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:20.946Z"
  },
  {
    "id": "spread-rest-po-0031",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-destructuring",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "rest destructuring oggetto",
      "proprietà oggetto"
    ],
    "prompt": "Cosa stampa questo codice che usa il rest nel destructuring di oggetto?",
    "code": "const persona = { nome: 'Marta', età: 30, ruolo: 'dev' };\nconst { nome, ...info } = persona;\nconsole.log(nome);\nconsole.log(info);",
    "options": [
      {
        "id": "a",
        "text": "Marta\n{ età: 30, ruolo: 'dev' }"
      },
      {
        "id": "b",
        "text": "Marta\n[ 'età', 'ruolo' ]"
      },
      {
        "id": "c",
        "text": "{ nome: 'Marta' }\n{ età: 30, ruolo: 'dev' }"
      },
      {
        "id": "d",
        "text": "undefined\n{ nome: 'Marta', età: 30, ruolo: 'dev' }"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il rest nel destructuring oggetto raccoglie le proprietà non estratte in un nuovo oggetto.",
      "whyCorrect": "Il destructuring estrae `nome` e raccoglie le altre proprietà (`età` e `ruolo`) in `info`, che è un oggetto separato.",
      "whyOthersWrong": {
        "b": "Il rest nel destructuring oggetto crea un oggetto con le proprietà rimanenti, non un array di nomi di proprietà.",
        "c": "`nome` viene estratto come stringa e non come oggetto con chiave 'nome'.",
        "d": "`nome` è definito e vale 'Marta', non undefined. Inoltre, `info` non contiene la chiave `nome`."
      },
      "concept": "Rest nel destructuring oggetto",
      "commonMistake": "Pensare che il rest raccolga chiavi in un array o lasci le proprietà originali.",
      "example": "const { a, ...rest } = obj;"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:20.946Z"
  },
  {
    "id": "spread-rest-po-0032",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "spread array",
      "shallow copy",
      "modifica array annidato"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const dati = [{ x: 1 }, { y: 2 }];\nconst copia = [...dati];\ncopia[0].x = 42;\nconsole.log(dati[0].x);\nconsole.log(copia === dati);\nconsole.log(copia[0] === dati[0]);",
    "options": [
      {
        "id": "a",
        "text": "42\nfalse\ntrue"
      },
      {
        "id": "b",
        "text": "1\ntrue\ntrue"
      },
      {
        "id": "c",
        "text": "1\nfalse\nfalse"
      },
      {
        "id": "d",
        "text": "42\nfalse\nfalse"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread copia l'array ma non gli oggetti interni, quindi modificare `copia[0].x` modifica anche `dati[0].x`. Gli array sono distinti, ma gli oggetti all'interno sono condivisi.",
      "whyCorrect": "Lo spread crea una copia superficiale dell'array, quindi `copia !== dati`, ma gli oggetti al loro interno sono gli stessi (`copia[0] === dati[0]`). Modificando una proprietà interna si cambia il riferimento condiviso, quindi la modifica appare in entrambi.",
      "whyOthersWrong": {
        "b": "`copia` e `dati` sono due array distinti, quindi `copia === dati` è falso. Inoltre, modificare `copia[0].x` imposta anche `dati[0].x` a 42, non 1.",
        "c": "La copia con spread è superficiale: sia l'array che gli oggetti interni hanno riferimenti diversi solo per l'array, non per gli oggetti. Quindi `copia[0] === dati[0]` è vero.",
        "d": "Anche se `copia[0].x` viene cambiato, l'oggetto interno è lo stesso di `dati[0]`, quindi `copia[0] === dati[0]` è vero, non falso."
      },
      "concept": "Spread su array e oggetti",
      "commonMistake": "Credere che lo spread effettui una copia profonda sugli array di oggetti.",
      "example": "const copia = [...originale]; // copia superficiale"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:25.040Z"
  },
  {
    "id": "spread-rest-po-0033",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "predict-output",
    "difficulty": "hard",
    "skills": [
      "spread array",
      "spread oggetto",
      "shallow copy"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const persona = { nome: 'Luca', hobby: ['tennis', 'scacchi'] };\nconst copia = { ...persona };\ncopia.hobby.push('yoga');\nconsole.log(persona.hobby);\nconsole.log(copia === persona);\nconsole.log(copia.hobby === persona.hobby);",
    "options": [
      {
        "id": "a",
        "text": "[ 'tennis', 'scacchi', 'yoga' ]\nfalse\ntrue"
      },
      {
        "id": "b",
        "text": "[ 'tennis', 'scacchi', 'yoga' ]\ntrue\ntrue"
      },
      {
        "id": "c",
        "text": "[ 'tennis', 'scacchi' ]\nfalse\nfalse"
      },
      {
        "id": "d",
        "text": "[ 'tennis', 'scacchi', 'yoga' ]\nfalse\nfalse"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread copia solo il primo livello: `copia` e `persona` sono oggetti diversi, ma l'array `hobby` al loro interno resta condiviso. Quindi aggiungendo 'yoga' la modifica si riflette su entrambi.",
      "whyCorrect": "Con lo spread l'oggetto esterno viene copiato superficialmente: `copia` e `persona` sono oggetti distinti (`false`), ma la proprietà `hobby` fa riferimento allo stesso array per entrambi (`true`). Per questo la modifica si riflette su entrambi.",
      "whyOthersWrong": {
        "b": "Gli oggetti `copia` e `persona` non sono uguali: lo spread crea un nuovo oggetto, quindi il confronto con `===` restituisce `false`. Solo l'array `hobby` rimane condiviso.",
        "c": "Lo spread non effettua una copia profonda: quando si aggiunge 'yoga' a `copia.hobby`, anche `persona.hobby` viene modificato. L'array mostrato sarà arricchito, non quello originale.",
        "d": "L'array `hobby` rimane condiviso tra i due oggetti dopo la copia superficiale, ma gli oggetti esterni non sono uguali con `===`, quindi la terza riga stampa `true`, non `false`."
      },
      "concept": "Spread copia superficiale",
      "commonMistake": "Aspettarsi che lo spread copi anche gli oggetti o array annidati, mentre in realtà crea solo una copia del primo livello.",
      "example": "const nuovo = { ...vecchio }; // copia solo le proprietà, non gli oggetti annidati"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:29.523Z"
  },
  {
    "id": "spread-rest-fb-0034",
    "topicId": "spread-rest",
    "subtopicId": "spread-rest-spread",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "copia superficiale",
      "spread su array"
    ],
    "prompt": "Il codice vuole creare una copia di `numeri` per modificarla senza toccare l'originale, ma dopo la modifica anche `numeri` viene alterato. Qual è la causa?",
    "code": "const numeri = [[1, 2], [3, 4]];\nconst copia = [...numeri];\ncopia[0][0] = 99;\nconsole.log(numeri);",
    "options": [
      {
        "id": "a",
        "text": "Lo spread copia solo l'array esterno, non gli interni"
      },
      {
        "id": "b",
        "text": "Lo spread muta entrambi gli array per errore"
      },
      {
        "id": "c",
        "text": "Serve uno spread doppio per copiare tutto"
      },
      {
        "id": "d",
        "text": "Lo spread funziona solo su array di numeri semplici"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Lo spread copia solo l'array più esterno: gli array interni restano condivisi.",
      "whyCorrect": "Lo spread effettua una copia superficiale dell'array, quindi gli array annidati rimangono riferimenti condivisi tra la copia e l'originale. Modificando un elemento interno, il cambiamento si riflette su entrambi.",
      "whyOthersWrong": {
        "b": "Lo spread non modifica direttamente nessuno dei due array: restituisce un nuovo array contenente gli stessi riferimenti degli elementi originali, quindi la mutazione si propaga solo agli oggetti condivisi.",
        "c": "Non esiste un 'doppio spread' automatico: bisognerebbe copiare manualmente ogni array interno per ottenere una copia profonda.",
        "d": "Lo spread funziona su qualunque array, non solo su numeri. Il problema nasce con valori mutabili come array o oggetti, non con il tipo di elemento."
      },
      "concept": "Spread copia superficiale",
      "commonMistake": "Pensare che lo spread crei una copia profonda di array annidati.",
      "example": "const copia = [...arr]; // array annidati restano condivisi"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:59:14.057Z"
  },
  {
    "id": "string-methods-advanced-po-0001",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "split",
      "join",
      "array-manipulation"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const testo = 'albero;foglia;rame';\nconst parti = testo.split(';');\nconst output = parti.join('--');\nconsole.log(output);",
    "options": [
      {
        "id": "a",
        "text": "albero--foglia--rame"
      },
      {
        "id": "b",
        "text": "alberofoglia--rame"
      },
      {
        "id": "c",
        "text": "albero;foglia;rame"
      },
      {
        "id": "d",
        "text": "albero--foglia;rame"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il metodo `split` divide la stringa in un array, che viene poi ricombinato con `join` usando `--` come separatore.",
      "whyCorrect": "La stringa viene divisa in tre parti su ogni `;`, ottenendo l'array `[ 'albero', 'foglia', 'rame' ]`, che viene poi unito con `join('--')`, producendo `albero--foglia--rame`.",
      "whyOthersWrong": {
        "b": "`alberofoglia--rame` è il risultato se la prima virgola fosse unita senza separatore, ma qui tutti gli elementi sono separati da `--`.",
        "c": "La stringa originale non viene alterata se non si applicano i metodi, ma qui `split` e `join` modificano la forma della stringa.",
        "d": "`albero--foglia;rame` si ottiene se si uniscono solo i primi due elementi con `--` e si lascia il resto invariato, ma `join` applica il separatore a tutto l'array."
      },
      "concept": "split e join",
      "commonMistake": "Dimenticare che `join` sostituisce ogni virgola tra elementi con il nuovo separatore.",
      "example": "'a,b,c'.split(',').join('-') // 'a-b-c'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:44.814Z"
  },
  {
    "id": "string-methods-advanced-po-0002",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-replace",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "replace",
      "replaceAll",
      "string-search"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const frase = 'verde, verde, blu';\nconsole.log(frase.replace('verde', 'rosso'));",
    "options": [
      {
        "id": "a",
        "text": "rosso, verde, blu"
      },
      {
        "id": "b",
        "text": "rosso, rosso, blu"
      },
      {
        "id": "c",
        "text": "verde, rosso, blu"
      },
      {
        "id": "d",
        "text": "rosso, blu, verde"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "`replace` sostituisce solo la prima occorrenza trovata.",
      "whyCorrect": "Il metodo `replace` con una stringa cambia solo la prima occorrenza di 'verde' in 'rosso', lasciando la seconda invariata.",
      "whyOthersWrong": {
        "b": "Per sostituire tutte le occorrenze sarebbe necessario `replaceAll` o una regex globale; qui solo la prima è cambiata.",
        "c": "La seconda occorrenza non viene sostituita, ma la prima sì; questa opzione inverte l'ordine dei colori.",
        "d": "L'ordine dei colori non viene modificato: `replace` non scambia la posizione degli elementi."
      },
      "concept": "replace: solo prima occorrenza",
      "commonMistake": "Aspettarsi che `replace` cambi tutte le occorrenze invece di una sola.",
      "example": "'a a a'.replace('a', '-') // '- a a'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:44.815Z"
  },
  {
    "id": "string-methods-advanced-po-0003",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "split",
      "array-length"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const testo = 'uno due tre';\nconst array = testo.split();\nconsole.log(array.length);",
    "options": [
      {
        "id": "a",
        "text": "1"
      },
      {
        "id": "b",
        "text": "3"
      },
      {
        "id": "c",
        "text": "0"
      },
      {
        "id": "d",
        "text": "2"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "`split()` senza argomenti restituisce un array con l'intera stringa come unico elemento.",
      "whyCorrect": "`split()` senza separatore non spezza la stringa, quindi si ottiene un array che contiene la stringa originale come unico elemento.",
      "whyOthersWrong": {
        "b": "Per ottenere tre elementi occorreva usare `split(' ')`, che separa su ogni spazio.",
        "c": "`split()` non restituisce mai un array vuoto se la stringa non è vuota.",
        "d": "Non ci sono due elementi perché non viene fornito nessun separatore, quindi la stringa resta intera."
      },
      "concept": "split senza separatore",
      "commonMistake": "Aspettarsi che `split()` divida la stringa su ogni carattere o spazio.",
      "example": "'abc'.split() // [ 'abc' ]"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:44.815Z"
  },
  {
    "id": "string-methods-advanced-po-0004",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-replace",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "replaceAll",
      "replace",
      "string-replace"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const testo = 'pippo pippo palla';\nconst nuovo = testo.replaceAll('pippo', 'pluto');\nconsole.log(nuovo);",
    "options": [
      {
        "id": "a",
        "text": "pluto pluto palla"
      },
      {
        "id": "b",
        "text": "pluto pippo palla"
      },
      {
        "id": "c",
        "text": "pippo pippo palla"
      },
      {
        "id": "d",
        "text": "pluto pluto pluto"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "`replaceAll` sostituisce tutte le occorrenze della stringa cercata.",
      "whyCorrect": "Entrambi i 'pippo' vengono sostituiti da 'pluto', lasciando 'palla' invariato.",
      "whyOthersWrong": {
        "b": "Solo `replace` (non `replaceAll`) limita la sostituzione alla prima occorrenza.",
        "c": "Il testo originale non viene modificato senza assegnare il risultato, ma qui il nuovo valore è usato.",
        "d": "'palla' non viene sostituito perché non corrisponde all'argomento passato."
      },
      "concept": "replaceAll",
      "commonMistake": "Usare `replace` e aspettarsi il comportamento di `replaceAll`.",
      "example": "'a a'.replaceAll('a', '-') // '- -'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:44.816Z"
  },
  {
    "id": "string-methods-advanced-po-0005",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "split",
      "join",
      "manipolazione array",
      "stringhe"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const testo = 'mele-pere-uva';\nconst lista = testo.split('-');\nlista[1] = lista[1].toUpperCase();\nconsole.log(lista.join(';'))",
    "options": [
      {
        "id": "a",
        "text": "mele;PERE;uva"
      },
      {
        "id": "b",
        "text": "mele-pere-uva"
      },
      {
        "id": "c",
        "text": "mele-pere-uva;"
      },
      {
        "id": "d",
        "text": "mele;PERE;uva;"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Dopo lo split e la modifica, la join ricompone la stringa usando il carattere ';' e la seconda parola è maiuscola.",
      "whyCorrect": "Il metodo split crea l’array [ 'mele', 'pere', 'uva' ], poi lista[1] viene trasformato in 'PERE'. Il join usa ';' e ricompone la stringa come 'mele;PERE;uva'.",
      "whyOthersWrong": {
        "b": "La stringa originale non viene ripristinata perché join usa ';', non '-', e la seconda parola è maiuscola, non minuscola.",
        "c": "L’array non contiene un elemento finale vuoto, quindi join non aggiunge un punto e virgola extra alla fine.",
        "d": "Come sopra, join non aggiunge un delimitatore extra alla fine, quindi la stringa finisce esattamente dopo 'uva'."
      },
      "concept": "split e join su stringhe",
      "commonMistake": "Pensare che join aggiunga il delimitatore anche dopo l’ultimo elemento.",
      "example": "['a', 'b'].join('-') // 'a-b'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:55.281Z"
  },
  {
    "id": "string-methods-advanced-po-0006",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-replace",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "replace",
      "immutabilità stringhe",
      "manipolazione testo"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "let frase = 'pizza e pizza';\nfrase.replace('pizza', 'pasta');\nconsole.log(frase)",
    "options": [
      {
        "id": "a",
        "text": "pizza e pizza"
      },
      {
        "id": "b",
        "text": "pasta e pizza"
      },
      {
        "id": "c",
        "text": "pasta e pasta"
      },
      {
        "id": "d",
        "text": "pizza e pasta"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il metodo replace non modifica la stringa originale, serve assegnare il risultato.",
      "whyCorrect": "Senza riassegnare il risultato di replace, la variabile frase resta invariata: 'pizza e pizza'.",
      "whyOthersWrong": {
        "b": "Così sarebbe se avessimo assegnato: frase = frase.replace(...), ma manca l’assegnazione.",
        "c": "Replace sostituisce solo la prima occorrenza e comunque qui manca la riassegnazione.",
        "d": "Replace non sostituisce tutte le occorrenze senza usare replaceAll o un'espressione regolare globale e qui manca l’assegnazione."
      },
      "concept": "replace non muta la stringa",
      "commonMistake": "Aspettarsi che replace modifichi la variabile direttamente.",
      "example": "'a b a'.replace('a', 'z') // 'z b a'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:55.281Z"
  },
  {
    "id": "string-methods-advanced-po-0007",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "predict-output",
    "difficulty": "medium",
    "skills": [
      "split",
      "join",
      "manipolazione stringhe"
    ],
    "prompt": "Cosa stampa questo codice?",
    "code": "const parole = 'cane,gatto,topo';\nconst arr = parole.split(',');\narr[1] = arr[1].toUpperCase();\nconsole.log(arr.join('-'));\n",
    "options": [
      {
        "id": "a",
        "text": "cane-GATTO-topo"
      },
      {
        "id": "b",
        "text": "cane,gatto,topo"
      },
      {
        "id": "c",
        "text": "cane-gatto-topo"
      },
      {
        "id": "d",
        "text": "CANE-GATTO-TOPO"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il secondo elemento diventa maiuscolo, poi gli elementi sono uniti con '-'.",
      "whyCorrect": "La stringa viene divisa in tre parti, si trasforma solo il secondo elemento in maiuscolo, poi si ricompone con il trattino come separatore. Solo 'gatto' diventa 'GATTO'.",
      "whyOthersWrong": {
        "b": "Senza chiamare join il risultato sarebbe ancora un array, ma qui join usa il trattino come separatore, non la virgola, quindi il risultato è diverso.",
        "c": "Questa opzione ignora che il secondo elemento viene trasformato in maiuscolo: 'gatto' diventa 'GATTO', non resta minuscolo.",
        "d": "Solo il secondo elemento viene messo in maiuscolo, non tutti: 'cane' e 'topo' restano invariati."
      },
      "concept": "split e join su array di stringhe",
      "commonMistake": "Dimenticare di modificare solo l'elemento voluto o di usare il separatore giusto in join.",
      "example": "'a,b'.split(',')[1].toUpperCase() // 'B'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:59.351Z"
  },
  {
    "id": "string-methods-advanced-fb-0002",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "split",
      "separatore",
      "manipolazione array"
    ],
    "prompt": "Vuoi ottenere un array con le parole della frase 'cavallo mucca gallina'. Il codice stampa ['cavallo mucca gallina'] invece di ['cavallo', 'mucca', 'gallina']. Qual è il problema?",
    "code": "let parole = 'cavallo mucca gallina'.split();\nconsole.log(parole);",
    "options": [
      {
        "id": "a",
        "text": "split senza argomento non spezza la stringa"
      },
      {
        "id": "b",
        "text": "split serve solo per caratteri, non parole"
      },
      {
        "id": "c",
        "text": "split divide in lettere se vuoto"
      },
      {
        "id": "d",
        "text": "split va usato dopo trim"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Se split è chiamato senza separatore, restituisce l'intera stringa in un solo elemento.",
      "whyCorrect": "Quando split è chiamato senza argomento, non divide la stringa: restituisce un array con la stringa intera come unico elemento.",
      "whyOthersWrong": {
        "b": "split può dividere anche in parole se si passa uno spazio come separatore, non solo singoli caratteri.",
        "c": "Per ottenere le lettere serve split(''), non split() senza argomenti.",
        "d": "trim elimina spazi agli estremi, ma qui il problema è proprio nel separatore mancante, non negli spazi."
      },
      "concept": "split senza parametro",
      "commonMistake": "Omettere il separatore in split e aspettarsi la divisione.",
      "example": "'a b'.split(' ')"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:55.734Z"
  },
  {
    "id": "string-methods-advanced-fb-0003",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-replace",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "replace",
      "replaceAll",
      "pattern di sostituzione",
      "immutabilità"
    ],
    "prompt": "Si vuole trasformare 'uno uno uno' in 'due due due', ma il codice stampa 'due uno uno'. Dove sta il problema?",
    "code": "let testo = 'uno uno uno';\ntesto = testo.replace('uno', 'due');\nconsole.log(testo);",
    "options": [
      {
        "id": "a",
        "text": "replace sostituisce solo la prima occorrenza"
      },
      {
        "id": "b",
        "text": "replace modifica l'array ma non la stringa"
      },
      {
        "id": "c",
        "text": "replace richiede un pattern RegExp"
      },
      {
        "id": "d",
        "text": "replaceAll non esiste in JavaScript"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "replace con stringa sostituisce solo la prima occorrenza.",
      "whyCorrect": "Il metodo replace, se usato con una stringa come primo argomento, sostituisce solo la prima occorrenza trovata. Per tutte le occorrenze serve replaceAll o una RegExp globale.",
      "whyOthersWrong": {
        "b": "replace opera sulle stringhe, non sugli array: qui non c'è nessun array coinvolto.",
        "c": "replace accetta anche una semplice stringa come pattern, non obbligatoriamente una RegExp.",
        "d": "replaceAll esiste nelle versioni moderne di JavaScript e sarebbe la soluzione giusta per sostituire tutte le occorrenze."
      },
      "concept": "replace vs replaceAll",
      "commonMistake": "Credere che replace sostituisca tutte le occorrenze.",
      "example": "'a a a'.replaceAll('a', 'b')"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:55.734Z"
  },
  {
    "id": "string-methods-advanced-fb-0004",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-replace",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "replace",
      "immutabilità",
      "assegnazione variabile"
    ],
    "prompt": "Il codice dovrebbe stampare 'ciao mondo', ma stampa ancora 'ciao terra'. Qual è l'errore?",
    "code": "let saluto = 'ciao terra';\nsaluto.replace('terra', 'mondo');\nconsole.log(saluto);",
    "options": [
      {
        "id": "a",
        "text": "Il risultato di replace non viene assegnato"
      },
      {
        "id": "b",
        "text": "replace non trova la parola da sostituire"
      },
      {
        "id": "c",
        "text": "replace modifica la stringa originale"
      },
      {
        "id": "d",
        "text": "replace richiede una funzione di callback"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Bisogna assegnare il risultato di replace alla variabile.",
      "whyCorrect": "replace non modifica la stringa originale, restituisce una nuova stringa. Se il risultato non viene assegnato a saluto, la stampa mostrerà ancora il valore vecchio.",
      "whyOthersWrong": {
        "b": "La parola 'terra' è presente nella stringa di partenza, il problema non è la mancata corrispondenza.",
        "c": "replace non muta la stringa su cui è chiamato, restituisce una nuova stringa con le sostituzioni.",
        "d": "replace può anche essere usato con due semplici stringhe, la callback è opzionale per sostituzioni dinamiche."
      },
      "concept": "Immutabilità dei metodi stringa",
      "commonMistake": "Dimenticare di assegnare il risultato di replace.",
      "example": "str = str.replace('vecchio', 'nuovo');"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:55.734Z"
  },
  {
    "id": "string-methods-advanced-fb-0005",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "join",
      "separatore",
      "manipolazione array"
    ],
    "prompt": "Vuoi ottenere la stringa 'a-b-c' da ['a', 'b', 'c'], ma il codice stampa 'abc'. Dov'è l'errore?",
    "code": "let lettere = ['a', 'b', 'c'];\nconsole.log(lettere.join());",
    "options": [
      {
        "id": "a",
        "text": "join senza separatore usa la virgola, non il trattino"
      },
      {
        "id": "b",
        "text": "join senza separatore unisce senza alcun carattere"
      },
      {
        "id": "c",
        "text": "join modifica l'array originale"
      },
      {
        "id": "d",
        "text": "join non accetta trattini come separatore"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "join senza argomento usa la virgola come separatore predefinito.",
      "whyCorrect": "Se join viene usato senza argomenti, unisce gli elementi usando la virgola. Per ottenere un trattino come separatore bisogna specificarlo esplicitamente.",
      "whyOthersWrong": {
        "b": "join senza argomenti produce una stringa con le virgole, quindi 'a,b,c' e non 'abc'.",
        "c": "join crea una nuova stringa, non modifica l'array originale.",
        "d": "join accetta qualsiasi stringa come separatore, anche simboli come il trattino."
      },
      "concept": "join e separatore predefinito",
      "commonMistake": "Dimenticare di specificare il separatore in join.",
      "example": "arr.join('-')"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:25:55.734Z"
  },
  {
    "id": "string-methods-advanced-fb-0006",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-replace",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "replace",
      "comprendere il comportamento su più occorrenze"
    ],
    "prompt": "Questo codice dovrebbe trasformare 'verde, verde, rosso' in 'blu, blu, rosso', ma stampa solo 'blu, verde, rosso'. Che errore è stato commesso?",
    "code": "let colori = 'verde, verde, rosso';\nlet risultato = colori.replace('verde', 'blu');\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "replace sostituisce solo la prima occorrenza"
      },
      {
        "id": "b",
        "text": "Serve split invece di replace"
      },
      {
        "id": "c",
        "text": "replace non accetta spazi nel pattern"
      },
      {
        "id": "d",
        "text": "replace modifica direttamente colori"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il metodo `replace` con una stringa sostituisce solo la prima occorrenza trovata: per cambiare tutte servirebbe `replaceAll` o una regex globale.",
      "whyCorrect": "Quando si usa `replace` con una stringa, solo la prima corrispondenza viene modificata. Le altre rimangono inalterate.",
      "whyOthersWrong": {
        "b": "`split` serve per dividere la stringa in segmenti, non per effettuare sostituzioni di testo.",
        "c": "Il pattern passato a `replace` è valido anche se ci sono spazi: vengono trovate corrispondenze letterali.",
        "d": "`replace` restituisce una nuova stringa, non modifica l’originale: per questo il risultato viene assegnato a una nuova variabile."
      },
      "concept": "replace e sostituzione di occorrenze",
      "commonMistake": "Aspettarsi che `replace` agisca su tutte le corrispondenze invece che solo sulla prima.",
      "example": "'a a a'.replaceAll('a', 'b') // 'b b b'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:02.807Z"
  },
  {
    "id": "string-methods-advanced-fb-0007",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "find-the-bug",
    "difficulty": "medium",
    "skills": [
      "split",
      "join",
      "string immutability"
    ],
    "prompt": "Il seguente codice vuole trasformare la stringa `testo` separando le parole e poi riunendole con il trattino `-`, ma stampa ancora uno spazio tra le parole. Qual è la causa?",
    "code": "let testo = 'ciao mondo';\ntesto.split(' ');\ntesto = testo.join('-');\nconsole.log(testo);",
    "options": [
      {
        "id": "a",
        "text": "split non modifica la stringa, serve assegnare il risultato"
      },
      {
        "id": "b",
        "text": "join funziona solo su array, non su stringhe"
      },
      {
        "id": "c",
        "text": "split senza assegnare lascia testo invariato"
      },
      {
        "id": "d",
        "text": "Manca il separatore corretto in join"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "I metodi delle stringhe non modificano il valore originale, quindi bisogna assegnare il risultato di split a una variabile prima di usare join.",
      "whyCorrect": "Il metodo split restituisce un nuovo array ma non cambia la stringa originale. Usare join subito dopo su una stringa causa errore. Serve assegnare il risultato di split e poi usare join sull'array risultante.",
      "whyOthersWrong": {
        "b": "Sebbene join funzioni solo su array, il vero problema qui è che split non è stato assegnato a una variabile: testo resta una stringa. join su una stringa causa un errore.",
        "c": "È vero che split senza assegnare non cambia testo, ma il vero bug è che il risultato di split non è mai usato e si tenta join su una stringa. Serve assegnare split a una variabile.",
        "d": "Il separatore '-' in join è corretto. Il problema è che join viene chiamato su una stringa, non su un array, perché split non è stato salvato."
      },
      "concept": "split e join: immutabilità e chaining",
      "commonMistake": "Pensare che split modifichi la stringa originale, dimenticando che restituisce un nuovo array.",
      "example": "let parole = testo.split(' ');\nlet nuovo = parole.join('-');"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:06.977Z"
  },
  {
    "id": "string-methods-advanced-fg-0001",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "join",
      "array",
      "string"
    ],
    "prompt": "Completa per ottenere la stringa 'uno,due,tre' da un array.",
    "code": "[\"uno\", \"due\", \"tre\"].join(___)",
    "options": [
      {
        "id": "a",
        "text": "\",\""
      },
      {
        "id": "b",
        "text": "\" \""
      },
      {
        "id": "c",
        "text": "\".\""
      },
      {
        "id": "d",
        "text": "\"-\""
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il separatore deve essere la virgola per produrre 'uno,due,tre'.",
      "whyCorrect": "join con la virgola unisce gli elementi dell'array inserendo una virgola tra ciascuno, ottenendo la stringa desiderata.",
      "whyOthersWrong": {
        "b": "Uno spazio tra gli elementi darebbe 'uno due tre', non con le virgole.",
        "c": "Il punto tra gli elementi produrrebbe 'uno.due.tre', non la versione richiesta.",
        "d": "Il trattino darebbe come risultato 'uno-due-tre', diverso dalla richiesta."
      },
      "concept": "join con separatore",
      "commonMistake": "Usare un separatore diverso da quello richiesto.",
      "example": "[ 'a', 'b' ].join(',') // 'a,b'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:03.612Z"
  },
  {
    "id": "string-methods-advanced-fg-0002",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-trim-pad",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "padStart",
      "allineamento",
      "formattazione"
    ],
    "prompt": "Completa per ottenere '007' partendo da '7'.",
    "code": "\"7\".padStart(___)",
    "options": [
      {
        "id": "a",
        "text": "3, \"0\""
      },
      {
        "id": "b",
        "text": "2, \"7\""
      },
      {
        "id": "c",
        "text": "3, \"7\""
      },
      {
        "id": "d",
        "text": "2, \"0\""
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "padStart(3, '0') rende '007' aggiungendo zeri a sinistra.",
      "whyCorrect": "padStart con lunghezza 3 e carattere '0' aggiunge zeri finché la lunghezza raggiunge 3, ottenendo '007'.",
      "whyOthersWrong": {
        "b": "padStart(2, '7') produce '77', non aggiunge zeri e la lunghezza è diversa.",
        "c": "padStart(3, '7') crea '777', non aggiunge zeri ma il carattere dato.",
        "d": "padStart(2, '0') produce '07', quindi la stringa non raggiunge 3 cifre."
      },
      "concept": "padStart parametri",
      "commonMistake": "Invertire posizione e carattere o usare lunghezza sbagliata.",
      "example": "'5'.padStart(3, '0') // '005'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:03.613Z"
  },
  {
    "id": "string-methods-advanced-fg-0003",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-replace",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "replace",
      "sostituzione",
      "string"
    ],
    "prompt": "Completa per sostituire solo la prima occorrenza di 'a' con 'o'.",
    "code": "\"banana\".replace(___)",
    "options": [
      {
        "id": "a",
        "text": "\"a\", \"o\""
      },
      {
        "id": "b",
        "text": "/a/g, \"o\""
      },
      {
        "id": "c",
        "text": "\"an\", \"on\""
      },
      {
        "id": "d",
        "text": "/an/, \"on\""
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "replace('a', 'o') cambia solo la prima 'a' trovata.",
      "whyCorrect": "Con due stringhe, replace sostituisce solo la prima corrispondenza della 'a' con 'o', lasciando invariate le altre.",
      "whyOthersWrong": {
        "b": "L'opzione usa una regex globale, che sostituirebbe tutte le 'a', non solo la prima.",
        "c": "Sostituirebbe la sequenza 'an' con 'on', non la singola 'a'.",
        "d": "Sostituisce 'an' con 'on' solo alla prima occorrenza, non la singola 'a'."
      },
      "concept": "replace prima occorrenza",
      "commonMistake": "Supporre che replace sostituisca tutte le occorrenze.",
      "example": "'testa'.replace('t', 'b') // 'besta'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:03.613Z"
  },
  {
    "id": "string-methods-advanced-fg-0005",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-trim-pad",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "trim"
    ],
    "prompt": "Scegli il metodo che rimuove gli spazi all’inizio e alla fine della stringa.",
    "code": "const input = '  esempio  ';\nconst pulito = input.___();",
    "options": [
      {
        "id": "a",
        "text": "trim"
      },
      {
        "id": "b",
        "text": "slice"
      },
      {
        "id": "c",
        "text": "split"
      },
      {
        "id": "d",
        "text": "replaceAll"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il metodo trim elimina gli spazi da inizio e fine stringa.",
      "whyCorrect": "trim rimuove i caratteri di spazio solo all’inizio e alla fine della stringa, lasciando invariato il resto.",
      "whyOthersWrong": {
        "b": "slice crea una sottostringa scegliendo un intervallo, non rimuove gli spazi automaticamente.",
        "c": "split converte la stringa in array secondo un separatore, ma non elimina spazi.",
        "d": "replaceAll sostituisce tutte le occorrenze di un pattern, ma senza pattern specifico non pulisce gli spazi."
      },
      "concept": "Metodo trim sulle stringhe",
      "commonMistake": "Cercare di usare slice o replace per rimuovere spazi ai bordi.",
      "example": "'  ok  '.trim() // 'ok'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:26:10.200Z"
  },
  {
    "id": "string-methods-advanced-fg-0018",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "split",
      "array"
    ],
    "prompt": "Completa il codice per ottenere un array con ogni carattere della stringa 'gatto'.",
    "code": "const lettere = 'gatto'.___;\nconsole.log(lettere);",
    "options": [
      {
        "id": "a",
        "text": "split('')"
      },
      {
        "id": "b",
        "text": "split()"
      },
      {
        "id": "c",
        "text": "split(' ')"
      },
      {
        "id": "d",
        "text": "split(',')"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Usando split('') ottieni ogni carattere della stringa come elemento dell'array.",
      "whyCorrect": "split('') divide la stringa su ogni carattere, quindi 'gatto' diventa ['g','a','t','t','o'].",
      "whyOthersWrong": {
        "b": "split() senza argomenti restituisce un array con la stringa intera come unico elemento, quindi ottieni ['gatto'].",
        "c": "split(' ') cerca uno spazio come separatore, ma 'gatto' non ne contiene: avrai di nuovo ['gatto'].",
        "d": "split(',') divide solo dove trova una virgola, ma qui non ci sono virgole: il risultato è ancora ['gatto']."
      },
      "concept": "split con separatore vuoto",
      "commonMistake": "Dimenticare che split senza argomenti non divide in caratteri.",
      "example": "'ciao'.split('') // ['c', 'i', 'a', 'o']"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:32.441Z"
  },
  {
    "id": "string-methods-advanced-fg-0020",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "join"
    ],
    "prompt": "Completa il codice per ottenere la stringa 'a-b-c' da un array di lettere.",
    "code": "const array = ['a', 'b', 'c'];\nconst risultato = array.___;\nconsole.log(risultato);",
    "options": [
      {
        "id": "a",
        "text": "join('-')"
      },
      {
        "id": "b",
        "text": "join()"
      },
      {
        "id": "c",
        "text": "split('-')"
      },
      {
        "id": "d",
        "text": "concat('-')"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "join('-') unisce gli elementi mettendo un trattino tra ciascuno.",
      "whyCorrect": "join('-') concatena gli elementi separandoli con '-', ottenendo 'a-b-c'.",
      "whyOthersWrong": {
        "b": "join() senza argomenti usa la virgola come separatore, producendo 'a,b,c', non 'a-b-c'.",
        "c": "split('-') è un metodo delle stringhe, non degli array: su array lancia TypeError.",
        "d": "concat('-') aggiunge la stringa '-' come nuovo elemento, risultato: ['a', 'b', 'c', '-']."
      },
      "concept": "join con separatore personalizzato",
      "commonMistake": "Dimenticare di passare il separatore corretto a join.",
      "example": "['uno', 'due'].join(',') // 'uno,due'"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:32.442Z"
  },
  {
    "id": "string-methods-advanced-fg-0021",
    "topicId": "string-methods-advanced",
    "subtopicId": "string-methods-advanced-split-join",
    "type": "fill-the-gap",
    "difficulty": "easy",
    "skills": [
      "split",
      "riconoscere uso del separatore"
    ],
    "prompt": "Completa il codice per ottenere ['gatto', 'cane'] dalla stringa 'gatto-cane'.",
    "code": "const animali = 'gatto-cane';\nconst arr = animali.split(___);",
    "options": [
      {
        "id": "a",
        "text": "'-'"
      },
      {
        "id": "b",
        "text": "''"
      },
      {
        "id": "c",
        "text": "','"
      },
      {
        "id": "d",
        "text": "undefined"
      }
    ],
    "correctOptionId": "a",
    "explanation": {
      "short": "Il separatore '-' permette di dividere la stringa in due parti dove compare il trattino.",
      "whyCorrect": "Usando '-' come separatore, il metodo split divide la stringa in corrispondenza del trattino, producendo l'array ['gatto', 'cane'].",
      "whyOthersWrong": {
        "b": "Con la stringa vuota come separatore, split divide tra ogni carattere: si ottiene un array con tutte le lettere singole, non le parole.",
        "c": "Con ',' come separatore, split non trova nessuna virgola, quindi restituisce un array con la stringa intera, senza suddividerla.",
        "d": "Passando undefined, split non suddivide affatto la stringa e restituisce un array contenente solo il valore originale senza divisioni."
      },
      "concept": "split con separatore corretto",
      "commonMistake": "Dimenticare di specificare il carattere che separa le parti nella stringa.",
      "example": "'a:b:c'.split(':') // ['a', 'b', 'c']"
    },
    "source": "ai",
    "model": "gpt-4.1",
    "createdAt": "2026-09-16T08:48:38.527Z"
  }
];
