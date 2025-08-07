# Overview

GetMarkdown is a rich text to Markdown converter web application built as a full-stack TypeScript project. The application provides a WYSIWYG editor that allows users to input rich text content and see real-time conversion to Markdown format. Users can format text with bold, italic, underline, strikethrough, headings, lists, links, and code blocks, with the output automatically converted to clean Markdown syntax.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI components
- **Rich Text Editor**: Tiptap editor with extensions for formatting (bold, italic, headings, lists, links, code blocks)
- **State Management**: TanStack Query for server state management and caching
- **Markdown Conversion**: TurndownService for converting HTML/rich text to Markdown format
- **UI Components**: Extensive component library based on Radix UI primitives

## Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Build System**: esbuild for production builds, tsx for development
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM migrations
- **Schema**: User management with username/password authentication
- **Development Storage**: In-memory storage implementation for local development
- **Migrations**: Drizzle-kit for database schema management

## Development Environment
- **Hot Reload**: Vite HMR for frontend development
- **Development Server**: Express with Vite middleware integration
- **Build Process**: Separate builds for client (Vite) and server (esbuild)
- **Type Safety**: Shared TypeScript types between client and server

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **@tiptap/core**: Rich text editor framework with various extensions

## UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for managing CSS class variants
- **lucide-react**: Icon library for consistent iconography

## Development Tools
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast JavaScript bundler for production builds
- **drizzle-kit**: Database migration and schema management tool

## Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library (via drizzle-zod)

The application uses a modern full-stack TypeScript architecture with a clear separation between client and server code, shared type definitions, and a robust UI component system for consistent user experience.