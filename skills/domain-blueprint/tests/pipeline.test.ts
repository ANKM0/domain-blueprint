import assert from "node:assert/strict";
import { test } from "node:test";
import type { ResolvedConfig } from "../src/config.ts";
import { runExtractors } from "../src/extract.ts";
import { graphData } from "../src/graph.ts";
import { mergeModel } from "../src/merge.ts";
import type { Model } from "../src/model.ts";

const base: ResolvedConfig = {
  title: "t",
  model: "model.json",
  schema: "schema.json",
  outDir: "generated",
  views: [],
  typeMap: {},
  api: {},
  i18n: {},
  adapters: [],
  extractors: [],
  auto: "generated/graph.auto.json",
  presentation: "presentation.json",
  configDir: process.cwd(),
  configPath: `${process.cwd()}/domain-blueprint.config.json`,
};

const sample: Model = {
  domains: { string: { kind: "primitive" } },
  entities: { tasks: { attributes: { id: { domain: "string" } } } },
  screens: { S1: { name: "Tasks", entities: ["tasks"], onLoad: "h" } },
  api: {
    list: { kind: "api", method: "GET", path: "/api/tasks", operation: "list", entity: "tasks", success: 200 },
    h: { kind: "html", method: "GET", path: "/tasks", operation: "load", entity: "tasks", success: 200 },
  },
};

test("mergeModel merges auto with presentation and applies overrides", () => {
  const auto = { api: { a: { kind: "api", method: "GET", path: "/a", operation: "get", success: 200 } } };
  const presentation = {
    entities: { x: { attributes: { id: { domain: "string" } } } },
    flows: { f: { name: "F", steps: [{ name: "s" }] } },
    overrides: { navigation: { add: [{ from: "S1", on: "open", to: "S2" }] } },
  };
  const model = mergeModel(auto, presentation);
  assert.ok(model.api?.a);
  assert.ok(model.entities.x);
  assert.equal(model.flows?.f?.name, "F");
  assert.equal(model.navigation?.length, 1);
});

test("graphData builds clients, endpoints and entities with read/write edges", () => {
  const graph = graphData(sample);
  assert.ok(graph.nodes.some((node) => node.id === "api:list"));
  assert.ok(graph.nodes.some((node) => node.id === "entity:tasks"));
  assert.ok(graph.edges.some((edge) => edge.from === "api:list" && edge.to === "entity:tasks"));
  assert.ok(graph.edges.some((edge) => edge.from === "screen:S1" && edge.to === "api:h"));
  for (const node of graph.nodes) assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y));
});

test("runExtractors merges the JSON printed by extractor commands", () => {
  const command = `node -e "process.stdout.write(JSON.stringify({api:{x:{kind:'api',method:'GET',path:'/x',operation:'get',success:200}}}))"`;
  const auto = runExtractors({ ...base, extractors: [command] });
  assert.ok(auto.api?.x);
});
