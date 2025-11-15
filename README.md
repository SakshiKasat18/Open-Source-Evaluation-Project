# 🌿 BreatheGreen

**Make every choice a little lighter.**

A clean, modern carbon footprint decision tool that helps you understand and reduce your environmental impact.

## ✨ Features

### 🔥 Unique Feature 1 — "What If?" Machine
Instantly compare your current travel choices with better alternatives:
- What if you took a bus instead of a car?
- What if you used an EV?
- What if you cycled or walked?

See exactly how much CO₂ you'd save with each better choice.

### 🔥 Unique Feature 2 — "Context Engine"
Get real meaning from your carbon footprint by comparing with:
- **India's yearly average emissions** (4.2 tons per person)
- **UN 2030 per-person carbon target** (2.5 tons per person)

Example: "This one flight = 25% of your UN yearly carbon budget."

### 🔥 Unique Feature 3 — "Weekly Tracker"
Track your carbon footprint over time:
- Click **"Add to my week"** to save your results
- View a bar chart of your entries from the last 7 days
- See total weekly emissions and trends
- Data stored in localStorage for privacy

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- A Climatiq API key (FREE) from https://www.climatiq.io/

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Open-Source-Evaluation-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   echo "CLIMATIQ_API_KEY=your_api_key_here" > .env
   ```

4. **Test the API connection**
   ```bash
   npm run test-api
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open the application**
   - Open `carbon_calculator.html` in your browser
   - Or use a local server: `python -m http.server 8000` and visit `http://localhost:8000/carbon_calculator.html`

### Deploy to Vercel

**Quick Deploy:**
1. Push your code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `CLIMATIQ_API_KEY`
4. Deploy!

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 📱 How to Use

1. **Enter Your Data**
   - Select Individual or Family calculation
   - Enter your travel distance and mode
   - Enter your electricity usage (kWh/month)
   - Select your diet type
   - Enter your waste production (kg/month)

2. **View Your Results**
   - See your total carbon footprint
   - Explore category breakdowns
   - Check greenhouse gas breakdown

3. **Use the "What If?" Machine**
   - See instant comparisons with alternative travel modes
   - Discover potential CO₂ savings

4. **Understand Context**
   - Compare with India's average emissions
   - See how you measure against UN 2030 targets

5. **Track Your Progress**
   - Click "Add to my week" to save your result
   - View your weekly tracker chart
   - Monitor trends over time

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Axios
- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **API**: Climatiq API (carbon emission calculations)
- **Storage**: localStorage (for weekly tracker)

## 📁 Project Structure

```
├── server.js                 # Backend API server
├── carbon_calculator.html    # Main calculator page
├── carbon_calculator.css     # Calculator styles
├── index.html                # Home page
├── index.css                 # Home page styles
├── eco_library.html          # Educational content
├── eco_library.css           # Library styles
├── test-api.js              # API test script
├── package.json             # Dependencies
└── README.md                # This file
```

## 🎨 Design

- **Clean white + green UI** theme
- **Responsive design** for all devices
- **Modern animations** and transitions
- **Accessible** and user-friendly interface

## 📊 Calculation Categories

1. **Travel**: Car, Bus, Train, EV, Scooter, Cycle, Walk
2. **Electricity**: kWh usage per month
3. **Food**: Vegetarian, Mixed, Non-Vegetarian
4. **Waste**: kg per month

## 🌍 Data Sources

- Emission factors from **Climatiq API**
- India's average emissions: 4.2 tons CO₂/year per person
- UN 2030 target: 2.5 tons CO₂/year per person

## 🤝 Team

**Team 60** - Open Source Evaluation Project
- Sakshi
- Nishant
- Shubham
- Guthal

## 📝 License

ISC

## 🔗 Links

- [Climatiq API](https://www.climatiq.io/)
- [Node.js](https://nodejs.org/)

---

**BreatheGreen** — Make every choice a little lighter. 🌿
