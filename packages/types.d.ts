import type { sep } from "node:path";

export type AbsoluteFilePath = `${typeof sep}${string}`;

export type FileURL = `file://${string}`;
export type ResolvedSpecifier = `${'data'|'file'|'https'}://`;
