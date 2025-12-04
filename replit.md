# SPL - Sistema de Previsão Legal

## Overview
This is a Brazilian legal prediction system (SPL - Sistema de Previsão Legal) focused on environmental compliance in the Amazon region. The application provides legal analysis, compliance tracking, and document management for B2B clients. All UI is in Brazilian Portuguese.

## Project Architecture

### Frontend (React + Vite + TypeScript)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.x
- **Styling**: TailwindCSS (CDN)
- **AI Integration**: Google Gemini API for legal case analysis
- **Charts**: Recharts for data visualization
- **Port**: 5000 (configured for Replit deployment)

### Key Features
- CNPJ lookup with automatic data retrieval from Receita Federal
- CNAE-based legal requirement identification
- Legal Assistant with AI-powered case analysis
- Compliance Dashboard with KPIs and charts
- Document Management with drag-and-drop upload
- Company Dashboard with multi-step onboarding
- Questionnaire System for operational profile
- Notifications and legal updates tracking
- Action Plans management

## Project Structure
```
.
├── src/                        # New organized source code
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Company, CNAE, LegalRequirement, etc.
│   ├── services/               # API service layer
│   │   ├── cnpjService.ts      # CNPJ validation and lookup (BrasilAPI)
│   │   ├── cnaeService.ts      # CNAE lookup and risk mapping (IBGE)
│   │   └── legalService.ts     # Legal requirements generation
│   ├── hooks/                  # Custom React hooks
│   │   └── useToast.ts         # Toast notification hook
│   ├── context/                # React Context providers
│   │   └── AppContext.tsx      # Global state management
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── StatusBadge.tsx # Status indicators
│   │   │   ├── RiskIndicator.tsx # Risk level displays
│   │   │   ├── Toast.tsx       # Toast notifications
│   │   │   ├── Stepper.tsx     # Multi-step wizard
│   │   │   └── FilterPanel.tsx # Filter UI
│   │   └── shared/             # Shared business components
│   │       ├── OnboardingFlow.tsx # Company onboarding wizard
│   │       ├── ObligationDetailModal.tsx # Obligation details
│   │       └── ExecutiveDashboard.tsx # Executive KPIs
├── components/                 # Legacy components
│   ├── Dashboard.tsx           # Main layout with navigation
│   ├── LoginScreen.tsx         # Login page
│   ├── LegalAssistant.tsx      # AI legal assistant
│   ├── ComplianceDashboard.tsx # OL/RL compliance tracking
│   ├── SPLDashboard.tsx        # Action plans and library
│   ├── CompanyDashboard.tsx    # Company profile
│   ├── DocumentsDashboard.tsx  # Document management
│   ├── QuestionnaireDashboard.tsx # Questionnaires
│   ├── NotificationsDashboard.tsx # Notifications
│   ├── Charts.tsx              # Recharts components
│   ├── Modal.tsx               # Modal dialogs
│   └── Sidebar.tsx             # Navigation sidebar
├── App.tsx                     # Main app component
├── index.tsx                   # App entry point
├── vite.config.ts              # Vite configuration with path aliases
└── tsconfig.json               # TypeScript config with path aliases
```

## Recent Changes (Dec 4, 2024)

### Multi-Tenant B2B SaaS Architecture
1. **Role-Based Access Control**
   - GlobalRole: MASTER (platform admin), PLATFORM_SUPPORT (support staff), USER (regular users)
   - CompanyRole: ADMIN (company admin), MANAGER, COLLABORATOR, VIEWER
   - company_memberships table linking users to companies with specific roles

2. **Authentication System**
   - JWT authentication with httpOnly cookies
   - Access tokens (15min) + Refresh tokens (7 days)
   - Company context switching in tokens
   - Unique token IDs to prevent duplicates

3. **Clean System Start**
   - System starts with no pre-loaded data
   - SetupScreen for creating Master Administrator
   - GET /api/admin/setup-status endpoint to check if setup needed
   - POST /api/admin/create-master for initial admin creation

4. **Email Invitation System**
   - Invite users by email with expirable tokens (7 days)
   - Company admins can invite collaborators
   - InvitationScreen for accepting invitations
   - Password setup during invitation acceptance

5. **Key Components**
   - SetupScreen: Initial master admin creation
   - MasterDashboard: Platform-wide management for MASTER users
   - InvitationScreen: Accept email invitations
   - LoginScreen: Enhanced to support company context

6. **Backend Structure**
   - server/src/db/schema.ts: Multi-tenant database schema
   - server/src/services/authService.ts: Authentication logic
   - server/src/routes/admin.ts: Master admin endpoints
   - server/src/middleware/auth.ts: JWT validation + role guards

