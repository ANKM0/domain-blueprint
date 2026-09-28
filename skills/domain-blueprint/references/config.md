# Config reference

`domain-blueprint.config.json`:

| Field | Description |
| --- | --- |
| `title` | Viewer title. |
| `model` | Path to the model JSON. Relative to the config file. |
| `schema` | Path to the JSON schema for the model. Relative to the config file. |
| `outDir` | Output directory for `*.d2`, `*.svg`, and `viewer.html`. Relative to the config file. |
| `views` | List of views: `{ key, label, kind, layout?, source? }`. `kind` is `logical` \| `physical` \| `flow` \| `nav` \| `api` \| `static`. `layout` is `elk` or `dagre` (d2 layout). A `static` view is not generated from the model: set `source` to a hand-written `.d2` (path relative to the config) and `build` compiles it to `<key>.svg`; without `source`, an existing pre-rendered `<key>.svg` is used. Use `static` for a hand-written concept/domain diagram. |
| `typeMap` | Logical type to physical type mapping used by the `physical` view. |
| `api.pathPrefix` | Prefix for `kind: "api"` paths (default `/api/`). |
| `api.crudVerbs` | Path segments rejected in `kind: "api"` routes. |
| `i18n` | Overrides for view labels (`legend`, `initial`, `reference`, `unused`, `entity`, `unusedTitle`, `referenceLegend`, `unusedLegend`, `entityLegend`). Defaults are English. |
| `adapters` | Paths to adapter modules (relative to the config file). See `adapters.md`. |

Views are independent: remove any `kind` you do not need, or add the same kind under a
different `key` (for example two `api` views with different labels).
