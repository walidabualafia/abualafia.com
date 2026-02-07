/* ===================================
   Boot Sequence Animation
   =================================== */

const Boot = (() => {
    const bootLines = [
        { text: '[BIOS] POST Check...', delay: 80, tag: 'BIOS', append: ' OK', appendClass: 'boot-ok', appendDelay: 300 },
        { text: '[BIOS] Cores: 55,000+ across 6 clusters', delay: 60, tag: 'BIOS' },
        { text: '[BIOS] Memory: Walid Abu Al-Afia | Computational Engineer', delay: 60, tag: 'BIOS' },
        { text: '[BIOS] Cache: M.S. Computer Science @ UT Austin', delay: 60, tag: 'BIOS' },
        { text: '[BIOS] GPU: 2,500+ GPUs detected', delay: 60, tag: 'BIOS' },
        { text: '', delay: 200, empty: true },
        { text: '[KERNEL] Loading modules...', delay: 50, tag: 'KERNEL', append: ' prometheus grafana slurm lsf', appendClass: 'boot-mod', appendDelay: 400 },
        { text: '[KERNEL] Mounting /data (30 PB)...', delay: 50, tag: 'KERNEL', append: ' OK', appendClass: 'boot-ok', appendDelay: 350 },
        { text: '', delay: 150, empty: true },
        { text: '[NET] Connecting to St. Jude HPC Network...', delay: 50, tag: 'NET', append: ' OK', appendClass: 'boot-ok', appendDelay: 400 },
        { text: '[NET] Resolving abualafia.com...', delay: 50, tag: 'NET', append: ' OK', appendClass: 'boot-ok', appendDelay: 300 },
        { text: '', delay: 150, empty: true },
        { text: '[SCHED] Slurm scheduler online', delay: 60, tag: 'SCHED' },
        { text: '', delay: 200, empty: true },
        { text: '[DASH] Initializing monitoring dashboard...', delay: 50, tag: 'DASH' },
        { text: '[DASH] Loading panels...', delay: 50, tag: 'DASH', progress: true },
        { text: '', delay: 300, empty: true },
        { text: '> Welcome to Walid\'s HPC Dashboard', delay: 0, className: 'boot-welcome' },
        { text: '> Type \'help\' in the terminal for available commands', delay: 0, className: 'boot-hint' },
    ];

    let skipped = false;
    let bootScreen = null;
    let bootOutput = null;

    function createLine(config) {
        const div = document.createElement('div');
        div.className = 'boot-line' + (config.className ? ' ' + config.className : '');

        if (config.empty) {
            div.innerHTML = '&nbsp;';
            return div;
        }

        let html = config.text;
        // Colorize tag
        if (config.tag) {
            html = html.replace(`[${config.tag}]`, `<span class="boot-tag">[${config.tag}]</span>`);
        }

        div.innerHTML = html;
        return div;
    }

    async function sleep(ms) {
        if (skipped) return;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeText(element, text, charDelay) {
        for (let i = 0; i < text.length; i++) {
            if (skipped) {
                element.textContent += text.slice(i);
                return;
            }
            element.textContent += text[i];
            await sleep(charDelay);
        }
    }

    async function showProgress(element) {
        const bar = document.createElement('span');
        bar.className = 'boot-progress';
        element.appendChild(bar);

        const blocks = '████████████████████';
        for (let i = 0; i < blocks.length; i++) {
            if (skipped) {
                bar.textContent = blocks + ' READY';
                return;
            }
            bar.textContent = blocks.slice(0, i + 1);
            await sleep(50);
        }
        bar.textContent = blocks + ' READY';
    }

    async function runSequence() {
        for (let i = 0; i < bootLines.length; i++) {
            if (skipped) break;

            const config = bootLines[i];
            const line = createLine(config);
            bootOutput.appendChild(line);

            if (!config.empty && config.text) {
                await sleep(config.delay * config.text.length * 0.15);
            }

            if (config.progress) {
                await showProgress(line);
            }

            if (config.append && !skipped) {
                await sleep(config.appendDelay || 200);
                const span = document.createElement('span');
                span.className = config.appendClass || '';
                span.textContent = config.append;
                line.appendChild(span);
            }

            if (config.empty) {
                await sleep(config.delay);
            } else {
                await sleep(80);
            }

            // Keep boot output scrolled down
            bootOutput.scrollTop = bootOutput.scrollHeight;
        }
    }

    function skipBoot() {
        skipped = true;
        finishBoot();
    }

    function finishBoot() {
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            const appShell = document.getElementById('app-shell');
            appShell.style.display = '';
            appShell.style.opacity = '0';
            requestAnimationFrame(() => {
                appShell.style.transition = 'opacity 0.5s ease';
                appShell.style.opacity = '1';
            });

            // Signal that boot is done
            window.dispatchEvent(new CustomEvent('bootComplete'));

            setTimeout(() => {
                bootScreen.style.display = 'none';
            }, 700);
        }, skipped ? 100 : 600);
    }

    async function init() {
        bootScreen = document.getElementById('boot-screen');
        bootOutput = document.getElementById('boot-output');

        if (!bootScreen || !bootOutput) return;

        // Skip if already visited this session
        if (sessionStorage.getItem('bootSeen')) {
            bootScreen.style.display = 'none';
            const appShell = document.getElementById('app-shell');
            appShell.style.display = '';
            appShell.style.opacity = '1';
            window.dispatchEvent(new CustomEvent('bootComplete'));
            return;
        }

        // Skip handlers
        const skipHandler = () => {
            skipBoot();
            document.removeEventListener('keydown', skipHandler);
            bootScreen.removeEventListener('click', skipHandler);
        };
        document.addEventListener('keydown', skipHandler);
        bootScreen.addEventListener('click', skipHandler);

        // Run the sequence
        await runSequence();

        if (!skipped) {
            finishBoot();
        }

        sessionStorage.setItem('bootSeen', 'true');
        document.removeEventListener('keydown', skipHandler);
        bootScreen.removeEventListener('click', skipHandler);
    }

    return { init };
})();
