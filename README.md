# FitTrack – Personal Fitness & Activity Tracker

> **Track. Improve. Stay Consistent.**  
> A modern, responsive personal fitness dashboard built with React, TypeScript, Tailwind CSS, Recharts, and Lucide React. FitTrack helps fitness enthusiasts monitor daily activity, analyze weekly volume, and stay consistent toward health milestones.

---

## 🌟 Project Overview

FitTrack is an offline-ready, responsive personal fitness application designed with a sleek modern dark theme, subtle glassmorphic surfaces, and neon cyan/emerald accents. The application empowers users to seamlessly record workouts, log hydration and sleep, view interactive weekly analytics, manage customizable daily targets, and browse a searchable activity history—with instant persistence via browser LocalStorage.

---

## 🚀 Key Features

### 1. 📊 Executive Dashboard
- **Dynamic Greeting & Live Date**: Automatically greets users based on the time of day and shows the current date.
- **5 Core Fitness Metric Cards**:
  - 👟 **Steps**: Tracked against daily step goal with real-time percentage progress.
  - 🔥 **Active Calories**: Calculated expenditure compared against daily burn goal.
  - ⏱️ **Workout Duration**: Total active exercise minutes.
  - 💧 **Hydration**: Precise water intake in Liters.
  - 🌙 **Sleep & Recovery**: Rest hours monitored against recommended target.
- **Weekly Activity Chart**:
  - Built with Recharts.
  - Interactive multi-metric filtering (**All Metrics**, **Steps**, **Calories**, **Workout Duration**).
  - Target reference lines and custom dark tooltips.
- **Today's Workout Overview**:
  - Live list of today's logged sessions with badges, duration, calories, water, and notes.
  - Quick-edit and instant delete shortcuts.

### 2. ✍️ Add & Edit Activity
- **Comprehensive Activity Logging**:
  - **Date Picker** with quick "Today" and "Yesterday" shortcuts.
  - **Workout Type Dropdown**: Running, Walking, Cycling, Gym, Yoga, Swimming, Sports, and Other.
  - **Workout Duration**: In minutes, with quick-select chip increments (+15m, +30m, +45m, +60m).
  - **Steps**: With one-click presets (2,500, 5,000, 8,000, 10,000).
  - **Calories Burned**: In kcal.
  - **Water Intake**: In Liters (+0.5L increments).
  - **Sleep Hours**: Hours rested (0–24h validation).
  - **Personal Notes**: Optional reflection on workout intensity, mood, and achievements.
- **Robust Validation**: Rejects negative inputs, validates reasonable sleep hours, and ensures mandatory dates.
- **Immediate Feedback**: Toast notification upon saving, immediate recalculation of dashboard and progress charts.

### 3. 📈 Progress & Analytics
- **Fitness Statistics Grid**:
  - Total weekly steps
  - Total calories burned
  - Total workout minutes
  - Average daily steps
  - Average sleep hours
  - Average water intake
- **4 Interactive Visualizations**:
  1. **Weekly Steps Distribution Bar Chart** with target reference line.
  2. **Weekly Calorie Burn Trend Curve** with glowing data points.
  3. **Daily Workout Duration Bar Chart**.
  4. **Workout Variety Breakdown Donut Chart** visualizing time spent across workout disciplines.
- **Composite Score**: Overview of daily goal fulfillment across all 5 health pillars.

### 4. 🗂️ Searchable Activity History
- **Dual Presentation**:
  - High-density tabular layout on desktop.
  - Touch-friendly card view on mobile devices.
- **Filtering & Search**:
  - Real-time search across workout types and journal notes.
  - Filter by workout discipline (Running, Gym, Cycling, etc.).
  - Date filter for inspecting specific days.
  - Toggle sort order (Newest First / Oldest First).
- **CRUD Operations**:
  - In-place editing modal with prefilled data.
  - Deletion with an accessible confirmation dialog.
  - **Export to JSON**: One-click backup of all activity history.

### 5. 🎯 Customizable Goals
- **Personalized Targets**:
  - Steps (default: 10,000)
  - Calories (default: 500 kcal)
  - Workout Duration (default: 60 min)
  - Water Intake (default: 3.0 L)
  - Sleep (default: 8.0 hrs)
