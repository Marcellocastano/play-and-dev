# Guida ai contenuti — regole di qualità per i template

Ogni template genera domande che devono far **ragionare**, non indovinare. Una domanda è
accettabile solo se uno studente che non conosce l'argomento non può individuare la
risposta dai soli indizi di forma (lunghezza, dettaglio, tono).

## 1. Le quattro opzioni

- **Stessa forma.** Le 4 opzioni hanno la stessa natura (tutte codice, tutte valori, tutte
  affermazioni) e la stessa struttura grammaticale. Se la corretta è un'espressione,
  i distrattori sono espressioni.
- **Stessa lunghezza.** La corretta non può essere la più lunga o la più dettagliata.
  Gate automatico: scarto dalla mediana dei distrattori ≤ max(8 caratteri, 40%).
- **Ogni distrattore è una misconcezione reale.** Chi lo scrive deve sapersi rispondere:
  "quale studente sceglierebbe questa e perché?". Vietati i distrattori "di riempimento"
  (`un ciclo for` come alternativa a `switch`).
- **Il campo `why` spiega, non etichetta.** È la frase che lo studente legge dopo aver
  sbagliato: deve spiegare in modo completo e corretto **perché quella opzione è sbagliata
  e cosa succede davvero**, in 1–2 frasi in italiano scorrevole. Mai iniziare con
  "Chi…"/"Quando…" o classificare lo studente; niente stile telegrafico con i due punti.
  - No: `Chi confonde metodo e proprietà: senza () si ottiene la funzione.`
  - Sì: `Senza le parentesi non si chiama il metodo: l'espressione restituisce la funzione
stessa, ed è quella che console.log stampa. Per ottenere 'ciao' bisogna invocarla con
presentati().`
    Gate automatico: ogni `why` ha almeno 60 caratteri e non inizia con "Chi"/"Quando".
- **Codice inline tra backtick.** Nelle opzioni e nelle spiegazioni, identificatori,
  espressioni e valori vanno tra backtick (`` `switch` ``, `` `x === 1` ``): l'interfaccia
  li rende come codice.
- **API inventate solo se plausibili.** `s.contains()` è un buon distrattore (esiste in Java,
  in Python `in`); `isString()` o `record.'chiave'` no.
- **Nessuna opzione assoluta** (`Solo…`, `Nessuna…`, `Tutte…`, `Sempre`, `Mai`, `Entrambe`).
- **Nessun indizio nel testo**: niente commenti `// false` nelle opzioni, niente
  ripetizione letterale della risposta nel prompt.

## 2. Preferire il codice alle parole

Una domanda "a parole" su un concetto (`Che cosa cattura una closure?`) si indovina per
eliminazione. La stessa domanda su **codice concreto** (`Cosa stampa questo codice?` con
una closure vera) no. Quando un template `multiple-choice` o `compare` verte su un
comportamento del linguaggio, va espresso come codice + esito, con la risposta corretta
**calcolata** dal template (così il test la esegue e la verifica).

`compare` deve confrontare due scritture concrete (`let` vs `var` in questo blocco,
`==` vs `===` su questi valori), mai due definizioni astratte.

`best-method` presenta uno scenario con **vincolo esplicito** che rende una sola opzione
la migliore (es. "ti serve un booleano", "l'array non deve essere modificato"); i
distrattori sono alternative che funzionano ma violano il vincolo, o API sbagliate ma
plausibili.

## 3. Difficoltà

Il tag deve corrispondere alla **operazione mentale richiesta**, non alla lunghezza del
codice.

| Tag      | Lo studente deve…                                                                    | Esempio                                                            |
| -------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `easy`   | Riconoscere un fatto o un'API; un solo concetto, nessuna interazione.                | `'abc'.toUpperCase()`; `typeof 'x'`                                |
| `medium` | Applicare 2 concetti che interagiscono, o predire codice con un passaggio non ovvio. | precedenza `+` e `*`; `else if` con soglie; `var` fuori dal blocco |
| `hard`   | Conoscere un caso limite o un comportamento controintuitivo del linguaggio.          | fallthrough di `switch`; `NaN === NaN`; closure in un ciclo `var`  |

