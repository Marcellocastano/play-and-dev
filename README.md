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

1. Crea un package in `packages/subject-<nome>` che esporta una `SubjectDefinition` di `@lg/core`: `id`, `name`, `kind` (`language`/`framework`/`runtime`), `status`, `icon`, `theme` (palette + gradienti), `levels` con `topicIds`, `topics` completi e `templates`.
2. I template sono `QuestionTemplate`: `generate(rng)` restituisce una `GeneratedQuestion` (prompt, code opzionale, 4 opzioni, `correctOptionId`, `explanation` completa). Usa l'RNG passato dal core per variare i dati e `makeOptions`-like helpers per distrattori unici.
3. Registra il subject in `apps/web/src/state/subjectStore.ts` (array `subjects`).
4. Il tema viene applicato automaticamente da `ThemeProvider`/`applyTheme` scrivendo le CSS vars su `:root`.

Per un subject "coming soon" basta la `SubjectDefinition` con `status: 'coming-soon'` e liste vuote (vedi `subject-placeholders`).

## Contenuti: template generativi + banca curata

Le domande di `@lg/subject-javascript` arrivano da due fonti: i template generativi in
`src/templates/` (dati variati via RNG) e la banca curata in `content/<topic>.json`,
caricata come `QuestionTemplate` da `src/bank/` (un template per gruppo
`topicId:type:difficulty`, minimo 6 domande — sotto soglia il gruppo non entra nel subject).
Il runtime non importa JSON: `src/bank/data.generated.ts` è rigenerato ad ogni approvazione.

Il flusso di authoring AI è offline e manuale:

```bash
npm run content:author -w @lg/subject-javascript -- \
  --topic errors --type predict-output --difficulty medium --count 7
# genera bozze in content/drafts/ (system prompt: scripts/author.prompt.md,
# key letta da apps/server/.env; modello di default gpt-4.1, override con --model)

npm run content:review -w @lg/subject-javascript
# stampa compatta delle bozze in attesa per la revisione umana

npm run content:approve -w @lg/subject-javascript -- content/drafts/<file>.json [id...]
# senza id approva tutta la bozza; con --reject <file> id... rimuove gli id dalla bozza.
# L'approvazione aggiorna content/<topic>.json e rigenera data.generated.ts.

npm run content:dump -w @lg/subject-javascript -- <seed> [--why]
# dump di ogni template (generativi e banca) per ispezione
```

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
