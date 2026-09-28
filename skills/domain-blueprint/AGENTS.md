# AGENTS.md

Guidance for agents working on this repository. Run commands from
`skills/domain-blueprint/` unless noted.

## Layout

- `src/` — runtime (CLI, config, model, checks, renderers, serve). Only `node:` builtins
  and `ajv`. No `Bun.*` APIs; the code must run on both Node and bun.
- `template/` — files copied into consumer projects.
- `references/` — docs referenced by `SKILL.md`.
- `examples/minimal/` — runnable example (uses `../../template` for model/schema; includes a
  hand-written `domain.d2` concept diagram shown via a `static` view with `source`).

## Commands

```bash
npm install
npm test          # node --test tests/*.test.ts
npm run typecheck # tsc -p tsconfig.json
node src/cli.ts build --config examples/minimal/domain-blueprint.config.json
node src/cli.ts serve --config examples/minimal/domain-blueprint.config.json
```

Relative imports use explicit `.ts` extensions (required by Node's type stripping).
Keep `tsconfig.json` `allowImportingTsExtensions` and `noEmit` in sync with that.

## Verify before finishing

- `npm test` and `npm run typecheck` pass.
- `build` on `examples/minimal` exits 0 and produces `*.svg` and `viewer.html`.
- `serve` starts and serves `viewer.html`.

## Publish

`SKILL.md` must keep `name: domain-blueprint` (it must match the repository/directory name).

```bash
gh skill publish --dry-run
gh skill publish   # validates, tags, and creates an immutable release
```
