# Interactive Data Grid Application

A modern React/Next.js application featuring an interactive data grid with pluggable cell renderers and editors.

## Features

- Interactive data grid with virtualized rendering
- Pluggable cell renderers and editors
- Multi-select user cell component
- CSV file upload and processing
- TypeScript support throughout the application

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── forms/          # Form components
│   └── grid/           # Grid-related components
│       └── cells/      # Cell renderers
├── data/               # Data utilities and mock data
└── types/              # TypeScript type definitions
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Virtualized