Regola pratica: se la risposta si trova "leggendo la riga", è `easy`; se bisogna
simulare mentalmente più di un passo, `medium`; se serve sapere una regola del
linguaggio che sorprende, `hard`.

## 4. Generatività

Ogni template deve produrre almeno 5 varianti distinte su 25 seed. Variare non solo i
nomi: cambiare i **dati** in modo che cambi la risposta corretta (o l'ordine delle
opzioni non basta: il gate lo verifica sulla `variantKey`).

## 5. Verifica

`npm test -w @lg/subject-javascript` esegue: validità strutturale, esecuzione dei
`predict-output`, **gate di qualità** (`qualityIssues` del core) e conteggi. Un
template che non passa il gate non entra nel contenuto.

## 6. Formati di gioco

Oltre a `choice` (4 opzioni, una corretta) ci sono tre formati a classificazione, più il
formato `text` prodotto automaticamente da `toTextFormat` sulle `predict-output`.

- **categorize**: `categories` 2–3 `{id, text}`, `items` 4–8 `{id, text, categoryId}`.
  Il DSL è `defineCategorize` (gli item si danno come `{text, categoryId, why}`; gli id
  `i0..` e la `why` per item sono assegnati dal builder).
- **match**: `choices` 2–4 `{id, text}`, `rows` 3–6 `{id, text, choiceId}`.
  DSL `defineMatch` (`rows: {text, choice, why}`; choices come array di stringhe).
- **true-false**: `statements` 4–6 `{id, text, value}`, almeno una vera e una falsa.
  DSL `defineTrueFalse` (`{text, value, why}`).

Regole:

- `explanation.why` ha una voce per **ogni** elemento (non solo gli errori possibili):
  ≥ 60 caratteri, spiega cosa succede davvero, mai "Chi…"/"Quando…".
- Nessun item, riga o affermazione ambiguo o dipendente da contesto non dichiarato.
- Il testo di un item/riga non contiene il nome della categoria o scelta di destinazione
  (il gate lo verifica su categorize e match).
- Le affermazioni true-false sono atomiche (una sola affermazione verificabile, mai
  "X, altrimenti Y") e i valori vero/falso vanno bilanciati; il gate segnala più di 4
  valori uguali consecutivi.
- Tutti gli elementi dello stesso gruppo devono essere identici visivamente prima della
  conferma: nessun indizio di forma.

## 7. Authoring via chat (senza API key)

```bash
# 1. stampa system prompt + user prompt pronti da incollare in una chat
npm run content:prompt -w @lg/subject-javascript -- \
  --topic json --type true-false --difficulty easy --count 5   # | pbcopy
# 2. incolla l'output nella chat e salva la risposta in risposta.json (root del repo)
# 3. un solo comando fa tutto: valida, approva, rigenera la banca, esegue i test
#    (se i test falliscono ripristina i file e non applica nulla)
npm run content:add                                            # oppure: -- <altro-file.json>
# 4. rilettura umana del gruppo: chiedi la revisione delle domande approvate
```

`content:add` accetta `{ "topicId": ..., "questions": [...] }` (o un array, con
`--topic`), JSON puro o blocco ` ```json `. Oltre al gate didattico esegue il codice
delle `predict-output` e i controlli automatici su match e true-false (esegue le
espressioni e confronta il risultato con la risposta dichiarata). Con `--api` genera
le domande direttamente con OpenAI invece di leggere `risposta.json`.

Per far crescere i contenuti in modo scalabile preferisci i template generativi:
`content:template` fa scrivere all'AI un template nel DSL, lo esegue su 25 seed contro
gate ed esecuzione del codice e lo registra in `src/templates/ai/` solo se passa.

Il campo `format` è obbligatorio nel JSON generato; per i tipi didattici classici è
`choice`. La revisione umana resta obbligatoria.
