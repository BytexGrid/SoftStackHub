# SoftStacker - Technical Documentation

## Project Overview

SoftStacker is a community-driven platform designed to help users discover and share software templates across different operating systems. The platform aims to streamline the process of setting up software environments by providing curated collections of tools based on user roles and operating systems.

### Core Features
- Cross-platform software template discovery
- Role-based software recommendations
- Community-driven template sharing
- Automated system scanning for template creation
- Integration with package managers (Chocolatey, Homebrew, apt/dnf/pacman)

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with GitHub provider
- **State Management**: React Context API

### Backend Stack
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes + Supabase Client
- **Authentication**: NextAuth.js with Supabase Auth
- **File Storage**: Supabase Storage

### Project Structure
```
SoftStacker/
├── softstacker/           # Main Next.js application
│   ├── app/              # App Router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utility functions and helpers
│   ├── supabase/        # Supabase client and types
│   └── public/          # Static assets
├── .github/             # GitHub Actions workflows
```

## Setup and Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account
- GitHub account (for authentication)

### Environment Variables
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

## Implementation Details

### Authentication Flow
- Implemented using NextAuth.js with Supabase Auth
- GitHub OAuth integration
- Session management with JWT
- Protected API routes and pages

### Database Schema
```sql
-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  name text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Templates Table
create table public.templates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  os text[] not null,
  tools jsonb not null,
  author_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies will be added for security
```

### API Routes
- `/api/auth/*` - Authentication endpoints
- `/api/templates` - Template CRUD operations
- `/api/users` - User management
- `/api/scan` - System scanning functionality

### Frontend Components
- Navbar with authentication status
- Template cards and lists
- Profile management interface
- Template creation form
- System scanner interface

## Current Progress

### Completed Features
1. Project setup with Next.js and TypeScript
2. Database schema design with Supabase
3. Basic authentication flow with NextAuth.js and Supabase Auth
4. Initial UI components and layouts
5. Basic routing structure

### In Progress
1. Template creation functionality
2. System scanning implementation
3. User profile management
4. Search and filtering capabilities

### Planned Features
1. Package manager integration
2. Advanced template sharing
3. Community features (comments, ratings)
4. Analytics dashboard

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Use proper TypeScript types

### Git Workflow
1. Create feature branches from main
2. Follow conventional commits
3. Submit PRs for review
4. Maintain clean commit history

### Testing Strategy
- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical flows
- Component testing with React Testing Library

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Deployment Platform
- Vercel (planned)
- Supabase for database and auth
- GitHub Actions for CI/CD

## Security Considerations
- Environment variables protection
- API route authentication
- Input validation
- Rate limiting
- CORS configuration

## Performance Optimization
- Image optimization
- Code splitting
- Cache strategies
- API response optimization

## Monitoring and Analytics
- Error tracking (planned)
- Usage analytics (planned)
- Performance monitoring (planned)

## Contributing Guidelines
1. Fork the repository
2. Create feature branch
3. Follow code style guidelines
4. Submit pull request
5. Wait for review and approval

## Support and Documentation
- GitHub Issues for bug reports
- Discussions for feature requests
- Wiki for additional documentation

## License
GNU General Public License - See LICENSE file for details 