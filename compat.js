(() => {
  'use strict';

  // LegoLens Core v3.0.0 compatibility layer.
  // Keep this file intentionally small: it exists so the static browser entrypoint
  // has a stable place for safe polyfills without carrying legacy v1/v2/v120 code.

  if (!window.crypto && window.msCrypto) {
    window.crypto = window.msCrypto;
  }

  if (!window.structuredClone) {
    window.structuredClone = (value) => JSON.parse(JSON.stringify(value));
  }

  window.LEGOLENS_COMPAT = {
    release: 'v3.0.0',
    loaded: true
  };
})();
