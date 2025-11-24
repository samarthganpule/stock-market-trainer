# MyStockTrainer 📈

A modern stock market tracking application built with React, Vite, and Firebase. Monitor real-time stock prices, visualize trends with interactive charts, and build your personalized watchlist.

## Features

- 🔍 Real-time stock price search
- 📊 Interactive 7-day price charts
- ⭐ Personal watchlist management
- 🕒 Recent search history
- 🔐 Firebase authentication
- 🎨 Modern, responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Finnhub API key (free tier available)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the client directory with your API keys:
```env
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

3. Run the development server:
```bash
npm run dev
```

## API Information

### Finnhub API

This app uses the [Finnhub API](https://finnhub.io/) for stock data. The free tier includes:
- 60 API calls/minute
- Real-time stock quotes
- Historical data

**Important Notes:**
- If you hit the rate limit (403 error), the app will use simulated data for charts
- Get your free API key at: https://finnhub.io/register
- Popular stock symbols to try: AAPL, MSFT, GOOGL, TSLA, AMZN, META, NVDA

### Rate Limit Handling

The app automatically falls back to mock data when API limits are reached, so you can continue testing the UI and functionality.

## Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS
- **Charts:** Chart.js, react-chartjs-2
- **Authentication:** Firebase Auth
- **API:** Finnhub Stock API
- **Routing:** React Router

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── StockChart.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
├── public/
└── .env
```
