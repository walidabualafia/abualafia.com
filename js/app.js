/* ===================================
   Main Application Entry Point
   =================================== */

(function () {
    'use strict';

    let started = false;

    function startApp() {
        if (started) return;
        started = true;

        Router.init();
        Panels.init();
        Charts.init();
        Terminal.init();
        Eggs.init();
    }

    // Ensure we never miss the bootComplete event (boot may be skipped instantly on refresh)
    window.addEventListener('bootComplete', startApp, { once: true });

    // Initialize boot sequence
    Boot.init();

    // Fallback: if boot was skipped and event already fired, start anyway
    // (e.g., when sessionStorage.bootSeen is set and Boot.init dispatches synchronously)
    queueMicrotask(() => {
        const appShell = document.getElementById('app-shell');
        if (appShell && appShell.style.display !== 'none') {
            startApp();
        }
    });
})();
