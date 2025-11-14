# Daily Carb Tracker - Progressive Web App

A complete meal tracking Progressive Web App (PWA) for tracking daily carbohydrate intake across 7 meal types. Built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

### 🍽️ Meal Tracking System
- Track 7 meal types:
  - Breakfast
  - Intra/Post Workout
  - Lunch
  - Snack 1, Snack 2, Snack 3
  - Dinner
- Set planned carb ranges (min-max) for each meal
- Log actual carbs consumed
- Visual progress indicators for each meal
- Automatic daily total calculation

### 📅 Calendar View
- Monthly calendar interface
- Color-coded days:
  - **Green**: Carbs under or at target
  - **Red**: Carbs over target
  - **Gray**: No data
- Display total carbs on each day
- Click any day to edit meals
- Navigate between months

### 📊 History View
- List view of all tracked days
- Expandable meal breakdowns
- Planned vs actual comparison
- Daily totals display

### 🔄 Copy & Delete Features
- Copy entire day's meal plan to any other day
- Clear individual meals
- Delete entire day's data

### 📱 Mobile Optimization
- Fully responsive design
- Touch-friendly interface
- Large, easily tappable buttons
- Optimized for Android phones

### 💾 PWA Features
- Installable on Android (no browser bar)
- Works offline with service worker
- Standalone display mode
- App icon and splash screen
- Data persists in localStorage

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: localStorage
- **PWA**: Service Worker + Web Manifest
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/solikiev/daylicarb2.git
cd daylicarb2
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/solikiev/daylicarb2)

1. Click the "Deploy" button above, or:
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect Next.js and configure the build
5. Click "Deploy"

Your app will be live in minutes!

### Manual Deployment

```bash
# Build the application
npm run build

# The build output will be in the .next folder
# Deploy this folder to your hosting provider
```

## Installing as PWA on Android

### On Mobile Device:

1. Open the deployed app URL in Chrome on your Android phone
2. Tap the **menu** (three dots) in the top right
3. Select **"Install app"** or **"Add to Home Screen"**
4. Confirm the installation
5. The app will appear on your home screen like a native app
6. Open it - it will run in standalone mode without browser UI!

### Features When Installed:
- No browser address bar or navigation buttons
- Full-screen experience
- Appears in app drawer
- Works offline after first load
- Data persists across sessions

## Project Structure

```
daylicarb2/
├── app/
│   ├── layout.tsx          # Root layout with PWA meta tags
│   ├── page.tsx            # Main app page with navigation
│   └── globals.css         # Global styles
├── components/
│   ├── MealTracker.tsx     # Meal tracking interface
│   ├── CalendarView.tsx    # Monthly calendar
│   ├── HistoryView.tsx     # History list view
│   └── PWAInstaller.tsx    # Service worker registration
├── lib/
│   ├── types.ts            # TypeScript types
│   └── storage.ts          # localStorage utilities
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   └── icons/              # App icons
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── vercel.json             # Vercel configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Usage Guide

### Tracking Meals

1. **Today's View**: Opens to today's date by default
2. **Set Planned Carbs**: Enter min and max values for each meal
3. **Log Actual Carbs**: Enter the actual amount consumed
4. **Visual Feedback**: Progress bars show how you're doing against your plan

### Using the Calendar

1. Click the **"Calendar"** tab
2. View your month at a glance
3. Days are color-coded based on performance
4. Click any day to edit that day's meals

### Viewing History

1. Click the **"History"** tab
2. See all days with logged data
3. Click a day to expand and see meal details
4. Use **"Edit"** to modify a day
5. Use **"Delete"** to remove a day's data

### Copying Data

1. Open the day you want to copy to
2. Use the **"Copy from another day"** dropdown
3. Select the source date
4. Click **"Copy"** - all meal plans are duplicated!

## Data Storage

- All data is stored locally in your browser's localStorage
- Data persists across sessions
- No server or account required
- Export/backup features can be added in the future

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support (PWA installation on Android available)
- **Safari**: Works as web app (iOS PWA has limitations)

## Customization

### Changing Colors

Edit `app/layout.tsx` to change the theme color:
```typescript
themeColor: "#3b82f6"  // Change this hex color
```

### Modifying Meal Types

Edit `lib/types.ts` to change meal types:
```typescript
export const MEAL_TYPES: MealType[] = [
  "Breakfast",
  // Add or modify meal types here
];
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TypeScript
