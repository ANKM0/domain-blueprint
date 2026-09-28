# Adapters reference

Adapters add project-specific validation on top of the generic checks. They are useful for
cross-checking the model against other sources of truth (invariant docs, SQL migrations,
HTTP route definitions, generated types, ...).

An adapter module exports an `adapter` function (or a default function):

```ts
import type { Adapter } from "tools/domain-blueprint/src/adapters.ts";

export const adapter: Adapter = ({ model, config }) => {
  const errors = Object.entries(model.entities)
    .filter(([, entity]) => entity.description === undefined)
    .map(([name]) => `entities.${name} is missing a description`);
  return { errors, warnings: [] };
};
```

Register it in the config:

```json
{ "adapters": ["tools/adapters/require-description.ts"] }
```

Adapter paths are resolved relative to the config file. Each adapter receives:

- `model`: the parsed model.
- `config`: the resolved config, including `configDir` for resolving other paths.

Returned `errors` fail the build; `warnings` are printed. Adapters may be async.
Keep project-specific logic in the project, not in `domain-blueprint`.
