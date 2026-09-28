import type { Adapter } from "../../../src/adapters.ts";

// Example adapter: require every entity to document itself.
// Real projects use adapters to cross-check project-specific sources
// (invariant docs, SQL migrations, HTTP route definitions, ...).
export const adapter: Adapter = ({ model }) => {
  const errors = Object.entries(model.entities)
    .filter(([, entity]) => entity.description === undefined)
    .map(([name]) => `entities.${name} is missing a description`);
  return { errors };
};
