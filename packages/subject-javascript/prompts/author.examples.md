### Esempio — `format: "choice"` — per i tipi predict-output / find-the-bug / fill-the-gap / multiple-choice / compare / best-method

{
"format": "choice",
"subtopicId": "json-stringify",
"type": "predict-output",
"difficulty": "medium",
"skills": ["JSON.stringify"],
"prompt": "Cosa stampa questo codice?",
"code": "const u = { nome: 'Ada', eta: undefined };\nconsole.log(JSON.stringify(u));",
"options": [
{ "id": "a", "text": "{ nome: 'Ada', eta: undefined }" },
{ "id": "b", "text": "{\"nome\":\"Ada\"}" },
{ "id": "c", "text": "{\"nome\":\"Ada\",\"eta\":null}" },
{ "id": "d", "text": "TypeError" }
],
"correctOptionId": "b",
"explanation": {
"short": "`JSON.stringify` omette le proprietà con valore `undefined`.",
"whyCorrect": "Le proprietà `undefined` non sono serializzabili e vengono saltate del tutto.",
"why": {
"a": "Nell'output JSON le chiavi hanno le virgolette doppie e `undefined` non è un valore JSON valido: la proprietà viene omessa, non stampata.",
"c": "`undefined` non viene convertito in `null` nelle proprietà degli oggetti: la conversione in null avviene solo dentro gli array.",
"d": "Omettere una proprietà non serializzabile non è un errore: stringify completa normalmente la conversione."
},
"concept": "JSON.stringify e valori omessi"
}
}

### Esempio — `format: "categorize"` — per il tipo categorize

{
"format": "categorize",
"subtopicId": "json-parse",
"type": "categorize",
"difficulty": "easy",
"skills": ["JSON.parse"],
"prompt": "Per ogni stringa, decidi se `JSON.parse` la accetta o lancia un errore.",
"categories": [
{ "id": "ok", "text": "JSON valido" },
{ "id": "ko", "text": "Lancia SyntaxError" }
],
"items": [
{ "id": "i0", "text": "'{\"a\":1}'", "categoryId": "ok" },
{ "id": "i1", "text": "'{a:1}'", "categoryId": "ko" },
{ "id": "i2", "text": "'[1,2,]'", "categoryId": "ko" },
{ "id": "i3", "text": "'\"x\"'", "categoryId": "ok" }
],
"explanation": {
"short": "JSON è più rigido dei letterali JavaScript.",
"whyCorrect": "JSON richiede chiavi tra virgolette doppie e vieta virgole finali.",
"why": {
"i0": "Chiavi con doppi apici e valore numerico: è esattamente la sintassi JSON, quindi il parsing riesce.",
"i1": "Le chiavi senza virgolette sono legali negli oggetti JavaScript ma non in JSON: il parser si ferma sulla `a`.",
"i2": "La virgola prima della parentesi chiusa non è ammessa in JSON: trailing comma non esiste in questa grammatica.",
"i3": "Una stringa con doppi apici è un documento JSON completo e valido: parse restituisce la stringa stessa."
}
}
}

### Esempio — `format: "match"` — per il tipo match

{
"format": "match",
"subtopicId": "json-parse",
"type": "match",
"difficulty": "medium",
"skills": ["JSON.parse"],
"prompt": "Abbina ogni chiamata a ciò che restituisce.",
"choices": [
{ "id": "c0", "text": "numero" },
{ "id": "c1", "text": "oggetto" },
{ "id": "c2", "text": "SyntaxError" }
],
"rows": [
{ "id": "r0", "text": "`JSON.parse(\"5\")`", "choiceId": "c0" },
{ "id": "r1", "text": "`JSON.parse(\"{}\")`", "choiceId": "c1" },
{ "id": "r2", "text": "`JSON.parse(\"{x}\")`", "choiceId": "c2" }
],
"explanation": {
"short": "Il risultato di parse dipende dal documento JSON passato.",
"whyCorrect": "Ogni stringa produce il valore JavaScript corrispondente, o un errore se non è JSON valido.",
"why": {
"r0": "Il numero 5 è un documento JSON completo: parse lo converte nel valore numerico corrispondente.",
"r1": "Le graffe vuote sono un oggetto JSON valido: parse restituisce un oggetto JavaScript senza proprietà.",
"r2": "La chiave x senza virgolette viola la grammatica JSON: il parsing si interrompe con un SyntaxError."
}
}
}

### Esempio — `format: "true-false"` — per il tipo true-false

{
"format": "true-false",
"subtopicId": "json-stringify",
"type": "true-false",
"difficulty": "easy",
"skills": ["JSON.stringify"],
"prompt": "Per ogni affermazione su `JSON.stringify`, indica se è vera o falsa.",
"statements": [
{ "id": "s0", "text": "Converte una `Date` in una stringa ISO", "value": true },
{ "id": "s1", "text": "Serializza le funzioni come stringhe di codice", "value": false },
{ "id": "s2", "text": "Omette le proprietà con valore `undefined`", "value": true },
{ "id": "s3", "text": "Lancia sempre un errore sugli oggetti", "value": false }
],
"explanation": {
"short": "stringify ha regole precise su ciò che può serializzare.",
"whyCorrect": "Ogni affermazione va valutata contro il comportamento reale del metodo.",
"why": {
"s0": "Le istanze di Date hanno un metodo toJSON interno: stringify lo invoca e produce la stringa ISO della data.",
"s1": "Le funzioni non sono serializzabili: come le proprietà undefined vengono omesse, non convertite in codice.",
"s2": "Una proprietà che vale undefined viene saltata del tutto: la chiave non compare nella stringa prodotta.",
"s3": "stringify lancia TypeError solo su strutture circolari o BigInt: gli oggetti ordinari vengono serializzati normalmente."
}
}
}
