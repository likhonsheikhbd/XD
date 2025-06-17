# Next.js AI Coding Assistant

A powerful AI-powered coding assistant built with Next.js 14, featuring real-time code generation, editing, and preview capabilities powered by Google's Gemini AI.

## 🚀 Features

### Core Functionality
- **AI-Powered Code Generation**: Generate code in multiple programming languages using Google Gemini AI
- **Real-time Code Editing**: Advanced code editor with syntax highlighting, auto-completion, and error detection
- **Live Preview**: Instant preview of HTML/CSS/JavaScript projects with responsive viewport testing
- **Intelligent Chat Interface**: Context-aware conversations with code understanding
- **Multi-file Support**: Create, edit, and manage multiple files simultaneously

### Advanced Features
- **Code Explanation**: Get detailed explanations of complex code snippets
- **Debugging Assistance**: AI-powered debugging and error resolution
- **Code Optimization**: Performance optimization suggestions and refactoring
- **Multi-language Support**: JavaScript, TypeScript, Python, HTML, CSS, and more
- **Framework Integration**: Support for React, Vue, Angular, and other popular frameworks

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: System-aware theme switching with custom accent colors
- **Keyboard Shortcuts**: Comprehensive keyboard navigation and shortcuts
- **Auto-save**: Automatic saving of work with conversation history
- **Error Boundaries**: Robust error handling and recovery

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **AI Integration**: Vercel AI SDK, Google Gemini AI
- **Code Editor**: CodeMirror 6 with language support
- **Preview**: Sandpack for live code execution
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand with persistence
- **Development**: ESLint, Prettier, Jest for testing

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm package manager
- Google AI API key (Gemini)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nextjs-ai-coding-assistant.git
cd nextjs-ai-coding-assistant
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

To get your Google AI API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your environment file

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Basic Usage

1. **Start a Conversation**: Type your coding request in the chat interface
2. **Generate Code**: Ask the AI to create functions, components, or entire applications
3. **Edit Code**: Use the integrated editor to modify generated code
4. **Preview Results**: See your changes live in the preview panel
5. **Save & Export**: Download your files or save your progress

### Example Prompts

```
"Create a React component for a todo list with add, delete, and toggle functionality"

"Generate a Python function to sort a list of dictionaries by a specific key"

"Build a responsive navigation bar with CSS Grid and animations"

"Debug this JavaScript function that's not working properly: [paste code]"

"Optimize this SQL query for better performance: [paste query]"
```

### Keyboard Shortcuts

- `Ctrl/Cmd + B`: Toggle sidebar
- `Ctrl/Cmd + \``: Toggle terminal
- `Ctrl/Cmd + 1`: Switch to editor
- `Ctrl/Cmd + 2`: Switch to preview
- `Ctrl/Cmd + S`: Save files
- `Ctrl/Cmd + Enter`: Send chat message
- `Escape`: Focus chat input

## 🏗️ Architecture

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── chat/             # Chat interface components
│   ├── editor/           # Code editor components
│   ├── layout/           # Layout components
│   ├── preview/          # Preview panel components
│   ├── terminal/         # Terminal components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── types.ts          # TypeScript definitions
│   ├── store.ts          # State management
│   ├── utils.ts          # Helper functions
│   └── validation.ts     # Input validation
└── public/               # Static assets
```

### Key Components

#### CodingAssistant
Main application component that orchestrates the entire interface:
- Manages layout and panel states
- Handles keyboard shortcuts
- Coordinates between chat, editor, and preview

#### ChatInterface
AI conversation management:
- Streams responses from Gemini AI
- Extracts and processes code blocks
- Maintains conversation history
- Handles error states and retries

#### CodeEditor
Advanced code editing capabilities:
- CodeMirror 6 integration
- Multi-language syntax highlighting
- Auto-completion and error detection
- File management and tabs

#### PreviewPanel
Live code preview and testing:
- Real-time HTML/CSS/JS execution
- Responsive viewport testing
- Error handling and debugging
- External preview options

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key for Gemini | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Vercel Analytics ID | No |

### Customization

#### Theme Configuration
Modify `tailwind.config.js` to customize colors, fonts, and spacing:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Add custom colors
      },
    },
  },
}
```

#### AI Model Configuration
Adjust AI behavior in `app/api/chat/route.ts`:

```typescript
const result = streamText({
  model: google('gemini-1.5-pro-latest'),
  maxTokens: 4096,
  temperature: 0.7,
  // Customize parameters
})
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
├── __tests__/
│   ├── components/       # Component tests
│   ├── lib/             # Utility function tests
│   └── api/             # API route tests
├── jest.config.js       # Jest configuration
└── jest.setup.js        # Test setup
```

### Writing Tests

Example component test:

```typescript
import { render, screen } from '@testing-library/react'
import { ChatInterface } from '@/components/chat/chat-interface'

describe('ChatInterface', () => {
  it('renders chat input', () => {
    render(<ChatInterface onCodeGenerated={jest.fn()} />)
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
  })
})
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security

### API Security
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Environment variable protection

### Content Security
- XSS prevention in code preview
- Sandboxed code execution
- Content moderation for AI responses
- Secure file handling

### Best Practices
- Regular dependency updates
- Security headers configuration
- Error logging and monitoring
- User input validation

## 📊 Performance

### Optimization Features
- Code splitting and lazy loading
- Image optimization
- Bundle size monitoring
- Caching strategies

### Monitoring
- Core Web Vitals tracking
- Error boundary implementation
- Performance metrics collection
- User experience monitoring

### Performance Tips
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize bundle size with tree shaking
- Use service workers for caching

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- Follow TypeScript strict mode
- Use ESLint and Prettier for formatting
- Write comprehensive tests
- Document new features
- Follow semantic commit messages

### Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure CI passes
4. Request review from maintainers
5. Address feedback promptly

## 📝 API Reference

### Chat API

#### POST `/api/chat`

Generate AI responses for coding assistance.

**Request Body:**
```typescript
{
  messages: ChatMessage[]
  context?: EditorContext
}
```

**Response:**
```typescript
{
  content: string
  isComplete: boolean
  metadata?: {
    tokens: number
    model: string
  }
}
```

### Rate Limiting

- 10 requests per minute per IP
- 100 requests per hour per IP
- Exponential backoff for exceeded limits

## 🐛 Troubleshooting

### Common Issues

#### API Key Issues
```
Error: API configuration error
```
**Solution**: Verify your Google AI API key is correctly set in `.env.local`

#### Build Errors
```
Module not found: Can't resolve '@/components/...'
```
**Solution**: Check TypeScript path configuration in `tsconfig.json`

#### Preview Not Working
```
Preview Error: Failed to generate preview
```
**Solution**: Ensure HTML file exists and contains valid markup

### Debug Mode

Enable debug logging:

```typescript
// In your component
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### Performance Issues

1. Check bundle size: `npm run build`
2. Analyze with Bundle Analyzer
3. Monitor Core Web Vitals
4. Profile React components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) for AI integration
- [CodeMirror](https://codemirror.net/) for code editing
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Google AI](https://ai.google.dev/) for Gemini API

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/nextjs-ai-coding-assistant/issues)
- 📖 Documentation: [Full Documentation](https://docs.example.com)

---

**Built with ❤️ using Next.js and AI**