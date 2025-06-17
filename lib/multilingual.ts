export interface Language {
  code: string
  name: string
  nativeName: string
  rtl: boolean
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", rtl: false },
  { code: "es", name: "Spanish", nativeName: "Español", rtl: false },
  { code: "fr", name: "French", nativeName: "Français", rtl: false },
  { code: "de", name: "German", nativeName: "Deutsch", rtl: false },
  { code: "it", name: "Italian", nativeName: "Italiano", rtl: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", rtl: false },
  { code: "ru", name: "Russian", nativeName: "Русский", rtl: false },
  { code: "ja", name: "Japanese", nativeName: "日本語", rtl: false },
  { code: "ko", name: "Korean", nativeName: "한국어", rtl: false },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "he", name: "Hebrew", nativeName: "עברית", rtl: true },
]

export interface TranslationStrings {
  [key: string]: {
    [languageCode: string]: string
  }
}

export const VIBE_TRANSLATIONS: TranslationStrings = {
  vibeQuestion: {
    en: "What vibe do you want for your project?",
    es: "¿Qué vibe quieres para tu proyecto?",
    fr: "Quelle ambiance souhaitez-vous pour votre code?",
    de: "Welche Stimmung soll Ihr Code vermitteln?",
    it: "Che atmosfera vuoi per il tuo progetto?",
    pt: "Que vibe você quer para seu projeto?",
    ru: "Какую атмосферу вы хотите для вашего проекта?",
    ja: "プロジェクトにどんな雰囲気を求めますか？",
    ko: "프로젝트에 어떤 분위기를 원하시나요?",
    zh: "您希望项目具有什么样的氛围？",
    ar: "ما هو الطابع الذي تريده لمشروعك؟",
    he: "איזה ווייב אתה רוצה לפרויקט שלך?",
  },
  visionAnalysis: {
    en: "Vision Analysis",
    es: "Análisis de Visión",
    fr: "Analyse de Vision",
    de: "Vision Analyse",
    it: "Analisi della Visione",
    pt: "Análise de Visão",
    ru: "Анализ Видения",
    ja: "ビジョン分析",
    ko: "비전 분석",
    zh: "愿景分析",
    ar: "تحليل الرؤية",
    he: "ניתוח חזון",
  },
  primaryVibe: {
    en: "Primary Vibe",
    es: "Vibe Principal",
    fr: "Ambiance Principale",
    de: "Hauptstimmung",
    it: "Atmosfera Principale",
    pt: "Vibe Principal",
    ru: "Основная Атмосфера",
    ja: "主要な雰囲気",
    ko: "주요 분위기",
    zh: "主要氛围",
    ar: "الطابع الأساسي",
    he: "ווייב עיקרי",
  },
}

