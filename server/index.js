const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const TelegramBot = require("node-telegram-bot-api")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const Redis = require("redis")
const Stripe = require("stripe")
const { body, validationResult } = require("express-validator")
const crypto = require("crypto")

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN || "7665532248:AAGjP16s3lEx5gPRA3tnlFuB5nFh0HHv7C0"
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex")
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/telegram-vibe-app"
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const PORT = process.env.PORT || 3000

// Initialize services
const app = express()
const bot = new TelegramBot(BOT_TOKEN, { polling: true })
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null
const redis = new Redis(REDIS_URL)

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://telegram.org"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.telegram.org"],
        frameSrc: ["https://telegram.org"],
      },
    },
  }),
)

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// User Schema
const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  languageCode: { type: String, default: "en" },
  isPremium: { type: Boolean, default: false },
  vibePreferences: {
    primaryVibe: { type: String, default: "modern" },
    colorPalette: [String],
    typography: String,
    animations: [String],
    culturalContext: String,
  },
  moodBoards: [
    {
      id: String,
      name: String,
      elements: [
        {
          type: String,
          value: String,
          label: String,
        },
      ],
      createdAt: { type: Date, default: Date.now },
    },
  ],
  paymentHistory: [
    {
      id: String,
      amount: Number,
      currency: String,
      status: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  notifications: {
    enabled: { type: Boolean, default: true },
    preferences: {
      vibeUpdates: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: true },
      newFeatures: { type: Boolean, default: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const User = mongoose.model("User", userSchema)

// Middleware for Telegram authentication
const authenticateTelegram = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    // Verify Telegram Web App data
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findOne({ telegramId: decoded.telegramId })

    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ error: "Invalid token" })
  }
}

// Validation middleware
const validateVibeInput = [
  body("input").isLength({ min: 1, max: 1000 }).trim().escape(),
  body("language")
    .optional()
    .isIn(["en", "es", "fr", "de", "it", "pt", "ru", "ja", "ko", "zh", "ar", "he", "hi", "tr", "uk"]),
]

const validatePayment = [
  body("amount").isFloat({ min: 0.01 }),
  body("currency").isIn(["USD", "EUR", "GBP", "JPY", "RUB"]),
  body("paymentMethod").isIn(["google_pay", "apple_pay", "stripe"]),
]

// Bot commands
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  const user = msg.from

  try {
    // Create or update user in database
    let dbUser = await User.findOne({ telegramId: user.id })

    if (!dbUser) {
      dbUser = new User({
        telegramId: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        languageCode: user.language_code || "en",
        isPremium: user.is_premium || false,
      })
      await dbUser.save()
    } else {
      dbUser.updatedAt = new Date()
      await dbUser.save()
    }

    // Generate JWT token for web app authentication
    const token = jwt.sign({ telegramId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" })

    // Store token in Redis for session management
    await redis.setex(`session:${user.id}`, 604800, token) // 7 days

    const welcomeMessage = getLocalizedMessage("welcome", dbUser.languageCode)

    await bot.sendMessage(chatId, welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: getLocalizedMessage("openApp", dbUser.languageCode),
              web_app: { url: `${process.env.WEB_APP_URL}?token=${token}` },
            },
          ],
        ],
      },
    })
  } catch (error) {
    console.error("Start command error:", error)
    await bot.sendMessage(chatId, "Sorry, something went wrong. Please try again.")
  }
})

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id
  const user = await User.findOne({ telegramId: msg.from.id })
  const language = user?.languageCode || "en"

  const helpMessage = getLocalizedMessage("help", language)
  await bot.sendMessage(chatId, helpMessage)
})

bot.onText(/\/settings/, async (msg) => {
  const chatId = msg.chat.id
  const user = await User.findOne({ telegramId: msg.from.id })

  if (!user) {
    await bot.sendMessage(chatId, "Please start the bot first with /start")
    return
  }

  const token = await redis.get(`session:${user.telegramId}`)

  await bot.sendMessage(chatId, getLocalizedMessage("openSettings", user.languageCode), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: getLocalizedMessage("openApp", user.languageCode),
            web_app: { url: `${process.env.WEB_APP_URL}/settings?token=${token}` },
          },
        ],
      ],
    },
  })
})

// API Routes

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// User authentication and profile
app.post("/api/auth/telegram", async (req, res) => {
  try {
    const { initData } = req.body

    // Validate Telegram Web App init data
    if (!validateTelegramWebAppData(initData)) {
      return res.status(401).json({ error: "Invalid Telegram data" })
    }

    const userData = parseTelegramInitData(initData)
    let user = await User.findOne({ telegramId: userData.user.id })

    if (!user) {
      user = new User({
        telegramId: userData.user.id,
        username: userData.user.username,
        firstName: userData.user.first_name,
        lastName: userData.user.last_name,
        languageCode: userData.user.language_code || "en",
        isPremium: userData.user.is_premium || false,
      })
      await user.save()
    }

    const token = jwt.sign({ telegramId: user.telegramId, username: user.username }, JWT_SECRET, { expiresIn: "7d" })

    await redis.setex(`session:${user.telegramId}`, 604800, token)

    res.json({ token, user })
  } catch (error) {
    console.error("Auth error:", error)
    res.status(500).json({ error: "Authentication failed" })
  }
})

