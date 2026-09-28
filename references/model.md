# Model reference

The model is the single source for every view.

```jsonc
{
  "domains": {
    "string": { "kind": "primitive" },
    "status": { "kind": "state", "logical": "string", "values": ["todo", "done"] }
  },
  "entities": {
    "tasks": {
      "description": "A task.",
      "attributes": {
        "id": { "domain": "string", "pk": true },
        "status": { "domain": "status" }
      },
      "transitions": [{ "on": "complete", "domain": "status", "from": "todo", "to": "done" }]
    }
  },
  "relations": [{ "from": "tasks", "to": "notes", "kind": "one-to-many", "on": "has" }],
  "flows": {
    "task_management": {
      "name": "Manage tasks",
      "steps": [{ "name": "Create a task", "entity": "tasks", "changes": { "status": "todo" } }]
    }
  },
  "screens": {
    "S01": { "name": "Task list", "entities": ["tasks"], "onLoad": "html_tasks_page" }
  },
  "navigation": [{ "from": "S01", "on": "open task", "to": "S02", "call": "html_tasks_update" }],
  "api": {
    "tasks_list": { "kind": "api", "method": "GET", "path": "/api/tasks", "operation": "list", "entity": "tasks", "success": 200 },
    "html_tasks_page": { "kind": "html", "method": "GET", "path": "/tasks", "operation": "load", "entity": "tasks", "success": 200 }
  }
}
```

- `domains`: `primitive` (logical type is the domain name) or `state` (with `logical` and `values`).
- `entities[].attributes[].domain` must exist in `domains`.
- `transitions[].from`/`to` must be in the domain's `values`.
- `screens[].onLoad` must reference an `api` entry with `kind: "html"` and `method: "GET"`.
- `screens[].references` are logical API references (drawn dashed; not real calls).
- `navigation[].call` references an `api` key; the call map draws it as a real call.
- `api[].kind` is `api` (JSON API) or `html` (server-rendered UI endpoint).

See `template/model.schema.json` for the full schema.
