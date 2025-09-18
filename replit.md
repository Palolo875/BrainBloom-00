# Overview

BrainBloom is a modern note-taking and knowledge management application built as a digital garden for ideas. It combines organic design principles with sophisticated functionality to create a seamless writing and thinking experience. The application features a soft UI design system inspired by neumorphism, with warm color palettes and fluid interactions that make knowledge management feel natural and intuitive.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application is built using **Next.js 14** with the App Router pattern and **React Server Components**. The architecture follows a component-based design with clear separation of concerns:

- **UI Framework**: Next.js 14.2.16 with React 18+ for server-side rendering and optimal performance
- **Styling**: Tailwind CSS with custom design tokens for the "Palette des Rêves" color system
- **Component Library**: Custom Soft UI components built on top of Radix UI primitives for accessibility
- **Type Safety**: Full TypeScript implementation with strict type checking

The frontend uses a modular screen-based navigation system where different views (notes, graph visualization, modules) are rendered conditionally based on application state.

## Design System

The application implements a comprehensive **Soft UI (Neumorphic) design system** with:

- **Custom Color Palette**: "Palette des Rêves" featuring warm, organic colors (Pêche du Matin, Lavande des Songes, Miel Doré, etc.)
- **Typography**: Multi-font system using Lexend for readability, Lora for serif headings, and Geist Mono for code
- **Shadows**: Custom CSS shadow utilities for the characteristic soft UI depth effects
- **Animations**: Smooth transitions and micro-interactions using CSS animations and transitions

## State Management

The application uses **React hooks** for state management with a custom `useNotes` hook that handles:

- Note creation, editing, and management
- Search functionality with real-time filtering
- Connection management between notes
- Local state persistence

## Core Features Architecture

### Rich Text Editor
- Custom-built editor with floating toolbar functionality
- Real-time formatting with AI-powered suggestions
- Link creation system with note search integration
- Auto-save functionality with visual feedback

### Graph Visualization
- Canvas-based network visualization of note connections
- Interactive node manipulation with physics simulation
- Advanced filtering system with saved views
- Path-finding algorithms for discovering connection routes

### Modular System
- Plugin-like architecture for feature modules (Task Management, Journaling, Learning System)
- Each module is self-contained with its own state and UI
- Toggle-based activation system for customizing the user experience

# External Dependencies

## UI and Styling
- **Radix UI**: Comprehensive primitive component library for accessibility-first UI components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration for the design system
- **Lucide React**: Icon system for consistent iconography
- **class-variance-authority**: Type-safe component variant system

## Development Tools
- **TypeScript**: Full type safety across the application
- **Next.js**: React framework with App Router and server components
- **Autoprefixer**: CSS vendor prefixing for cross-browser compatibility

## Fonts and Typography
- **Geist Font Family**: Modern font stack from Vercel
- **Google Fonts**: Lexend and Lora font families for enhanced readability

## Analytics and Deployment
- **Vercel Analytics**: Application performance and usage tracking
- **Vercel Platform**: Hosting and deployment infrastructure with automatic CI/CD

## Form Handling
- **React Hook Form**: Performant form management
- **Hookform Resolvers**: Form validation integration

## Date Management
- **date-fns**: Modern date utility library for formatting and manipulation

The application is designed to be fully self-contained with minimal external API dependencies, focusing on local-first data management and offline capability.