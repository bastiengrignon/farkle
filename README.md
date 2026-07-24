# Farkle Game

A modern, feature-rich Farkle Scorekeeper built with React, TypeScript, and Turborepo.

## Features

- **PWA Support**: Installable as a Progressive Web App
- **Offline Capabilities**: Works without internet connection
- **Internationalization**: English, and French translations
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
- **Score Logic**: Farkle score engine

#### `web`
- **React 1ç**: Modern React with concurrent features
- **Vite 8**: Fast development server and bundler
- **Mantine UI**: Beautiful, accessible components
- **@tolgee/i18next & i18next**: Internationalization
- **mantine-datatable**: Enhanced table components
- **React Router 8**: Client-side routing
- **Zustand**: Lightweight state management
- **react-icons**: Extensive icon library
- **vite-plugin-pwa**: PWA configuration
- **vite-plugin-compression2**: Gzip compression
- **Workbox**: Service worker for offline support

### Tooling

- **BiomeJS**: Modern linter and formatter
- **Changesets**: Version management and changelog generation
- **Docker**: Containerized deployment

## Getting Started

### Prerequisites

- Node.js 22+
- Yarn classic
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bastiengrignon/farkle.git
   cd farkle
   ```

2. Install dependencies:
   ```bash
   yarn
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

Create a `.env` file in the web directory:

```env
# Tolgee Translation API (optional)
VITE_TOLGEE_API_URL=http://localhost:4000
VITE_TOLGEE_API_KEY=your-api-key
```

## Development

### Adding a New Package

1. Create a new directory in `packages/` or `apps/`
2. Add a `package.json` file
3. Update the root `package.json` workspaces
4. Run `yarn install`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `yarn lint` and `yarn typecheck`
5. Add tests if applicable
6. Create a changeset: `yarn new-version`
7. Commit and push your changes
8. Open a pull request

## License

MIT

## Acknowledgments

- [Turborepo](https://turbo.build/repo)
- [BiomeJS](https://biomejs.dev/)
- [Mantine](https://mantine.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite](https://vitejs.dev/)
- [Tolgee](https://tolgee.io/)
- [React Icons](https://react-icons.github.io/react-icons/)
