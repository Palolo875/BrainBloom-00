# Overview

BrainBloom is a modern note-taking and knowledge management application built as a digital garden for ideas. It combines organic design principles with sophisticated functionality to create a seamless writing and thinking experience. The application features a soft UI design system with warm color palettes and fluid interactions that make knowledge management feel natural and intuitive.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The application is built using **SvelteKit** with TypeScript. The architecture follows a component-based design with clear separation of concerns:

- **UI Framework**: SvelteKit with Svelte 5 for reactive components and server-side rendering
- **Styling**: Tailwind CSS with custom design tokens for warm, organic colors
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Build Tool**: Vite for fast development and optimized builds

The frontend uses SvelteKit's file-based routing system with API routes handling backend functionality.

## Design System

The application implements a warm, organic design system with:

- **Custom Color Palette**: Featuring warm colors including primary-bg (#FBF9F6), primary-text (#5C5470), accent-peach (#F3AB9A), accent-lavender (#B9B2D8), and accent-green (#A4BFA0)
- **Typography**: Multi-font system using Lexend for readability and Lora for serif headings
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities

## Backend Architecture

The application includes API routes built with SvelteKit's server-side capabilities:

- **Notes API**: Full CRUD operations for note management
- **Search API**: Semantic search using vector embeddings
- **Embedding API**: Text-to-vector conversion using Hugging Face models
- **Database**: Supabase PostgreSQL with vector similarity search capabilities

## Core Features Architecture

### Note Management
- Create, read, update, and delete notes
- Vector embeddings for semantic search
- User-specific note isolation
- Real-time note operations

### Semantic Search
- AI-powered search using sentence-transformers/all-MiniLM-L6-v2 model
- Vector similarity matching with configurable thresholds
- User authentication and note ownership verification

### API Integration
- Hugging Face API for text embedding generation
- Supabase for data persistence and vector search
- RESTful API design with proper error handling

# External Dependencies

## Core Framework
- **SvelteKit**: Full-stack web framework for building the application
- **Svelte**: Reactive component framework for building user interfaces
- **TypeScript**: Type safety and enhanced development experience
- **Vite**: Fast build tool and development server

## Styling and UI
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide Svelte**: Icon system for consistent iconography throughout the app
- **PostCSS**: CSS processing with autoprefixer support

## Backend and Data
- **Supabase**: Backend-as-a-Service providing PostgreSQL database and authentication
- **@supabase/supabase-js**: Official Supabase client library for JavaScript

## AI and Machine Learning
- **Hugging Face Inference API**: Text embedding generation using sentence-transformers models
- **Vector similarity search**: Powered by Supabase's pg_vector extension

## Development Configuration
The application requires the following environment variables:
- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_ANON_KEY**: Your Supabase project's anonymous key
- **HF_TOKEN**: Hugging Face API token for embedding generation

## Deployment
- **SvelteKit Adapter Auto**: Automatic deployment adapter selection
- **Production Ready**: Configured for autoscale deployment with build optimization