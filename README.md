# abualafia.com

A personal portfolio website featuring an interactive terminal interface with retro-inspired theming options.

[![Live Site](https://img.shields.io/badge/live-abualafia.com-00ff00?style=flat-square)](https://abualafia.com)

## Overview

This is a terminal-themed portfolio website for Walid Abu Al-Afia, showcasing professional experience, technical skills, and education. The site features an interactive command-line interface with multiple visual themes and easter eggs.

## Features

### Interactive Terminal
- **Command-line interface** with autocomplete (Tab key)
- **Command history** navigation (↑/↓ arrow keys)
- **Quick-access buttons** for common commands
- **Responsive design** optimized for desktop and mobile

### Visual Themes
- **Default Mode**: Modern dark terminal aesthetic
- **Windows XP Mode** (`xp`): Nostalgic Windows XP "Bliss" background
- **Retro Mode** (`retro`): Classic green-on-black terminal with scanline effects
- **Funky Mode** (`funky`): Colorful gradient animations and rainbow effects

### Available Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `about` | Information about Walid |
| `experience` | Work experience details |
| `skills` | Technical skills and expertise |
| `education` | Educational background |
| `projects` | View projects and GitHub profile |
| `contact` | Contact information |
| `resume` | Resume availability info |
| `clear` | Clear the terminal |
| `xp` / `retro` / `funky` | Toggle visual themes |

### Hidden Easter Eggs
Try these commands for fun surprises:
- `ls`, `pwd`, `whoami`, `uname`
- `neofetch`, `sudo`, `hack`
- `matrix`, `coffee`
- **Konami Code**: `↑↑↓↓←→←→BA` 🎮

## Tech Stack

- **HTML5** - Semantic markup with SEO optimization
- **CSS3** - Custom properties, animations, responsive design
- **Vanilla JavaScript** - No frameworks, pure DOM manipulation

## Project Structure

```
abualafia.com/
├── index.html          # Main HTML structure
├── style.css           # Styles and theme definitions
├── script.js           # Terminal logic and commands
├── CNAME              # Custom domain configuration
├── robots.txt         # SEO crawler directives
├── sitemap.xml        # Site structure for search engines
└── legacy/            # Previous website versions
    ├── v1/            # Original portfolio design
    └── v2/            # Bootstrap-based portfolio
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/walidabualafia/abualafia.com.git
cd abualafia.com
```

2. Open `index.html` in your browser:
```bash
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

Or use a local server:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

## SEO Features

- Structured data (Schema.org Person)
- Open Graph meta tags
- Twitter Card integration
- Semantic HTML structure
- Custom sitemap and robots.txt

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

The site is deployed on **GitHub Pages** with a custom domain (`abualafia.com`).

To deploy your own version:
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. (Optional) Configure custom domain in `CNAME`

## License

© 2025 Walid Abu Al-Afia. All rights reserved.

---

*Built with ❤️ and ☕ | HPC Engineer @ St. Jude | MSCS Student @ UT Austin*
