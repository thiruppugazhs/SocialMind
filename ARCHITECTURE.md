# SocialMind Backend Architecture

## Project Structure

```
socialmind/
├── frontend/                  # React frontend app
│   ├── src/
│   ├── components/           # React components
│   ├── services/
│   │   └── apiService.ts     # API client for backend communication
│   ├── types.ts              # TypeScript type definitions
│   ├── App.tsx               # Main App component
│   ├── index.tsx             # React entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/                   # Express.js backend server
│   ├── src/
│   │   ├── server.ts         # Main Express server
│   │   ├── routes/
│   │   │   ├── instagram.ts  # Instagram API routes
│   │   │   ├── content.ts    # Content generation routes
│   │   │   └── trends.ts     # Trend analysis routes
│   │   └── services/
│   │       ├── instagramService.ts   # Instagram Graph API client
│   │       └── contentService.ts     # Gemini AI content generation
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                 # Compiled output
│
├── .env.example              # Environment variables template
├── package.json              # Monorepo root
└── README.md

```

## API Endpoints

### Instagram Routes (`/api/instagram`)

- `GET /profile/:userId` - Get user's Instagram profile
- `GET /insights/:userId` - Get user's insights
- `GET /media/:userId` - Get user's media
- `POST /publish` - Publish a media post
- `POST /schedule` - Schedule a post
- `GET /hashtags` - Search for hashtags

### Content Routes (`/api/content`)

- `POST /generate` - Generate Instagram content using Gemini AI
- `POST /reply` - Generate AI reply for messages

### Trends Routes (`/api/trends`)

- `POST /analyze` - Analyze trends for a niche

## Key Features

✅ Instagram Graph API Integration
✅ Gemini AI Content Generation
✅ Trend Analysis
✅ Account Insights
✅ Media Publishing & Scheduling
✅ Automated Replies

## Environment Variables

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=<your-gemini-key>
META_CLIENT_ID=<your-meta-app-id>
META_CLIENT_SECRET=<your-meta-secret>
```

## Development

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend
```

## Next Steps for Full Implementation

1. **Remove Mock Data** - Delete mock arrays in frontend components
2. **Connect Components to APIs** - Update components to call backend APIs
3. **Implement Authentication** - Connect Meta OAuth flow
4. **Error Handling** - Add proper error boundaries
5. **Loading States** - Add skeleton loaders
6. **Testing** - Add unit and integration tests
7. **Deployment** - Set up Docker, CI/CD pipelines

