/* ===================================
   Easter Eggs & Keyboard Shortcuts
   =================================== */

const Eggs = (() => {
    // Keyboard shortcuts (only when terminal is closed)
    function initShortcuts() {
        const shortcutsOverlay = document.getElementById('shortcuts-overlay');

        document.addEventListener('keydown', (e) => {
            // Don't trigger if typing in terminal or input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const terminalVisible = document.getElementById('terminal-overlay')?.classList.contains('visible');
            const shortcutsVisible = shortcutsOverlay?.classList.contains('visible');

            // Close shortcuts on any key
            if (shortcutsVisible) {
                shortcutsOverlay.classList.remove('visible');
                return;
            }

            // Don't process shortcuts if terminal is open
            if (terminalVisible) return;

            switch (e.key) {
                case 't':
                    e.preventDefault();
                    Terminal.openTerminal();
                    break;
                case '1':
                    e.preventDefault();
                    Router.navigateTo('overview');
                    break;
                case '2':
                    e.preventDefault();
                    Router.navigateTo('experience');
                    break;
                case '3':
                    e.preventDefault();
                    Router.navigateTo('skills');
                    break;
                case '4':
                    e.preventDefault();
                    Router.navigateTo('education');
                    break;
                case '5':
                    e.preventDefault();
                    Router.navigateTo('research');
                    break;
                case '6':
                    e.preventDefault();
                    Router.navigateTo('projects');
                    break;
                case '7':
                    e.preventDefault();
                    Router.navigateTo('contact');
                    break;
                case '?':
                    e.preventDefault();
                    if (shortcutsOverlay) shortcutsOverlay.classList.add('visible');
                    break;
                case 'Escape':
                    if (shortcutsOverlay) shortcutsOverlay.classList.remove('visible');
                    break;
            }
        });
    }

    // Konami code
    function initKonami() {
        const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let index = 0;

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            if (e.key === code[index]) {
                index++;
                if (index === code.length) {
                    triggerKonami();
                    index = 0;
                }
            } else {
                index = 0;
            }
        });
    }

    function triggerKonami() {
        Terminal.openTerminal();
        setTimeout(() => {
            const output = document.getElementById('terminal-output');
            if (output) {
                const div = document.createElement('div');
                div.className = 'term-output';
                div.innerHTML = `<span class="term-success">
🎮 KONAMI CODE ACTIVATED! 🎮

+30 lives, unlimited continues!
Achievement unlocked: "True Gamer"

You found the secret Easter egg.
Welcome to the inner circle.
</span>`;
                output.appendChild(div);
                document.getElementById('terminal-body').scrollTop = document.getElementById('terminal-body').scrollHeight;
            }
        }, 300);
    }

    // Logo click cycle
    function initLogoClick() {
        const logo = document.getElementById('topbar-logo');
        if (!logo) return;

        const messages = [
            'walid@cluster:~$',
            'Building infrastructure for scientific discovery',
            '55,000+ cores managed',
            'St. Jude Children\'s Research Hospital',
            'From Amman, Jordan 🇯🇴',
        ];
        let msgIndex = 0;

        logo.addEventListener('click', () => {
            msgIndex = (msgIndex + 1) % messages.length;
            if (msgIndex === 0) {
                // Reset to default
                logo.innerHTML = '<span class="logo-prompt">walid</span><span class="logo-at">@</span><span class="logo-host">cluster</span><span class="logo-colon">:</span><span class="logo-path">~</span><span class="logo-dollar">$</span>';
            } else {
                logo.innerHTML = `<span style="color: var(--green); font-size: 12px;">${messages[msgIndex]}</span>`;
            }
        });
    }

    // Console easter egg
    function initConsoleEgg() {
        const styles = 'font-size: 16px; font-weight: bold; padding: 10px;';
        console.log('%c🖥️ Welcome to Walid\'s HPC Dashboard!', `${styles} color: #00d4aa;`);
        console.log('%cComputational Engineer @ St. Jude | M.S. CS @ UT Austin', 'font-size: 12px; color: #8e8e8e;');
        console.log('%cTry the terminal (press "t") for more secrets...', 'font-size: 12px; color: #3274d9;');
        console.log('%cOr enter the Konami code: ↑↑↓↓←→←→BA', 'font-size: 11px; color: #5a5e66;');
    }

    function init() {
        initShortcuts();
        initKonami();
        initLogoClick();
        initConsoleEgg();
    }

    return { init };
})();