// Vibe detection
app.post("/api/vibe/detect", authenticateTelegram, validateVibeInput, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { input, language = "en" } = req.body
    const user = req.user

    // Detect vibe using the vibe detection algorithm
    const vibeAnalysis = detectVibe(input, {
      language: user.languageCode,
      culturalBackground: user.vibePreferences?.culturalContext,
    })

    // Update user's vibe preferences
    user.vibePreferences = {
      ...user.vibePreferences,
      primaryVibe: vibeAnalysis.primaryVibe,
      colorPalette: vibeAnalysis.colorPalette,
      typography: vibeAnalysis.typography,
      animations: vibeAnalysis.animations,
    }
    user.updatedAt = new Date()
    await user.save()

    // Cache the result
    await redis.setex(`vibe:${user.telegramId}`, 3600, JSON.stringify(vibeAnalysis))

    res.json({ vibe: vibeAnalysis })
  } catch (error) {
    console.error("Vibe detection error:", error)
    res.status(500).json({ error: "Vibe detection failed" })
  }
})

// Mood board generation
app.post("/api/moodboard/generate", authenticateTelegram, async (req, res) => {
  try {
    const { vibeId, customElements = [] } = req.body
    const user = req.user

    // Get cached vibe or use user's preferences
    let vibe = await redis.get(`vibe:${user.telegramId}`)
    if (vibe) {
      vibe = JSON.parse(vibe)
    } else {
      vibe = user.vibePreferences
    }

    // Generate mood board elements
    const moodBoard = await generateMoodBoard(vibe, customElements)

    // Save mood board to user's collection
    const moodBoardId = crypto.randomUUID()
    user.moodBoards.push({
      id: moodBoardId,
      name: `${vibe.primaryVibe} Mood Board`,
      elements: moodBoard.elements,
      createdAt: new Date(),
    })
    await user.save()

    res.json({ moodBoard: { id: moodBoardId, ...moodBoard } })
  } catch (error) {
    console.error("Mood board generation error:", error)
    res.status(500).json({ error: "Mood board generation failed" })
  }
})

// Payment processing
app.post("/api/payment/create", authenticateTelegram, validatePayment, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { amount, currency, paymentMethod } = req.body
    const user = req.user

    let paymentIntent

    if (paymentMethod === "stripe" && stripe) {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          telegramId: user.telegramId.toString(),
          username: user.username || "",
        },
      })
    } else {
      // Handle Google Pay / Apple Pay through Telegram Payments API
      const invoice = await bot.sendInvoice(
        user.telegramId,
        "Vibe Coding Premium",
        "Unlock premium features and advanced vibe customization",
        crypto.randomUUID(),
        process.env.PAYMENT_PROVIDER_TOKEN,
        currency,
        [{ label: "Premium Features", amount: Math.round(amount * 100) }],
        {
          need_email: true,
          send_email_to_provider: true,
        },
      )

      paymentIntent = { id: invoice.message_id, client_secret: null }
    }

    res.json({
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
      },
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    res.status(500).json({ error: "Payment creation failed" })
  }
})

// Notification management
app.post("/api/notifications/send", authenticateTelegram, async (req, res) => {
  try {
    const { message, type = "info" } = req.body
    const user = req.user

    if (!user.notifications.enabled) {
      return res.status(400).json({ error: "Notifications disabled" })
    }

    // Check notification preferences
    const typePreferences = {
      vibe: user.notifications.preferences.vibeUpdates,
      payment: user.notifications.preferences.paymentAlerts,
      feature: user.notifications.preferences.newFeatures,
    }

    if (typePreferences[type] === false) {
      return res.status(400).json({ error: "Notification type disabled" })
    }

    await bot.sendMessage(user.telegramId, message)
    res.json({ success: true })
  } catch (error) {
    console.error("Notification send error:", error)
    res.status(500).json({ error: "Failed to send notification" })
  }
})

// Security validation
app.post("/api/security/validate", authenticateTelegram, async (req, res) => {
  try {
    const { code } = req.body

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Code is required" })
    }

    // Perform security validation
    const validation = validateSecurity(code)
    const lpg8c = validateLPG8C(code)

    res.json({ validation, lpg8c })
  } catch (error) {
    console.error("Security validation error:", error)
    res.status(500).json({ error: "Security validation failed" })
  }
})

