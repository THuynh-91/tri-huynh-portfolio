# 🚀 Tri Huynh's Portfolio Website

A modern, interactive portfolio website built with Next.js 15, React 19, and Tailwind CSS. Featuring stunning animations, an interactive terminal, and fun Easter eggs!

## ✨ Features

### 🎨 Visual & Interactive
- **Animated Background**: Floating particle system with connections
- **Typing Animation**: Dynamic role cycling in hero section
- **Scroll Progress Bar**: Beautiful gradient progress indicator
- **Smooth Animations**: Framer Motion throughout
- **Project Cards**: Interactive hover effects with gradient overlays
- **GitHub Stats**: Live stats integration from your profile

### 🎮 Interactive Elements
- **Terminal Interface**: Fully functional command-line in browser
- **Konami Code**: Hidden Easter egg with confetti celebration 🎉
- **Copy-to-Clipboard**: One-click email copying with toast notifications
- **Responsive Navigation**: Mobile-friendly with smooth scrolling

### 📊 Content Sections
- Hero with typing animation
- Featured projects showcase
- Technical skills breakdown
- Education details (Northeastern University)
- AWS & ML certifications
- Professional experience
- About section with GitHub stats
- Contact form with social links

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **Icons**: Heroicons & Custom SVG
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/THuynh-91/portfolio-website.git
cd portfolio-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The site will hot-reload as you make changes!

### 🎮 Try the Interactive Features

Once running, try these:
1. Click the **terminal button** (bottom-right) and type `help`
2. Press the **Konami Code**: ↑ ↑ ↓ ↓ ← → ← → B A
3. **Hover** over project cards for animations
4. **Click** the email to copy to clipboard
5. **Scroll** and watch the progress bar!

## 🎨 Customization

### Update Your Information

All content is data-driven for easy updates:

1. **Projects**: `data/projects.json`
   - Add your project details, tech stack, and impact metrics
   - Update GitHub repo links

2. **Experience**: `data/experience.json`
   - Your work history and achievements

3. **Skills**: `data/skills.json`
   - Languages, frameworks, libraries, databases, tools, cloud

4. **Contact**: `components/Contact.jsx` & `components/Footer.jsx`
   - Email, LinkedIn, GitHub links

5. **Resume**: `public/resume.pdf`
   - Replace with your updated resume

6. **GitHub Stats**: `components/GitHubStats.jsx`
   - Update username prop (currently: THuynh-91)

### Add Project Screenshots

See `PROJECT_VISUALS_GUIDE.md` for detailed instructions!

```bash
# Quick start:
1. Save screenshots to public/images/
2. Name them: rps-game.png, spotify-app.png, etc.
3. They'll auto-display on project cards!
```

### Styling

- **Colors**: Edit `tailwind.config.js`
  - Primary: `#3B82F6` (blue)
  - Accent: `#F59E0B` (amber)
- **Fonts**: Change in `styles/globals.css`
- **Animations**: Adjust Framer Motion timing in components

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy with one click

### Other Platforms

The site can also be deployed to:
- Netlify
- GitHub Pages
- AWS Amplify
- Any static hosting service

## 📁 Project Structure

```
portfolio-website/
├── components/               # React components
│   ├── Hero.jsx             # Landing section with typing effect
│   ├── Projects.jsx         # Featured projects showcase
│   ├── ProjectCard.jsx      # Individual project card
│   ├── Skills.jsx           # Tech stack display
│   ├── Education.jsx        # University details
│   ├── Certifications.jsx   # AWS & ML certs
│   ├── Experience.jsx       # Work history
│   ├── About.jsx            # Bio + GitHub stats
│   ├── Contact.jsx          # Contact info
│   ├── Navbar.jsx           # Sticky navigation
│   ├── Footer.jsx           # Footer with links
│   ├── InteractiveTerminal.jsx  # Terminal interface
│   ├── KonamiCode.jsx       # Easter egg
│   ├── ScrollProgress.jsx   # Progress bar
│   ├── AnimatedBackground.jsx   # Particle system
│   ├── GitHubStats.jsx      # Live GitHub stats
│   └── ...more components
├── pages/
│   ├── index.jsx            # Main page
│   ├── _app.jsx             # App wrapper
│   └── _document.jsx        # HTML document
├── public/
│   ├── images/              # Project screenshots
│   └── resume.pdf           # Your resume
├── styles/
│   └── globals.css          # Global styles
├── data/
│   ├── projects.json        # Project data
│   ├── experience.json      # Work history
│   └── skills.json          # Tech skills
├── package.json
├── tailwind.config.js
├── next.config.js
├── README.md
├── PROJECT_VISUALS_GUIDE.md     # How to add screenshots
└── INTERACTIVE_FEATURES.md      # Interactive elements guide
```

## 📚 Documentation

- **[PROJECT_VISUALS_GUIDE.md](PROJECT_VISUALS_GUIDE.md)** - How to add screenshots, GIFs, and demos
- **[INTERACTIVE_FEATURES.md](INTERACTIVE_FEATURES.md)** - All interactive features explained

## 🎯 Terminal Commands

Open the terminal on the site and try:
- `help` - See all commands
- `about` - Learn about Tri
- `skills` - View tech stack
- `projects` - List projects
- `contact` - Get contact info
- `joke` - Random programming joke!

## 🔗 Links

- **Live Site**: [Coming Soon - Deploy to Vercel]
- **GitHub**: [https://github.com/THuynh-91](https://github.com/THuynh-91)
- **LinkedIn**: [https://www.linkedin.com/in/tri-huynh-81735326a](https://www.linkedin.com/in/tri-huynh-81735326a)

## 📝 License

MIT License - feel free to use this as a template for your own portfolio!

## 👨‍💻 Author

**Tri Huynh**
- 🎓 Computer Science Student @ Northeastern University
- 🤖 AI & Full-Stack Developer
- ☁️ AWS Certified Cloud Practitioner
- 📧 triqhuynh91@gmail.com

---

Built with ❤️ using Next.js 15, React 19, Tailwind CSS, and Framer Motion

**Star ⭐ this repo if you like it!**
