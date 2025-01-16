# SoftStacker

A community-driven platform for discovering and sharing software templates across different operating systems. SoftStacker helps users find the right software setup based on their operating system and professional role.

## About

SoftStacker streamlines the process of setting up development environments, creative workstations, and productivity tools across Windows, macOS, and Linux. Whether you're a developer, designer, or content creator, you can find and share curated collections of tools that work best for your workflow.

## Features

### Template Management
- Browse software collections specific to Windows, macOS, and Linux
- Filter templates based on professional roles and use cases
- Create and share your own software setups
- Save drafts while creating templates
- Quick template creation through system scanning

### User Features
- GitHub OAuth authentication
- Personal dashboard with template analytics
- Vote on templates to help surface the best setups
- Track your voted and created templates
- Data privacy controls with account data deletion option

### Package Manager Integration
- Windows: Chocolatey package manager
- macOS: Homebrew package manager
- Linux: Support for apt, dnf, and pacman

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with GitHub provider
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **State Management**: React Context API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/BytexGrid/SoftStacker.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SoftStacker/softstacker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GITHUB_ID=your-github-oauth-client-id
   GITHUB_SECRET=your-github-oauth-secret
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
SoftStacker/
├── softstacker/           # Next.js application
│   ├── app/              # App Router pages and layouts
│   │   ├── (auth)/      # Authentication routes
│   │   ├── (os)/        # OS-specific template routes
│   │   ├── api/         # API routes
│   │   └── dashboard/   # User dashboard
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utility functions and helpers
│   ├── public/         # Static assets
│   └── types/          # TypeScript type definitions
└── docs/              # Project documentation
```

## API Routes

- `/api/templates` - Template CRUD operations
- `/api/templates/[id]/vote` - Template voting
- `/api/templates/draft` - Draft management
- `/api/user` - User profile management
- `/api/auth/*` - Authentication endpoints

## Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your PR adheres to our coding standards and includes appropriate tests.

## Documentation

For detailed documentation, please visit our [Wiki](https://github.com/BytexGrid/SoftStacker/wiki).

## License

This project is open source under the GNU General Public License. See [LICENSE](LICENSE) for details. 