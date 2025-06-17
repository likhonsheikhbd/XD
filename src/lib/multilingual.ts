export interface Language {
  code: string
  name: string
  nativeName: string
  rtl: boolean
  flag: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", rtl: false, flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", rtl: false, flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", rtl: false, flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", rtl: false, flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", rtl: false, flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", rtl: false, flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", rtl: false, flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", rtl: false, flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", rtl: false, flag: "🇰🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: false, flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true, flag: "🇸🇦" },
  { code: "he", name: "Hebrew", nativeName: "עברית", rtl: true, flag: "🇮🇱" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", rtl: false, flag: "🇮🇳" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", rtl: false, flag: "🇹🇷" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", rtl: false, flag: "🇺🇦" },
]

export interface TranslationStrings {
  [key: string]: {
    [languageCode: string]: string
  }
}

export const TRANSLATIONS: TranslationStrings = {
  // App Navigation
  welcome: {
    en: "Welcome to Vibe Coding",
    es: "Bienvenido a Vibe Coding",
    fr: "Bienvenue à Vibe Coding",
    de: "Willkommen bei Vibe Coding",
    it: "Benvenuto a Vibe Coding",
    pt: "Bem-vindo ao Vibe Coding",
    ru: "Добро пожаловать в Vibe Coding",
    ja: "Vibe Codingへようこそ",
    ko: "Vibe Coding에 오신 것을 환영합니다",
    zh: "欢迎来到Vibe Coding",
    ar: "مرحباً بك في Vibe Coding",
    he: "ברוכים הבאים ל-Vibe Coding",
    hi: "Vibe Coding में आपका स्वागत है",
    tr: "Vibe Coding'e Hoş Geldiniz",
    uk: "Ласкаво просимо до Vibe Coding",
  },

  // Vibe Detection
  vibeQuestion: {
    en: "What vibe do you want for your project?",
    es: "¿Qué vibe quieres para tu proyecto?",
    fr: "Quelle ambiance souhaitez-vous pour votre projet?",
    de: "Welche Stimmung möchten Sie für Ihr Projekt?",
    it: "Che atmosfera vuoi per il tuo progetto?",
    pt: "Que vibe você quer para seu projeto?",
    ru: "Какую атмосферу вы хотите для вашего проекта?",
    ja: "プロジェクトにどんな雰囲気を求めますか？",
    ko: "프로젝트에 어떤 분위기를 원하시나요?",
    zh: "您希望项目具有什么样的氛围？",
    ar: "ما هو الطابع الذي تريده لمشروعك؟",
    he: "איזה ווייב אתה רוצה לפרויקט שלך?",
    hi: "आप अपने प्रोजेक्ट के लिए कैसा वाइब चाहते हैं?",
    tr: "Projeniz için nasıl bir atmosfer istiyorsunuz?",
    uk: "Яку атмосферу ви хочете для свого проекту?",
  },

  analyzeVibe: {
    en: "Analyze Vibe",
    es: "Analizar Vibe",
    fr: "Analyser l'Ambiance",
    de: "Stimmung Analysieren",
    it: "Analizza Atmosfera",
    pt: "Analisar Vibe",
    ru: "Анализировать Атмосферу",
    ja: "雰囲気を分析",
    ko: "분위기 분석",
    zh: "分析氛围",
    ar: "تحليل الطابع",
    he: "נתח ווייב",
    hi: "वाइब का विश्लेषण करें",
    tr: "Atmosferi Analiz Et",
    uk: "Аналізувати Атмосферу",
  },

  // Mood Board
  moodBoard: {
    en: "Mood Board",
    es: "Tablero de Inspiración",
    fr: "Planche d'Ambiance",
    de: "Stimmungstafel",
    it: "Tavola dell'Umore",
    pt: "Painel de Humor",
    ru: "Доска Настроения",
    ja: "ムードボード",
    ko: "무드 보드",
    zh: "情绪板",
    ar: "لوحة المزاج",
    he: "לוח מצב רוח",
    hi: "मूड बोर्ड",
    tr: "Ruh Hali Panosu",
    uk: "Дошка Настрою",
  },

  generateMoodBoard: {
    en: "Generate Mood Board",
    es: "Generar Tablero",
    fr: "Générer la Planche",
    de: "Tafel Generieren",
    it: "Genera Tavola",
    pt: "Gerar Painel",
    ru: "Создать Доску",
    ja: "ムードボードを生成",
    ko: "무드 보드 생성",
    zh: "生成情绪板",
    ar: "إنشاء لوحة المزاج",
    he: "צור לוח מצב רוח",
    hi: "मूड बोर्ड बनाएं",
    tr: "Ruh Hali Panosu Oluştur",
    uk: "Створити Дошку",
  },

  // Security
  securityValidation: {
    en: "Security Validation",
    es: "Validación de Seguridad",
    fr: "Validation de Sécurité",
    de: "Sicherheitsvalidierung",
    it: "Validazione Sicurezza",
    pt: "Validação de Segurança",
    ru: "Проверка Безопасности",
    ja: "セキュリティ検証",
    ko: "보안 검증",
    zh: "安全验证",
    ar: "التحقق من الأمان",
    he: "אימות אבטחה",
    hi: "सुरक्षा सत्यापन",
    tr: "Güvenlik Doğrulaması",
    uk: "Перевірка Безпеки",
  },

  // Payment
  payment: {
    en: "Payment",
    es: "Pago",
    fr: "Paiement",
    de: "Zahlung",
    it: "Pagamento",
    pt: "Pagamento",
    ru: "Платеж",
    ja: "支払い",
    ko: "결제",
    zh: "付款",
    ar: "الدفع",
    he: "תשלום",
    hi: "भुगतान",
    tr: "Ödeme",
    uk: "Платіж",
  },

  payWithGooglePay: {
    en: "Pay with Google Pay",
    es: "Pagar con Google Pay",
    fr: "Payer avec Google Pay",
    de: "Mit Google Pay bezahlen",
    it: "Paga con Google Pay",
    pt: "Pagar com Google Pay",
    ru: "Оплатить через Google Pay",
    ja: "Google Payで支払う",
    ko: "Google Pay로 결제",
    zh: "使用Google Pay付款",
    ar: "الدفع باستخدام Google Pay",
    he: "שלם עם Google Pay",
    hi: "Google Pay से भुगतान करें",
    tr: "Google Pay ile Öde",
    uk: "Сплатити через Google Pay",
  },

  payWithApplePay: {
    en: "Pay with Apple Pay",
    es: "Pagar con Apple Pay",
    fr: "Payer avec Apple Pay",
    de: "Mit Apple Pay bezahlen",
    it: "Paga con Apple Pay",
    pt: "Pagar com Apple Pay",
    ru: "Оплатить через Apple Pay",
    ja: "Apple Payで支払う",
    ko: "Apple Pay로 결제",
    zh: "使用Apple Pay付款",
    ar: "الدفع باستخدام Apple Pay",
    he: "שלם עם Apple Pay",
    hi: "Apple Pay से भुगतान करें",
    tr: "Apple Pay ile Öde",
    uk: "Сплатити через Apple Pay",
  },

  // Common Actions
  save: {
    en: "Save",
    es: "Guardar",
    fr: "Sauvegarder",
    de: "Speichern",
    it: "Salva",
    pt: "Salvar",
    ru: "Сохранить",
    ja: "保存",
    ko: "저장",
    zh: "保存",
    ar: "حفظ",
    he: "שמור",
    hi: "सेव करें",
    tr: "Kaydet",
    uk: "Зберегти",
  },

  cancel: {
    en: "Cancel",
    es: "Cancelar",
    fr: "Annuler",
    de: "Abbrechen",
    it: "Annulla",
    pt: "Cancelar",
    ru: "Отменить",
    ja: "キャンセル",
    ko: "취소",
    zh: "取消",
    ar: "إلغاء",
    he: "בטל",
    hi: "रद्द करें",
    tr: "İptal",
    uk: "Скасувати",
  },

  loading: {
    en: "Loading...",
    es: "Cargando...",
    fr: "Chargement...",
    de: "Laden...",
    it: "Caricamento...",
    pt: "Carregando...",
    ru: "Загрузка...",
    ja: "読み込み中...",
    ko: "로딩 중...",
    zh: "加载中...",
    ar: "جاري التحميل...",
    he: "טוען...",
    hi: "लोड हो रहा है...",
    tr: "Yükleniyor...",
    uk: "Завантаження...",
  },

  // Error Messages
  errorOccurred: {
    en: "An error occurred",
    es: "Ocurrió un error",
    fr: "Une erreur s'est produite",
    de: "Ein Fehler ist aufgetreten",
    it: "Si è verificato un errore",
    pt: "Ocorreu um erro",
    ru: "Произошла ошибка",
    ja: "エラーが発生しました",
    ko: "오류가 발생했습니다",
    zh: "发生错误",
    ar: "حدث خطأ",
    he: "אירעה שגיאה",
    hi: "एक त्रुटि हुई",
    tr: "Bir hata oluştu",
    uk: "Сталася помилка",
  },

  // Success Messages
  success: {
    en: "Success!",
    es: "¡Éxito!",
    fr: "Succès!",
    de: "Erfolg!",
    it: "Successo!",
    pt: "Sucesso!",
    ru: "Успех!",
    ja: "成功！",
    ko: "성공!",
    zh: "成功！",
    ar: "نجح!",
    he: "הצלחה!",
    hi: "सफलता!",
    tr: "Başarılı!",
    uk: "Успіх!",
  },
}

