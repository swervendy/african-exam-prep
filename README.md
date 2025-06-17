# African Exam Prep

A world-class African exam preparation and tutoring platform powered by AI. Practice JAMB questions and get personalized tutoring for free.

## 🚀 Features

### 📚 Test Practice
- **Multiple Subjects**: English, Mathematics, Biology, Physics, Chemistry, and more
- **Past Questions**: Access to real JAMB past questions
- **Adaptive Learning**: Questions are shuffled for better practice
- **Score Tracking**: Monitor your progress with detailed scoring
- **Session Management**: Track your study sessions and progress

### 🤖 AI Tutoring
- **Personalized Explanations**: Get detailed explanations for any question
- **Step-by-Step Guidance**: Break down complex problems
- **Conversation History**: Review your tutoring sessions
- **Voice Synthesis**: Listen to explanations (coming soon)

### 📱 User Experience
- **Mobile-First Design**: Optimized for mobile devices
- **Dark Mode Support**: Comfortable viewing in any lighting
- **Responsive Layout**: Works seamlessly across all devices
- **Accessibility**: Built with accessibility in mind

## 🛠️ Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **FontAwesome** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **OpenAI GPT-4** - AI-powered tutoring
- **Vercel Postgres** - Primary database
- **MongoDB** - Additional data storage
- **Azure Blob Storage** - File storage

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/africanexamprep.git
   cd africanexamprep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Database
   POSTGRES_URL=your_postgres_connection_string
   MONGODB_URI=your_mongodb_connection_string
   
   # Azure Blob Storage
   AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
   AZURE_STORAGE_CONTAINER_NAME=your_container_name
   
   # Vercel
   VERCEL_BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout component
│   ├── MessageForm.tsx # Message input component
│   ├── MessageList.tsx # Message display component
│   └── ErrorBoundary.tsx # Error handling
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   ├── index.tsx      # Home page
│   ├── test.tsx       # Subject selection
│   ├── quiz.tsx       # Quiz interface
│   ├── review.tsx     # Results review
│   └── tutor.tsx      # AI tutoring
├── lib/               # Utility functions
│   └── util.ts        # Helper functions
└── utils/             # Additional utilities
    ├── dbConnect.ts   # Database connection
    ├── sendMessage.ts # Message sending logic
    └── useMessages.tsx # Custom hook for messages
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure environment variables**
   - Add all environment variables in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📝 API Documentation

### Endpoints

#### `GET /api/fetchJambQuestions`
Fetch questions for a specific subject.

**Parameters:**
- `subject` (string): Subject name (e.g., "english", "mathematics")
- `num` (number): Number of questions to fetch

**Response:**
```json
{
  "data": [
    {
      "question": "What is...",
      "option": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "answer": "A"
    }
  ]
}
```

#### `POST /api/storeSession`
Store a new user session.

**Body:**
```json
{
  "userUUID": "user-uuid",
  "sessionTimestamp": 1234567890,
  "sessionID": "user-uuid-1234567890",
  "selectedSubject": "english",
  "questionCount": 10
}
```

#### `POST /api/createMessage`
Create a new AI tutoring message.

**Body:**
```json
{
  "message": "User question here",
  "sessionID": "session-id"
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- **TypeScript**: All new code should be written in TypeScript
- **Component Structure**: Keep components under 200 lines
- **Mobile First**: Design for mobile devices first
- **Testing**: Add tests for new features
- **Documentation**: Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **JAMB**: For providing past questions
- **OpenAI**: For AI-powered tutoring capabilities
- **Vercel**: For hosting and deployment
- **Contributors**: Everyone who has contributed to this project

## 📞 Support

If you have any questions or need help:

- **Issues**: [GitHub Issues](https://github.com/yourusername/africanexamprep/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/africanexamprep/discussions)
- **Email**: support@africanexamprep.com

---

Made with ❤️ for African students