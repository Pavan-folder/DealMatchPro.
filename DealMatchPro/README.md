# Business Acquisition Platform

Your custom business acquisition platform designed for modern entrepreneurs and investors.

## Features

Key capabilities include:

- ✅ **In-memory storage** - No database required
- ✅ **Basic AI matching** - Simplified compatibility scoring
- ✅ **Core functionality** - Full buyer-seller workflow
- ✅ **Memory sessions** - No PostgreSQL dependency
- ✅ **Optional AI** - Works without OpenAI API key

## 🛠️ Quick Start

1. **Clone or fork this Repl**
2. **Run the app** - It works out of the box!
3. **Optional**: Add your OpenAI API key for enhanced AI features

## 📋 Configuration

### Required (Auto-configured by Replit)
- `REPL_ID` - Automatically set by Replit
- `REPLIT_DOMAINS` - Automatically set by Replit

### Optional
- `SESSION_SECRET` - Random string for session security
- `OPENAI_API_KEY` - For enhanced AI features (upgrade)
- `USE_FREE_TIER=true` - Ensures free tier compatibility

## 🎯 What Works on Free Tier

### ✅ Full Features Available
- User authentication via Replit Auth
- Business and buyer profile creation
- Match discovery and management
- Deal workflow and stages
- Document upload and basic analysis
- Real-time messaging
- Basic compatibility scoring

### 🔄 Simplified for Free Tier
- **Storage**: In-memory (resets on restart)
- **AI Features**: Basic templates and random scoring
- **Sessions**: Memory-based (not persistent)

### 🚀 Upgrade Benefits
- **AI-Powered Analysis**: Full OpenAI integration
- **Persistent Storage**: PostgreSQL database
- **Advanced Matching**: Sophisticated AI scoring
- **Document Analysis**: AI-powered financial review

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Storage**: In-memory Maps (free tier) / PostgreSQL (upgrade)
- **Auth**: Replit OpenID Connect
- **AI**: Optional OpenAI integration

## 📱 Usage

1. **Sign in** with your Replit account
2. **Complete onboarding** as either a buyer or seller
3. **Create your profile** with business details
4. **Discover matches** based on compatibility
5. **Start deals** and manage the acquisition process

## 🔧 Development

```bash
# Install dependencies (auto-installed by Replit)
npm install

# Start development server
npm run dev

# The app runs on port 5000
# Accessible at your-repl-name.replit.app
```

## 📄 Free Tier Limitations

- **Data Persistence**: Data resets when the app restarts
- **AI Features**: Basic functionality without OpenAI API
- **Storage**: Limited to available memory
- **Sessions**: Memory-based, not persistent across restarts

## Technology Stack

- React 18 with TypeScript
- Express.js backend
- Modern UI components with Tailwind CSS
- Real-time features and secure authentication
- Optional AI integration for enhanced functionality