// Utility functions
function validateTelegramWebAppData(initData) {
  // Implement Telegram Web App data validation
  // This should verify the hash and check data integrity
  return true // Simplified for demo
}

function parseTelegramInitData(initData) {
  // Parse Telegram init data
  const params = new URLSearchParams(initData)
  return {
    user: JSON.parse(params.get("user") || "{}"),
    chat: JSON.parse(params.get("chat") || "{}"),
    start_param: params.get("start_param"),
  }
}

function getLocalizedMessage(key, language) {
  const messages = {
    welcome: {
      en: "Welcome to Vibe Coding! 🎨\n\nDiscover your perfect design aesthetic and create amazing projects with AI-powered vibe detection.",
      es: "¡Bienvenido a Vibe Coding! 🎨\n\nDescubre tu estética de diseño perfecta y crea proyectos increíbles con detección de vibe impulsada por IA.",
      fr: "Bienvenue à Vibe Coding! 🎨\n\nDécouvrez votre esthétique de design parfaite et créez des projets incroyables avec la détection de vibe alimentée par IA.",
    },
    openApp: {
      en: "🚀 Open Vibe App",
      es: "🚀 Abrir App Vibe",
      fr: "🚀 Ouvrir App Vibe",
    },
    help: {
      en: "Vibe Coding Help 📚\n\n/start - Start the app\n/settings - Open settings\n/help - Show this help\n\nUse the web app for full functionality!",
      es: "Ayuda de Vibe Coding 📚\n\n/start - Iniciar la app\n/settings - Abrir configuración\n/help - Mostrar esta ayuda\n\n¡Usa la app web para funcionalidad completa!",
      fr: "Aide Vibe Coding 📚\n\n/start - Démarrer l'app\n/settings - Ouvrir paramètres\n/help - Afficher cette aide\n\nUtilisez l'app web pour toutes les fonctionnalités!",
    },
    openSettings: {
      en: "Open your settings to customize your vibe preferences, notifications, and more!",
      es: "¡Abre tu configuración para personalizar tus preferencias de vibe, notificaciones y más!",
      fr: "Ouvrez vos paramètres pour personnaliser vos préférences de vibe, notifications et plus!",
    },
  }

  return messages[key]?.[language] || messages[key]?.en || key
}

async function generateMoodBoard(vibe, customElements) {
  // Generate mood board based on vibe analysis
  const elements = [
    // Colors from vibe palette
    ...vibe.colorPalette.map((color, index) => ({
      type: "color",
      value: color,
      label: `Color ${index + 1}`,
    })),

    // Typography
    {
      type: "typography",
      value: vibe.typography,
      label: "Primary Font",
    },

    // Patterns and textures
    ...vibe.animations.map((animation, index) => ({
      type: "pattern",
      value: animation,
      label: `Animation ${index + 1}`,
    })),

    // Custom elements
    ...customElements,
  ]

  return {
    elements,
    vibe: vibe.primaryVibe,
    createdAt: new Date().toISOString(),
  }
}

function detectVibe(input, context = {}) {
  // Simplified vibe detection for server-side
  // In production, this would use the full vibe detection algorithm
  const vibes = ["modern", "retro", "minimal", "vibrant", "dark", "elegant", "playful", "professional"]
  const primaryVibe = vibes[Math.floor(Math.random() * vibes.length)]

  return {
    primaryVibe,
    mood: "energetic",
    visualDirection: "clean",
    confidence: 0.8,
    colorPalette: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981"],
    typography: "Inter, system-ui, sans-serif",
    animations: ["fade", "slide", "scale"],
    keywords: ["modern", "clean", "tech"],
    culturalContext: context.culturalBackground,
    emotionalTone: "positive",
  }
}

function validateSecurity(code) {
  // Simplified security validation
  return {
    isValid: true,
    violations: [],
    riskLevel: "low",
    recommendations: [],
  }
}

function validateLPG8C(code) {
  // Simplified LPG8C validation
  return {
    inputValidation: true,
    outputEncoding: true,
    authentication: true,
    authorization: true,
    rateLimiting: true,
    caching: true,
    compression: false,
    logging: true,
    monitoring: false,
    auditTrail: false,
    principles: {
      defenseInDepth: true,
      failSecure: true,
      leastPrivilege: true,
      separationOfDuties: false,
      economyOfMechanism: true,
      completeMediation: true,
      openDesign: true,
      psychologicalAcceptability: true,
    },
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error" })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Telegram Vibe Mini App server running on port ${PORT}`)
  console.log(`🤖 Bot token: ${BOT_TOKEN.substring(0, 10)}...`)
  console.log(`📱 Web App URL: ${process.env.WEB_APP_URL || "http://localhost:5173"}`)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully")
  await mongoose.connection.close()
  await redis.quit()
  process.exit(0)
})

module.exports = app
