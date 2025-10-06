// command history
let commandHistory = [];
let historyIndex = -1;
let funkyMode = false;
let retroMode = false;
let xpMode = false;

// command data (keeping personal info minimal/anonymous)
const commands = {
  help : {
    description : 'show available commands',
    output : `available commands:

  <span class="info-text">about</span>        - learn about me
  <span class="info-text">experience</span>   - view work experience
  <span class="info-text">skills</span>       - see technical skills
  <span class="info-text">education</span>    - education background
  <span class="info-text">projects</span>     - view my projects
  <span class="info-text">contact</span>      - get contact information
  <span class="info-text">resume</span>       - download resume
  <span class="info-text">xp</span>           - toggle windows xp mode 🪟
  <span class="info-text">retro</span>        - toggle retro mode 🖥️
  <span class="info-text">funky</span>        - toggle funky mode ✨
  <span class="info-text">clear</span>        - clear terminal
  <span class="info-text">help</span>         - show this message

<span class="command-hint">psst...</span> try typing: sudo, hack, matrix, coffee, neofetch
or try the konami code (↑↑↓↓←→←→ba) 🎮`
  },

  about : {
    description : 'information about me',
    output : `<span class="success-text">$ whoami</span>

computational engineer ii @ st. jude children's research hospital
mscs student @ university of texas at austin (starting aug 2025)

from amman, jordan | based in memphis, tn
b.s. computer science - rhodes college (2023)
nvidia-certified associate: ai infrastructure and operations (2024)

passionate about applying high-performance computing, data analysis,
and computational modeling to advance research. experienced in large-scale
data workflows, cluster computing, and scientific software development.
currently deepening expertise in algorithms, machine learning, and compilers.

fluent in arabic & english
limited proficiency in spanish & french`
  },

  experience : {
    description : 'work experience',
    output : `<span class="success-text">$ cat experience.txt</span>

<span class="info-text">computational engineer ii</span>
st. jude children's research hospital | may 2024 - present
  • leads hpc infrastructure and scientific computing initiatives
  • maintains open ondemand on 20,000+ core cluster
  • authored multiple ondemand interactive applications
  • handles all software/module installations (rhel7/rhel8)

<span class="info-text">computational engineer i</span>
st. jude children's research hospital | may 2023 - may 2024
  • built and maintained open ondemand instance
  • performed routine module installs on rhel7 hpc cluster
  • taught seminars on hpc programming tools
  • optimized/debugged parallel programs for researchers

<span class="info-text">hpc engineer - student</span>
st. jude children's research hospital | sep 2022 - may 2023
  • built metrics collection environment with prometheus & grafana
  • deployed rest api for protein structure prediction
  • documented deployment procedures for engineering team`
  },

  skills : {
    description : 'technical skills',
    output : `<span class="success-text">$ ls -la skills/</span>

<span class="info-text">core:</span>
  • high-performance computing (hpc) & cluster computing
  • python, bash, c/c++, r, java, go (12+ languages total)
  • distributed systems & parallel programming
  • linux system administration (rhel7/rhel8)
  • scientific software development

<span class="info-text">tools & platforms:</span>
  • open ondemand, slurm, prometheus, grafana
  • containerization & kubernetes
  • ai/ml infrastructure (nvidia-certified)
  • large-scale data workflows

<span class="info-text">focus areas:</span>
  • algorithms & compiler optimization
  • machine learning & data analysis
  • computational modeling for research`
  },

  education : {
    description : 'education background',
    output : `<span class="success-text">$ cat education.log</span>

<span class="info-text">master of science - computer science</span>
university of texas at austin | aug 2025 - may 2027
  • focus: algorithms, machine learning, parallel systems, distributed systems

<span class="info-text">bachelor of science - computer science</span>
rhodes college | 2019 - 2023
  • gpa: 3.9/4.0, magna cum laude
  • joseph reeves hyde award recipient
  • upsilon pi epsilon, theta kappa alpha, acm/ieee
  • minor: religious studies

<span class="info-text">certifications</span>
  • nvidia-certified associate: ai infrastructure and operations (2024)
  • hackerrank java (basic) certificate (2020)`
  },

  projects : {
    description : 'view projects',
    output : `<span class="success-text">$ ls -l ~/projects/</span>

my public github projects showcase work in:
  • distributed systems (raft algorithm, mapreduce)
  • hpc tools and optimizations
  • system-level programming

<span class="info-text">view projects:</span> <a href="https://github.com/walidabualafia" target="_blank">github.com/walidabualafia</a>

<span class="command-hint">note:</span> some projects available on request basis`
  },

  contact : {
    description : 'contact information',
    output : `<span class="success-text">$ cat contact.vcf</span>

<span class="info-text">email:</span>     <a href="mailto:walid@lavabit.com">walid@lavabit.com</a>
<span class="info-text">github:</span>    <a href="https://github.com/walidabualafia" target="_blank">github.com/walidabualafia</a>
<span class="info-text">linkedin:</span>  <a href="https://www.linkedin.com/in/abualafia" target="_blank">linkedin.com/in/abualafia</a>

<span class="command-hint">tip:</span> fastest response via linkedin message`
  },

  resume : {
    description : 'download resume',
    output : `<span class="info-text">resume available on request</span>

please contact me via email or linkedin for resume/cv

  email: <a href="mailto:walid@lavabit.com">walid@lavabit.com</a>
  linkedin: <a href="https://www.linkedin.com/in/abualafia" target="_blank">linkedin.com/in/abualafia</a>`
  },

  clear : {description : 'clear terminal', output : null},

  xp : {description : 'toggle windows xp mode', output : null},

  retro : {description : 'toggle retro mode', output : null},

  funky : {description : 'toggle funky mode', output : null}
};

