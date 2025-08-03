# Tendly 🌱

A mobile-first productivity app where users grow a digital garden by completing tasks, maintaining focus, and avoiding distractions. Built with Expo React Native and integrated with XION's Mobile Development Kit and zkTLS for blockchain-verified achievements.

## Features

### Core Functionality
- **Digital Garden**: Each completed task becomes a plant that grows over time
- **Focus Timer**: Pomodoro-style timer with plant growth rewards
- **Task Management**: Prioritized task system with category organization
- **Mood-Based Weather**: Garden atmosphere reflects user's daily mood
- **Compost Currency**: Earn rewards for completing tasks and maintaining streaks
- **Social Sharing**: Share garden achievements with the community

### Gamification Elements
- **Plant Types**: Different priorities create different plants (sprouts, flowers, trees)
- **Growth System**: Plants grow based on task completion and focus sessions
- **Achievements**: Unlock badges and rare seeds through milestones
- **Leaderboards**: Weekly challenges and community rankings
- **Rare Seeds**: Special plants for exceptional achievements

### Blockchain Integration
- **XION Wallet**: Seamless mobile wallet integration
- **zkTLS Verification**: Cryptographic proofs for task completion and focus sessions
- **Smart Contracts**: On-chain storage of achievements and garden state
- **Verifiable Achievements**: Tamper-proof record of productivity milestones

## Technology Stack

- **Framework**: Expo React Native with TypeScript
- **Navigation**: Expo Router with tab-based architecture
- **Animations**: React Native Reanimated & Gesture Handler
- **Blockchain**: XION Mobile Development Kit (Dave)
- **Privacy**: zkTLS for verifiable task completion
- **Design**: Custom components with earthy, calming aesthetic

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI or EAS CLI
- XION Mobile Development Kit account
- zkTLS provider access

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Blockchain Setup

#### XION Integration
1. Sign up for XION Mobile Development Kit at [xion.burnt.com](https://xion.burnt.com)
2. Install the XION Mobile SDK:
```bash
npm install @xion/mobile-sdk
```
3. Configure your app ID in `services/xionService.ts`

#### zkTLS Integration
1. Set up zkTLS provider account
2. Add your API key to environment variables:
```
EXPO_PUBLIC_ZKTLS_API_KEY=your_api_key_here
```
3. Configure the zkTLS service in `services/zkTLSService.ts`

#### Smart Contract Deployment
1. Deploy the Task Garden smart contract to XION testnet
2. Update the contract address in `services/smartContractService.ts`
3. Test all blockchain interactions in development

## Architecture

### Component Structure
```
app/
├── (tabs)/
│   ├── index.tsx          # Garden view
│   ├── tasks.tsx          # Task management
│   ├── focus.tsx          # Focus timer
│   ├── social.tsx         # Community features
│   └── profile.tsx        # User profile & achievements

components/
├── GardenPlant.tsx        # Individual plant component
├── WeatherMood.tsx        # Mood selector
└── CompostCounter.tsx     # Currency display

services/
├── xionService.ts         # XION wallet integration
├── zkTLSService.ts        # zkTLS proof generation
└── smartContractService.ts # Smart contract interactions

hooks/
└── useTaskGarden.ts       # Main state management hook
```

### Key Features Implementation

#### Task-to-Plant System
- Tasks are categorized by priority (low = sprout, medium = flower, high = tree)
- Completion triggers plant creation in the garden
- Growth continues based on focus sessions and streaks

#### Focus Timer with Rewards
- 25-minute Pomodoro sessions with customizable breaks
- Plant growth animations during successful sessions
- zkTLS proofs verify genuine focus time (no app switching)

#### Blockchain Verification
- All major achievements are recorded on XION blockchain
- zkTLS provides cryptographic proof of task completion
- Smart contracts manage compost currency and rare seed distribution

#### Social Features
- Community garden sharing
- Weekly challenges and leaderboards
- Achievement verification through blockchain

## Design Philosophy

The app uses a calm, nature-inspired aesthetic with:
- **Colors**: Sage greens (#87A96B), warm browns (#8B7355), soft creams (#F5F1E8)
- **Typography**: Accessible fonts with clear hierarchy
- **Animations**: Gentle, organic movements that feel natural
- **Spacing**: Consistent 8px grid system for visual harmony

## Business Model

### Freemium Structure
- **Free Tier**: Basic task management, standard plants, limited social features
- **Premium Tier**: Rare seeds, custom themes, advanced analytics, priority support

### Revenue Streams
- Monthly/yearly premium subscriptions
- Rare seed packs (special plant varieties)
- Custom garden themes and sound packs
- Corporate wellness program licensing

## Target Audience

- **Primary**: Students, remote workers, creatives aged 20-35
- **Secondary**: ADHD/neurodivergent users seeking gamified productivity
- **Use Cases**: Study sessions, work focus, habit building, wellness tracking

## Development Notes

### Current Status
This implementation provides a fully functional MVP with:
- ✅ Complete UI/UX for all core features
- ✅ Task management with gamification
- ✅ Focus timer with animations
- ✅ Social features and community aspects
- ✅ Placeholder blockchain integration
- ⚠️ Requires XION SDK setup for full blockchain functionality
- ⚠️ Requires zkTLS provider configuration

### Next Steps
1. **Integrate XION Mobile Development Kit**
   - Install official XION SDK
   - Configure wallet connection
   - Test blockchain transactions

2. **Set up zkTLS Provider**
   - Choose zkTLS implementation (Reclaim Protocol, etc.)
   - Implement proof generation for focus sessions
   - Add verification for task completion

3. **Deploy Smart Contracts**
   - Create Task Garden contract on XION
   - Implement compost token mechanics
   - Add achievement NFT system

4. **Production Readiness**
   - Add comprehensive error handling
   - Implement offline-first architecture
   - Add analytics and crash reporting
   - Optimize performance for lower-end devices

### Known Limitations
- Blockchain features are currently mocked for demonstration
- Real-time plant growth requires background processing
- Social features need backend infrastructure
- Push notifications require additional setup

## Contributing

This app demonstrates advanced mobile development patterns:
- Modular architecture with clear separation of concerns
- Type-safe blockchain integration
- Privacy-preserving verification systems
- Accessibility-first design principles

The codebase is structured for easy extension and modification, making it an excellent foundation for a production productivity app with blockchain features.
