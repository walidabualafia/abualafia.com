# abualafia.com

A personal portfolio website with a Martian-inspired design, featuring modern UI sections and an interactive terminal experience.

[![Live Site](https://img.shields.io/badge/live-abualafia.com-c45a3b?style=flat-square)](https://abualafia.com)

## Overview

This is a Martian-themed portfolio website for Walid Abu Al-Afia, Computational Engineer II at St. Jude Children's Research Hospital and MSCS student at UT Austin. The site features a clean, modern design inspired by urbit.org with earthy/Martian tones, complemented by an interactive terminal accessible via a floating button.

## Features

### Modern Design
- **Martian color palette**: Rust reds, terracotta, dusty orange, and sand highlights
- **Clean card-based layout**: Organized sections for easy navigation
- **Responsive design**: Optimized for desktop, tablet, and mobile
- **Smooth animations**: Fade-in effects and hover interactions
- **Custom Martian favicon**: Stylized "W" on a Mars-inspired circle

### Content Sections
- **Hero**: Introduction with role and mission statement
- **About**: Background, stats, and profile image
- **Experience**: Full career timeline at St. Jude
- **Research**: IEEE/RSJ IROS 2023 publication
- **Education**: UT Austin MS, Rhodes College BS, NVIDIA certification
- **Skills**: Comprehensive technical skills organized by category
- **Vibe Coding**: AI-assisted development philosophy and daily tool stack
- **Contact**: Email, GitHub, LinkedIn links with CV download

### Interactive Terminal
Access the terminal by clicking the terminal icon (bottom-right corner):
- **Command-line interface** with autocomplete (Tab key)
- **Command history** navigation (↑/↓ arrow keys)
- **Mars-themed** prompts and easter eggs

### Available Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `about` | Information about Walid |
| `experience` | Work experience details |
| `skills` | Technical skills and expertise |
| `education` | Educational background |
| `projects` | View projects and GitHub profile |
| `vibe` | Vibe coding philosophy |
| `contact` | Contact information |
| `resume` | Download CV |
| `clear` | Clear the terminal |

### Hidden Easter Eggs
Try these commands for fun surprises:
- `ls`, `pwd`, `whoami`, `uname`
- `neofetch`, `sudo`, `hack`
- `matrix`, `coffee`, `mars`
- **Konami Code**: `↑↑↓↓←→←→BA`

## Tech Stack

- **HTML5** - Semantic markup with SEO optimization
- **CSS3** - Custom properties, animations, responsive design
- **Vanilla JavaScript** - No frameworks, pure DOM manipulation
- **Google Fonts** - Inter + Space Mono typography

## Project Structure

```
abualafia.com/
├── index.html                    # Main HTML structure
├── style.css                     # Martian theme styles
├── script.js                     # Terminal logic and interactions
├── favicon.svg                   # Martian "W" favicon
├── profile.png                   # Profile photo
├── abualafia-curriculum-vitae.pdf # Downloadable CV
├── CNAME                         # Custom domain configuration
├── robots.txt                    # SEO crawler directives
├── sitemap.xml                   # Site structure for search engines
└── legacy/                       # Previous website versions
    ├── v1/                       # Original portfolio design
    └── v2/                       # Bootstrap-based portfolio
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/walidabualafia/abualafia.com.git
cd abualafia.com
```

2. Start a local server:
```bash
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background Primary | `#0f0e0c` | Main background |
| Background Secondary | `#1a1816` | Section backgrounds |
| Accent Primary (Rust) | `#c45a3b` | Buttons, borders, highlights |
| Accent Secondary (Terracotta) | `#d4764e` | Hover states |
| Accent Tertiary (Dusty Orange) | `#e8a87c` | Stats, labels |
| Text Primary | `#f5f0e8` | Headings, body text |
| Text Secondary | `#a8a095` | Descriptions |

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

© 2026 Walid Abu Al-Afia. All rights reserved.

---

*Designed & built with care from the red planet.*
