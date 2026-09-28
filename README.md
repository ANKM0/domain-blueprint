# domain-blueprint

Turn one model JSON into several design views — logical/physical ER, business flow,
screen navigation, and an API call map — then browse them in a local viewer.
Every view comes from the same source, so editing the model keeps all diagrams in sync.

This repository is both a plain project and an
[Agent Skill](https://agentskills.io): `SKILL.md` tells an agent how to install it into
another project.

## Quickstart

```bash
npm install            # or: bun install
node src/cli.ts build --config template/domain-blueprint.config.json
node src/cli.ts serve --config template/domain-blueprint.config.json
# open the printed URL
```

`build` validates the model, writes `*.d2`, compiles them with
[d2](https://d2lang.com) (must be on PATH), patches the SVGs, and writes `viewer.html`.
Node.js >= 22.6 strips TypeScript types; on 22.6–23.5 add `--experimental-strip-types`.

## Install into your project

```bash
npx skills add ANKM0/domain-blueprint
# or
gh skill install ANKM0/domain-blueprint
```

Then ask your agent to follow `SKILL.md`. It copies `src/` and `template/` into your
project, creates the model and config, wires the tasks, and verifies the viewer.
`INSTALL.md` is a ready-to-paste prompt.

## Layout

- `src/` — CLI, config, model types, checks, renderers, viewer template, static server.
- `template/` — starter config, model, schema, and Taskfile fragment.
- `references/` — config, model, and adapter reference docs.
- `examples/minimal/` — a runnable example with an adapter.

## License

MIT
