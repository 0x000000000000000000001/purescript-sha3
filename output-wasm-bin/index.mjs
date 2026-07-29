import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { makeMarshal } from "./marshal.js";

const MANIFEST = {"Effect.Console.log":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.logShow":{"params":[],"result":"o"},"Effect.Console.warn":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.warnShow":{"params":[],"result":"o"},"Effect.Console.error":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.errorShow":{"params":[],"result":"o"},"Effect.Console.info":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.infoShow":{"params":[],"result":"o"},"Effect.Console.debug":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.debugShow":{"params":[],"result":"o"},"Effect.Console.time":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.timeLog":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.timeEnd":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.clear":{"params":[],"result":{"eff":"o"}},"Effect.Console.group":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.groupCollapsed":{"params":["s"],"result":{"eff":"o"}},"Effect.Console.groupEnd":{"params":[],"result":{"eff":"o"}},"Effect.Console.grouped":{"params":["s",{"eff":"o"}],"result":{"eff":"o"}}};
const EXPORTS_MANIFEST = {"main":{"params":[],"result":{"eff":"o"}},"repeatByte":{"params":["i","i"],"result":"o"}};

const bytes = readFileSync(fileURLToPath(new URL("./index.wasm", import.meta.url)));
const mod = await WebAssembly.compile(bytes);

// `E` is a *lazy* view of the (post-instantiation) exports, so the marshalling glue can be built
// before `inst` exists — `wrap` is used while wiring the importObject below. `wasm-merge` folds the
// runtime + foreign providers into this one module, so every primitive is on `inst.exports`.
let inst;
const E = new Proxy({}, { get: (_, p) => inst.exports[p] });
const { eqrefToJs, eqrefFromJs, isRaw, wrap, wrapExport } = makeMarshal(E);

const importObject = {};
const nsCache = {};
for (const { module, name } of WebAssembly.Module.imports(mod)) {
  if (!nsCache[module]) {
    nsCache[module] = await import(new URL(`./foreign/${module}.js`, import.meta.url).href);
    importObject[module] = {};
  }
  const sig = MANIFEST[module + "." + name];
  importObject[module][name] = sig ? wrap(nsCache[module][name], sig) : nsCache[module][name];
}

inst = await WebAssembly.instantiate(mod, importObject);
// Run module initialization (the CAF globals, ADR 0006) AFTER instantiation, not via the wasm
// `start` section — so a CAF whose init calls a JS foreign that re-enters wasm reaches the
// now-bound instance instead of trapping during instantiation (ADR 0021). `caf_init` is absent
// when the program globalizes no CAFs.
inst.exports.caf_init?.();
// expose the exports as plain JS values. A function export (the type has arguments) is
// wrapped so callers pass/receive JS values; a nullary value binding (a CAF, the type
// has no arguments) is evaluated once here and exposed as the value itself — marshalled
// for a non-raw result — so JS sees `exports.x` as `42` / "hi" / {…}, not a function.
const marshalledExports = {};
for (const name of Object.keys(inst.exports)) {
  if (name === "caf_init") continue; // internal module-init hook, not a user export
  const e = inst.exports[name];
  const sig = EXPORTS_MANIFEST[name];
  if (!sig || typeof e !== "function") {
    marshalledExports[name] = e;
  } else if (sig.params.length === 0 && sig.result && sig.result.eff !== undefined) {
    // an `Effect a` value binding (e.g. `main`) is a *deferred computation*, not a CAF:
    // expose it as a JS thunk `() => a` so the effect runs when CALLED, not at load
    // (matching `Effect a ≃ () => a`). The wasm export performs it on each call.
    const k = sig.result.eff;
    marshalledExports[name] = () => {
      const r = e();
      return isRaw(k) ? r : eqrefToJs(k, r);
    };
  } else if (sig.params.length === 0 && e.length === 0) {
    // a genuine CAF (source value, compiled to a nullary function): call it once at load
    // and expose the resulting value, so it reads as a value on the JS side, not a thunk.
    const r = e();
    marshalledExports[name] = isRaw(sig.result) ? r : eqrefToJs(sig.result, r);
  } else if (sig.params.length === 0) {
    // the source type is a value but the backend compiled it to a *function* — a monadic
    // value (e.g. `TypingM a`) collapsed to take its reader/state arguments (ADR 0015). It
    // is not a JS-usable CAF, and calling it with no args would trap (`illegal cast` on the
    // missing argument), so expose the raw wasm export rather than evaluating it at load.
    marshalledExports[name] = e;
  } else if (sig.result && sig.result.eff !== undefined) {
    // a function returning `Effect a` (e.g. `main :: String -> Effect Unit`): marshal the value
    // args, then return a JS thunk that performs the effect when CALLED — `f(x)()` — matching
    // `Effect a ≃ () => a` (ADR 0015). The wasm export carries the trailing perform-unit param
    // (ADR 0018), which we leave off (as for a nullary Effect); the inner result is marshalled.
    const k = sig.result.eff;
    marshalledExports[name] = (...args) => {
      const xs = args.map((a, i) => (isRaw(sig.params[i]) ? a : eqrefFromJs(sig.params[i], a)));
      return () => {
        const r = e(...xs);
        return isRaw(k) ? r : eqrefToJs(k, r);
      };
    };
  } else {
    marshalledExports[name] = wrapExport(e, sig);
  }
}
export const exports = marshalledExports;
export default exports;
exports.main();
