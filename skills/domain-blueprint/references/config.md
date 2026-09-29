# Config reference

`domain-blueprint.config.json`:

| Field | Description |
| --- | --- |
| `title` | Viewer title. |
| `model` | Path to the model JSON. Relative to the config file. |
| `schema` | Path to the JSON schema for the model. Relative to the config file. |
| `outDir` | Output directory for `*.d2`, `*.svg`, and `viewer.html`. Relative to the config file. |
| `views` | List of views: `{ key, label, kind, layout?, source? }`. `kind` is `logical` \| `physical` \| `flow` \| `nav` \| `api` \| `graph` \| `static`. `layout` is `elk` or `dagre` (d2 layout). A `static` view is not generated from the model: set `source` to a hand-written `.d2` (path relative to the config) and `build` compiles it to `<key>.svg`; without `source`, an existing pre-rendered `<key>.svg` is used. Use `static` for a hand-written concept/domain diagram. A `graph` view renders an interactive vis-network graph (`<key>.json`) built from the model; the optional `presentation.graph` section only decorates it (areas, labels, colors). |
| `typeMap` | Logical type to physical type mapping used by the `physical` view. |
| `api.pathPrefix` | Prefix for `kind: "api"` paths (default `/api/`). |
| `api.crudVerbs` | Path segments rejected in `kind: "api"` routes. |
| `i18n` | Overrides for view labels (`legend`, `initial`, `reference`, `unused`, `entity`, `unusedTitle`, `referenceLegend`, `unusedLegend`, `entityLegend`). Defaults are English. |
| `adapters` | Paths to adapter modules (relative to the config file). See `adapters.md`. |
| `extractors` | Commands (run from the config directory) that print a partial model JSON to stdout. The `sync` command merges their output into the auto graph. Language-agnostic: use any executable. |
| `auto` | Path to the code-derived auto graph (default `generated/graph.auto.json`). |
| `presentation` | Path to the manual presentation JSON (default `presentation.json`): decoration, `overrides` (`add`/`remove`), and business `flows`. |

Views are independent: remove any `kind` you do not need, or add the same kind under a
different `key` (for example two `api` views with different labels).

## Code-driven pipeline

`sync` keeps the model in sync with the code:

```bash
blueprint sync --config domain-blueprint.config.json          # run extractors -> auto -> merge -> model
blueprint sync --config domain-blueprint.config.json --check  # fail if auto or model is stale
blueprint build --config domain-blueprint.config.json         # sync + generate + compile
```

- Extractors are commands that read the codebase and print a partial model (`domains`,
  `entities`, `relations`, `screens`, `navigation`, `screenCalls`, `api`, `persistence`).
  They are project-specific and live with the project; the tool only merges their output.
- `auto` holds the code-derived relationships; `presentation` holds the manual decoration,
  `overrides`, and business `flows`. `model` is the merged result (do not edit by hand).
