# ChatBotBE

Backend submodule for the ChatBot fullstack application. Awaits client calls from the frontend and forwards them to the Grok AI service.

## Tech Stack

- **Runtime:** Node.js
- **Testing:** Jest
- **AI Integration:** Grok AI

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
GROK_API_KEY=your_grok_api_key
```

## Related

- [ChatBotFE](https://github.com/Adrian55Stack/ChatBotFE) — Frontend submodule
- [ChatBotRxjs](https://github.com/Adrian55Stack/ChatBotRxjs) — Monorepo