# kris-kryngle-coordinator

A web application where the user can enter a list of names of people participating in the Kris Kringle. The webapp randomly assigns each person another person they should buy presents for this holiday season.

## 🌐 Live Deployment

🚀 **Production**: [https://kris-kryngle-coordinator.dilger.dev](https://kris-kryngle-coordinator.dilger.dev)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/cdilga/kris-kryngle-coordinator.git
cd kris-kryngle-coordinator

# Install dependencies
npm install

# Run locally
npm run dev
```

## 📦 Deployment

This project automatically deploys to Cloudflare Workers when you push to the main branch.

### Manual Deployment
```bash
npm run deploy
```

## 🛠️ Development

### Local Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Environment Variables
- `CLOUDFLARE_API_TOKEN`: Used for deployment (set in GitHub Secrets)

## 📝 Requirements

The application should:
- Be stateless and fully client-side. No information should be persisted or sent to a server.
- Show a list of names and a textbox to add new names.
- There should also be a delete button next to each name.
- There is a bright green submit button labelled 'Pretzel' which will create the allocations.
To create the allocations, a copy of the `names` list is first shuffled randomly. Then, `names[i]` is allocated `names[(i + 1) % names.length]`. This ensures that a derangement is created without any partitioned cycles.

## 🤖 Created with Claude

This project was automatically generated using [the-ultimate-bootstrap](https://github.com/cdilga/the-ultimate-bootstrap).
