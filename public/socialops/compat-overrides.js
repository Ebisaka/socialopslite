/* Compatibility layer kept intentionally light.
   Product behavior is finalized in runtime-overrides.js so older demo
   patches cannot redraw the interface after the clean runtime has run. */
(function socialOpsCompatOverrides(){
  window.SOCIALOPS_COMPAT_READY = true;
})();
