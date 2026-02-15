# GymFuel-Stellar

The World's First Decentralized Tipping Platform for Athletes. Built on the Stellar Blockchain to enable near-instant, low-fee micro-payments for fitness content creators and athletes.

## Features

###  Wallet Integration
- **Freighter Wallet** connection with persistent sessions
- Real-time balance display
- Account activation detection (Friendbot integration)

###  Tip/Payment System
- Quick tip buttons (1, 5, 10 XLM)
- Stellar blockchain transactions with memos
- Transaction status tracking (signing, submitting, confirmed)
- Direct links to Stellar.Expert for verification
- Secure environment variable configuration

###  Transaction History
- Real-time transaction feed ("Recent Gains")
- Incoming/outgoing transaction indicators
- Human-readable timestamps
- Memo display
- Last 10 transactions with auto-refresh

### Dynamic Progress Tracking
- **Weekly Progress**: Tracks tips sent in last 7 days (target: 10/week)
- Dynamic progress bar with percentage
- Motivational messages based on progress

###  Workout Log
- Photo upload with FileReader API (base64 conversion)
- 200-character workout notes
- localStorage persistence (survives page refresh)
- Image preview before posting
- History gallery with delete functionality  
- Responsive 2-column grid layout

###  UI/UX
- Gym-themed dark mode with neon green accents
- Glassmorphism effects
- Smooth transitions and animations
- Responsive design (mobile-first)
- Loading states and error handling

## Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Blockchain**: Stellar SDK (stellar-sdk@11.2.2)
- **Wallet**: @stellar/freighter-api
- **Icons**: Lucide-react
- **State Management**: React Context API
- **Storage**: localStorage (workout logs, wallet persistence)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Freighter Wallet Extension ([Download](https://www.freighter.app/))
- Stellar testnet account with XLM (use Friendbot for funding)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd Gym-Wallet

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your recipient Stellar address

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Environment Setup

Create a `.env` file in the project root:

```bash
# Recipient Stellar Public Key (Testnet)
VITE_RECIPIENT_ADDRESS=YOUR_STELLAR_PUBLIC_KEY_HERE
```

**Security**: Never commit `.env` to Git! It's already in `.gitignore`.

## Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.jsx      # Top navigation with wallet connection
│   ├── PowerLevel.jsx  # Balance display
│   ├── TipButtons.jsx  # Quick tip interface
│   ├── TransactionStatus.jsx  # Transaction modal
│   ├── TransactionList.jsx    # Transaction history
│   ├── WeeklyProgress.jsx     # Dynamic weekly stats
│   ├── DailyPump.jsx          # Stats dashboard
│   └── WorkoutLog.jsx         # Photo upload & history
├── context/           # Global state management
│   └── WalletContext.jsx  # Wallet & transaction state
├── services/          # Blockchain services
│   └── StellarService.js  # Stellar API integration
├── config/           # App configuration
│   └── config.js    # Stellar network settings
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Architecture

### State Management
- **Context API**: Global wallet state (publicKey, balance, transactions)
- **localStorage**: Workout logs, wallet persistence
- Custom events for cross-component updates

### Data Flow
```
User Action → WalletContext → StellarService → Horizon API
                    ↓
              UI Components
```

### Stellar Integration
- **Network**: Testnet (configurable for mainnet)
- **Operations**: Payment transactions with memos
- **APIs**: Horizon (account queries, transaction submission)

## Key Features Deep Dive

### Transaction System
1. User clicks tip amount
2. `StellarService` builds transaction
3. Freighter signs transaction
4. Submit to Stellar network
5. Update balance & history

### Workout Log System
1. User uploads image
2. FileReader converts to base64
3. Save to localStorage
4. Display in gallery
5. Cross-component sync via events

### Weekly Progress
- Filters transactions from last 7 days
- Calculates percentage: `(count / 10) * 100`
- Dynamic messages based on progress

## Development Roadmap

**Completed** ✅:
- [x] Freighter wallet integration
- [x] Tip sending functionality  
- [x] Transaction history
- [x] Real progress tracking
- [x] Photo upload for workouts
- [x] Environment variable security
- [x] localStorage persistence

**Future Enhancements** 🚀:
- [ ] Multi-recipient support
- [ ] NFT badges for milestones
- [ ] Social features (leaderboards)
- [ ] Mainnet deployment
- [ ] Workout streak calculation
- [ ] Export/import workout history

## Testing

### Manual Testing Checklist

**Wallet**:
- [ ] Connect Freighter wallet
- [ ] Disconnect wallet
- [ ] Persistent connection (refresh page)

**Transactions**:
- [ ] Send 1 XLM tip
- [ ] Send 5 XLM tip
- [ ] Send 10 XLM tip
- [ ] Check transaction on Stellar.Expert
- [ ] Verify balance updates

**Workout Log**:
- [ ] Upload image (< 5MB)
- [ ] Add workout note
- [ ] Post update
- [ ] View in history
- [ ] Delete log

**Progress**:
- [ ] Send multiple tips, watch weekly progress update
- [ ] Check tip counter in Daily Pump
- [ ] Verify workout days counter

## Deployment

### Environment Variables (Production)

For production deployment, set these environment variables in your hosting platform:

```bash
VITE_RECIPIENT_ADDRESS=<your-mainnet-public-key>
```

**Platforms**:
- **Vercel**: Dashboard → Environment Variables
- **Netlify**: Site settings → Environment
- **GitHub Pages**: Use GitHub Secrets

### Build

```bash
npm run build
```

Output in `dist/` directory.

## Security Best Practices

 **Implemented**:
- Environment variables for sensitive data
- `.gitignore` protects `.env`
- No private keys in code  
- Optional chaining for safe data access
- Input validation (file size, type)

 **Never Do**:
- Commit `.env` file
- Store private keys in frontend
- Trust user input without validation

## Built for Stellar White Belt Challenge 🥋

This project demonstrates:
- Stellar SDK integration
- Freighter wallet connectivity
- Payment transactions
- Horizon API usage
- Best practices for Web3 dApps

---

**License**: MIT  
**Author**: [Your Name]  
**Network**: Stellar Testnet (ready for mainnet)
