export interface VibeAnalysis {
  primaryVibe: string
  mood: string
  visualDirection: string
  confidence: number
  colorPalette: string[]
  typography: string
  animations: string[]
  keywords: string[]
  culturalContext?: string
  emotionalTone: string
}

export interface VibeKeywords {
  [key: string]: {
    keywords: string[]
    mood: string[]
    visual: string[]
    colors: string[]
    typography: string
    animations: string[]
    culturalMarkers: string[]
    emotionalIndicators: string[]
  }
}

const VIBE_PATTERNS: VibeKeywords = {
  modern: {
    keywords: ["clean", "sleek", "contemporary", "minimalist", "fresh", "crisp", "tech", "digital"],
    mood: ["professional", "confident", "efficient", "focused"],
    visual: ["geometric", "spacious", "structured", "grid-based"],
    colors: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981"],
    typography: "Inter, system-ui, sans-serif",
    animations: ["fade", "slide", "scale", "smooth"],
    culturalMarkers: ["startup", "silicon valley", "innovation", "disruption"],
    emotionalIndicators: ["optimistic", "forward-thinking", "ambitious"],
  },
  retro: {
    keywords: ["vintage", "nostalgic", "classic", "old-school", "throwback", "80s", "90s", "neon"],
    mood: ["warm", "nostalgic", "playful", "fun"],
    visual: ["rounded", "textured", "layered", "gradient"],
    colors: ["#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
    typography: "Georgia, serif",
    animations: ["bounce", "pulse", "wiggle", "glow"],
    culturalMarkers: ["arcade", "synthwave", "vaporwave", "cassette"],
    emotionalIndicators: ["nostalgic", "whimsical", "carefree"],
  },
  minimal: {
    keywords: ["simple", "clean", "bare", "essential", "pure", "basic", "zen", "calm"],
    mood: ["calm", "focused", "serene", "peaceful"],
    visual: ["spacious", "uncluttered", "balanced", "white-space"],
    colors: ["#6B7280", "#9CA3AF", "#D1D5DB", "#F3F4F6"],
    typography: "system-ui, sans-serif",
    animations: ["fade", "subtle", "gentle"],
    culturalMarkers: ["scandinavian", "japanese", "meditation", "mindfulness"],
    emotionalIndicators: ["tranquil", "centered", "mindful"],
  },
  vibrant: {
    keywords: ["colorful", "bright", "energetic", "bold", "lively", "dynamic", "rainbow", "pop"],
    mood: ["exciting", "energetic", "joyful", "enthusiastic"],
    visual: ["colorful", "contrasting", "dynamic", "explosive"],
    colors: ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
    typography: "system-ui, sans-serif",
    animations: ["bounce", "shake", "rainbow", "pulse"],
    culturalMarkers: ["festival", "carnival", "celebration", "party"],
    emotionalIndicators: ["euphoric", "exuberant", "passionate"],
  },
  dark: {
    keywords: ["dark", "mysterious", "gothic", "noir", "shadow", "deep", "black", "night"],
    mood: ["mysterious", "sophisticated", "dramatic", "intense"],
    visual: ["shadowed", "contrasted", "moody", "atmospheric"],
    colors: ["#1F2937", "#374151", "#4B5563", "#6B7280"],
    typography: "system-ui, sans-serif",
    animations: ["fade", "glow", "shadow", "emerge"],
    culturalMarkers: ["cyberpunk", "gothic", "noir", "underground"],
    emotionalIndicators: ["mysterious", "brooding", "contemplative"],
  },
  elegant: {
    keywords: ["sophisticated", "refined", "luxurious", "premium", "classy", "upscale", "gold", "marble"],
    mood: ["sophisticated", "refined", "premium", "exclusive"],
    visual: ["polished", "detailed", "refined", "ornate"],
    colors: ["#8B5CF6", "#6366F1", "#EC4899", "#F59E0B"],
    typography: "Georgia, serif",
    animations: ["smooth", "elegant", "refined", "graceful"],
    culturalMarkers: ["luxury", "haute couture", "fine dining", "art gallery"],
    emotionalIndicators: ["refined", "distinguished", "aspirational"],
  },
  playful: {
    keywords: ["fun", "cute", "whimsical", "cartoon", "childlike", "bouncy", "silly", "kawaii"],
    mood: ["playful", "cheerful", "innocent", "lighthearted"],
    visual: ["rounded", "soft", "bubbly", "organic"],
    colors: ["#EC4899", "#F59E0B", "#10B981", "#8B5CF6"],
    typography: "Comic Sans MS, cursive",
    animations: ["bounce", "wiggle", "spin", "float"],
    culturalMarkers: ["anime", "gaming", "toys", "childhood"],
    emotionalIndicators: ["joyful", "carefree", "innocent"],
  },
  professional: {
    keywords: ["business", "corporate", "formal", "serious", "executive", "suit", "office", "boardroom"],
    mood: ["serious", "trustworthy", "reliable", "authoritative"],
    visual: ["structured", "formal", "organized", "hierarchical"],
    colors: ["#1F2937", "#3B82F6", "#6B7280", "#F3F4F6"],
    typography: "Times New Roman, serif",
    animations: ["fade", "slide", "professional"],
    culturalMarkers: ["wall street", "corporate", "banking", "consulting"],
    emotionalIndicators: ["confident", "authoritative", "trustworthy"],
  },
}

export function detectVibe(
  input: string,
  userContext?: { language?: string; culturalBackground?: string },
): VibeAnalysis {
  const normalizedInput = input.toLowerCase()
  const words = normalizedInput.split(/\s+/)

  const vibeScores: Record<string, number> = {}

  // Calculate scores for each vibe
  Object.entries(VIBE_PATTERNS).forEach(([vibe, pattern]) => {
    let score = 0

    // Check keywords (highest weight)
    pattern.keywords.forEach((keyword) => {
      if (normalizedInput.includes(keyword)) {
        score += 5
      }
    })

    // Check mood words
    pattern.mood.forEach((mood) => {
      if (normalizedInput.includes(mood)) {
        score += 3
      }
    })

    // Check visual words
    pattern.visual.forEach((visual) => {
      if (normalizedInput.includes(visual)) {
        score += 3
      }
    })

    // Check cultural markers
    pattern.culturalMarkers.forEach((marker) => {
      if (normalizedInput.includes(marker)) {
        score += 2
      }
    })

    // Check emotional indicators
    pattern.emotionalIndicators.forEach((emotion) => {
      if (normalizedInput.includes(emotion)) {
        score += 2
      }
    })

    // Bonus for cultural context matching
    if (userContext?.culturalBackground) {
      const culturalBonus = calculateCulturalBonus(vibe, userContext.culturalBackground)
      score += culturalBonus
    }

    vibeScores[vibe] = score
  })

  // Find the highest scoring vibe
  const sortedVibes = Object.entries(vibeScores).sort(([, a], [, b]) => b - a)

  const primaryVibe = sortedVibes[0]?.[0] || "modern"
  const confidence = Math.min(sortedVibes[0]?.[1] || 0, 20) / 20

  const selectedPattern = VIBE_PATTERNS[primaryVibe]

  // Determine emotional tone
  const emotionalTone = determineEmotionalTone(normalizedInput, selectedPattern.emotionalIndicators)

  // Add cultural context if available
  const culturalContext = userContext?.culturalBackground
    ? inferCulturalContext(primaryVibe, userContext.culturalBackground)
    : undefined

  return {
    primaryVibe,
    mood: selectedPattern.mood[0],
    visualDirection: selectedPattern.visual[0],
    confidence,
    colorPalette: selectedPattern.colors,
    typography: selectedPattern.typography,
    animations: selectedPattern.animations,
    keywords: selectedPattern.keywords,
    culturalContext,
    emotionalTone,
  }
}

function calculateCulturalBonus(vibe: string, culturalBackground: string): number {
  const culturalMappings: Record<string, string[]> = {
    minimal: ["japanese", "scandinavian", "nordic"],
    elegant: ["french", "italian", "british"],
    vibrant: ["latin", "african", "indian", "brazilian"],
    modern: ["american", "german", "dutch"],
    playful: ["japanese", "korean", "american"],
  }

  const vibecultures = culturalMappings[vibe] || []
  return vibecultures.some((culture) => culturalBackground.toLowerCase().includes(culture)) ? 3 : 0
}

function determineEmotionalTone(input: string, emotionalIndicators: string[]): string {
  const positiveWords = ["happy", "joy", "excited", "love", "amazing", "wonderful", "great"]
  const negativeWords = ["sad", "angry", "frustrated", "hate", "terrible", "awful", "bad"]

  let positiveScore = 0
  let negativeScore = 0

  positiveWords.forEach((word) => {
    if (input.includes(word)) positiveScore++
  })

  negativeWords.forEach((word) => {
    if (input.includes(word)) negativeScore++
  })

  if (positiveScore > negativeScore) return "positive"
  if (negativeScore > positiveScore) return "negative"
  return "neutral"
}

function inferCulturalContext(vibe: string, culturalBackground: string): string {
  const contextMappings: Record<string, Record<string, string>> = {
    minimal: {
      japanese: "Influenced by Japanese minimalism and wabi-sabi philosophy",
      scandinavian: "Nordic design principles with hygge aesthetics",
      default: "Clean, uncluttered design approach",
    },
    elegant: {
      french: "French luxury and haute couture influence",
      italian: "Italian craftsmanship and Renaissance aesthetics",
      default: "Sophisticated and refined design language",
    },
    vibrant: {
      latin: "Latin American color traditions and festive culture",
      indian: "Rich Indian color palettes and cultural vibrancy",
      default: "Bold and energetic color expression",
    },
  }

  const vibeContexts = contextMappings[vibe]
  if (!vibeContexts) return `${vibe} aesthetic approach`

  for (const [culture, context] of Object.entries(vibeContexts)) {
    if (culture !== "default" && culturalBackground.toLowerCase().includes(culture)) {
      return context
    }
  }

  return vibeContexts.default || `${vibe} aesthetic approach`
}

export function extractColorPalette(vibe: string): string[] {
  return VIBE_PATTERNS[vibe]?.colors || VIBE_PATTERNS.modern.colors
}

export function mapVibeToAnimations(vibe: string): string[] {
  return VIBE_PATTERNS[vibe]?.animations || VIBE_PATTERNS.modern.animations
}

export function determineLayoutStyle(vibe: string): string {
  const layoutMap: Record<string, string> = {
    modern: "grid-based",
    retro: "asymmetrical",
    minimal: "spacious",
    vibrant: "dynamic",
    dark: "layered",
    elegant: "structured",
    playful: "organic",
    professional: "hierarchical",
  }
  return layoutMap[vibe] || "grid-based"
}

export function selectTypography(vibe: string): string {
  return VIBE_PATTERNS[vibe]?.typography || VIBE_PATTERNS.modern.typography
}

export function generateVibePrompt(vibe: VibeAnalysis, language = "en"): string {
  const prompts: Record<string, Record<string, string>> = {
    en: {
      modern: `Create a ${vibe.primaryVibe} design with ${vibe.mood} energy. Focus on ${vibe.visualDirection} layouts with clean typography.`,
      retro: `Design with ${vibe.primaryVibe} aesthetics, embracing ${vibe.mood} vibes and ${vibe.visualDirection} elements.`,
      minimal: `Craft a ${vibe.primaryVibe} interface emphasizing ${vibe.mood} simplicity and ${vibe.visualDirection} composition.`,
      vibrant: `Build a ${vibe.primaryVibe} experience with ${vibe.mood} energy and ${vibe.visualDirection} visual impact.`,
      dark: `Develop a ${vibe.primaryVibe} theme with ${vibe.mood} atmosphere and ${vibe.visualDirection} aesthetics.`,
      elegant: `Create an ${vibe.primaryVibe} design showcasing ${vibe.mood} sophistication and ${vibe.visualDirection} details.`,
      playful: `Design a ${vibe.primaryVibe} interface with ${vibe.mood} character and ${vibe.visualDirection} elements.`,
      professional: `Build a ${vibe.primaryVibe} system with ${vibe.mood} credibility and ${vibe.visualDirection} organization.`,
    },
    es: {
      modern: `Crea un diseño ${vibe.primaryVibe} con energía ${vibe.mood}. Enfócate en layouts ${vibe.visualDirection} con tipografía limpia.`,
      retro: `Diseña con estética ${vibe.primaryVibe}, abrazando vibes ${vibe.mood} y elementos ${vibe.visualDirection}.`,
      minimal: `Crea una interfaz ${vibe.primaryVibe} enfatizando la simplicidad ${vibe.mood} y composición ${vibe.visualDirection}.`,
    },
    fr: {
      modern: `Créez un design ${vibe.primaryVibe} avec une énergie ${vibe.mood}. Concentrez-vous sur des layouts ${vibe.visualDirection} avec une typographie propre.`,
      retro: `Concevez avec une esthétique ${vibe.primaryVibe}, embrassant des vibes ${vibe.mood} et des éléments ${vibe.visualDirection}.`,
    },
  }

  const languagePrompts = prompts[language] || prompts.en
  return languagePrompts[vibe.primaryVibe] || languagePrompts.modern
}