// easter eggs / hidden commands
const easterEggs = {
  ls : {
    output :
        `about.txt  contact.vcf  education.log  experience.txt  projects/  resume.pdf  skills/

try running one of these: <span class="command-hint">cat about.txt</span>`
  },

  whoami : {
    output : `visitor

<span class="command-hint">hint:</span> try the <span class="info-text">about</span> command to learn about walid`
  },

  pwd : {output : `/home/walid/portfolio`},

  uname : {output : `portfolio terminal v1.0 (hpc edition)`},

  neofetch : {
    output : `                 _ _     _              visitor@walid
                | (_)   | |             -------------
 __      ____ _ | |_  __| |             os: portfolio terminal
 \\ \\ /\\ / / _\` || | |/ _\` |             host: github pages
  \\ V  V / (_| || | | (_| |             kernel: javascript
   \\_/\\_/ \\__,_||_|_|\\__,_|             shell: interactive
                                        terminal: web-based
                                        cpu: hpc engineer
                                        memory: 6+ years experience`
  },

  sudo : {
    output :
        `<span class="error-text">nice try! but you don't have sudo privileges here 😏</span>`
  },

  hack : {
    output : `<span class="success-text">
initializing hack sequence...
[████████████████████████] 100%

access granted! welcome to the mainframe 🚀

just kidding. this is a portfolio site, not hollywood.
try 'help' for actual commands.
    </span>`
  },

  matrix : {
    output : `<span class="success-text">wake up, neo...</span>
<span class="info-text">the matrix has you...</span>
<span class="command-hint">follow the white rabbit 🐰</span>

(psst... try typing 'funky' for a cool surprise)`
  },

  coffee : {
    output : `<span class="info-text">
      ( (
       ) )
    ........
    |      |]
    \\      /
     \`----'
</span>
here's your coffee ☕
walid runs on this stuff`
  },

  konami : {
    output : `<span class="success-text">
🎮 KONAMI CODE ACTIVATED! 🎮

you found the secret! you're a true gamer.
+30 lives, unlimited continues!

...in your terminal browsing experience, at least.
    </span>`
  }
};

// get terminal elements
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const terminalOutput = document.getElementById('terminal-output');

// focus input when clicking anywhere in terminal
terminalBody.addEventListener('click', () => { terminalInput.focus(); });

// handle input
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

// autocomplete function
function autocomplete() {
  const input = terminalInput.value.toLowerCase();
  if (!input)
    return;

  const allCommands = {...commands, ...easterEggs};
  const matches = Object.keys(allCommands).filter(cmd => cmd.startsWith(input));

  if (matches.length === 1) {
    terminalInput.value = matches[0];
  } else if (matches.length > 1) {
    const output =
        `<span class="info-text">suggestions:</span> ${matches.join('  ')}`;
    addOutput('', output);
  }
}

// execute command
function executeCommand(command) {
  addOutput(command, '');

  if (command === 'clear') {
    clearTerminal();
    return;
  }

  if (command === 'xp') {
    toggleXPMode();
    return;
  }

  if (command === 'retro') {
    toggleRetroMode();
    return;
  }

  if (command === 'funky') {
    toggleFunkyMode();
    return;
  }

  if (commands[command]) {
    addOutput('', commands[command].output);
  } else if (easterEggs[command]) {
    addOutput('', easterEggs[command].output);
  } else {
    addOutput(
        '',
        `<span class="error-text">command not found: ${
            command}</span>\n\ntype <span class="command-hint">help</span> to see available commands`);
  }

  scrollToBottom();
}

