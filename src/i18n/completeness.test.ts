import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

function readMessagesFile(relativePath: string): JsonObject {
  const absPath = resolve(process.cwd(), relativePath);
  const raw = readFileSync(absPath, 'utf8');
  return JSON.parse(raw) as JsonObject;
}

function getLeafKeys(value: JsonValue, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  const result: string[] = [];
  for (const [key, child] of Object.entries(value)) {
    const next = prefix ? `${prefix}.${key}` : key;
    result.push(...getLeafKeys(child, next));
  }
  return result;
}

function getValueAtPath(obj: JsonObject, path: string): JsonValue | undefined {
  const parts = path.split('.');
  let current: JsonValue = obj;
  for (const part of parts) {
    if (current === null || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    current = (current as JsonObject)[part];
    if (current === undefined) {
      return undefined;
    }
  }
  return current;
}

describe('i18n message completeness', () => {
  const en = readMessagesFile('messages/en.json');
  const zhCN = readMessagesFile('messages/zh-CN.json');
  const enLeafKeys = getLeafKeys(en).sort();
  const zhLeafKeys = getLeafKeys(zhCN).sort();

  it('every leaf key in en.json exists in zh-CN.json', () => {
    const missing = enLeafKeys.filter((key) => !zhLeafKeys.includes(key));
    expect(missing).toEqual([]);
  });

  it('zh-CN.json has no extra leaf keys absent from en.json', () => {
    const extra = zhLeafKeys.filter((key) => !enLeafKeys.includes(key));
    expect(extra).toEqual([]);
  });

  it('all zh-CN leaf values are non-empty strings', () => {
    const emptyValueKeys = zhLeafKeys.filter((key) => {
      const value = getValueAtPath(zhCN, key);
      return typeof value !== 'string' || value.trim().length === 0;
    });

    expect(emptyValueKeys).toEqual([]);
  });
});
