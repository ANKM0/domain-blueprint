---
name: domain-blueprint
description: Add a single-source domain model that generates ER, flow, screen, and API diagrams and serves them in a local viewer. Use when a project wants design-first diagrams from one JSON, or when asked to install domain-blueprint into a project.
license: MIT
---

# domain-blueprint

Turn one model JSON into several design views (logical/physical ER, business flow,
screen navigation, API call map), validate them, and browse them in a local viewer.
All views come from the same source, so editing the model keeps every diagram in sync.

## When to use

- A project wants ER / flow / screen / API diagrams generated from one source of truth.
- A project wants to align data shape and design before writing code.
- The user asks to install or set up `domain-blueprint`.

## Prerequisites

- Node.js >= 22.6 (type stripping) or bun. `serve` needs no extra runtime beyond Node.
- `d2` (Terrastruct D2) on PATH, only for generating SVGs. The viewer itself does not need it.
  Install: `brew install d2`, `scoop install d2`, or `go install oss.terrastruct.com/d2@latest`.

## Install into a project

1. Copy this skill's `src/` and `template/` into the project as `tools/domain-blueprint/`.
   - If installed via `npx skills add`, the files are under the installed skill directory
     (for example `.agents/skills/domain-blueprint/`). Copy `src/` and `template/` from there.
2. Create the project config at `domain-blueprint.config.json` from
   `tools/domain-blueprint/template/domain-blueprint.config.json`, and adjust `views`,
   `typeMap`, and `api` conventions.
3. Create the model:
   - `docs/domain/domain-model.schema.json` from `template/model.schema.json`.
   - `docs/domain/domain-model.json` describing the project's domains, entities, relations,
     flows, screens, navigation, and api. Ask the user about the domain, or extract it from code.
4. Point the config at the model, schema, and an output directory:
   ```json
   { "model": "docs/domain/domain-model.json", "schema": "docs/domain/domain-model.schema.json", "outDir": "docs/domain/generated" }
   ```
5. Add tasks (Taskfile or npm scripts) from `template/taskfile/blueprint.yml`, adjusting the
   path to `tools/domain-blueprint/src/cli.ts`.
6. Optionally add project-specific checks as adapters in `domain-blueprint.config.json`
   `adapters` (see `references/adapters.md`). An adapter exports an `adapter` function that
   returns `{ errors, warnings }`.

## Commands

```bash
# write *.d2 and viewer.html
node tools/domain-blueprint/src/cli.ts generate --config domain-blueprint.config.json

# generate + compile SVGs with d2 + patch svg dimensions
node tools/domain-blueprint/src/cli.ts build --config domain-blueprint.config.json

# serve the viewer locally
node tools/domain-blueprint/src/cli.ts serve --config domain-blueprint.config.json
```

Node 22.6–23.5 needs `--experimental-strip-types`. With bun, run `bun src/cli.ts`.

## Verify (done when)

- `build` exits 0 (schema, cross-checks, and adapters pass).
- `serve` prints a URL and the viewer shows every configured tab.
- Every entity is referenced by a screen (otherwise a warning is printed).

## References

- `references/config.md` — full config reference (views, typeMap, i18n, adapters).
- `references/model.md` — model JSON shape and conventions.
- `references/adapters.md` — writing project-specific checks.
