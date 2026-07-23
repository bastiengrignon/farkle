# Farkle Game

A modern, feature-rich Farkle dice game built with React, TypeScript, and Turborepo.

## Features

- **Multiplayer Gameplay**: Play with 2-8 players
- **Complete Scoring System**: All standard Farkle combinations supported
- **PWA Support**: Installable as a Progressive Web App
- **Offline Capabilities**: Works without internet connection
- **Internationalization**: English, French, and Spanish translations
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Theme switching with Mantine UI

## Tech Stack

### Monorepo Structure

- **Turborepo**: Fast, incremental builds
- **Yarn**: Package manager with workspaces
- **TypeScript**: Type-safe development

### Packages

#### `@farkle/core`
- **tsdown**: Bundle ESM and CJS modules
- **TypeScript**: Latest version with strict mode
- **Game Logic**: Complete Farkle game engine
  - Dice rolling and selection
  - Scoring system with all combinations
  - Game state management with reducer pattern
  - Type definitions for all game entities

#### `@farkle/web`
- **React 18**: Modern React with concurrent features
- **Vite 5**: Fast development server and bundler
- **Mantine UI**: Beautiful, accessible components
- **@tolgee/web & @tolgee/react**: Internationalization
- **mantine-datatable**: Enhanced table components
- **React Router 6**: Client-side routing
- **Zustand**: Lightweight state management
- **react-icons**: Extensive icon library
- **vite-plugin-pwa**: PWA configuration
- **vite-plugin-compression**: Gzip compression
- **Workbox**: Service worker for offline support

### Tooling

- **BiomeJS**: Modern linter and formatter
- **Changesets**: Version management and changelog generation
- **Docker**: Containerized deployment
- **nginx**: Production web server

## Project Structure

```
farkle/
├── apps/
│   └── web/                    # React application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   ├── store/          # Zustand stores
│       │   ├── hooks/          # Custom hooks
│       │   ├── utils/          # Utility functions
│       │   ├── styles/         # Global styles
│       │   ├── i18n/           # Translation configuration
│       │   ├── App.tsx         # Main app component
│       │   └── main.tsx        # Entry point
│       ├── public/            # Static assets
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── packages/
│   └── core/                  # Core game logic
│       ├── src/
│       │   ├── types/         # TypeScript types
│       │   ├── utils/         # Game utilities
│       │   └── index.ts       # Package entry
│       ├── package.json
│       └── tsconfig.json
│
├── turbo.json                # Turborepo configuration
├── package.json              # Root package.json
├── biome.json                # BiomeJS configuration
├── .changeset/               # Changesets configuration
├── Dockerfile                # Production Docker image
├── docker-compose.yml        # Development and production setup
├── nginx.conf                # nginx configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn 4+ (recommended) or npm/pnpm
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bastiengrignon/farkle.git
   cd farkle
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Build all packages
yarn build

# Build only the web app
yarn workspaces focus @farkle/web && yarn build
```

### Running in Production

```bash
# Using Docker (recommended)
docker-compose up -d

# Or manually
cd apps/web
yarn build
yarn preview
```

## Available Scripts

### Root Level

| Script | Description |
|--------|-------------|
| `yarn install` | Install all dependencies |
| `yarn build` | Build all packages |
| `yarn dev` | Start all development servers |
| `yarn lint` | Run linting on all packages |
| `yarn lint:check` | Check linting without fixing |
| `yarn lint:fix` | Fix linting issues |
| `yarn format` | Format all files |
| `yarn typecheck` | Run TypeScript type checking |
| `yarn clean` | Clean all build artifacts |
| `yarn changeset` | Create a new changeset |
| `yarn changeset-publish` | Publish packages with changesets |
| `yarn release` | Full release workflow |

### Web App Level

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn preview` | Preview production build |
| `yarn lint` | Run linting |
| `yarn typecheck` | Run TypeScript type checking |
| `yarn clean` | Clean build artifacts |

## Game Rules

Farkle is a dice game where players take turns rolling dice to accumulate points.

### Objective
Be the first player to reach 10,000 points.

### Scoring Combinations

| Combination | Points |
|-------------|--------|
| Single 1 | 100 |
| Single 5 | 50 |
| Three 1s | 1000 |
| Three 2s | 200 |
| Three 3s | 300 |
| Three 4s | 400 |
| Three 5s | 500 |
| Three 6s | 600 |
| Four of a kind | 2× Three of a kind |
| Five of a kind | 3× Three of a kind |
| Six of a kind | 4× Three of a kind |
| Straight (1-5) | 1500 |
| Straight (2-6) | 2000 |
| Full House | 1500 |
| Four of a kind + Pair | 1500 |
| Two Triplets | 2500 |

### Gameplay

1. On your turn, roll all 6 dice
2. Select dice that form scoring combinations
3. You can roll up to 3 times per turn
4. Bank your score to keep it, or risk rolling again
5. If you don't score on a roll, you lose your turn score
6. First to 10,000 points wins!

## Deployment

### Docker (Recommended)

1. Build the Docker image:
   ```bash
   docker build -t farkle-game .
   ```

2. Run the container:
   ```bash
   docker run -d -p 3000:80 --name farkle farkle-game
   ```

3. Or use docker-compose:
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. Build the web app:
   ```bash
   cd apps/web
yarn build
   ```

2. Serve the `dist` folder with any static file server:
   ```bash
   npx serve -s dist -l 3000
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Tolgee Translation API (optional)
VITE_TOLGEE_API_URL=http://localhost:4000
VITE_TOLGEE_API_KEY=your-api-key

# Development server
VITE_DEV_SERVER_PORT=5173

# Production
NODE_ENV=production
PORT=3000
```

## Development

### Adding a New Package

1. Create a new directory in `packages/` or `apps/`
2. Add a `package.json` file
3. Update the root `package.json` workspaces
4. Run `yarn install`

### Adding Dependencies

```bash
# Add to root
yarn add -Dw package-name

# Add to a specific workspace
yarn workspaces focus package-name && yarn add package-name
```

### Creating a Changeset

```bash
yarn changeset
# Follow the prompts to create a changeset
yarn changeset-publish
```

## Architecture Decisions

### Why Turborepo?
- Fast, incremental builds
- Easy dependency management between packages
- Scalable monorepo structure
- Built-in caching

### Why BiomeJS?
- Modern, fast linter and formatter
- Single configuration for both
- TypeScript-aware
- Organize imports support

### Why Zustand?
- Lightweight (~1kB)
- Simple API
- TypeScript-first
- No providers needed
- Devtools support

### Why Mantine?
- Complete component library
- Built-in dark mode
- Accessible
- Customizable
- Great TypeScript support

### Why Vite?
- Fast development server
- Instant hot module replacement
- Optimized production builds
- Plugin ecosystem

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `yarn lint` and `yarn typecheck`
5. Add tests if applicable
6. Create a changeset: `yarn changeset`
7. Commit and push your changes
8. Open a pull request

## License

ISC

## Acknowledgments

- [Turborepo](https://turbo.build/repo)
- [BiomeJS](https://biomejs.dev/)
- [Mantine](https://mantine.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite](https://vitejs.dev/)
- [Tolgee](https://tolgee.io/)
- [React Icons](https://react-icons.github.io/react-icons/)
