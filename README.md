**SafeCam Dashboard**

A modern, responsive web dashboard for monitoring and managing security cameras in the SafeCam surveillance system. Built with React, TypeScript, and Vite for a fast, type-safe, and maintainable user experience.

### Features
- **Camera Monitoring**: Live view, status overview, and multi-camera grid support.
- **User Authentication**: Protected routes with secure login flows.
- **Responsive Design**: Optimized for desktop and mobile using Tailwind CSS and shadcn/ui components.
- **Real-time Updates**: Hooks and state management for dynamic camera feeds and alerts.
- **Routing & Navigation**: Clean client-side routing with protected pages.
- **Developer-Friendly**: TypeScript for type safety, ESLint for code quality, and Vite for lightning-fast development.

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router (via `src/routes`)
- **Other**: PostCSS, ESLint, environment configuration (`.env`)

### Project Structure
```
safecam-dashboard/
├── public/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and libraries
│   ├── routes/          # Routing logic (MainRoutes.tsx, ProtectedRoute.tsx)
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

### Getting Started

#### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

#### Installation
```bash
# Clone the repository
git clone https://github.com/Manith003/safecam-dashboard.git
cd safecam-dashboard

# Install dependencies
npm install
```

#### Environment Variables
Create a `.env` file in the root directory (copy from `.env.example` if available) and configure your API endpoints, camera streams, or authentication keys.

#### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

#### Linting
```bash
npm run lint
```

### Usage
1. Log in to access the dashboard (protected routes enforce authentication).
2. View live camera feeds and manage devices.
3. Navigate between monitoring, alerts, and settings pages.

### Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please ensure your code passes linting and follows the existing TypeScript/React patterns.

### License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details (add one if not present).

### Acknowledgments
- Built on the Vite + React + TypeScript template.
- UI components powered by shadcn/ui and Tailwind CSS.
- Designed for seamless integration with SafeCam backend services.

For issues or feature requests, please open an issue on GitHub.
