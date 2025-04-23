# WhatsApp Bot Admin Panel - Project Plan

## Overview
This project aims to build an admin panel for managing WhatsApp bots. The system will allow users to create and manage their bots/clients, purchase or use existing phone numbers, and configure their bots through a user-friendly interface.

## Tech Stack
- Deco.cx as framework
- Fresh + Preact + Tailwind for UI
- Supabase for authentication and data storage
- GitHub API for repository creation
- External API for purchasing phone numbers

## Database Structure (Supabase)
1. **Users**
   - id (primary key)
   - email
   - name
   - avatar_url
   - created_at

2. **Clients**
   - id (primary key)
   - user_id (foreign key to Users)
   - client_id (unique identifier for the bot)
   - phone_number
   - phone_number_id
   - repo_url
   - status (active, pending, disconnected)
   - created_at
   - updated_at

3. **Client_Keys**
   - id (primary key)
   - client_id (foreign key to Clients)
   - api_key
   - webhook_url
   - created_at

## Pages & Routes Structure
1. `/` - Homepage/Login Page
2. `/dashboard` - Main dashboard after login
3. `/clients` - List of user's clients/bots
4. `/clients/new` - Create new client flow
5. `/clients/[id]` - Client details page
6. `/clients/[id]/setup` - Client setup page (QR code)
7. `/clients/[id]/settings` - Client settings

## Authentication Flow
1. Implement Supabase Auth with Google provider
2. Create protected routes that redirect to login if not authenticated
3. Store and manage user session

## Components Structure
1. **UI Components**
   - Button
   - Card
   - Input
   - Modal
   - Notification
   - Loader

2. **Layout Components**
   - MainLayout (with sidebar navigation)
   - AuthLayout (for login/signup pages)

3. **Feature Components**
   - ClientList
   - ClientCard
   - PhoneNumberSelector
   - QRCodeDisplay
   - KeysDisplay

## Action/Loader Modules

### Loaders
1. `loaders/getUser.ts` - Get current authenticated user
2. `loaders/getClients.ts` - Get user's clients
3. `loaders/getClientDetails.ts` - Get details for a specific client
4. `loaders/getQRCode.ts` - Get QR code for client authentication
5. `loaders/checkClientIdAvailability.ts` - Check if a client ID is available

### Actions
1. `actions/createClient.ts` - Create a new client
2. `actions/buyPhoneNumber.ts` - Purchase a new phone number
3. `actions/createGithubRepo.ts` - Create a new GitHub repository from template
4. `actions/setupRepoVariables.ts` - Configure repository variables
5. `actions/generateClientKeys.ts` - Generate and save keys for a client
6. `actions/updateClientSettings.ts` - Update client settings

## Implementation Plan

### Phase 1: Project Setup & Authentication
1. Set up Deco.cx project structure
2. Configure Supabase and create database tables
3. Implement authentication with Supabase
4. Create basic layouts and UI components
5. Set up protected routes

### Phase 2: Client Management
1. Implement client listing functionality
2. Create client details view
3. Implement client creation flow (basic)
4. Create settings pages for clients

### Phase 3: Phone Number Integration
1. Implement phone number purchase API integration
2. Create phone number selection interface
3. Implement existing phone number validation

### Phase 4: GitHub Integration
1. Implement GitHub API for repo creation
2. Create functionality for setting up repository variables
3. Build keys generation and storage

### Phase 5: QR Code & Bot Connection
1. Implement QR code generation and display
2. Create connection status monitoring
3. Build instruction pages for users

### Phase 6: Testing & Polish
1. End-to-end testing of all flows
2. UI/UX improvements
3. Performance optimization
4. Security review

## Client Creation Flow Details

### Step 1: Initial Selection
- User clicks "Create New Client"
- User selects phone number option:
  - A) Buy a new number
  - B) Use existing number

### Step 2A: Buy Phone Number (if selected)
- User selects country/region
- System shows available numbers
- User selects and confirms purchase
- System processes payment and assigns number

### Step 2B: Use Existing Number (if selected)
- User enters phone number
- System validates number format
- User confirms number

### Step 3: Client Setup
1. User enters desired Client ID
   - System checks availability in real-time
   - Must be unique among all users
2. System calls GitHub API to create repository from template
   - Creates private repository under system's GitHub account
   - Uses predefined template repository
3. System configures repository variables
   - Sets CLIENT_ID environment variable
   - Sets other necessary configuration
4. System generates API keys for client
   - Generates secure random keys
   - Stores in database linked to client
5. System generates QR code for WhatsApp authentication
   - Displays to user
   - Monitors connection status
6. Once connected, system shows success and instructions
   - Explains how to use the WhatsApp bot
   - Provides links to documentation

## Technical Considerations
1. **Error Handling**
   - Implement proper error handling for all API calls
   - Create user-friendly error messages
   - Build retry mechanisms where appropriate

2. **Security**
   - Secure all API endpoints
   - Encrypt sensitive data (keys, tokens)
   - Implement rate limiting

3. **Performance**
   - Optimize database queries
   - Implement caching where appropriate
   - Minimize unnecessary rendering

4. **UX Considerations**
   - Clear progress indicators during setup
   - Helpful instructions throughout the process
   - Intuitive navigation between steps 