# replit.md

## Overview

This is a custom business acquisition platform that transforms how buyers and sellers connect. The platform features smart matching technology, document management, and streamlined deal workflows for modern business transactions. Built with React frontend, Express.js backend, and flexible storage options optimized for the free tier.

## User Preferences

Preferred communication style: Simple, everyday language.
Deployment preference: Replit Starter (free) plan - 10 public apps, basic AI features, limited Agent access.
Project customization: Remove any references suggesting created by others, make it appear as user's own project.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom design system featuring glassmorphism effects and premium color palette
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and API interactions
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: OpenID Connect integration with Replit Auth using Passport.js
- **Session Management**: Express sessions with PostgreSQL store using connect-pg-simple
- **File Uploads**: Multer middleware for document handling
- **AI Integration**: OpenAI API for business compatibility analysis, document processing, and deal recommendations

### Database Layer
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with schema-first approach
- **Schema Design**: Comprehensive relational model supporting users, businesses, buyer profiles, matches, deals, documents, messages, and AI insights
- **Migrations**: Drizzle Kit for schema management and database migrations

### Authentication & Authorization
- **Provider**: Replit OpenID Connect with session-based authentication
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **User Management**: Profile-based system supporting both buyer and seller roles
- **Onboarding Flow**: Multi-step guided setup for user type selection and profile completion

### Core Business Logic
- **Matching Engine**: AI-powered compatibility scoring between businesses and buyers based on industry, budget, experience, and preferences
- **Deal Workflow**: Structured acquisition pipeline with stages from initial discussion through closing
- **Document Management**: Secure file upload with AI-powered financial document analysis
- **Communication**: Real-time messaging system integrated with deal progression
- **Analytics**: User activity tracking and business metrics dashboard

### UI/UX Design System
- **Design Philosophy**: Premium glassmorphism aesthetic with sophisticated visual hierarchy
- **Typography**: Inter and Poppins font families for modern, professional appearance
- **Color Scheme**: Blue-green gradient palette with semantic color assignments
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
- **Accessibility**: ARIA-compliant components with keyboard navigation support

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless platform for scalable data storage
- **Authentication**: Replit OpenID Connect service for user identity management
- **Development Environment**: Replit hosting with integrated development tools

### AI and Machine Learning
- **OpenAI API**: GPT-4 integration for business analysis, compatibility scoring, document processing, and recommendation generation
- **Document Analysis**: AI-powered financial statement analysis and risk assessment

### Frontend Libraries
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Animations**: CSS transitions and transforms for smooth user interactions
- **Icons**: Font Awesome for consistent iconography
- **State Management**: TanStack React Query for efficient API state handling

### Backend Services
- **Session Storage**: PostgreSQL-based session management with automatic cleanup
- **File Processing**: Multer for multipart form data and file upload handling
- **Real-time Features**: WebSocket support for live messaging and notifications
- **Security**: CORS, helmet, and session security middleware

### Development Tools
- **Build System**: Vite for fast development server and optimized production builds
- **Type Checking**: TypeScript with strict configuration for type safety
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **Testing**: Built-in support for component and integration testing

### Deployment Dependencies
- **Runtime**: Node.js 18+ for ES module support and modern JavaScript features
- **Process Management**: PM2 or similar for production process management
- **Environment Variables**: Secure configuration management for API keys and database URLs