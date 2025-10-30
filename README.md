# CareerCompass

**AI-Powered Career Guidance Platform for High School Students**

CareerCompass helps NYC high school students discover their career passion through AI-powered assessments, personalized job recommendations, mentorship opportunities, and scholarship resources.

## Features

### **Smart Career Assessment**
- **Dual Assessment Types**: Quick (5 questions) and Comprehensive (12 research-based questions)
- **AI-Powered Matching**: Uses Gemini 2.5 Flash for intelligent career recommendations
- **Psychological Profiling**: Based on validated career psychology research

### **Job Discovery**
- **Real-Time Job Search**: Integration with JSearch, Reed, and other job APIs
- **Location-Based Results**: Focused on NYC and remote opportunities
- **Quick Career Search**: One-click job searches for favorite careers

### **Career Planning**
- **Detailed Career Roadmaps**: Step-by-step guidance from high school to career success
- **Career Favorites**: Save and track preferred career paths
- **Growth & Salary Data**: Comprehensive career outlook information

### **Community & Mentorship**
- **Forum Discussions**: Connect with peers and mentors
- **Q&A Platform**: Get advice on career decisions
- **Networking Opportunities**: Build professional connections

### **Scholarship Resources**
- **Curated Scholarships**: Opportunities relevant to career interests
- **Application Tracking**: Manage scholarship applications
- **Deadline Reminders**: Never miss important dates

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **AI Integration**: Google Gemini 2.5 Flash API
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Job APIs**: JSearch (RapidAPI), Reed.co.uk
- **Routing**: React Router v6 with future flags

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Firebase account (optional, for auth/database)
- API keys (see environment setup below)

### 1. Clone Repository
```bash
git clone https://github.com/iattia/CareerCompass.git
cd CareerCompass
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Setup Guide

For detailed API setup instructions, see [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)

### Required APIs:
- **Gemini AI**: Essential for career matching (free tier available)

### Optional APIs:
- **JSearch (RapidAPI)**: Enhanced job search capabilities
- **Reed.co.uk**: UK-focused job listings
- **Firebase**: User authentication and data persistence

## Build & Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag & drop the `dist` folder or connect GitHub
- **Firebase Hosting**: `firebase deploy` after setup
- **GitHub Pages**: Enable in repository settings

## Usage

1. **Take Assessment**: Start with either Quick or Comprehensive assessment
2. **Explore Careers**: Review AI-generated career matches with detailed information
3. **Plan Your Path**: Access step-by-step career roadmaps
4. **Find Jobs**: Search for relevant job opportunities
5. **Connect**: Join community discussions and find mentors
6. **Apply**: Discover and track scholarship opportunities

