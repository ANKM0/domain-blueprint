# Usage example images

These images show the viewer and the diagrams generated from the dummy
task-management model in `skills/domain-blueprint/examples/minimal`.

- `viewer-<view>.png` — the viewer, one screenshot per tab.
- `<view>.svg` — the generated diagrams (domain / logical / physical / flow / nav / api).

## Regenerate

```bash
cd skills/domain-blueprint
npm install                       # or: bun install
node src/cli.ts build --config examples/minimal/domain-blueprint.config.json
cp examples/minimal/generated/domain.svg examples/minimal/generated/logical.svg \
   examples/minimal/generated/physical.svg examples/minimal/generated/flow.svg \
   examples/minimal/generated/nav.svg examples/minimal/generated/api.svg ../../docs/images/
node src/cli.ts serve --config examples/minimal/domain-blueprint.config.json --port 8781
```

Then capture each tab with any headless browser (for example Playwright):
open the printed URL, click `button[data-view="<domain|logical|physical|flow|nav|api>"]`,
and screenshot. The committed screenshots were taken at 1280x860 with a 2x device
scale factor. `d2` must be on PATH.
