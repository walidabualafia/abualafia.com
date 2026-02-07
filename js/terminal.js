/* ===================================
   Interactive Terminal
   =================================== */

const Terminal = (() => {
    let overlay, body, output, input;
    let commandHistory = [];
    let historyIndex = -1;
    let cwd = '/home/visitor';
    const HOME = '/home/visitor';

    // -----------------------------------
    // Fake filesystem (tiny, realistic-ish)
    // -----------------------------------
    // Intentionally lightweight: enough to feel like Linux, not a full emulator.
    const fsNodes = new Map();
    const fsPermDenyPrefixes = ['/root'];

    function fsDir(path, children = []) {
        fsNodes.set(path, { type: 'dir', children: [...children] });
    }

    function fsFile(path, content) {
        fsNodes.set(path, { type: 'file', content });
    }

    function fsExists(path) {
        return fsNodes.has(path);
    }

    function fsGet(path) {
        return fsNodes.get(path);
    }

    function normalizePath(path) {
        if (!path) return '/';
        // Replace multiple slashes
        path = path.replace(/\/+/g, '/');
        // Remove trailing slash except root
        if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
        return path;
    }

    function resolvePath(inputPath) {
        const raw = (inputPath || '').trim();
        if (!raw || raw === '.') return cwd;
        if (raw === '~') return HOME;
        if (raw.startsWith('~/')) return normalizePath(HOME + raw.slice(1));

        const base = raw.startsWith('/') ? '' : cwd;
        const combined = normalizePath((base ? base + '/' : '/') + raw);

        const parts = combined.split('/').filter(Boolean);
        const stack = [];
        for (const p of parts) {
            if (p === '.') continue;
            if (p === '..') stack.pop();
            else stack.push(p);
        }
        return '/' + stack.join('/');
    }

    function hasPermission(path) {
        const p = normalizePath(path);
        return !fsPermDenyPrefixes.some(prefix => p === prefix || p.startsWith(prefix + '/'));
    }

    function formatPromptPath(path) {
        const p = normalizePath(path);
        if (p === HOME) return '~';
        if (p.startsWith(HOME + '/')) return '~' + p.slice(HOME.length);
        return p;
    }

    function parseArgs(argString) {
        const raw = (argString || '').trim();
        if (!raw) return { flags: new Set(), paths: [] };
        const parts = raw.split(/\s+/);
        const flags = new Set(parts.filter(p => p.startsWith('-')));
        const paths = parts.filter(p => !p.startsWith('-'));
        return { flags, paths };
    }

    function setCwd(path) {
        cwd = normalizePath(path);
        // Update input prompt
        const promptEl = document.querySelector('.terminal-input-line .terminal-prompt');
        if (promptEl) promptEl.textContent = `visitor@cluster:${formatPromptPath(cwd)}$`;
    }

    function fsInit() {
        // Root directories
        fsDir('/', ['bin', 'boot', 'dev', 'etc', 'home', 'lib', 'proc', 'root', 'run', 'tmp', 'usr', 'var']);
        fsDir('/bin', ['bash', 'cat', 'cd', 'echo', 'ls', 'pwd', 'sh']);
        fsDir('/boot', ['config-6.8.0', 'vmlinuz-6.8.0', 'initrd.img-6.8.0']);
        fsDir('/dev', ['null', 'zero', 'random', 'urandom', 'tty']);
        fsDir('/home', ['visitor']);
        fsDir('/home/visitor', ['about.txt', 'experience.txt', 'skills.txt', 'education.log', 'contact.vcf', 'projects', 'resume.pdf', 'README']);
        fsDir('/proc', ['cpuinfo', 'meminfo', 'uptime', 'version']);
        fsDir('/root', ['.bashrc', '.profile', 'README']); // permission denied by default
        fsDir('/run', ['lock', 'systemd']);
        fsDir('/tmp', []);
        fsDir('/usr', ['bin', 'local', 'share']);
        fsDir('/usr/bin', ['ssh', 'scp', 'vim', 'emacs', 'htop', 'neofetch']);
        fsDir('/usr/local', ['bin', 'share']);
        fsDir('/var', ['cache', 'lib', 'log', 'spool', 'tmp']);
        fsDir('/var/log', ['syslog', 'auth.log', 'boot.log', 'kern.log', 'slurm', 'grafana', 'prometheus', 'ondemand']);
        fsDir('/var/log/slurm', ['slurmctld.log', 'slurmd.log']);
        fsDir('/var/log/grafana', ['grafana.log']);
        fsDir('/var/log/prometheus', ['prometheus.log']);
        fsDir('/var/log/ondemand', ['nginx_access.log', 'nginx_error.log']);
        fsDir('/var/lib', ['dpkg', 'systemd', '.cache']);
        fsDir('/var/lib/.cache', ['.sjhpc']);
        fsDir('/var/lib/.cache/.sjhpc', ['README', '.flag']);
        fsDir('/etc', ['os-release', 'issue', 'hostname', 'hosts', 'resolv.conf', 'passwd', 'group', 'shadow', 'motd', 'profile', 'ssh', 'slurm', 'prometheus', 'grafana', '.cluster_vault']);
        fsDir('/etc/ssh', ['sshd_config']);
        fsDir('/etc/slurm', ['slurm.conf']);
        fsDir('/etc/prometheus', ['prometheus.yml']);
        fsDir('/etc/grafana', ['grafana.ini']);

        // Files (kept short but realistic)
        fsFile('/etc/os-release', [
            'NAME=\"Ubuntu\"',
            'VERSION=\"24.04.1 LTS (Noble Numbat)\"',
            'ID=ubuntu',
            'ID_LIKE=debian',
            'PRETTY_NAME=\"Ubuntu 24.04.1 LTS\"',
            'VERSION_ID=\"24.04\"',
            'HOME_URL=\"https://www.ubuntu.com/\"',
            'SUPPORT_URL=\"https://help.ubuntu.com/\"',
            'BUG_REPORT_URL=\"https://bugs.launchpad.net/ubuntu/\"',
        ].join('\\n'));

        fsFile('/etc/issue', 'Ubuntu 24.04.1 LTS \\n \\l');
        fsFile('/etc/hostname', 'walid-cluster');
        fsFile('/etc/hosts', [
            '127.0.0.1\\tlocalhost',
            '127.0.1.1\\twalid-cluster',
            '',
            '# The following lines are desirable for IPv6 capable hosts',
            '::1\\tlocalhost ip6-localhost ip6-loopback',
            'ff02::1\\tip6-allnodes',
            'ff02::2\\tip6-allrouters',
        ].join('\\n'));

        fsFile('/etc/resolv.conf', [
            '# This file is managed by systemd-resolved',
            'nameserver 1.1.1.1',
            'nameserver 8.8.8.8',
            'search cluster.local',
        ].join('\\n'));

        fsFile('/etc/passwd', [
            'root:x:0:0:root:/root:/bin/bash',
            'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
            'syslog:x:104:110::/home/syslog:/usr/sbin/nologin',
            'grafana:x:472:472:Grafana:/usr/share/grafana:/usr/sbin/nologin',
            'prometheus:x:65534:65534:Prometheus:/var/lib/prometheus:/usr/sbin/nologin',
            'visitor:x:1000:1000:Visitor:/home/visitor:/bin/bash',
        ].join('\\n'));

        fsFile('/etc/group', [
            'root:x:0:',
            'adm:x:4:syslog,visitor',
            'sudo:x:27:visitor',
            'grafana:x:472:',
            'prometheus:x:65534:',
            'users:x:100:visitor',
        ].join('\\n'));

        // Use the existing MOTD text (keeps consistency)
        fsFile('/etc/motd', commands['cat /etc/motd']());

        fsFile('/etc/profile', [
            '# /etc/profile: system-wide .profile file for the Bourne shell (sh(1))',
            '# This is a simulated environment inside a portfolio terminal.',
            'export PATH=\"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\"',
        ].join('\\n'));

        fsFile('/etc/ssh/sshd_config', [
            '# OpenSSH server configuration file',
            'Port 22',
            'PermitRootLogin prohibit-password',
            'PasswordAuthentication no',
            'KbdInteractiveAuthentication no',
            'UsePAM yes',
            'X11Forwarding no',
            'AcceptEnv LANG LC_*',
        ].join('\\n'));

        fsFile('/etc/slurm/slurm.conf', [
            '# slurm.conf - simulated configuration (portfolio)',
            'ClusterName=stjude-hpc',
            'SlurmctldHost=slurmctld01',
            'AuthType=auth/munge',
            'StateSaveLocation=/var/spool/slurmctld',
            'SlurmctldPort=6817',
            'SlurmdPort=6818',
            'SchedulerType=sched/backfill',
            'SelectType=select/cons_tres',
            'GresTypes=gpu',
            'PartitionName=main-hpc Nodes=ALL Default=YES MaxTime=INFINITE State=UP',
        ].join('\\n'));

        fsFile('/etc/prometheus/prometheus.yml', [
            '# prometheus.yml - simulated',
            'global:',
            '  scrape_interval: 15s',
            'scrape_configs:',
            '  - job_name: \"node_exporter\"',
            '    static_configs:',
            '      - targets: [\"node01:9100\", \"node02:9100\"]',
            '  - job_name: \"slurm_exporter\"',
            '    static_configs:',
            '      - targets: [\"slurmctld01:8080\"]',
        ].join('\\n'));

        fsFile('/etc/grafana/grafana.ini', [
            '; grafana.ini - simulated',
            '[server]',
            'http_port = 3000',
            '',
            '[security]',
            'disable_gravatar = true',
            'cookie_secure = true',
        ].join('\\n'));

        // Logs (short but plausible)
        fsFile('/var/log/boot.log', [
            'systemd[1]: Starting Boot Sequence (portfolio)...',
            'kernel: Linux version 6.8.0 (gcc) #1 SMP PREEMPT_DYNAMIC',
            'systemd[1]: Started OpenSSH server.',
            'systemd[1]: Started Prometheus.',
            'systemd[1]: Started Grafana.',
            'slurmctld[901]: slurmctld version 23.x started on cluster stjude-hpc',
            'systemd[1]: Reached target Multi-User System.',
            '',
            'motd: \"Curious sysadmins: check /etc/.cluster_vault\"',
        ].join('\\n'));

        fsFile('/var/log/syslog', [
            'Feb 07 12:00:01 walid-cluster systemd[1]: Started Daily apt download activities.',
            'Feb 07 12:02:11 walid-cluster prometheus[812]: TSDB started',
            'Feb 07 12:03:02 walid-cluster grafana[833]: HTTP Server Listen',
            'Feb 07 12:06:54 walid-cluster sshd[1022]: Server listening on 0.0.0.0 port 22.',
        ].join('\\n'));

        fsFile('/var/log/auth.log', [
            'Feb 07 12:06:54 walid-cluster sshd[1022]: Server listening on 0.0.0.0 port 22.',
            'Feb 07 12:07:10 walid-cluster sshd[1099]: Invalid user admin from 203.0.113.44 port 52311',
            'Feb 07 12:07:12 walid-cluster sshd[1099]: pam_unix(sshd:auth): authentication failure',
            'Feb 07 12:07:20 walid-cluster sshd[1099]: Failed password for invalid user admin from 203.0.113.44 port 52311 ssh2',
        ].join('\\n'));

        fsFile('/var/log/kern.log', [
            'Feb 07 12:00:00 walid-cluster kernel: audit: initializing netlink subsys',
            'Feb 07 12:00:00 walid-cluster kernel: sched: RT throttling activated',
            'Feb 07 12:00:01 walid-cluster kernel: Initialized GPU subsystem (simulated)',
        ].join('\\n'));

        fsFile('/var/log/slurm/slurmctld.log', [
            'Feb 07 12:00:03 slurmctld[901]: debug: slurmctld started',
            'Feb 07 12:00:04 slurmctld[901]: sched: Backfill scheduler started',
            'Feb 07 12:01:22 slurmctld[901]: job_submit: JobId=100006 Name=computation_engineer State=RUNNING',
        ].join('\\n'));

        fsFile('/var/log/slurm/slurmd.log', [
            'Feb 07 12:00:10 slurmd[955]: slurmd started',
            'Feb 07 12:01:25 slurmd[955]: Launching job 100006 batch script',
        ].join('\\n'));

        fsFile('/var/log/grafana/grafana.log', [
            't=2026-02-07T12:03:02Z lvl=info msg=\"Starting Grafana\"',
            't=2026-02-07T12:03:03Z lvl=info msg=\"HTTP Server Listen\" address=0.0.0.0:3000',
        ].join('\\n'));

        fsFile('/var/log/prometheus/prometheus.log', [
            'ts=2026-02-07T12:02:11Z level=info msg=\"Starting Prometheus\"',
            'ts=2026-02-07T12:02:12Z level=info msg=\"Server is ready to receive web requests.\"',
        ].join('\\n'));

        fsFile('/var/log/ondemand/nginx_access.log', [
            '127.0.0.1 - - [07/Feb/2026:12:10:01 +0000] \"GET /pun/sys/dashboard HTTP/1.1\" 200 1024 \"-\" \"Mozilla/5.0\"',
        ].join('\\n'));

        fsFile('/var/log/ondemand/nginx_error.log', [
            '2026/02/07 12:10:01 [notice] 1#1: using the \"epoll\" event method',
        ].join('\\n'));

        // Home files (point to existing terminal content)
        fsFile('/home/visitor/README', [
            'Welcome, curious sysadmin.',
            '',
            'This is a simulated filesystem inside a portfolio terminal.',
            'Try:',
            '  cd /',
            '  ls',
            '  ls -a /etc',
            '  cat /var/log/boot.log',
        ].join('\\n'));

        // Treasure hunt (dotfiles + small trail of hints)
        fsFile('/etc/.cluster_vault', [
            '# vault: do not commit real secrets here',
            '# (this is a fake file for a portfolio easter egg)',
            '',
            'If you are reading this, you\\'re the kind of person I love working with.',
            '',
            'Hint 1: Logs rarely lie.',
            'Hint 2: Try: cat /var/log/boot.log',
            '',
            'Next: /var/lib/.cache/.sjhpc/README',
        ].join('\\n'));

        fsFile('/var/lib/.cache/.sjhpc/README', [
            'stjude-hpc: scratch notes (simulated)',
            '',
            'Rule 0: no secrets in repos.',
            'Rule 1: observability beats guesswork.',
            '',
            'If you\\'re here, you\\'re close.',
            'Try: ls -a /var/lib/.cache/.sjhpc',
        ].join('\\n'));

        fsFile('/var/lib/.cache/.sjhpc/.flag', [
            'FLAG{curious_sysadmin_detected}',
            '',
            'Nice. You found the treasure hunt.',
            'If you enjoyed this, open the terminal and type: about',
        ].join('\\n'));
    }

    const commands = {
        help: () => `<span class="term-bold">Available commands:</span>

  <span class="term-info">Filesystem:</span>
  <span class="term-success">ls</span>           - list files (try: ls -a /etc)
  <span class="term-success">cd</span>           - change directory (try: cd /var/log)
  <span class="term-success">pwd</span>          - print working directory
  <span class="term-success">cat</span>          - print file contents

  <span class="term-success">about</span>        - learn about me
  <span class="term-success">experience</span>   - work experience
  <span class="term-success">skills</span>       - technical skills
  <span class="term-success">education</span>    - education background
  <span class="term-success">projects</span>     - view projects
  <span class="term-success">research</span>     - publications
  <span class="term-success">contact</span>      - get in touch
  <span class="term-success">resume</span>       - download CV
  <span class="term-success">clear</span>        - clear terminal
  <span class="term-success">help</span>         - this message

<span class="term-info">HPC commands:</span>
  <span class="term-success">squeue</span>       - show job queue
  <span class="term-success">nvidia-smi</span>   - GPU utilization
  <span class="term-success">module avail</span> - available modules
  <span class="term-success">sinfo</span>        - cluster info
  <span class="term-success">neofetch</span>     - system info
  <span class="term-success">htop</span>         - process list

<span class="term-muted">treasure hunt:</span> try <span class="term-success">cd /</span> then <span class="term-success">ls</span>, and check <span class="term-success">/etc</span> + <span class="term-success">/var/log</span>`,

        about: () => `<span class="term-success">$ whoami</span>

Computational Engineer @ St. Jude Children's Research Hospital
M.S. Computer Science @ University of Texas at Austin (Expected Dec 2028)

From Amman, Jordan | Based in Memphis, TN
B.S. Computer Science - Rhodes College (2023) - Magna Cum Laude
NVIDIA Certified Associate: AI Infrastructure and Operations (2025)

I architect HPC systems, MLOps pipelines, and AI infrastructure
that empower researchers to push the boundaries of pediatric cancer research.

Fluent in Arabic & English | Working proficiency in Spanish & French`,

        experience: () => `<span class="term-success">$ cat experience.txt</span>

<span class="term-bold">Computational Engineer</span>
St. Jude Children's Research Hospital | May 2024 - Present
  > Leads AI infrastructure adoption across all HPC clusters
  > Architected 20,000-line MLOps Python package for researchers
  > Expanded Open OnDemand to multi-cluster deployment (4 envs)
  > Sole resource for 19 CryoSPARC instances
  > Conducted 30 PB data migration to imaging storage

<span class="term-bold">Computational Engineer I</span>
St. Jude Children's Research Hospital | May 2023 - May 2024
  > Built Open OnDemand for 20,000+ core cluster
  > Authored interactive applications (Maestro, VMD, Scipion)
  > Taught seminars on HPC programming tools

<span class="term-bold">HPC Engineering Student/Intern</span>
St. Jude Children's Research Hospital | Jun 2022 - May 2023
  > Built Prometheus + Grafana metrics infrastructure
  > Developed VR training app for pediatric patients
  > Deployed AlphaFold-based protein prediction API`,

        skills: () => `<span class="term-success">$ ls -la skills/</span>

<span class="term-bold">Languages:</span>
  Python, C/C++, Rust, Go, Java, R, Ruby, Bash, JavaScript,
  HTML/CSS, React.js, Racket, C#

<span class="term-bold">HPC & Parallel Computing:</span>
  Slurm, LSF, Open OnDemand, MPI, OpenMP, CUDA, GPU Optimization,
  SPMD Programming, Data Distribution, Environment Modules, RHEL

<span class="term-bold">DevOps & Cloud:</span>
  Prometheus, Grafana, Docker, Kubernetes, Apptainer, Singularity,
  GCP, Conda, VNC, SSO/OneLogin, Shell Scripting

<span class="term-bold">ML, AI & Scientific Computing:</span>
  Transformers, CNNs, LSTMs, Federated Learning, Contrastive Learning,
  MLOps, Deep Learning, AI Agents, Jupyter, AlphaFold, CryoSPARC

<span class="term-bold">Focus Areas:</span>
  Parallel Systems, Distributed Systems, Compiler Design,
  Systems Programming, Scientific Computing, HRI, VR/AR`,

        education: () => `<span class="term-success">$ cat /var/log/education</span>

<span class="term-bold">M.S. Computer Science</span>
University of Texas at Austin | Aug 2025 - Dec 2028
  GPA: 4.0 | Focus: Parallel Systems, Deep Learning

<span class="term-bold">B.S. Computer Science</span>
Rhodes College | 2019 - 2023
  GPA: 3.87, Magna Cum Laude
  Joseph Reeves Hyde Award, Jack U. Russell Award
  Upsilon Pi Epsilon, Theta Alpha Kappa

<span class="term-bold">Certifications:</span>
  NVIDIA Certified Associate: AI Infrastructure & Operations (2025)`,

        projects: () => `<span class="term-success">$ docker ps --format "table {{.Names}}\\t{{.Status}}"</span>

NAMES                    STATUS
mlops-toolkit            Up (active)
hpc-monitoring-stack     Up (active)
ondemand-multi-cluster   Up (active)
cryosparc-fleet          Up (active)
vr-patient-training      Exited (archived)
alphafold-api            Exited (archived)

<span class="term-info">View projects:</span> <a href="https://github.com/walidabualafia" target="_blank">github.com/walidabualafia</a>`,

        research: () => `<span class="term-success">$ SELECT * FROM publications;</span>

<span class="term-bold">IEEE/RSJ IROS 2023</span> | Detroit, MI, USA
"Development and Evaluation of Exploratory Experiences to
 Facilitate Reasoning About Robotic Systems"

Authors: S. Balali, M. Hudspeth, I. Afflerbach, H. Helgesen,
         J. McCurry, <span class="term-success">W. Abu Al-Afia</span> et al.

DOI: 10.1109/IROS55552.2023.10342409
Keywords: HRI, Navigation, Object Detection, Explainable AI

<a href="https://ieeexplore.ieee.org/document/10342409" target="_blank">Read paper on IEEE Xplore</a>`,

        contact: () => `<span class="term-success">$ ip addr show</span>

<span class="term-bold">eth0: email</span>     [UP]  <a href="mailto:walid@utexas.edu">walid@utexas.edu</a>
<span class="term-bold">eth1: github</span>    [UP]  <a href="https://github.com/walidabualafia" target="_blank">github.com/walidabualafia</a>
<span class="term-bold">eth2: linkedin</span>  [UP]  <a href="https://www.linkedin.com/in/abualafia" target="_blank">linkedin.com/in/abualafia</a>

<span class="term-info">Location:</span>  Memphis, TN (Open to Relocation)
<span class="term-muted">Fastest response via email or LinkedIn</span>`,

        resume: () => {
            // Trigger download
            const a = document.createElement('a');
            a.href = 'abualafia-curriculum-vitae.pdf';
            a.download = '';
            a.click();
            return `<span class="term-success">$ wget abualafia-curriculum-vitae.pdf</span>

Downloading resume... <span class="term-success">done</span>
<span class="term-muted">If download didn't start:</span> <a href="abualafia-curriculum-vitae.pdf" download>click here</a>`;
        },

        squeue: () => `<span class="term-success">$ squeue -u walid --format="%.8i %.12P %.30j %.8T %.20M %.6D"</span>

  JOBID    PARTITION   NAME                           STATE    TIME                 NODES
  100006   st-jude     computational_engineer          <span class="term-success">RUNNING</span>  May 2024 - Present   6
  100005   st-jude     is_internship_coordinator       <span class="term-success">RUNNING</span>  May 2023 - Present   1
  100004   st-jude     computational_engineer_i         <span class="term-muted">COMPLTD</span>  May 2023 - May 2024  4
  100003   st-jude     hpc_engineering_student          <span class="term-muted">COMPLTD</span>  Sep 2022 - May 2023  2
  100002   st-jude     hpc_research_intern              <span class="term-muted">COMPLTD</span>  Jun 2022 - Aug 2022  1
  100001   rhodes      cs_tutor_and_admin               <span class="term-muted">COMPLTD</span>  Aug 2020 - May 2023  1
  100000   intrasoft   data_science_intern              <span class="term-muted">COMPLTD</span>  Jun 2018 - Aug 2018  1`,

        'nvidia-smi': () => `<span class="term-success">$ nvidia-smi</span>

+-----------------------------------------------------------------------------------------+
| WALID-SMI 550.127       Driver Version: 550.127       CUDA Version: 12.4               |
|-----------------------------------------+------------------------+----------------------+
| Skill                                   | Proficiency            | Utilization          |
|=========================================+========================+======================|
| Python                                  | Expert                 | <span class="term-success">███████████████████</span>  95% |
| C/C++                                   | Advanced               | <span class="term-success">████████████████</span>     80% |
| Bash/Shell                              | Expert                 | <span class="term-success">██████████████████</span>   92% |
| Slurm/LSF                               | Expert                 | <span class="term-success">███████████████████</span>  95% |
| Prometheus/Grafana                       | Expert                 | <span class="term-success">██████████████████</span>   90% |
| AI Agents/LLMs                           | Advanced               | <span class="term-success">█████████████████</span>    85% |
| MPI/OpenMP/CUDA                          | Advanced               | <span class="term-success">████████████████</span>     82% |
| CryoSPARC/Cryo-EM                       | Expert                 | <span class="term-success">██████████████████</span>   90% |
+-----------------------------------------------------------------------------------------+`,

        'module avail': () => `<span class="term-success">$ module avail</span>

--- /opt/languages ---
python/3.x    c-cpp/gcc    rust/stable    go/1.x    java/jdk    r/4.x
ruby/3.x      bash/5.x     javascript/es6 racket/8.x csharp/dotnet

--- /opt/hpc ---
slurm/23.x    lsf/10.x     openmpi/4.x   openmp/5.x   cuda/12.x
ondemand/3.x  modules/5.x

--- /opt/devops ---
prometheus/2.x  grafana/10.x  docker/25.x   kubernetes/1.x
apptainer/1.x   singularity/3.x  conda/24.x  gcp-sdk/latest

--- /opt/ml ---
pytorch/2.x     transformers/latest  jupyter/lab  mlops-toolkit/1.0
alphafold/2.x   cryosparc/4.x

--- /opt/editors ---
vim/9.x  emacs/29.x  vscode/latest  cursor/latest  intellij/2024`,

        sinfo: () => `<span class="term-success">$ sinfo</span>

PARTITION   AVAIL   NODES   STATE    CPUS    GPUS
main-hpc    up      200+    mixed    55,000+ 2,500+
scce-gdpr   up      40      idle     *       *
model-train up      30      alloc    *       *
colocation  up      20      mixed    *       *
cryo-em     up      19      alloc    *       *
dev         up      10      idle     *       *

<span class="term-muted">Total: 6 cluster environments | 30 PB storage</span>`,

        neofetch: () => `
<span class="term-success"> __      __         _   _       _</span>        visitor@cluster
<span class="term-success"> \\ \\    / /  __ _  | | (_)   __| |</span>       ---------------
<span class="term-success">  \\ \\/\\/ /  / _\` | | | | |  / _\` |</span>       <span class="term-bold">OS:</span> HPC Dashboard v4.0
<span class="term-success">   \\_/\\_/   \\__,_| |_| |_|  \\__,_|</span>       <span class="term-bold">Host:</span> GitHub Pages
                                        <span class="term-bold">Kernel:</span> Vanilla JS
                                        <span class="term-bold">Shell:</span> Interactive Terminal
                                        <span class="term-bold">CPU:</span> 55,000+ cores
                                        <span class="term-bold">GPU:</span> 2,500+ (NVIDIA)
                                        <span class="term-bold">Memory:</span> 30 PB managed
                                        <span class="term-bold">Uptime:</span> Since June 2022
                                        <span class="term-bold">Theme:</span> Grafana Dark`,

        htop: () => `<span class="term-success">$ htop</span>

  PID  USER    PR   NI  VIRT   RES  %CPU  %MEM  COMMAND
    1  walid   20    0  HPC    100%  95%   90%   computational_engineering
    2  walid   20    0  OOD    100%  80%   75%   open_ondemand_admin
    3  walid   20    0  ML     100%  85%   80%   mlops_development
    4  walid   20    0  MON    100%  90%   70%   prometheus_grafana
    5  walid   20    0  BIO    100%  88%   85%   cryosparc_admin
    6  walid   20    0  AI     100%  82%   78%   ai_agent_infrastructure
    7  walid   20    0  EDU    100%  95%   90%   ms_cs_utaustin
    8  walid   20    0  HR     100%  70%   60%   internship_coordination

<span class="term-muted">Tasks: 8 running | Load average: very high | Uptime: 3+ years</span>`,

        'cat /etc/motd': () => `
 ╔══════════════════════════════════════════════════╗
 ║                                                  ║
 ║   Welcome to Walid's HPC Dashboard               ║
 ║   Computational Engineer @ St. Jude              ║
 ║   M.S. CS @ UT Austin                             ║
 ║                                                  ║
 ║   55,000+ cores | 2,500+ GPUs | 6 clusters      ║
 ║                                                  ║
 ║   Type 'help' for available commands             ║
 ║                                                  ║
 ╚══════════════════════════════════════════════════╝`,

        // Filesystem helpers (simulated)
        pwd: () => `${cwd}`,

        cd: (args) => {
            const targetArg = (args || '').trim() || HOME;

            // Convenience: allow `cd overview` to navigate dashboards
            const dash = targetArg.toLowerCase();
            if (Router?.pages?.includes?.(dash)) {
                Router.navigateTo(dash);
                closeTerminal();
                return `<span class="term-success">Navigating to ${escapeHtml(dash)}...</span>`;
            }

            const target = resolvePath(targetArg);

            if (!hasPermission(target)) {
                return `<span class="term-error">cd: ${escapeHtml(targetArg)}: Permission denied</span>`;
            }

            if (!fsExists(target)) {
                return `<span class="term-error">cd: ${escapeHtml(targetArg)}: No such file or directory</span>`;
            }

            const node = fsGet(target);
            if (node.type !== 'dir') {
                return `<span class="term-error">cd: ${escapeHtml(targetArg)}: Not a directory</span>`;
            }

            setCwd(target);
            return ''; // no output on successful cd\n+        },\n+\n+        ls: (args) => {\n+            const parsed = parseArgs(args);\n+            const showAll = parsed.flags.has('-a') || parsed.flags.has('-la') || parsed.flags.has('-al');\n+            const targetArg = parsed.paths[0] || '';\n+            const target = resolvePath(targetArg);\n+\n+            if (!hasPermission(target)) {\n+                return `<span class=\"term-error\">ls: cannot open directory '${escapeHtml(targetArg || target)}': Permission denied</span>`;\n+            }\n+\n+            if (!fsExists(target)) {\n+                return `<span class=\"term-error\">ls: cannot access '${escapeHtml(targetArg || target)}': No such file or directory</span>`;\n+            }\n+\n+            const node = fsGet(target);\n+            if (node.type === 'file') {\n+                return escapeHtml(target.split('/').pop() || target);\n+            }\n+\n+            const items = node.children\n+                .filter(name => showAll || !name.startsWith('.'))\n+                .slice()\n+                .sort((a, b) => a.localeCompare(b));\n+\n+            // Add . and .. for -a\n+            if (showAll) {\n+                items.unshift('..');\n+                items.unshift('.');\n+            }\n+\n+            return items.map(name => {\n+                const full = normalizePath((target === '/' ? '' : target) + '/' + name);\n+                const n = fsGet(full);\n+                if (name === '.' || name === '..') {\n+                    return `<span class=\"term-muted\">${escapeHtml(name)}</span>`;\n+                }\n+                if (n?.type === 'dir') {\n+                    return `<span class=\"term-info\">${escapeHtml(name)}/</span>`;\n+                }\n+                if (name.endsWith('.log') || name === 'syslog' || name === 'auth.log' || name === 'boot.log') {\n+                    return `<span class=\"term-muted\">${escapeHtml(name)}</span>`;\n+                }\n+                if (name.endsWith('.conf') || name.endsWith('.ini') || name.endsWith('.yml') || name.endsWith('.yaml')) {\n+                    return `<span class=\"term-bold\">${escapeHtml(name)}</span>`;\n+                }\n+                return escapeHtml(name);\n+            }).join('  ');\n+        },\n+\n+        cat: (args) => {\n+            const targetArg = (args || '').trim();\n+            if (!targetArg) {\n+                return `<span class=\"term-error\">cat: missing file operand</span>`;\n+            }\n+\n+            const target = resolvePath(targetArg);\n+\n+            if (!hasPermission(target)) {\n+                return `<span class=\"term-error\">cat: ${escapeHtml(targetArg)}: Permission denied</span>`;\n+            }\n+\n+            // Preserve old \"portfolio files\" behavior\n+            if (target === '/home/visitor/about.txt') return commands.about();\n+            if (target === '/home/visitor/experience.txt') return commands.experience();\n+            if (target === '/home/visitor/skills.txt') return commands.skills();\n+            if (target === '/home/visitor/education.log') return commands.education();\n+            if (target === '/home/visitor/contact.vcf') return commands.contact();\n+            if (target === '/home/visitor/resume.pdf') {\n+                return `<span class=\"term-muted\">Binary file (PDF). Try:</span> <a href=\"abualafia-curriculum-vitae.pdf\" download>download CV</a>`;\n+            }\n+\n+            if (!fsExists(target)) {\n+                return `<span class=\"term-error\">cat: ${escapeHtml(targetArg)}: No such file or directory</span>`;\n+            }\n+\n+            const node = fsGet(target);\n+            if (node.type !== 'file') {\n+                return `<span class=\"term-error\">cat: ${escapeHtml(targetArg)}: Is a directory</span>`;\n+            }\n+\n+            return node.content;\n+        },\n     };
    };

    // Easter egg commands
    const easterEggs = {
        sudo: () => `<span class="term-error">Permission denied: nice try, but you don't have sudo on this cluster.</span>
<span class="term-muted">Contact your sysadmin (that's me).</span>`,

        'rm -rf /': () => `<span class="term-error">rm: cannot remove '/': Operation not permitted</span>
<span class="term-muted">Did you really think that would work on an HPC cluster?</span>`,

        'rm -rf': () => `<span class="term-error">rm: missing operand</span>
<span class="term-muted">Nice try though.</span>`,

        coffee: () => `<span class="term-info">
      ( (
       ) )
    ........
    |      |]
    \\      /
     \`----'
</span>
Here's your coffee ☕
Double espresso, Memphis style.`,

        mars: () => `<span class="term-success">
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
<span class="term-muted">A relic from the old Martian theme. The red planet remembers.</span>`,

        hack: () => `<span class="term-success">
Initializing breach protocol...
[████████████████████████] 100%

ACCESS GRANTED: Welcome to Olympus Mons Base 🚀

...just kidding. This is a portfolio site.
</span>
<span class="term-muted">Try 'help' for actual commands.</span>`,

        matrix: () => `<span class="term-success">Wake up, engineer...</span>
<span class="term-info">The red pill shows you how deep the HPC rabbit hole goes.</span>
<span class="term-muted">Follow the blinking LED... 🟢</span>`,

        whoami: () => `visitor

<span class="term-muted">Hint: try the 'about' command to learn about Walid</span>`,


        uname: () => `HPC Dashboard v4.0 (Grafana Edition)`,

        'uname -a': () => `HPCDash 4.0.0 walid-cluster #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`,

        uptime: () => {
            const start = new Date('2022-06-01');
            const now = new Date();
            const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
            return `up ${days} days, load average: very high, very high, very high`;
        },

        date: () => new Date().toString(),

        echo: (args) => args || '',


        exit: () => {
            setTimeout(() => closeTerminal(), 200);
            return `<span class="term-muted">Goodbye! Closing terminal...</span>`;
        },

        vim: () => `<span class="term-muted">You're trapped in vim! Just kidding, type :q to... wait, this isn't vim.</span>`,

        emacs: () => `<span class="term-muted">M-x butterfly... this is a web terminal, not Emacs.</span>`,
    };

    function executeCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        addCommandLine(trimmed);

        const lower = trimmed.toLowerCase();
        const parts = trimmed.split(/\s+/);
        const cmd1 = (parts[0] || '').toLowerCase();
        const cmd2 = (parts[1] || '').toLowerCase();
        const restArgs = trimmed.slice(parts[0].length).trim();
        const twoWord = cmd2 ? `${cmd1} ${cmd2}` : '';

        if (lower === 'clear') {
            clearTerminal();
            return;
        }

        // Prefer multiword commands (e.g., \"module avail\")
        if (twoWord && commands[twoWord]) {
            const handler = commands[twoWord];
            const argStr = trimmed.slice((parts[0] + ' ' + parts[1]).length).trim();
            const result = typeof handler === 'function' ? handler(argStr) : handler;
            if (result) addOutput(result);
        } else if (commands[cmd1]) {
            const handler = commands[cmd1];
            const result = typeof handler === 'function' ? handler(restArgs) : handler;
            if (result) addOutput(result);
        } else if (easterEggs[lower]) {
            const handler = easterEggs[lower];
            const result = typeof handler === 'function' ? handler() : handler;
            if (result) addOutput(result);
        } else if (lower.startsWith('echo ')) {
            addOutput(escapeHtml(trimmed.slice(5)));
        }
        // Navigate commands
        else if (lower === 'goto overview' || lower === 'cd overview') {
            Router.navigateTo('overview');
            closeTerminal();
            addOutput('<span class="term-success">Navigating to Overview...</span>');
        } else if (lower === 'goto experience' || lower === 'cd experience') {
            Router.navigateTo('experience');
            closeTerminal();
            addOutput('<span class="term-success">Navigating to Experience...</span>');
        } else if (lower === 'goto skills' || lower === 'cd skills') {
            Router.navigateTo('skills');
            closeTerminal();
            addOutput('<span class="term-success">Navigating to Skills...</span>');
        } else if (lower === 'goto contact' || lower === 'cd contact') {
            Router.navigateTo('contact');
            closeTerminal();
            addOutput('<span class="term-success">Navigating to Contact...</span>');
        }
        // Unknown
        else {
            addOutput(`<span class="term-error">command not found: ${escapeHtml(trimmed)}</span>
<span class="term-muted">Type 'help' to see available commands</span>`);
        }

        scrollToBottom();
    }

    function addCommandLine(cmd) {
        const block = document.createElement('div');
        block.className = 'term-block';
        block.innerHTML = `<div class="term-cmd-line"><span class="terminal-prompt">visitor@cluster:${escapeHtml(formatPromptPath(cwd))}$</span> <span class="term-cmd-text">${escapeHtml(cmd)}</span></div>`;
        output.appendChild(block);
    }

    function addOutput(html) {
        const div = document.createElement('div');
        div.className = 'term-output';
        div.innerHTML = html;
        output.appendChild(div);
    }

    function clearTerminal() {
        output.innerHTML = '';
        const welcome = document.createElement('div');
        welcome.className = 'terminal-welcome';
        welcome.innerHTML = `<p>Terminal cleared. Type <span class="term-highlight">help</span> for commands.</p>`;
        output.appendChild(welcome);
    }

    function scrollToBottom() {
        body.scrollTop = body.scrollHeight;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function openTerminal() {
        overlay.classList.add('visible');
        setTimeout(() => input.focus(), 100);
    }

    function closeTerminal() {
        overlay.classList.remove('visible');
    }

    function autocomplete(partial) {
        const allCmds = [...Object.keys(commands), ...Object.keys(easterEggs)];
        const matches = allCmds.filter(c => c.startsWith(partial));
        if (matches.length === 1) {
            input.value = matches[0];
        } else if (matches.length > 1) {
            addCommandLine(partial);
            addOutput(`<span class="term-info">Suggestions:</span> ${matches.join('  ')}`);
            scrollToBottom();
        }
    }

    function init() {
        overlay = document.getElementById('terminal-overlay');
        body = document.getElementById('terminal-body');
        output = document.getElementById('terminal-output');
        input = document.getElementById('terminal-input');

        if (!overlay || !input) return;

        // Initialize fake filesystem once
        if (fsNodes.size === 0) {
            fsInit();
        }
        setCwd(HOME);

        // Input handling
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value;
                if (cmd.trim()) {
                    commandHistory.push(cmd);
                    historyIndex = commandHistory.length;
                    executeCommand(cmd);
                }
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    input.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                if (input.value.trim()) {
                    autocomplete(input.value.trim().toLowerCase());
                }
            }
        });

        // Focus input on body click
        body.addEventListener('click', () => input.focus());

        // Close button
        const closeBtn = document.getElementById('terminal-close');
        if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

        // Close on backdrop
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeTerminal();
        });

        // Open buttons
        const topBtn = document.getElementById('topbar-terminal-btn');
        const sideBtn = document.getElementById('sidebar-terminal-btn');
        const mobileBtn = document.getElementById('mobile-terminal-btn');

        if (topBtn) topBtn.addEventListener('click', openTerminal);
        if (sideBtn) sideBtn.addEventListener('click', (e) => { e.preventDefault(); openTerminal(); });
        if (mobileBtn) mobileBtn.addEventListener('click', (e) => { e.preventDefault(); openTerminal(); document.getElementById('mobile-more-menu').classList.remove('visible'); });

        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('visible')) {
                closeTerminal();
            }
        });
    }

    return { init, openTerminal, closeTerminal };
})();
