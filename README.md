# Play & Dev

Piattaforma web gamificata per imparare la programmazione: sessioni da 20 domande generate da template, XP, streak giornaliere, mastery per topic, raccomandazioni e badge. UI e contenuti in italiano.

## Struttura del monorepo

```
packages/
  core/                   @lg/core — engine puro (modelli, question engine, sessioni,
                          scoring, mastery, persistence, AI provider). Zero React.
  subject-javascript/     @lg/subject-javascript — contenuti JavaScript: curriculum,
                          ~80 template generativi, approfondimenti, tema.
  subject-placeholders/   @lg/subject-placeholders — subject "coming soon"
                          (Vue, React, Angular, TypeScript, Node.js, Python).
apps/
  web/                    @lg/web — app React + Vite + Tailwind v4 + motion + zustand.
  server/                 @lg/server — proxy Express verso OpenAI per le funzioni AI.
```

## Requisiti

- Node.js 22 (con Volta la versione è pinnata automaticamente; altrimenti `.nvmrc`).
- npm 10.

## Comandi

```bash
npm install              # installa tutte le dipendenze dei workspace
npm run dev -w @lg/web   # app web su http://localhost:5173
npm run dev -w @lg/server # proxy AI su http://localhost:8787
npm test                 # tutti i test (core, contenuti, web, server)
npm run typecheck        # tsc -b su tutti i workspace
npm run lint             # eslint
npm run build            # build di tutti i workspace
```

## Configurare il server AI

```bash
cp apps/server/.env.example apps/server/.env
# poi valorizza OPENAI_API_KEY (e opzionalmente OPENAI_MODEL, PORT)
```

Senza `OPENAI_API_KEY` gli endpoint rispondono `503 { error: 'ai_unavailable' }` e il client fa fallback silenzioso: l'app funziona comunque. In dev, Vite gira `/api` → `http://localhost:8787`.

## Aggiungere un nuovo subject

1. Crea un package in `packages/subject-<nome>` che esporta una `SubjectDefinition` di `@lg/core`: `id`, `name`, `kind` (`language`/`framework`/`runtime`), `status`, `icon`, `theme` (palette + gradienti), `levels` con `topicIds`, `topics` completi e `templates`. Il DSL generico per i template (`defineTemplate`, `makeOptions`, `pickInt`…) viene da `@lg/subject-kit`.
2. I template sono `QuestionTemplate`: `generate(rng)` restituisce una `GeneratedQuestion` (prompt, code opzionale, 4 opzioni, `correctOptionId`, `explanation` completa). Usa l'RNG passato dal core per variare i dati e `makeOptions`-like helpers per distrattori unici.
3. Registra il subject in `apps/web/src/state/subjectStore.ts` (array `subjects`).
4. Il tema viene applicato automaticamente da `ThemeProvider`/`applyTheme` scrivendo le CSS vars su `:root`.
5. Per i comandi `content:*` aggiungi `packages/subject-<nome>/content.config.ts` (default export `SubjectContentConfig` di `@lg/subject-kit/node`: subject, language, pkgRoot, runner opzionale, path dei prompt, `template` opzionale). Il CLI `npm run content -- <cmd> --subject <nome>` lo carica automaticamente; per eseguire il codice delle domande servono anche un `CodeRunner` e i tre file prompt in `prompts/` (`author.language.md`, `author.examples.md`, `template.md`).

Per un subject "coming soon" basta la `SubjectDefinition` con `status: 'coming-soon'` e liste vuote (vedi `subject-placeholders`).

## Contenuti: template generativi + banca curata

Le domande di `@lg/subject-javascript` arrivano da due fonti: i template generativi in
`src/templates/` (dati variati via RNG) e la banca curata in `src/bank/content/<topic>.json`,
caricata come `QuestionTemplate` da `src/bank/` (un template per gruppo
`topicId:type:difficulty`, con `capacity` pari al numero di domande: può contribuire con più
domande alla stessa sessione, entro il cap di similarità del motore).
I JSON sono importati direttamente; `src/bank/content/index.ts` (un import per file) è
rigenerato dagli script ad ogni approvazione e un test verifica che sia allineato.