- **Goal Presets**: Light, Standard, and Intense athlete presets.
- **Live Recalculation**: Changing goals immediately updates progress bar percentages throughout the dashboard and analytics pages.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with custom glassmorphism and animations |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Visualizations** | [Recharts 2.x](https://recharts.org/) |
| **State & Persistence** | React Context API + Browser `localStorage` |

---

## 💾 How LocalStorage Persistence Works

FitTrack is designed to be 100% functional without requiring external servers or accounts:

1. **Storage Keys**:
   - `fittrack_activities_v1`: Stores an array of activity objects serialized as JSON.
   - `fittrack_goals_v1`: Stores the user's custom daily goals.
   - `fittrack_seeded_v1`: Tracks whether initial demonstration data has been initialized.
2. **First-Launch Seeding**:
   - On the very first visit, FitTrack seeds realistic workouts for the past 7 days up to today so that charts and progress bars are immediately alive and interactive.
   - Subsequent page reloads and browser restarts preserve existing data without overwriting.
   - Users can reset to sample data anytime via the **Reset Demo Data** button in the header or sidebar.
3. **Multi-Session Daily Aggregation**:
   - When users log multiple workouts on the same date (e.g., morning run + evening gym session), the `groupActivitiesByDate` calculation utility accurately sums steps, calories, duration, and water, while recording the peak/latest sleep value.

---

## 📁 Project Structure

```
c:/Users/venka/OneDrive/Desktop/Fitness/
├── index.html                   # HTML entry point with Google Fonts & metadata
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript root configuration
├── tsconfig.app.json            # Application compiler options (verbatimModuleSyntax)
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── public/
│   ├── favicon.svg              # FitTrack custom pulse SVG icon
│   └── icons.svg
├── src/
│   ├── main.tsx                 # React DOM mount
│   ├── App.tsx                  # Root component & page layout shell
│   ├── index.css                # Tailwind CSS v4 setup and glassmorphic utilities
│   ├── types/
│   │   └── fitness.ts           # Activity, Goal, Metric, and Filter types
│   ├── utils/
│   │   ├── formatters.ts        # Date, number, decimal, and workout style helpers
│   │   ├── storage.ts           # LocalStorage CRUD and sample data generator
│   │   └── calculations.ts      # Multi-activity aggregations, chart data, streaks
│   ├── context/
│   │   └── FitnessContext.tsx   # React Context provider with reactive actions
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx           # Responsive header with greeting and quick log
│   │   │   ├── Sidebar.tsx          # Desktop sidebar navigation with streak badge
│   │   │   ├── MobileNavigation.tsx # Mobile bottom navigation bar
│   │   │   ├── StatCard.tsx         # Metric summary card with progress bar
│   │   │   ├── ProgressBar.tsx      # Reusable multi-color progress indicator
│   │   │   ├── ConfirmDialog.tsx    # Accessible modal for deletion confirmations
│   │   │   ├── Toast.tsx            # Floating notification banner container
│   │   │   ├── EmptyState.tsx       # Polished fallback view for zero records
│   │   │   └── Footer.tsx           # Brand footer with motto and security badge
│   │   ├── dashboard/
│   │   │   ├── WeeklyActivityChart.tsx # Filterable Recharts composed visualization
│   │   │   └── TodayWorkoutList.tsx    # List of today's workout sessions
│   │   └── forms/
│   │       └── ActivityForm.tsx        # Add / Edit form with validation & chips
│   └── pages/
│       ├── DashboardPage.tsx    # Core executive dashboard
│       ├── AddActivityPage.tsx  # Dedicated logging interface
│       ├── ProgressPage.tsx     # Comprehensive analytics & 4 Recharts graphs
│       ├── HistoryPage.tsx      # Searchable, filterable table/card history
│       └── GoalsPage.tsx        # Customizable target manager
└── README.md
```

---

## 🏃 Getting Started & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) version 18 or higher (Node 20+ recommended)
- `npm` (comes with Node.js)

### Installation
1. Clone or navigate to the repository directory:
   ```bash
   cd c:/Users/venka/OneDrive/Desktop/Fitness
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

### Production Build
To create an optimized, minified production build:
```bash
npm run build
```
To preview the production bundle locally:
```bash
npm run preview
```

---

## 📱 Responsive Testing Breakdown

FitTrack is designed mobile-first and tested across standard device breakpoints:
- **Mobile (375px - 640px)**: Compact vertical cards, bottom navigation bar with floating quick-add button, responsive Recharts charts, and touch-friendly controls.
- **Tablet (768px - 1023px)**: 2-column grid metrics, collapsible layout, optimized table overflow.
- **Desktop (1024px - 1440px+)**: Sleek left sidebar navigation, 5-column metric summary cards, multi-column dashboard grid, full table view in History, and side-by-side analytics charts.

---

## 🔮 Future Improvements & Roadmap

- [ ] **Wearable API Integrations**: Sync steps directly with Apple HealthKit, Google Fit, or Strava.
- [ ] **Meal & Nutrition Tracker**: Macro tracking (Proteins, Carbs, Fats) alongside calories.
- [ ] **GPS Workout Tracking**: Interactive map integration for outdoor running and cycling routes.
- [ ] **Weekly PDF Reports**: Export professional weekly progress summaries for personal trainers or coaches.
- [ ] **PWA (Progressive Web App)**: Service worker installation for native app-like experience on iOS and Android.

---

## 📄 License & Attribution

FitTrack is created as an open-source demonstration fitness project.  
**FitTrack • Track. Improve. Stay Consistent.**
