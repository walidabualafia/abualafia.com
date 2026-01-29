// ===================================
// Martian Portfolio - Interactive Scripts
// ===================================

// DOM Elements
const terminalToggle = document.getElementById('terminal-toggle');
const terminalModal = document.getElementById('terminal-modal');
const terminalClose = document.getElementById('terminal-close');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const terminalOutput = document.getElementById('terminal-output');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

// Command history
let commandHistory = [];
let historyIndex = -1;

// ===================================
// Terminal Commands
// ===================================

const commands = {
    help: {
        description: 'show available commands',
        output: `available commands:

  <span class="info-text">about</span>        - learn about me
  <span class="info-text">experience</span>   - view work experience
  <span class="info-text">skills</span>       - see technical skills
  <span class="info-text">education</span>    - education background
  <span class="info-text">projects</span>     - view my projects
  <span class="info-text">vibe</span>         - vibe coding philosophy
  <span class="info-text">contact</span>      - get contact information
  <span class="info-text">resume</span>       - download resume
  <span class="info-text">clear</span>        - clear terminal
  <span class="info-text">help</span>         - show this message

<span class="command-hint">psst...</span> try typing: sudo, neofetch, coffee, mars`
    },

    about: {
        description: 'information about me',
        output: `<span class="success-text">$ whoami</span>

computational engineer ii @ st. jude children's research hospital
m.s. computer science @ university of texas at austin (expected dec 2028)

from amman, jordan | based in memphis, tn
b.s. computer science - rhodes college (2023) - magna cum laude
nvidia-certified associate: ai infrastructure and operations (2025)

i architect hpc systems, mlops pipelines, and ai infrastructure that
empower researchers to push the boundaries of pediatric cancer research.

fluent in arabic & english | working proficiency in spanish & french`
    },

    experience: {
        description: 'work experience',
        output: `<span class="success-text">$ cat experience.txt</span>

<span class="info-text">computational engineer ii</span>
st. jude children's research hospital | may 2024 - present
  • leads ai infrastructure adoption, teaching cursor/claude code/codex & more
  • architected 20,000-line mlops python package for researchers
  • expanded open ondemand to multi-cluster deployment (4 envs)
  • sole resource for 19 cryosparc instances
  • conducted 30 pb data migration to imaging storage

<span class="info-text">computational engineer i</span>
st. jude children's research hospital | may 2023 - may 2024
  • built open ondemand for 20,000+ core cluster
  • authored interactive applications (maestro, vmd, scipion)
  • taught seminars on hpc programming tools
  • optimized mpi, openmp, and cuda programs for researchers

<span class="info-text">hpc engineering student/intern</span>
st. jude children's research hospital | jun 2022 - may 2023
  • built prometheus + grafana metrics infrastructure
  • developed vr training app for pediatric patients
  • deployed alphafold-based protein prediction api`
    },

    skills: {
        description: 'technical skills',
        output: `<span class="success-text">$ ls -la skills/</span>

<span class="info-text">languages:</span>
  python, c/c++, rust, go, java, r, ruby, bash, javascript,
  html/css, react.js, racket, c#

<span class="info-text">hpc & parallel computing:</span>
  slurm, lsf, open ondemand, mpi, openmp, cuda, gpu optimization,
  spmd programming, data distribution, environment modules, rhel

<span class="info-text">devops & cloud:</span>
  prometheus, grafana, docker, kubernetes, apptainer, singularity,
  gcp, conda, vnc, sso/onelogin, shell scripting

<span class="info-text">ml, ai & scientific computing:</span>
  transformers, cnns, lstms, federated learning, contrastive learning,
  ensemble methods, mlops, deep learning, ai agents, jupyter,
  alphafold, cryosparc, cryo-em/et, data pipelines

<span class="info-text">tools & editors:</span>
  vim, emacs, vscode, cursor, intellij, rstudio, unity, git, gcc

<span class="info-text">focus areas:</span>
  parallel systems, distributed systems, compiler design,
  systems programming, scientific computing, hri, vr/ar`
    },

    education: {
        description: 'education background',
        output: `<span class="success-text">$ cat education.log</span>

<span class="info-text">master of science - computer science</span>
university of texas at austin | aug 2025 - dec 2028
  • gpa: 4.0
  • focus: parallel systems, deep learning

<span class="info-text">bachelor of science - computer science</span>
rhodes college | 2019 - 2023
  • gpa: 3.87, magna cum laude
  • joseph reeves hyde award, jack u. russell award
  • upsilon pi epsilon, theta alpha kappa
  • minor: religious studies

<span class="info-text">certifications</span>
  • nvidia-certified associate: ai infrastructure and operations (2025)`
    },

    projects: {
        description: 'view projects',
        output: `<span class="success-text">$ ls -l ~/projects/</span>

my github showcases work in:
  • distributed systems (raft algorithm, mapreduce)
  • hpc tools and optimizations
  • system-level programming
  • mlops infrastructure

<span class="info-text">publication:</span>
  ieee/rsj iros 2023 - "development and evaluation of exploratory
  experiences to facilitate reasoning about robotic systems"

<span class="info-text">view projects:</span> <a href="https://github.com/walidabualafia" target="_blank">github.com/walidabualafia</a>

<span class="command-hint">note:</span> some projects available on request basis`
    },

    contact: {
        description: 'contact information',
        output: `<span class="success-text">$ cat contact.vcf</span>

<span class="info-text">email:</span>     <a href="mailto:walid@utexas.edu">walid@utexas.edu</a>
<span class="info-text">github:</span>    <a href="https://github.com/walidabualafia" target="_blank">github.com/walidabualafia</a>
<span class="info-text">linkedin:</span>  <a href="https://www.linkedin.com/in/abualafia" target="_blank">linkedin.com/in/abualafia</a>
<span class="info-text">location:</span>  memphis, tn (open to relocation)

<span class="command-hint">tip:</span> fastest response via linkedin message`
    },

    resume: {
        description: 'download resume',
        output: `<span class="success-text">$ download resume.pdf</span>

<span class="info-text">curriculum vitae available for download:</span>

  <a href="abualafia-curriculum-vitae.pdf" download>click here to download cv (pdf)</a>

or contact me directly:
  email: <a href="mailto:walid@utexas.edu">walid@utexas.edu</a>
  linkedin: <a href="https://www.linkedin.com/in/abualafia" target="_blank">linkedin.com/in/abualafia</a>`
    },

    vibe: {
        description: 'vibe coding philosophy',
        output: `<span class="success-text">$ cat vibe.md</span>

<span class="info-text">vibe coding philosophy</span>

i'm a vibe coder at heart—using ai to ship software faster and better.

<span class="info-text">how i use ai:</span>
  • rapid prototyping and proof-of-concepts
  • generating boilerplate and scaffolding
  • refactoring and modernizing codebases
  • optimizing efficiency and performance
  • studying and analyzing runtime behavior
  • documentation and code organization

<span class="info-text">my daily stack:</span>
  cursor, kiro, kilo, kimi, qwen, amp, augment, antigravity,
  opencode, moltbot, emergent, resonant, warp, trae, and more

the future isn't about replacing developers—it's about amplifying
what we can build.`
    },

    clear: { description: 'clear terminal', output: null }
};