export function detectLanguage(text: string): string {
  // Enhanced language detection with better patterns
  const patterns = {
    ar: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
    he: /[\u0590-\u05FF]/,
    ru: /[\u0400-\u04FF]/,
    ja: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
    ko: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
    zh: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
    hi: /[\u0900-\u097F]/,
    tr: /[çğıöşüÇĞIİÖŞÜ]/,
    de: /[äöüßÄÖÜ]|\b(der|die|das|und|ist|zu|den|mit|für|auf|von|im|eine|einen|einer|ein|sich|auch|an|werden|aus|er|hat|dass|sie|nach|wird|bei|noch|wie|einem|über|einen|so|zum|war|haben|nur|oder|aber|vor|zur|bis|unter|während|des|sein|sehr|um|durch|man|auch|andere|viele|kein|muss|große|neue|eigenen|ersten|beiden|leben|diese|diesem|gegen|jahr|viel|mehr|doch|schon|wenn|hier|alle|als|zwischen|heute|weit|gehen|seit|weg|welt|seite|dabei|frau|oft|tun|beispiel|hält|eins|nie|zweite|mal|dann|sehen|sehr|sicher|heißt|wer|jedoch|alles|wieder|weil|weg|unter|denn|dort|rechts|soweit|ganz|schnell|zusammen|kam|kommen|ihm|vom|sagte|jetzt|immer|während|ja|darf|damit|schon|hin|ohne|sondern|wohl|eines|solche|da|zur|um|am|sind|noch|wie|einem|nach|oben|die|können|soll|sagt|möglich|wegen|sonst|vielleicht|allein|vielleicht|eigentlich|fast|lange|genug|wenig|dabei|gleich|ganz|eben|falls|plötzlich|spät|früh|sofort|bald|manchmal|oft|immer|nie|heute|gestern|morgen|jetzt|hier|da|dort|links|rechts|oben|unten|innen|außen|vorn|hinten|neben|zwischen|über|unter|vor|hinter|in|an|auf|zu|bei|mit|für|gegen|ohne|durch|um|von|aus|nach|seit|bis|während|wegen|trotz|statt|außer|binnen|dank|laut|zufolge|gemäß|entsprechend|bezüglich|hinsichtlich|angesichts|aufgrund|infolge|zwecks|anstatt|anstelle|mittels|vermittels|kraft|mangels|seitens|vonseiten|behufs|halber|um|willen|zuliebe|zugunsten|ungeachtet|unbeschadet|vorbehaltlich|einschließlich|ausschließlich|zuzüglich|abzüglich|samt|nebst|mitsamt|eingerechnet|ausgenommen|außer|bis|auf|an|entlang|gegenüber|nahe|unweit|abseits|diesseits|jenseits|oberhalb|unterhalb|innerhalb|außerhalb|beiderseits|längs|rings|seitlich|nördlich|südlich|östlich|westlich|links|rechts|geradeaus|rückwärts|vorwärts|aufwärts|abwärts|einwärts|auswärts|heimwärts|seewärts|landwärts|stromaufwärts|stromabwärts|bergauf|bergab|talwärts|himmelwärts|erdwärts|nordwärts|südwärts|ostwärts|westwärts)\b/gi,
    fr: /\b(le|de|et|à|un|il|être|et|en|avoir|que|pour|dans|ce|son|une|sur|avec|ne|se|pas|tout|plus|par|grand|ou|si|les|deux|même|lui|temps|très|état|autre|bien|où|sans|peut|sous|cette|entre|encore|ces|jusqu|contre|tout|pendant|moins|rien|celui|ci|avant|eau|vers|plusieurs|bon|voici|matin|trop|cinq|devez|anglais|dit|possède|jours|parce|voiture|aller|vous|gouvernement|et|ceux|pendant|work|chaque|contre|votre|tout|état|dans|être|cours|plusieurs|groupe|pays|problème|main|fin|public|suivant|sans|place|cas|part|groupe|enfant|point|monde|fait|après|premier|jour|monsieur|grand|travail|gouvernement|petit|dire|part|nombre|grand|pendant|être|temps|très|savoir|falloir|voir|en|bien|autre|donner|travail|cinq|rester|pour|enfant|venir|où|demander|grand|être|avoir|là|haut|magasin|pourquoi|pas|madame|très|jour|monsieur|demain|beaucoup|où|voici|combien|non|merci|au|revoir|bonsoir|bonjour|salut|ça|va|oui|voici|merci|beaucoup|de|rien|je|vous|en|prie|excusez|moi|pardon|comment|allez|vous|très|bien|et|vous|ça|va|pas|mal|comme|ci|comme|ça|qu|est|ce|que|vous|faites|qu|est|ce|que|c|est|je|ne|sais|pas|je|ne|comprends|pas|pouvez|vous|répéter|s|il|vous|plaît|où|est|combien|ça|coûte|l|addition|s|il|vous|plaît|je|voudrais|avez|vous|est|ce|que|vous|avez|je|cherche|où|puis|je|trouver|à|quelle|heure|comment|dit|on|en|français|parlez|vous|anglais|je|suis|américain|je|suis|américaine|je|viens|des|états|unis|enchanté|enchantée)\b/gi,
    es: /\b(el|la|de|que|y|a|en|un|ser|se|no|te|lo|le|da|su|por|son|con|para|al|una|sur|también|todo|pero|más|hacer|o|poder|decir|este|ir|otro|ese|la|si|me|ya|ver|porque|dar|cuando|él|muy|sin|vez|mucho|saber|qué|sobre|mi|alguno|mismo|yo|también|hasta|año|dos|querer|entre|así|primero|desde|grande|eso|ni|nos|llegar|pasar|tiempo|ella|sí|día|uno|bien|poco|deber|entonces|poner|aquí|seguir|parecer|fin|tanto|donde|mismo|después|oír|salir|mientras|estar|mundo|mano|tener|conseguir|cabeza|ejemplo|llevar|crear|gustar|minuto|propio|tomar|nadie|cierto|conocer|último|empezar|incluso|nunca|antes|movimiento|derecho|pueblo|objeto|momento|través|durante|segundo|punto|quizá|gobierno|creer|mejor|igual|seguro|ciento|agua|ganar|historia|comprar|bastante|relación|recordar|terminar|permitir|aparece|programa|casi|proyecto|lado|menor|tipo|trabajar|niño|medio|encontrar|casa|bajo|parte|general|alto|guerra|valor|mostrar|voces|viene|razón|esperar|cuatro|falta|grupo|sentir|joven|país|problema|mano|lugar|caso|parte|grupo|niño|punto|mundo|hecho|después|primero|día|señor|grande|trabajo|gobierno|pequeño|decir|parte|número|grande|durante|ser|tiempo|muy|saber|tener|ver|en|bien|otro|dar|trabajo|cinco|quedar|para|niño|venir|donde|pedir|grande|ser|tener|allí|alto|tienda|por|qué|no|señora|muy|día|señor|mañana|mucho|donde|aquí|cuánto|no|gracias|adiós|buenas|noches|buenos|días|hola|qué|tal|sí|aquí|gracias|muchas|de|nada|por|favor|perdón|cómo|está|usted|muy|bien|y|usted|qué|tal|no|está|mal|así|así|qué|hace|usted|qué|es|esto|no|sé|no|entiendo|puede|repetir|por|favor|dónde|está|cuánto|cuesta|la|cuenta|por|favor|quisiera|tiene|usted|tiene|busco|dónde|puedo|encontrar|a|qué|hora|cómo|se|dice|en|español|habla|usted|inglés|soy|americano|soy|americana|vengo|de|estados|unidos|mucho|gusto)\b/gi,
    it: /\b(il|di|che|e|la|per|un|è|in|del|con|non|da|una|su|sono|come|ma|le|si|nella|anche|lo|se|tutto|quando|lui|dove|più|ci|molto|bene|senza|me|fino|tanto|tempo|lei|mio|al|solo|sì|prima|state|dopo|mentre|ora|fatto|tutti|fare|altro|cose|già|così|qui|detto|ogni|tre|casa|so|cosa|questa|grande|quella|là|fare|era|erano|stata|essere|suo|mia|fare|dire|quello|mi|te|lo|ci|vi|li|le|ne|uno|una|del|della|dei|delle|dal|dalla|dai|dalle|nel|nella|nei|nelle|sul|sulla|sui|sulle|col|colla|coi|colle)\b/gi,
    pt: /\b(o|de|a|e|do|da|em|um|para|é|com|não|uma|os|no|se|na|por|mais|as|dos|como|mas|foi|ao|ele|das|tem|à|seu|sua|ou|ser|quando|muito|há|nos|já|está|eu|também|só|pelo|pela|até|isso|ela|entre|era|depois|sem|mesmo|aos|ter|seus|quem|nas|me|esse|eles|estão|você|tinha|foram|essa|num|nem|suas|meu|às|minha|têm|numa|pelos|elas|havia|seja|qual|será|nós|tenho|lhe|deles|essas|esses|pelas|este|fosse|dele|tu|te|vocês|vos|lhes|meus|minhas|teu|tua|teus|tuas|nosso|nossa|nossos|nossas|dele|dela|deles|delas)\b/gi,
    uk: /\b(і|в|не|на|з|що|до|як|за|по|від|або|але|та|це|для|при|під|над|про|через|між|без|після|перед|біля|крім|окрім|замість|всередині|зовні|навколо|вздовж|поперек|назустріч|услід|попереду|позаду|зліва|справа|зверху|знизу|всередину|назовні|додому|звідси|звідти|сюди|туди|де|куди|звідки|коли|як|чому|навіщо|скільки|який|яка|яке|які|чий|чия|чиє|чиї|хто|що|кого|чого|кому|чому|ким|чим|на|кому|на|чому|я|ти|він|вона|воно|ми|ви|вони|мене|тебе|його|її|нас|вас|їх|мені|тобі|йому|їй|нам|вам|їм|мною|тобою|ним|нею|нами|вами|ними)\b/gi,
  }

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang
    }
  }

  return "en" // Default to English
}

export function translate(key: string, language = "en"): string {
  return TRANSLATIONS[key]?.[language] || TRANSLATIONS[key]?.["en"] || key
}

export function getLanguageDirection(languageCode: string): "ltr" | "rtl" {
  const rtlLanguages = ["ar", "he", "fa", "ur"]
  return rtlLanguages.includes(languageCode) ? "rtl" : "ltr"
}

export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)
}

export function formatCurrency(amount: number, currency: string, language: string): string {
  try {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency: currency,
    }).format(amount)
  } catch (error) {
    return `${amount} ${currency}`
  }
}

export function formatDate(date: Date, language: string): string {
  try {
    return new Intl.DateTimeFormat(language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  } catch (error) {
    return date.toLocaleDateString()
  }
}

export function formatTime(date: Date, language: string): string {
  try {
    return new Intl.DateTimeFormat(language, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    return date.toLocaleTimeString()
  }
}