Il flusso di authoring AI è offline e manuale (pipeline condivisa in
`@lg/content-pipeline`, tool comuni in `@lg/subject-kit`), con due strade che usano la
stessa validazione e lo stesso merge nei JSON con rollback se i test dei contenuti
falliscono. I comandi accettano `--subject <id>` (default `javascript`) e vivono nel CLI
`npm run content -- <add|prompt|template|dump>`; gli alias `content:*` del workspace
delegano allo stesso CLI:

```bash
# via chat gratuita: stampa system+user prompt da incollare (system prompt =
# subject-kit/prompts/author.base.md + prompts/author.language.md + prompts/author.examples.md)
npm run content -- prompt --subject javascript \
  --topic json --type true-false --difficulty easy --count 5   # | pbcopy
# → incolla l'output in una chat, salva la risposta in risposta.json nella root del repo
npm run content:add                                            # oppure: -- <altro-file.json>

# via OpenAI (key letta da apps/server/.env; modello di default gpt-4.1, --model per cambiare)
npm run content -- add --subject javascript \
  --api --topic errors --type predict-output --difficulty medium --count 7

npm run content -- dump --subject javascript <seed> [--why]
# dump di ogni template (generativi e banca) per ispezione
```

`content:add` valida ogni domanda (dedup, schema, gate didattico, esecuzione del codice
via node:vm), scarta quelle che non passano, fa merge in `src/bank/content/<topic>.json`,
rigenera l'indice dei JSON ed esegue i test dei contenuti (se falliscono, ripristina tutto).

Un livello sopra: l'AI può scrivere **template generativi** (non singole domande) nel DSL
di `src/templates/helpers.ts`; i file accettati finiscono in `src/templates/ai/` e vengono
compilati come gli altri template:

```bash
npm run content -- template --subject javascript \
  --topic loops --type predict-output --difficulty medium
# API: fino a --rounds round (default 3) con retry guidato dagli errori del gate;
# modello di default gpt-4.1 (--model per cambiare)

npm run content -- template --subject javascript \
  --topic loops --type predict-output --difficulty medium --print-prompt
# niente API: stampa system+user da incollare in una chat, poi valida la risposta con
# --from <file> (accetta JSON { "code": "..." } o TS grezzo, anche dentro un fence)
```

Il candidato viene scritto in `src/templates/ai/_candidate.ts`, importato e verificato
con `checkTemplate` (25 seed: schema, gate didattico, ≥5 varianti, esecuzione del codice)
più `tsc --noEmit`; se passa, il file è rinominato `ai/<topic>-<id>.ts`, l'indice dei
template AI è rigenerato e l'intera suite + typecheck devono restare verdi (altrimenti
rollback). La revisione umana del file resta obbligatoria.

Regole di qualità e formato delle domande: `packages/subject-javascript/CONTENT_GUIDE.md`
(il gate `qualityIssues` di `@lg/core` le applica nei test, bozze incluse).

## Aggiungere un question type

1. In `@lg/core` registra la definizione nel `QuestionTypeRegistry` (`PHASE1_QUESTION_TYPES` in `src/question/types.ts`): `id`, `label`, `requiresCode`.
2. Crea template con quel `type` nel package del subject.
3. In `apps/web/src/components/question/questionRenderers.tsx` mappa il `type` a un renderer (oggi `ChoiceQuestion` copre tutte le domande a 4 opzioni; un tipo con UI diversa può registrare un componente dedicato).

## Note di architettura

- Nessuna business logic nei componenti: sessioni, scoring, mastery e raccomandazioni vivono in `@lg/core`; gli store zustand le orchestrano.
- Persistenza: `LocalStoragePersistence` (namespace `lg:v1:`) implementa `PersistenceService`; intercambiabile con un backend remoto.
- I test dei contenuti generano 25 varianti per template e, per `predict-output`, eseguono il codice con `new Function` (solo nei test, mai nel client).