// Easter eggs
const easterEggs = {
    ls: {
        output: `about.txt  contact.vcf  education.log  experience.txt  projects/  resume.pdf  skills/

try running one of these: <span class="command-hint">cat about.txt</span>`
    },

    whoami: {
        output: `visitor

<span class="command-hint">hint:</span> try the <span class="info-text">about</span> command to learn about walid`
    },

    pwd: { output: `/home/walid/mars-base` },

    uname: { output: `martian terminal v2.0 (hpc edition)` },

    neofetch: {
        output: `
 __      __         _   _       _        visitor@mars
 \\ \\    / /  __ _  | | (_)   __| |       -----------
  \\ \\/\\/ /  / _\` | | | | |  / _\` |       os: martian portfolio
   \\_/\\_/   \\__,_| |_| |_|  \\__,_|       host: github pages
                                         kernel: javascript
                                         shell: interactive
                                         terminal: web-based
                                         cpu: hpc engineer
                                         memory: 20,000+ cores managed`
    },

    sudo: {
        output: `<span class="error-text">nice try! but you don't have sudo privileges on mars</span>`
    },

    mars: {
        output: `<span class="success-text">
          .  *  .   *    .  *
       *    __  *    .      *
    .   *  /  \\    .   *  .
      .   |    |  *    .
   *      |    |      *   .
     .    |    |   .    *
  *    .__|    |__ .      *
       \\          /   .
        \\        /  *
         \\______/
</span>
welcome to the red planet, traveler.
the dust storms are mild today.`
    },

    coffee: {
        output: `<span class="info-text">
      ( (
       ) )
    ........
    |      |]
    \\      /
     \`----'
</span>
here's your coffee on mars ☕
double strength for the thin atmosphere`
    },

    hack: {
        output: `<span class="success-text">
initializing mars colony systems...
[████████████████████████] 100%

access granted! welcome to olympus mons base 🚀

just kidding. this is a portfolio site.
try 'help' for actual commands.
        </span>`
    },

    matrix: {
        output: `<span class="success-text">wake up, martian...</span>
<span class="info-text">the red pill or the blue pill?</span>
<span class="command-hint">follow the dust trail 🔴</span>`
    }
};

