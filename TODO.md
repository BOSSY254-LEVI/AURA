# AURA Development Tasks

## Phase 1: Remove Replit Dependencies
- [ ] Remove @replit/vite-plugin-* from root package.json
- [ ] Remove Replit plugins from vite.config.ts
- [ ] Delete server/replitAuth.ts file
- [ ] Replace Replit auth in server/routes.ts with JWT auth
- [ ] Replace Replit auth in client/src/hooks/useAuth.ts with JWT auth

## Phase 2: Create Professional Files
- [ ] Create comprehensive README.md
- [ ] Create client/package.json
- [ ] Create server/package.json
- [ ] Create .env.example file
- [ ] Update root package.json (name, scripts, remove Replit deps)

## Phase 3: Fix Bugs and Improve Quality
- [ ] Add JWT authentication middleware
- [ ] Implement login/register endpoints
- [ ] Add proper error handling
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Add proper TypeScript types

## Phase 4: Testing and Optimization
- [ ] Test authentication flow
- [ ] Verify all API endpoints
- [ ] Optimize bundle size
- [ ] Add error boundaries
- [ ] Performance testing
