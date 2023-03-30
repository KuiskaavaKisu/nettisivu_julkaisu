/* tslint:disable */
/* eslint-disable */
/**
*/
export function left(): void;
/**
*/
export function right(): void;
/**
*/
export function center(): void;
/**
*/
export function scrollEnd(): void;
/**
*/
export function ran(): void;
/**
*/
export function loppu(): void;
/**
*/
export function half(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly left: () => void;
  readonly right: () => void;
  readonly center: () => void;
  readonly scrollEnd: () => void;
  readonly ran: () => void;
  readonly loppu: () => void;
  readonly half: () => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
