# 🎅 Kris Kringle Coordinator

A delightful web application for organizing Secret Santa gift exchanges! Simply enter participant names, click the magical Pretzel button, and let the app randomly assign who buys presents for whom this holiday season.

## ✨ Features

- **100% Client-Side**: All processing happens in your browser - no data is stored or sent to servers
- **Simple & Intuitive**: Clean interface for adding/removing participants
- **Fair Algorithm**: Uses Fisher-Yates shuffle and derangement to ensure truly random assignments
- **Privacy-Focused**: Click-to-reveal assignments keep secrets safe
- **Mobile-Friendly**: Works great on all devices
- **No Sign-Up Required**: Just visit and start organizing!

## 🌐 Live Deployment

🚀 **Production**: [https://kris-kryngle-coordinator.dilger.dev](https://kris-kryngle-coordinator.dilger.dev)

## 🎯 How It Works

1. **Add Participants**: Enter names of everyone participating in the gift exchange
2. **Generate Assignments**: Click the bright green "Pretzel" button to create random assignments
3. **Reveal Secrets**: Each participant can click on their name to see who they're buying for
4. **Stay Anonymous**: The algorithm ensures no one gets themselves and everyone forms one continuous gift-giving chain

### The Algorithm

The allocation uses a proven derangement algorithm:
1. The list of names is shuffled using Fisher-Yates shuffle for fair randomness
2. Each person at position `i` is assigned to buy for the person at position `(i + 1) % length`
3. This guarantees:
   - Everyone gives to exactly one person
   - Everyone receives from exactly one person
   - No one gives to themselves
   - No partitioned cycles (everyone is connected in one chain)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/cdilga/kris-kryngle-coordinator.git
cd kris-kryngle-coordinator

# Install dependencies
npm install

# Run locally
npm run dev

# Visit http://localhost:8788 in your browser
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Test against deployed production site
npm run test:deployed
```

## 📦 Deployment

This project automatically deploys to Cloudflare Pages when you push to the main branch.

### Manual Deployment
```bash
npm run deploy
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (no frameworks needed!)
- **Styling**: Tailwind CSS via CDN
- **Hosting**: Cloudflare Pages
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Build Tool**: Wrangler CLI

## 📁 Project Structure

```
kris-kryngle-coordinator/
├── public/
│   ├── index.html          # Main application
│   └── kris-kringle.js     # Core allocation logic (for testing)
├── tests/
│   ├── unit/
│   │   └── kris-kringle.test.js    # Unit tests for allocation algorithm
│   └── e2e/
│       └── kris-kringle.spec.js    # End-to-end tests
├── CLAUDE.md              # Development guidelines
└── README.md              # This file
```

## 🎨 Design Philosophy

This project follows the "minimal but delightful" approach:
- **Keep it simple**: No over-engineering or unnecessary complexity
- **Make it work**: Reliable core functionality first
- **Add personality**: Fun error messages and smooth animations
- **Stay focused**: Build what's needed, not what might be needed someday

## 🤖 Created with Claude

This project was automatically generated using [the-ultimate-bootstrap](https://github.com/cdilga/the-ultimate-bootstrap).
