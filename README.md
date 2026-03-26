# Niccalc
A web-based calculator with a hidden feature: enter a secret code to unlock a private notes vault. The calculator works like any standard calculator, but your secret notes are just a code away.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Features

- **Standard Calculator** - Addition, subtraction, multiplication, division, percentage
- **Secret Code Lock** - Enter a custom 4-digit code to unlock hidden notes
- **Secret Notes** - Create, view, and delete private notes stored locally
- **Keyboard Support** - Full keyboard input for calculator operations
- **Persistent Storage** - Notes and secret code saved in localStorage
- **Stunning Animations** - Splash screen, particle background, staggered button entrances, ripple effects

## How It Works

1. On first launch, set a 4-digit secret code
2. Use the calculator normally for arithmetic
3. Enter your secret code on the number pad to reveal your notes
4. Notes are stored locally in the browser and persist between sessions

## Getting Started

```bash
# Clone the repository
git clone <repository-url>

# Open index.html in a browser
# Or serve with any static file server
npx serve .
```

No build tools or dependencies required.

## Project Structure

```
├── index.html    # App markup and layout
├── styles.css    # Calculator and modal styling
└── script.js     # Calculator logic, secret code detection, and notes CRUD
```

## Tech Stack

- **HTML5** - Semantic markup, `<canvas>` for particle background
- **CSS3** - Grid, Flexbox, CSS Animations, `backdrop-filter` glassmorphism, custom scrollbar
- **Vanilla JavaScript** - ES6+ with IIFE pattern, Canvas 2D API, localStorage API
- **Google Fonts** - Inter font family via CDN

## Sources & Resources

| Resource | Purpose |
|---|---|
| [Google Fonts - Inter](https://fonts.google.com/specimen/Inter) | Typography |
| [Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Particle background |
| [CSS backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) | Frosted glass effect |
| [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) | localStorage for notes & code |
| [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) | Button grid layout |
| [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations) | Splash, entrance, ripple effects |

## Browser Support

| Browser | Supported |
|---|---|
| Chrome 76+ | Yes |
| Firefox 103+ | Yes |
| Safari 9+ | Yes |
| Edge 79+ | Yes |

> `backdrop-filter` requires Chromium-based browsers for full glassmorphism effect.

## License

MIT