// toggle windows xp mode
function toggleXPMode() {
  xpMode = !xpMode;

  // turn off other modes if they're on
  if (xpMode) {
    if (funkyMode) {
      funkyMode = false;
      document.body.classList.remove('funky-mode');
    }
    if (retroMode) {
      retroMode = false;
      document.body.classList.remove('retro-mode');
    }
  }

  document.body.classList.toggle('xp-mode');

  const message =
      xpMode
          ? `<span class="success-text">🪟 windows xp mode activated! 🪟</span>\n\nwelcome to the bliss...\nah, memories of simpler times 🌄\n\n<span class="command-hint">tip:</span> click the 🪟 button in the header to toggle anytime!`
          : `<span class="info-text">windows xp mode deactivated</span>\n\nback to modern terminal mode`;

  addOutput('', message);
  scrollToBottom();
}

// toggle retro mode
function toggleRetroMode() {
  retroMode = !retroMode;

  // turn off other modes if they're on
  if (retroMode) {
    if (funkyMode) {
      funkyMode = false;
      document.body.classList.remove('funky-mode');
    }
    if (xpMode) {
      xpMode = false;
      document.body.classList.remove('xp-mode');
    }
  }

  document.body.classList.toggle('retro-mode');

  const message =
      retroMode
          ? `<span class="success-text">🖥️  retro mode activated! 🖥️</span>\n\nwelcome to the vintage terminal experience\nremember the good old days of monochrome displays?\n\n<span class="command-hint">tip:</span> click the 🖥️  button in the header to toggle anytime!`
          : `<span class="info-text">retro mode deactivated</span>\n\nback to modern terminal mode`;

  addOutput('', message);
  scrollToBottom();
}

function toggleFunkyMode() {
  funkyMode = !funkyMode;

  // turn off other modes if they're on
  if (funkyMode) {
    if (retroMode) {
      retroMode = false;
      document.body.classList.remove('retro-mode');
    }
    if (xpMode) {
      xpMode = false;
      document.body.classList.remove('xp-mode');
    }
  }

  document.body.classList.toggle('funky-mode');

  const message =
      funkyMode
          ? `<span class="success-text">🎨 funky mode activated! 🎨</span>\n\nget ready for some color and vibes ✨\n\n<span class="command-hint">tip:</span> click the ✨ button in the header to toggle anytime!`
          : `<span class="info-text">funky mode deactivated</span>\n\nback to classic terminal mode`;

  addOutput('', message);
  scrollToBottom();
}

// quick command execution
function executeQuickCommand(command) {
  terminalInput.value = command;
  terminalInput.focus();
  executeCommand(command);
}

// add output to terminal
function addOutput(command, output) {
  const outputBlock = document.createElement('div');
  outputBlock.className = 'output-block';

  if (command) {
    outputBlock.innerHTML = `
            <div class="command-line">
                <span class="prompt">visitor@walid:~$</span>
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

// clear terminal
function clearTerminal() {
  terminalOutput.innerHTML = '';
  const welcomeDiv = document.createElement('div');
  welcomeDiv.className = 'welcome-message';
  welcomeDiv.innerHTML = `
        <pre class="ascii-art">
                 _ _     _
                | (_)   | |
 __      ____ _ | |_  __| |
 \\ \\ /\\ / / _\` || | |/ _\` |
  \\ V  V / (_| || | | (_| |
   \\_/\\_/ \\__,_||_|_|\\__,_|

        </pre>
        <p>terminal cleared. type <span class="command-hint">help</span> for commands.</p>
    `;
  terminalOutput.appendChild(welcomeDiv);
}

// scroll to bottom
function scrollToBottom() {
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

// auto-focus on load
window.addEventListener('load', () => { terminalInput.focus(); });

// mode toggle buttons
const xpToggle = document.getElementById('xp-toggle');
xpToggle.addEventListener('click', () => { toggleXPMode(); });

const retroToggle = document.getElementById('retro-toggle');
retroToggle.addEventListener('click', () => { toggleRetroMode(); });

const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => { toggleFunkyMode(); });

// konami code easter egg
let konamiCode = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight', 'b', 'a'
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      executeCommand('konami');
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});
