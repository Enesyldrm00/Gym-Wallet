# GymFuel-Stellar 🏋️⚡

A fitness-themed tip jar dApp built on Stellar blockchain for the White Belt Challenge.

## Features

- 🔐 Freighter Wallet Integration
- 💪 Gym-themed Dark Mode UI
- ⚡ Neon Green Accents & Effects
- 📊 Weekly Progress Tracking (placeholder)
- 📸 Daily Pump Photo Cards (placeholder)

## Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Blockchain**: Stellar SDK
- **Wallet**: @stellar/freighter-api
- **Icons**: Lucide-react

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Freighter Wallet Extension ([Download](https://www.freighter.app/))

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Project Structure

```
src/
├── components/     # React components
│   ├── Navbar.jsx
│   ├── WeeklyProgress.jsx
│   └── DailyPump.jsx
├── context/        # Global state management
│   └── WalletContext.jsx
├── hooks/          # Custom React hooks (for future use)
├── utils/          # Utility functions & services
│   └── stellarService.js
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Architecture

The app follows a clean separation of concerns:
- **UI Components**: Pure presentation components
- **Context API**: Global wallet state management
- **Services**: Stellar network operations (to be implemented)

## Roadmap

- [ ] Implement tip sending functionality
- [ ] Add transaction history
- [ ] Integrate real progress tracking
- [ ] Photo upload for Daily Pump
- [ ] Multi-recipient support

## Built for Stellar White Belt Challenge 🥋

---

**License**: MIT
