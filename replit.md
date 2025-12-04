# SPL - Sistema de Previsão Legal

## Overview
This is a Brazilian legal prediction system (SPL - Sistema de Previsão Legal) focused on environmental compliance in the Amazon region. The application provides legal analysis, compliance tracking, and document management for legal professionals.

## Project Architecture

### Frontend (React + Vite + TypeScript)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.x
- **Styling**: TailwindCSS (CDN)
- **AI Integration**: Google Gemini API for legal case analysis
- **Port**: 5000 (configured for Replit deployment)

### Key Features
- Legal Assistant with AI-powered case analysis
- Compliance Dashboard
- Document Management
- Company Dashboard
- Questionnaire System
- Notifications
- User Authentication (frontend-only, no backend)

## Project Structure
```
.
├── components/          # React UI components
│   ├── Dashboard.tsx
│   ├── LoginScreen.tsx
│   ├── LegalAssistant.tsx
│   ├── ComplianceDashboard.tsx
│   └── ... (other dashboards)
├── services/           # API services
│   └── geminiService.ts  # Gemini AI integration
├── backend/            # Backend config files (not implemented)
│   └── src/config/     # Environment, logging, cache configs
├── App.tsx            # Main app component
├── index.tsx          # App entry point
├── index.html         # HTML template
├── vite.config.ts     # Vite configuration
└── package.json       # Dependencies

```

## Recent Changes (Dec 4, 2024)

### UI/UX Improvements
1. **SPLDashboard Redesign**: Complete redesign with modern cards, enhanced statistics display, improved visual hierarchy, and interactive cards with status indicators
2. **Sidebar Enhancement**: Redesigned with expandable menus, better icons, collapsed state support, and smoother navigation transitions
3. **LegalAssistant Upgrade**: Modern UI with better loading states, example prompts, and improved user experience
4. **Global Animations**: Added comprehensive CSS animations (fade-in, slide-in, fade-in-up, fade-in-down) and custom scrollbar styling

### Technical Fixes
1. **Tailwind CSS Class Mapping**: Fixed critical Tailwind CSS class interpolation issues by replacing template literals with proper class mapping objects (getStatusClasses, getPriorityClasses) - Tailwind CDN doesn't support dynamic class generation
2. **Status/Priority Configs**: Added explicit class definitions for statuses (concluido, em_andamento, atrasado) and priorities (critica, alta, media, baixa)

### Replit Environment Setup
1. **Port Configuration**: Changed from 3000 to 5000 for Replit webview compatibility
2. **HMR Configuration**: Added conditional HMR config for both Replit and local development
3. **Entry Point**: Added script tag to index.html to load the React app
4. **Environment Variables**: Configured Vite to use GEMINI_API_KEY from environment
5. **Type Definitions**: Added vite-env.d.ts for TypeScript support
6. **Gemini Service**: Refactored to use lazy initialization and better error handling
7. **Deployment**: Configured static deployment with build command

### Configuration Notes
- The app uses Vite's environment variable system with the `VITE_` prefix
- HMR is configured to work with Replit's proxy environment
- The Gemini API key is injected at build time and exposed in the client bundle
- The backend folder contains configuration files but no actual server implementation
- **Important**: Tailwind CDN requires explicit class names - template literals like `bg-${color}-500` don't work and must use class mapping objects

## Environment Variables

### Required Secrets
- `GEMINI_API_KEY` - Google Gemini API key for AI-powered legal analysis
  - Get your key from: https://ai.google.dev/
  - Set in Replit Secrets tab or .env.local file

### Development
The app loads environment variables from:
1. Replit Secrets (recommended for production)
2. `.env.local` file (for local development)

## Running the Project

### Development
The project is configured to run automatically via the Frontend workflow:
- Command: `npm run dev`
- Port: 5000
- Output: Webview

### Building for Production
```bash
npm run build
```
This creates a production build in the `dist/` directory.

### Deployment
The project is configured for static deployment on Replit:
- Build command: `npm run build`
- Public directory: `dist`
- No server required (static hosting)

## User Preferences
- Language: Portuguese (Brazilian)
- Focus: Environmental law and Amazon region compliance
- Professional tone for legal analysis

## Important Notes
1. The backend folder exists but contains only configuration files, no actual server
2. All functionality runs in the frontend
3. The Gemini API is called directly from the browser
4. API keys are exposed in the client bundle (typical for client-side apps)
5. For production, consider moving sensitive API calls to a backend proxy
6. Tailwind CDN is used (warning in console is expected for dev mode)

## Dependencies
- React 19.2.0
- @google/genai 1.30.0
- lucide-react 0.555.0
- react-markdown 10.1.0
- Vite 6.2.0
- TypeScript 5.8.2

## Next Steps
- Add the GEMINI_API_KEY secret to use the AI features
- The app will show a helpful error message if the key is missing
- Test the Legal Assistant feature after adding the API key
