import assert from "node:assert/strict";
import { test } from "node:test";
import { check } from "../src/check.ts";
import type { Model } from "../src/model.ts";

const base: Model = {
  domains: {
    string: { kind: "primitive" },
    status: { kind: "state", logical: "string", values: ["todo", "done"] },
  },
  entities: {
    tasks: {
      attributes: { id: { domain: "string", pk: true }, status: { domain: "status" } },
      transitions: [{ on: "complete", domain: "status", from: "todo", to: "done" }],
    },
  },
  screens: { S01: { name: "Tasks", entities: ["tasks"], onLoad: "html_tasks" } },
  navigation: [{ from: "S01", on: "save", to: "S01", call: "tasks_patch" }],
  api: {
    tasks_patch: { kind: "api", method: "PATCH", path: "/api/tasks/{id}", operation: "patch", entity: "tasks", success: 200 },
    html_tasks: { kind: "html", method: "GET", path: "/tasks", operation: "load", entity: "tasks", success: 200 },
  },
};

test("check accepts a valid model", () => {
  assert.deepEqual(check(base).errors, []);
});

test("check rejects an unknown domain reference", () => {
  const model: Model = { ...base, entities: { tasks: { attributes: { id: { domain: "missing" } } } } };
  assert.ok(check(model).errors.some((e) => e.includes("is not in domains")));
});

test("check enforces api path and success conventions", () => {
  const model: Model = {
    ...base,
    api: {
      bad: { kind: "api", method: "POST", path: "/api/tasks/create", operation: "create", success: 200 },
      wrong: { kind: "api", method: "GET", path: "/api/tasks", operation: "list", success: 201 },
    },
  };
  const errors = check(model).errors;
  assert.ok(errors.some((e) => e.includes("CRUD verb")));
  assert.ok(errors.some((e) => e.includes("success for GET")));
});

test("check rejects an onLoad that is not an html GET and an unknown call", () => {
  const model: Model = {
    ...base,
    screens: { S01: { name: "Tasks", entities: ["tasks"], onLoad: "tasks_patch" } },
    navigation: [{ from: "S01", on: "x", to: "S01", call: "nope" }],
  };
  const errors = check(model).errors;
  assert.ok(errors.some((e) => e.includes("must be an html GET")));
  assert.ok(errors.some((e) => e.includes("call is not in api")));
});
