<<<<<<< HEAD
# CareerCompass2 🧭

**AI-Powered Career Guidance Platform for High School Students**

CareerCompass2 helps NYC high school students discover their career passion through AI-powered assessments, personalized job recommendations, mentorship opportunities, and scholarship resources.

## ✨ Features

### 🎯 **Smart Career Assessment**
- **Dual Assessment Types**: Quick (5 questions) and Comprehensive (12 research-based questions)
- **AI-Powered Matching**: Uses Gemini 2.5 Flash for intelligent career recommendations
- **Psychological Profiling**: Based on validated career psychology research

### 💼 **Job Discovery**
- **Real-Time Job Search**: Integration with JSearch, Reed, and other job APIs
- **Location-Based Results**: Focused on NYC and remote opportunities
- **Quick Career Search**: One-click job searches for favorite careers

### 📈 **Career Planning**
- **Detailed Career Roadmaps**: Step-by-step guidance from high school to career success
- **Career Favorites**: Save and track preferred career paths
- **Growth & Salary Data**: Comprehensive career outlook information

### 🤝 **Community & Mentorship**
- **Forum Discussions**: Connect with peers and mentors
- **Q&A Platform**: Get advice on career decisions
- **Networking Opportunities**: Build professional connections

### 🎓 **Scholarship Resources**
- **Curated Scholarships**: Opportunities relevant to career interests
- **Application Tracking**: Manage scholarship applications
- **Deadline Reminders**: Never miss important dates

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **AI Integration**: Google Gemini 2.5 Flash API
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Job APIs**: JSearch (RapidAPI), Reed.co.uk
- **Routing**: React Router v6 with future flags

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Firebase account (optional, for auth/database)
- API keys (see environment setup below)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/CareerCompass2.git
cd CareerCompass2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

Fill in your API keys in `.env`:
```bash
# Required for AI career matching
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Enhanced job search
VITE_JSEARCH_API_KEY=your_jsearch_api_key_here
VITE_REED_API_KEY=your_reed_api_key_here

# Optional: User authentication and data persistence
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 API Setup Guide

For detailed API setup instructions, see [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)

### Required APIs:
- **Gemini AI**: Essential for career matching (free tier available)

### Optional APIs:
- **JSearch (RapidAPI)**: Enhanced job search capabilities
- **Reed.co.uk**: UK-focused job listings
- **Firebase**: User authentication and data persistence

## 🏗️ Build & Deployment

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

## 🎯 Usage

1. **Take Assessment**: Start with either Quick or Comprehensive assessment
2. **Explore Careers**: Review AI-generated career matches with detailed information
3. **Plan Your Path**: Access step-by-step career roadmaps
4. **Find Jobs**: Search for relevant job opportunities
5. **Connect**: Join community discussions and find mentors
6. **Apply**: Discover and track scholarship opportunities

## 🔒 Security & Privacy

- **API Key Protection**: All sensitive keys are environment variables
- **Firebase Security Rules**: Proper access controls for user data
- **Client-Side Security**: No sensitive operations on frontend
- **HTTPS Only**: All API communications over secure connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🎉 Acknowledgments

- **shadcn/ui**: Beautiful and accessible UI components
- **Google Gemini**: Powerful AI for career matching
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful open-source icons

---

**Made with ❤️ for NYC High School Students**
