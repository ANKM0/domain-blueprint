import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { ResolvedConfig } from "./config.ts";
import { resolveConfigPath } from "./config.ts";
import type { Model } from "./model.ts";

// Project-provided extractors read the codebase and print a partial model as JSON.
// The tool merges their output into the auto graph, which is then merged with the
// manual presentation to build the model the views render.

const DICT_KEYS = ["domains", "entities", "screens", "api"] as const;
const LIST_KEYS = ["relations", "navigation", "screenCalls"] as const;

export type PartialModel = Partial<Model>;

function mergePartial(auto: PartialModel, partial: PartialModel): void {
  for (const key of DICT_KEYS) {
    const value = partial[key];
    if (value) auto[key] = { ...(auto[key] ?? {}), ...value } as never;
  }
  for (const key of LIST_KEYS) {
    const value = partial[key];
    if (value) auto[key] = [...((auto[key] ?? []) as unknown[]), ...(value as unknown[])] as never;
  }
  if (partial.flows) auto.flows = { ...(auto.flows ?? {}), ...partial.flows };
  if (partial.persistence) auto.persistence = partial.persistence;
}

export function runExtractors(config: ResolvedConfig): PartialModel {
  const auto: PartialModel = {};
  for (const command of config.extractors) {
    const result = spawnSync(command, { shell: true, cwd: config.configDir, encoding: "utf8" });
    if (result.status !== 0) {
      console.error(`extractor failed (${command}):`);
      console.error(result.stderr || result.stdout);
      process.exit(1);
    }
    let partial: PartialModel;
    try {
      partial = JSON.parse(result.stdout) as PartialModel;
    } catch {
      console.error(`extractor did not print JSON (${command})`);
      process.exit(1);
    }
    mergePartial(auto, partial);
  }
  return auto;
}

export function readAuto(config: ResolvedConfig): PartialModel | undefined {
  const path = resolveConfigPath(config, config.auto);
  if (!existsSync(path)) return undefined;
  return JSON.parse(readFileSync(path, "utf8")) as PartialModel;
}

export function writeAuto(config: ResolvedConfig, auto: PartialModel): string {
  const path = resolveConfigPath(config, config.auto);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(auto, null, 2)}\n`);
  return path;
}

export function checkAuto(config: ResolvedConfig, expected: PartialModel): void {
  const actual = readAuto(config);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(`${config.auto} differs from the extractors; run the sync command`);
    process.exit(1);
  }
}
