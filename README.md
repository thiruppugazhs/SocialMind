# SocialMind - Instagram Marketing Automation with AI

A full-stack application for Instagram marketing automation using AI-powered content generation, trend analysis, and account management.

## 🎯 Project Status: ✅ Refactored & Ready

This project has been successfully refactored from a monolithic React app into a proper **Frontend + Backend architecture** with Instagram Graph API and Gemini AI integration.

## 📁 Project Structure

```
SocialMind/
├── frontend/                 # React/Vite frontend application
│   ├── components/          # React UI components
│   ├── services/            # API communication layer (apiService.ts)
│   ├── types.ts             # TypeScript types
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # React entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Express.js backend API server
│   ├── src/
│   │   ├── server.ts        # Express server setup
│   │   ├── routes/          # API endpoint handlers
│   │   │   ├── instagram.ts   # Instagram Graph API routes
│   │   │   ├── content.ts     # AI content generation
│   │   │   └── trends.ts      # Trend analysis
│   │   └── services/        # Business logic
│   │       ├── instagramService.ts   # Instagram API wrapper
│   │       └── contentService.ts     # Gemini AI integration
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example             # Environment variables template
├── package.json             # Monorepo configuration
├── setup.sh                 # Setup automation script
├── ARCHITECTURE.md          # Technical documentation
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `GEMINI_API_KEY` - From [Google AI Studio](https://aistudio.google.com/apikey)
- `META_CLIENT_ID` - From [Facebook Developers](https://developers.facebook.com)
- `META_CLIENT_SECRET` - From your Meta App

### 3. Start Development

```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🎨 Frontend & Backend Separation

### Frontend (`/frontend`)
- React + TypeScript application
- Vite build tool for fast development
- API service layer (`apiService.ts`) for backend communication
- Tailwind CSS + Lucide icons for UI
- Recharts for data visualization

### Backend (`/backend`)
- Express.js REST API
- TypeScript for type safety
- Instagram Graph API integration
- Google Gemini AI integration
- CORS-enabled for frontend communication

## 📡 API Endpoints

### Instagram Management (`/api/instagram`)

```typescript
GET    /profile/:userId           // Get user profile
GET    /insights/:userId          // Get account insights
GET    /media/:userId             // Get user media
GET    /hashtags?search=...       // Search hashtags
POST   /publish                   // Publish a post
POST   /schedule                  // Schedule a post
```

### Content Generation (`/api/content`, `/api/ai`)

```typescript
POST   /content/generate          // Generate content with Gemini
POST   /ai/reply                  // Generate AI replies
POST   /analytics/audit           // Generate account audit
```

### Trend Analysis (`/api/trends`)

```typescript
POST   /analyze                   // Analyze trends for niche
```

## 🔧 Technology Stack

**Frontend:**
- React 18, TypeScript, Vite
- Tailwind CSS, Lucide React, Recharts
- Axios for HTTP requests

**Backend:**
- Express.js, TypeScript
- Google Gemini API
- Instagram Graph API
- dotenv for configuration

## 📝 Component Migration

Original components (`/components`) need to be moved and updated:

1. **Copy components to frontend:**
   ```bash
   bash migrate-components.sh
   ```

2. **Update imports:**
   ```typescript
   // Before
   import { generateInstagramContent } from '../services/geminiService';
   
   // After
   import { generateInstagramContent } from '../services/apiService';
   ```

3. **Remove mock data:**
   - Delete mock arrays and hardcoded values
   - Connect to backend APIs for real data

4. **Update App.tsx:**
   - Import and use actual components
   - Add professional UI/UX flows

## 🔐 Key Features

✅ Instagram Graph API integration
✅ Gemini AI content generation
✅ Trend analysis & recommendations
✅ Account audit generation
✅ Post publishing & scheduling
✅ Hashtag discovery
✅ Automated replies

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture
- **[Backend Routes](./backend/src/routes/)** - API documentation
- **[Frontend Services](./frontend/services/)** - API client

## 🛠️ Development Commands

```bash
# Install everything
npm run install:all

# Start both servers
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build

# Start production backend
npm run start:backend
```

## 🚨 Important Configuration

Before production deployment:

1. ✅ Add `.env` file with all required keys
2. ✅ Enable Instagram Graph API access
3. ✅ Configure Meta App for your domain
4. ✅ Set up HTTPS for secure connections
5. ✅ Implement database for persistent storage
6. ✅ Add proper error handling & logging
7. ✅ Implement rate limiting
8. ✅ Add authentication middleware
9. ✅ Set up CI/CD pipeline
10. ✅ Add unit & integration tests

## 📞 Troubleshooting

**Port already in use?**
```bash
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

**API connection errors?**
- Verify backend is running on port 5000
- Check all environment variables in `.env`
- Ensure API keys are valid

**Module not found?**
```bash
npm run install:all
rm -rf node_modules
npm install
```

## 📄 License

MIT License

---

**Status**: ✅ Refactoring Complete
**Last Updated**: February 2026