// ===================================
// Terminal Functions
// ===================================

function executeCommand(command) {
    addOutput(command, '');

    if (command === 'clear') {
        clearTerminal();
        return;
    }

    if (commands[command]) {
        addOutput('', commands[command].output);
    } else if (easterEggs[command]) {
        addOutput('', easterEggs[command].output);
    } else {
        addOutput('', `<span class="error-text">command not found: ${command}</span>

type <span class="command-hint">help</span> to see available commands`);
    }

    scrollToBottom();
}

function addOutput(command, output) {
    const outputBlock = document.createElement('div');
    outputBlock.className = 'output-block';

    if (command) {
        outputBlock.innerHTML = `
            <div class="command-line">
                <span class="prompt">visitor@mars:~$</span>
                <span class="command-text"> ${command}</span>
            </div>
        `;
    }

    if (output) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output-text';
        outputDiv.innerHTML = output;
        outputBlock.appendChild(outputDiv);
    }

    terminalOutput.appendChild(outputBlock);
}

function clearTerminal() {
    terminalOutput.innerHTML = '';
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <pre class="ascii-art">
 __      __         _   _       _ 
 \\ \\    / /  __ _  | | (_)   __| |
  \\ \\/\\/ /  / _\` | | | | |  / _\` |
   \\_/\\_/   \\__,_| |_| |_|  \\__,_|
                                  </pre>
        <p class="terminal-welcome">terminal cleared</p>
        <p>type <span class="command-hint">help</span> for commands</p>
    `;
    terminalOutput.appendChild(welcomeDiv);
}

function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function autocomplete() {
    const input = terminalInput.value.toLowerCase();
    if (!input) return;

    const allCommands = { ...commands, ...easterEggs };
    const matches = Object.keys(allCommands).filter(cmd => cmd.startsWith(input));

    if (matches.length === 1) {
        terminalInput.value = matches[0];
    } else if (matches.length > 1) {
        const output = `<span class="info-text">suggestions:</span> ${matches.join('  ')}`;
        addOutput('', output);
        scrollToBottom();
    }
}

// ===================================
// Event Listeners
// ===================================

// Terminal toggle
terminalToggle.addEventListener('click', () => {
    terminalModal.classList.add('active');
    setTimeout(() => terminalInput.focus(), 100);
});

// Terminal close
terminalClose.addEventListener('click', () => {
    terminalModal.classList.remove('active');
});

// Close terminal on backdrop click
terminalModal.addEventListener('click', (e) => {
    if (e.target === terminalModal) {
        terminalModal.classList.remove('active');
    }
});

// Close terminal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && terminalModal.classList.contains('active')) {
        terminalModal.classList.remove('active');
    }
});

// Terminal input handling
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        if (command) {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            executeCommand(command);
        }
        terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            terminalInput.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        autocomplete();
    }
});

// Focus terminal input when clicking body
terminalBody.addEventListener('click', () => {
    terminalInput.focus();
});

// Mobile navigation toggle
navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 14, 12, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 14, 12, 0.85)';
    }
    lastScrollY = window.scrollY;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Konami code easter egg
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Open terminal and show konami message
            terminalModal.classList.add('active');
            setTimeout(() => {
                addOutput('', `<span class="success-text">
🎮 KONAMI CODE ACTIVATED! 🎮

you found the secret! you're a true gamer.
+30 lives, unlimited continues!

...in your terminal browsing experience, at least.
welcome to mars colony alpha.
                </span>`);
                scrollToBottom();
                terminalInput.focus();
            }, 300);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Console easter egg
console.log('%c🔴 Welcome to Mars, Explorer! 🔴', 'font-size: 20px; color: #c45a3b; font-weight: bold;');
console.log('%cTry the terminal for more secrets...', 'font-size: 14px; color: #e8a87c;');
