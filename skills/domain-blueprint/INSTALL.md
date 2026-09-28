# Install prompt

Paste the following into your coding agent from the root of the target project:

---

Read https://github.com/ANKM0/domain-blueprint (and its `skills/domain-blueprint/SKILL.md`),
then install `domain-blueprint` into this project:

1. Copy `src/` and `template/` from that repository into `tools/domain-blueprint/`.
2. Create `domain-blueprint.config.json` from `tools/domain-blueprint/template/domain-blueprint.config.json`.
3. Create `docs/domain/domain-model.schema.json` from `template/model.schema.json`, and
   `docs/domain/domain-model.json` describing this project's domains, entities, relations,
   flows, screens, navigation, and api. Ask me about the domain if anything is unclear.
4. Point the config at the model, schema, and `docs/domain/generated`.
5. Add `blueprint:svg` and `blueprint:viewer` tasks from
   `tools/domain-blueprint/template/taskfile/blueprint.yml`.
6. Run `node tools/domain-blueprint/src/cli.ts build --config domain-blueprint.config.json`
   (install d2 if missing), fix any errors, then run
   `node tools/domain-blueprint/src/cli.ts serve --config domain-blueprint.config.json`
   and confirm the viewer shows every tab.

---

If the skill is already installed (`npx skills add ANKM0/domain-blueprint`), just say:
"follow the domain-blueprint skill to install it into this project".