### Gestão SPL Improvements
1. **ObligationsPanel Component**: New tabbed panel showing OL (Obrigações Legais), RL (Requisitos Legais), and Documents
   - Clear applicability indicators (Se Aplica / Não se Aplica / A Avaliar)
   - Status badges (Conforme, Pendente, Vencido, A Vencer)
   - Risk level indicators (Crítico, Alto, Médio, Baixo)
   - Expandable details with related requirements
   - Progress bars showing overall applicability
2. **FormBuilder Component**: Drag-and-drop questionnaire builder
   - Multiple question types: text, boolean, select, multiselect, date, file, number
   - Real-time preview of questionnaire
   - Question reordering with drag-and-drop
   - Options management for select/multiselect
   - Save as draft or publish functionality
3. **SPL Dashboard Enhancement**: Added "Obrigações Aplicáveis" as first tab
   - Shows ObligationsPanel by default when navigating to Gestão SPL
   - Integrated with existing action plans, monitoring, and library tabs

### UI/UX Improvements
1. **LoginScreen Redesign**: Modern minimalist two-panel layout with gradient branding, feature list, password recovery modal
2. **UserMenu Component**: User dropdown with profile, settings, help, and logout functionality
3. **SettingsModal**: Full settings panel with General, Notifications, and Security tabs
4. **HelpModal**: FAQ accordion with 6 common questions and support contact section
5. **ExportModal**: Export functionality with Excel/PDF/CSV format options
6. **Mobile Menu**: Fully functional hamburger menu with all navigation items

### New Service Layer Architecture
1. **Type System**: Comprehensive TypeScript types for Company, CNAE, LegalRequirement, Obligation, Evidence, ActionPlan
2. **CNPJ Service**: Real API integration with BrasilAPI for company data lookup
3. **CNAE Service**: IBGE API integration for CNAE classification with risk mapping
4. **Legal Service**: Automatic legal requirement generation based on CNAEs and location

### New Components
1. **StatusBadge**: Unified status display for compliance, risk, priority, action, document status
2. **RiskIndicator**: Multiple variants (badge, dot, bar, icon) for risk display
3. **Stepper**: Multi-step wizard for onboarding and forms
4. **FilterPanel**: Advanced filtering with select, multi-select, search, date-range
5. **Toast System**: Global toast notifications with useToast hook
6. **OnboardingFlow**: 4-step company registration (CNPJ → Confirm → Profile → Generate)
7. **ObligationDetailModal**: Detailed view with evidence upload and history
8. **ExecutiveDashboard**: Executive KPIs with conformity gauge
9. **UserMenu**: User profile dropdown with settings, help, logout
10. **ExportModal**: Export reports in multiple formats

### State Management
- **AppContext**: Centralized state with useReducer
- **useNavigation**: Navigation hook for view switching
- **useCompany**: Company data management
- **useOnboarding**: Onboarding flow state
- **useNotifications**: Notification management

### Path Aliases
Configured in vite.config.ts and tsconfig.json:
- `@src/*` → `./src/*`
- `@types/*` → `./src/types/*`
- `@services/*` → `./src/services/*`
- `@hooks/*` → `./src/hooks/*`
- `@context/*` → `./src/context/*`
- `@ui/*` → `./src/components/ui/*`
- `@shared/*` → `./src/components/shared/*`

### API Integrations
1. **BrasilAPI (CNPJ)**: `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`
2. **IBGE (CNAE)**: `https://servicodados.ibge.gov.br/api/v2/cnae`
3. **Google Gemini**: AI-powered legal analysis

### Technical Fixes
1. **Chart Dimensions**: Added min-height container to prevent negative dimension errors
2. **Tailwind CSS**: Using class mapping objects for dynamic styling (CDN limitation)
3. **Path Aliases**: Consistent imports across the project

## Environment Variables

### Required Secrets
- `GEMINI_API_KEY` - Google Gemini API key for AI-powered legal analysis
  - Get your key from: https://ai.google.dev/

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

## User Preferences
- Language: Portuguese (Brazilian)
- Focus: Environmental law and Amazon region compliance (IPAAM, IBAMA)
- Professional tone for legal analysis
- Modern, clean UI with teal color scheme

## Amazon Region Focus
- IPAAM (Instituto de Proteção Ambiental do Amazonas) requirements
- State-specific environmental licensing (Law 3.785/2012)
- CBMAM fire safety requirements
- Fluvial navigation regulations (ANTAQ, NORMAM)

## Dependencies
- React 19.2.0
- @google/genai 1.30.0
- lucide-react 0.555.0
- react-markdown 10.1.0
- recharts 2.x
- Vite 6.2.0
- TypeScript 5.8.2

## Next Steps
1. Add GEMINI_API_KEY secret for AI features
2. Integrate onboarding flow into main app
3. Connect executive dashboard to real data
4. Implement evidence file upload storage
5. Add database for persistent storage
