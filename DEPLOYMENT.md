# 🚀 Deployment Guide for BreatheGreen

This guide will help you deploy BreatheGreen to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Climatiq API Key**: Get a free key from [climatiq.io](https://www.climatiq.io/)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add a new variable:
     - **Name**: `CLIMATIQ_API_KEY`
     - **Value**: Your Climatiq API key
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variable**
   ```bash
   vercel env add CLIMATIQ_API_KEY
   # Enter your API key when prompted
   ```

5. **Redeploy with Environment Variable**
   ```bash
   vercel --prod
   ```

## Project Structure for Vercel

```
├── api/
│   └── calculate.js          # Serverless function
├── vercel.json               # Vercel configuration
├── index.html                # Home page
├── carbon_calculator.html    # Calculator page
├── eco_library.html          # Library page
├── *.css                     # Stylesheets
├── package.json              # Dependencies
└── README.md                 # Documentation
```

## Environment Variables

Make sure to set the following environment variable in Vercel:

- `CLIMATIQ_API_KEY`: Your Climatiq API key

## Testing After Deployment

1. Visit your deployed URL
2. Go to the Carbon Calculator page
3. Fill in the form and submit
4. Verify that:
   - Results are displayed correctly
   - Charts are rendered
   - "What If?" Machine shows comparisons
   - Context Engine displays India/UN comparisons
   - Weekly Tracker works (localStorage)

## Troubleshooting

### API Not Working
- Check that `CLIMATIQ_API_KEY` is set in Vercel environment variables
- Verify the API key is valid by testing locally first
- Check Vercel function logs in the dashboard

### Static Files Not Loading
- Ensure all HTML/CSS files are in the root directory
- Check that `vercel.json` routes are configured correctly

### CORS Errors
- The serverless function includes CORS headers
- If issues persist, check browser console for specific errors

## Local Development vs Production

- **Local**: Uses `server.js` with Express on port 3001
- **Production**: Uses Vercel serverless function at `/api/calculate.js`
- The frontend automatically detects the environment and uses the correct API URL

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test API endpoint directly: `https://your-project.vercel.app/api/calculate`
4. Check browser console for frontend errors

---

**Happy Deploying! 🌿**