export function detectLanguage(text: string): string {
  // Simple language detection based on character patterns
  const patterns = {
    ar: /[\u0600-\u06FF]/,
    he: /[\u0590-\u05FF]/,
    ru: /[\u0400-\u04FF]/,
    ja: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
    ko: /[\uAC00-\uD7AF]/,
    zh: /[\u4E00-\u9FFF]/,
    de: /\b(der|die|das|und|ist|zu|den|mit|für|auf|von|im|eine|einen|einer|ein|sich|auch|an|werden|aus|er|hat|dass|sie|nach|wird|bei|noch|wie|einem|über|einen|so|zum|war|haben|nur|oder|aber|vor|zur|bis|unter|während|des|sein|sehr|um|durch|man|auch|andere|viele|kein|muss|große|neue|eigenen|ersten|beiden|leben|diese|diesem|gegen|jahr|viel|mehr|doch|schon|wenn|hier|alle|als|zwischen|heute|weit|gehen|seit|weg|welt|seite|dabei|frau|oft|tun|beispiel|hält|eins|nie|zweite|mal|dann|sehen|sehr|sicher|heißt|wer|jedoch|alles|wieder|weil|weg|unter|denn|dort|rechts|soweit|ganz|schnell|zusammen|kam|kommen|ihm|vom|sagte|jetzt|immer|während|ja|darf|damit|schon|hin|ohne|sondern|wohl|eines|solche|da|zur|um|am|sind|noch|wie|einem|nach|oben|die|können|soll|sagt|möglich|wegen|sonst|vielleicht|allein|vielleicht|eigentlich|fast|lange|genug|wenig|dabei|gleich|ganz|eben|falls|plötzlich|spät|früh|sofort|bald|manchmal|oft|immer|nie|heute|gestern|morgen|jetzt|hier|da|dort|links|rechts|oben|unten|innen|außen|vorn|hinten|neben|zwischen|über|unter|vor|hinter|in|an|auf|zu|bei|mit|für|gegen|ohne|durch|um|von|aus|nach|seit|bis|während|wegen|trotz|statt|außer|binnen|dank|laut|zufolge|gemäß|entsprechend|bezüglich|hinsichtlich|angesichts|aufgrund|infolge|zwecks|anstatt|anstelle|mittels|vermittels|kraft|mangels|seitens|vonseiten|behufs|halber|um|willen|zuliebe|zugunsten|ungeachtet|unbeschadet|vorbehaltlich|einschließlich|ausschließlich|zuzüglich|abzüglich|samt|nebst|mitsamt|eingerechnet|ausgenommen|außer|bis|auf|an|entlang|gegenüber|nahe|unweit|abseits|diesseits|jenseits|oberhalb|unterhalb|innerhalb|außerhalb|beiderseits|längs|rings|seitlich|nördlich|südlich|östlich|westlich|links|rechts|geradeaus|rückwärts|vorwärts|aufwärts|abwärts|einwärts|auswärts|heimwärts|seewärts|landwärts|stromaufwärts|stromabwärts|bergauf|bergab|talwärts|himmelwärts|erdwärts|nordwärts|südwärts|ostwärts|westwärts)/gi,
    fr: /\b(le|de|et|à|un|il|être|et|en|avoir|que|pour|dans|ce|son|une|sur|avec|ne|se|pas|tout|plus|par|grand|ou|si|les|deux|même|lui|temps|très|état|autre|bien|où|sans|peut|sous|cette|entre|encore|ces|jusqu|contre|tout|pendant|moins|rien|celui|ci|avant|eau|vers|plusieurs|bon|voici|matin|trop|cinq|devez|anglais|dit|possède|jours|parce|voiture|aller|vous|gouvernement|et|ceux|pendant|work|chaque|contre|votre|tout|état|dans|être|cours|plusieurs|groupe|pays|problème|main|fin|public|suivant|sans|place|cas|part|groupe|enfant|point|monde|fait|après|premier|jour|monsieur|grand|travail|gouvernement|petit|dire|part|nombre|grand|pendant|être|temps|très|savoir|falloir|voir|en|bien|autre|donner|travail|cinq|rester|pour|enfant|venir|où|demander|grand|être|avoir|là|haut|magasin|pourquoi|pas|madame|très|jour|monsieur|demain|beaucoup|où|voici|combien|non|merci|au|revoir|bonsoir|bonjour|salut|ça|va|oui|voici|merci|beaucoup|de|rien|je|vous|en|prie|excusez|moi|pardon|comment|allez|vous|très|bien|et|vous|ça|va|pas|mal|comme|ci|comme|ça|qu|est|ce|que|vous|faites|qu|est|ce|que|c|est|je|ne|sais|pas|je|ne|comprends|pas|pouvez|vous|répéter|s|il|vous|plaît|où|est|combien|ça|coûte|l|addition|s|il|vous|plaît|je|voudrais|avez|vous|est|ce|que|vous|avez|je|cherche|où|puis|je|trouver|à|quelle|heure|comment|dit|on|en|français|parlez|vous|anglais|je|suis|américain|je|suis|américaine|je|viens|des|états|unis|enchanté|enchantée)/gi,
    es: /\b(el|la|de|que|y|a|en|un|ser|se|no|te|lo|le|da|su|por|son|con|para|al|una|sur|también|todo|pero|más|hacer|o|poder|decir|este|ir|otro|ese|la|si|me|ya|ver|porque|dar|cuando|él|muy|sin|vez|mucho|saber|qué|sobre|mi|alguno|mismo|yo|también|hasta|año|dos|querer|entre|así|primero|desde|grande|eso|ni|nos|llegar|pasar|tiempo|ella|sí|día|uno|bien|poco|deber|entonces|poner|aquí|seguir|parecer|fin|tanto|donde|mismo|después|oír|salir|mientras|estar|mundo|mano|tener|conseguir|cabeza|ejemplo|llevar|crear|gustar|minuto|propio|tomar|nadie|cierto|conocer|último|empezar|incluso|nunca|antes|movimiento|derecho|pueblo|objeto|momento|través|durante|segundo|punto|quizá|gobierno|creer|mejor|igual|seguro|ciento|agua|ganar|historia|comprar|bastante|relación|recordar|terminar|permitir|aparece|programa|casi|proyecto|lado|menor|tipo|trabajar|niño|medio|encontrar|casa|bajo|parte|general|alto|guerra|valor|mostrar|voces|viene|razón|esperar|cuatro|falta|grupo|sentir|joven|país|problema|mano|lugar|caso|parte|grupo|niño|punto|mundo|hecho|después|primero|día|señor|grande|trabajo|gobierno|pequeño|decir|parte|número|grande|durante|ser|tiempo|muy|saber|tener|ver|en|bien|otro|dar|trabajo|cinco|quedar|para|niño|venir|donde|pedir|grande|ser|tener|allí|alto|tienda|por|qué|no|señora|muy|día|señor|mañana|mucho|donde|aquí|cuánto|no|gracias|adiós|buenas|noches|buenos|días|hola|qué|tal|sí|aquí|gracias|muchas|de|nada|por|favor|perdón|cómo|está|usted|muy|bien|y|usted|qué|tal|no|está|mal|así|así|qué|hace|usted|qué|es|esto|no|sé|no|entiendo|puede|repetir|por|favor|dónde|está|cuánto|cuesta|la|cuenta|por|favor|quisiera|tiene|usted|tiene|busco|dónde|puedo|encontrar|a|qué|hora|cómo|se|dice|en|español|habla|usted|inglés|soy|americano|soy|americana|vengo|de|estados|unidos|mucho|gusto)/gi,
  }

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang
    }
  }

  return "en" // Default to English
}

export function translate(key: string, language = "en"): string {
  return VIBE_TRANSLATIONS[key]?.[language] || VIBE_TRANSLATIONS[key]?.["en"] || key
}

export function getLanguageDirection(languageCode: string): "ltr" | "rtl" {
  const rtlLanguages = ["ar", "he", "fa", "ur"]
  return rtlLanguages.includes(languageCode) ? "rtl" : "ltr"
}
