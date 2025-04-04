# CryptoWeather Nexus

A modern web application that combines real-time weather data, cryptocurrency information, and news updates in a single dashboard.

## Features

- Real-time cryptocurrency price updates via WebSocket
- Live weather data for multiple cities
- Latest crypto news updates
- Responsive design for all devices
- Dark mode support
- Favorite tracking for both cities and cryptocurrencies

## Prerequisites

Before you begin, ensure you have:

- Node.js 16.8 or later
- npm or yarn package manager
- API keys for:
  - OpenWeather API
  - NewsData.io API

## Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd cryptoweather-nexus
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Deploy to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Sign up or log in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - Add `NEXT_PUBLIC_OPENWEATHER_API_KEY`
     - Add `NEXT_PUBLIC_NEWSDATA_API_KEY`
   - Click "Deploy"

Your application will be automatically deployed and available at a Vercel URL.

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_OPENWEATHER_API_KEY`: Your OpenWeather API key
- `NEXT_PUBLIC_NEWSDATA_API_KEY`: Your NewsData.io API key

## Built With

- Next.js 14
- React 18
- Redux Toolkit
- Tailwind CSS
- Socket.io Client
- Chart.js
- React Hot Toast

## License

This project is licensed under the MIT License.
