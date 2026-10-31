- Per `predict-output` il campo `code` è obbligatorio, autonomo (nessuna dipendenza esterna,
  niente API del browser o di Node oltre a `console.log`), deterministico, e la risposta
  corretta è ESATTAMENTE ciò che il codice stampa, una riga per `console.log`, nel formato
  di Node: stringhe senza virgolette al top level, array come `[ 1, 2 ]`, oggetti come
  `{ a: 1 }`, `undefined`/`NaN`/`null` letterali. Se il codice lancia un errore, l'output
  corretto è il nome dell'errore (es. `TypeError`). Verifica mentalmente eseguendo riga per riga.
