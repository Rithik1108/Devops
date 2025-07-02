# DevOps Monitoring Dashboard

## Overview
This is a modern full-stack DevOps monitoring dashboard application built with React, TypeScript, and Express. The application provides comprehensive DevOps monitoring capabilities including system metrics, CI/CD pipeline tracking, system logs, performance analytics, and incident management. Features real-time monitoring with WebSocket connections, dark-themed UI optimized for operations centers, and multiple specialized views for different aspects of DevOps monitoring.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Charts**: Recharts for data visualization
- **Real-time Communication**: WebSocket client for live data updates

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design with structured error handling
- **Real-time Communication**: WebSocket server for broadcasting updates
- **Request Logging**: Custom middleware for API request logging and timing

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Interface**: Abstract storage layer with in-memory implementation for development
- **Session Management**: PostgreSQL session store with connect-pg-simple

## Key Components

### Data Models
- **Deployments**: Track service deployments with status, version, and duration
- **Alerts**: Manage system alerts with severity levels and resolution status
- **System Metrics**: Monitor CPU, memory, disk usage, and network I/O
- **Dashboard Stats**: Aggregated metrics for overview cards

### API Endpoints
- `GET /api/dashboard` - Retrieve comprehensive dashboard data
- `GET /api/deployments` - Fetch deployment history with pagination
- `GET /api/alerts` - Get active system alerts
- `GET /api/metrics` - Latest system metrics
- `GET /api/metrics/history` - Historical metrics data
- `GET /api/pipelines` - CI/CD pipeline runs with status tracking
- `GET /api/logs` - System logs with filtering by level
- `GET /api/performance` - Performance metrics by service

### UI Components & Pages
- **Dashboard Page**: Main overview with system status cards, health metrics, and recent activity
- **System Health Page**: Detailed system resource monitoring with historical charts and server information
- **CI/CD Pipeline Page**: Pipeline run tracking, build status, and deployment monitoring
- **Logs Page**: System log viewer with filtering, search, and real-time log streaming
- **Analytics Page**: Performance metrics analysis, service comparison, and optimization insights
- **Sidebar Navigation**: Dynamic navigation with active page highlighting
- **Real-time Components**: Live updating charts, metrics, and status indicators

## Data Flow

### Real-time Updates
1. WebSocket connection established on dashboard load
2. Server broadcasts updates to connected clients
3. Client receives and updates UI reactively
4. Fallback to HTTP polling if WebSocket fails

### State Management Flow
1. Initial data fetch via React Query
2. Real-time updates override cached data
3. Background refetching for data consistency
4. Optimistic updates for better UX

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **recharts**: Chart library for data visualization
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **Vite**: Frontend build tool and dev server
- **ESBuild**: Backend bundling for production
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Assets**: Static assets served from built frontend

### Environment Configuration
- **Development**: Vite dev server with HMR and Express API
- **Production**: Single Express server serving both API and static files
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Replit Integration
- **Development Mode**: Vite plugin for runtime error overlay
- **Cartographer**: Replit-specific development tooling
- **Banner**: Development environment indicator

## Changelog
```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```