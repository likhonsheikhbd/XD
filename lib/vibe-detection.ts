export interface VibeAnalysis {
  primaryVibe: string
  mood: string
  visualDirection: string
  confidence: number
  colorPalette: string[]
  typography: string
  animations: string[]
  keywords: string[]
}

export interface VibeKeywords {
  [key: string]: {
    keywords: string[]
    mood: string[]
    visual: string[]
    colors: string[]
    typography: string
    animations: string[]
  }
}

const VIBE_PATTERNS: VibeKeywords = {
  modern: {
    keywords: ["clean", "sleek", "contemporary", "minimalist", "fresh", "crisp"],
    mood: ["professional", "confident", "efficient"],
    visual: ["geometric", "spacious", "structured"],
    colors: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981"],
    typography: "Inter, system-ui, sans-serif",
    animations: ["fade", "slide", "scale"],
  },
  retro: {
    keywords: ["vintage", "nostalgic", "classic", "old-school", "throwback"],
    mood: ["warm", "nostalgic", "playful"],
    visual: ["rounded", "textured", "layered"],
    colors: ["#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
    typography: "Georgia, serif",
    animations: ["bounce", "pulse", "wiggle"],
  },
  minimal: {
    keywords: ["simple", "clean", "bare", "essential", "pure", "basic"],
    mood: ["calm", "focused", "serene"],
    visual: ["spacious", "uncluttered", "balanced"],
    colors: ["#6B7280", "#9CA3AF", "#D1D5DB", "#F3F4F6"],
    typography: "system-ui, sans-serif",
    animations: ["fade", "subtle"],
  },
  vibrant: {
    keywords: ["colorful", "bright", "energetic", "bold", "lively", "dynamic"],
    mood: ["exciting", "energetic", "joyful"],
    visual: ["colorful", "contrasting", "dynamic"],
    colors: ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
    typography: "system-ui, sans-serif",
    animations: ["bounce", "shake", "rainbow"],
  },
  dark: {
    keywords: ["dark", "mysterious", "gothic", "noir", "shadow", "deep"],
    mood: ["mysterious", "sophisticated", "dramatic"],
    visual: ["shadowed", "contrasted", "moody"],
    colors: ["#1F2937", "#374151", "#4B5563", "#6B7280"],
    typography: "system-ui, sans-serif",
    animations: ["fade", "glow", "shadow"],
  },
  elegant: {
    keywords: ["sophisticated", "refined", "luxurious", "premium", "classy"],
    mood: ["sophisticated", "refined", "premium"],
    visual: ["polished", "detailed", "refined"],
    colors: ["#8B5CF6", "#6366F1", "#EC4899", "#F59E0B"],
    typography: "Georgia, serif",
    animations: ["smooth", "elegant", "refined"],
  },
}

export function detectVibe(input: string): VibeAnalysis {
  const normalizedInput = input.toLowerCase()
  const words = normalizedInput.split(/\s+/)

  const vibeScores: Record<string, number> = {}

  // Calculate scores for each vibe
  Object.entries(VIBE_PATTERNS).forEach(([vibe, pattern]) => {
    let score = 0

    // Check keywords
    pattern.keywords.forEach((keyword) => {
      if (normalizedInput.includes(keyword)) {
        score += 3
      }
    })

    // Check mood words
    pattern.mood.forEach((mood) => {
      if (normalizedInput.includes(mood)) {
        score += 2
      }
    })

    // Check visual words
    pattern.visual.forEach((visual) => {
      if (normalizedInput.includes(visual)) {
        score += 2
      }
    })

    vibeScores[vibe] = score
  })

  // Find the highest scoring vibe
  const sortedVibes = Object.entries(vibeScores).sort(([, a], [, b]) => b - a)

  const primaryVibe = sortedVibes[0]?.[0] || "modern"
  const confidence = Math.min(sortedVibes[0]?.[1] || 0, 10) / 10

  const selectedPattern = VIBE_PATTERNS[primaryVibe]

  return {
    primaryVibe,
    mood: selectedPattern.mood[0],
    visualDirection: selectedPattern.visual[0],
    confidence,
    colorPalette: selectedPattern.colors,
    typography: selectedPattern.typography,
    animations: selectedPattern.animations,
    keywords: selectedPattern.keywords,
  }
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
  }
  return layoutMap[vibe] || "grid-based"
}

export function selectTypography(vibe: string): string {
  return VIBE_PATTERNS[vibe]?.typography || VIBE_PATTERNS.modern.typography
}
