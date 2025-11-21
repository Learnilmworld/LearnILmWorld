import express from 'express';
import Chatbot from '../models/Chatbot.js';
import fetch from 'node-fetch';
import fs from 'fs';

const router = express.Router();

// ================================
// KNOWLEDGE BASE LOADING
// ================================
let scrapedData = [];

try {
  scrapedData = JSON.parse(fs.readFileSync('full_site_data.json', 'utf8'));
} catch (error) {
  scrapedData = [];
}

// ================================
// SMART SEARCH FUNCTION
// ================================
function searchScrapedData(query) {
  if (!scrapedData || scrapedData.length === 0) {
    return null;
  }

  query = query.toLowerCase();

  const keywordMap = {
    'mentor': ['mentor', 'trainer', 'teacher', 'instructor', 'expert', 'educator', 'tutor'],
    'certificate': ['certificate', 'certification', 'completion', 'assessment', 'credential'],
    'equipment': ['equipment', 'laptop', 'requirements', 'device', 'tools', 'need', 'require'],
    'class': ['class', 'lesson', 'session', 'schedule', 'structure', '1-on-1', 'virtual'],
    'book': ['book', 'schedule', 'reserve', 'how to', 'get started', 'choose', 'search', 'find']
  };

  let matches = [];

  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      const categoryMatches = scrapedData.filter(item => {
        const content = (item.content || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        const section = (item.section || '').toLowerCase();

        return keywords.some(keyword =>
          content.includes(keyword) ||
          title.includes(keyword) ||
          section.includes(keyword)
        );
      });
      matches.push(...categoryMatches);
    }
  }

  matches = matches.filter((item, index, self) =>
    index === self.findIndex(i => i.content === item.content)
  );

  return matches.slice(0, 5);
}

// ================================
// CLEAN ANSWER GENERATOR - GIVES PROPER ANSWERS
// ================================
function generateStrictAnswer(question, websiteData, language) {
  if (!websiteData || websiteData.length === 0) {
    return null;
  }

  const q = question.toLowerCase();

  // SEARCH FOR TRAINERS - CLEAN ANSWER
  if (q.includes('search') || q.includes('find') || q.includes('where') || q.includes('look for') || q.includes('trainer') || q.includes('mentor')) {
    const searchData = websiteData.filter(item =>
      (item.content || '').toLowerCase().includes('search') ||
      (item.content || '').toLowerCase().includes('find') ||
      (item.content || '').toLowerCase().includes('filter') ||
      (item.content || '').toLowerCase().includes('browse') ||
      (item.section || '').toLowerCase().includes('faq')
    );

    if (searchData.length > 0) {
      return `To search for trainers on LearnILmWorld:

🔍 How to Find Trainers:
• Use the "Browse our Mentors" section on the website
• Apply filters like experience, ratings, and pricing
• Watch trainer video introductions
• Read student reviews and ratings

You can find and filter through our expert trainers to find the perfect match for your learning needs!`;
    }
  }

  // MENTORS - CLEAN ANSWER
  if (q.includes('mentor') || q.includes('trainer') || q.includes('teacher')) {
    return `🤝 Our Mentors & Trainers:

At LearnILmWorld, we connect you with certified expert trainers from around the world for personalized 1-on-1 sessions.

Features:
• Certified experts in languages, sciences, math, and computer science
• Global community of passionate educators  
• Flexible scheduling with trainers worldwide
• Video introductions and student reviews
• Filter by subject, experience, and availability

Browse our mentor profiles to find your perfect learning partner!`;
  }

  // CERTIFICATES - CLEAN ANSWER
  if (q.includes('certificate') || q.includes('certification')) {
    return `🏆 Certificates:

Yes! LearnILmWorld provides completion certificates for our courses.

Certificate Details:
• Issued after completing courses and passing required assessments
• Downloadable digital certificates
• Shareable to showcase your new skills
• Proof of course completion and skill acquisition

Complete your course to receive your certificate!`;
  }

  // EQUIPMENT - CLEAN ANSWER
  if (q.includes('equipment') || q.includes('laptop') || q.includes('need') || q.includes('require')) {
    return `💻 Equipment Needed:

For LearnILmWorld sessions, you'll need basic equipment:

• Laptop or computer with internet connection
• Webcam and microphone for interactive sessions
• Our platform works great on mobile devices too
• Progressive Web App (PWA) available

No special equipment required!`;
  }

  // CLASS STRUCTURE - CLEAN ANSWER
  if (q.includes('class') || q.includes('lesson') || q.includes('structure') || q.includes('schedule')) {
    return `📚 Class Structure:

LearnILmWorld offers personalized learning experiences:

• 1-on-1 sessions with expert trainers
• Flexible scheduling to fit your availability
• Interactive virtual classrooms
• Reschedule up to 24 hours before sessions
• Learning materials provided by trainers

Schedule sessions at your convenience!`;
  }

  // BOOKING - CLEAN ANSWER
  if (q.includes('book') || q.includes('how to') || q.includes('get started')) {
    return `🎯 How to Get Started:

Booking sessions on LearnILmWorld is easy:

1. Browse - Look through our trainer profiles
2. Filter - Use experience, rating, and price filters
3. Review - Watch videos and read student reviews
4. Message - Send a short message to potential trainers
5. Schedule - Book sessions based on mutual availability
6. Learn - Join interactive 1-on-1 sessions

Start by browsing our mentor community today!`;
  }

  return null;
}

// =====================================
// GEMINI SERVICE - CLEAN RESPONSES
// =====================================
const GeminiService = {
  generateResponse: async (message, conversationHistory = [], language = 'en') => {
    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!API_KEY) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      // Get website data
      const websiteData = searchScrapedData(message);

      // Try to generate clean answer first
      const manualAnswer = generateStrictAnswer(message, websiteData, language);

      if (manualAnswer) {
        return {
          success: true,
          response: manualAnswer,
          source: 'website_data_direct'
        };
      }

      // Convert website data to clean context for Gemini
      const websiteContext = websiteData && websiteData.length > 0
        ? websiteData.map(item => {
          // Clean up the content - remove repetitive parts
          let cleanContent = item.content || '';
          // Remove common repetitive phrases
          cleanContent = cleanContent.replace(/LEARNILM WORLD 🌎 Browse our Mentors Sign In Get started/g, '');
          cleanContent = cleanContent.replace(/💬 Ask LEARNilM/g, '');
          cleanContent = cleanContent.replace(/© 2025 Learnilm World — All rights reserved\.?/g, '');

          return `[${item.section || 'Info'}] ${cleanContent}`;
        }).join('\n\n')
        : "LearnILmWorld connects students with expert trainers for personalized 1-on-1 sessions.";

      // Clean prompt for Gemini
      const CLEAN_PROMPT = `
You are LearnILmWorld's helpful assistant. Answer the user's question clearly and concisely using the website information below.

WEBSITE INFORMATION:
${websiteContext}

USER QUESTION: "${message}"

INSTRUCTIONS:
1. Give a clear, direct answer to the question
2. Use bullet points or numbered lists for steps/features
3. Keep it conversational and helpful
4. Don't just repeat the website content - summarize it usefully
5. If it's about finding trainers, explain the search/filter process
6. Language: ${language}

ANSWER:
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: CLEAN_PROMPT }] }],
            generationConfig: {
              temperature: 0.3,
              topP: 0.8,
              maxOutputTokens: 500
            }
          })
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      let answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // If Gemini gives a weak response, use our clean manual answer
      const weakPhrases = [
        "I'm sorry", "I cannot", "unable to", "I don't have",
        "I couldn't find", "no information", "contact support"
      ];

      if (weakPhrases.some(phrase => answer.toLowerCase().includes(phrase.toLowerCase()))) {
        const fallbackAnswer = generateStrictAnswer(message, websiteData, language) ||
          "I'd be happy to help you find trainers or learn about our services at LearnILmWorld!";
        return {
          success: true,
          response: fallbackAnswer,
          source: 'clean_fallback'
        };
      }

      return {
        success: true,
        response: answer,
        source: 'gemini_clean'
      };

    } catch (error) {
      const websiteData = searchScrapedData(message);
      const manualAnswer = generateStrictAnswer(message, websiteData, language) ||
        "Welcome to LearnILmWorld! I can help you find expert trainers, learn about our courses, or answer any questions about our services.";

      return {
        success: true,
        response: manualAnswer,
        source: 'error_fallback'
      };
    }
  }
};

// ================================
// REST OF THE CODE (same as before)
// ================================

const LanguageDetector = {
  detect: (text) => {
    const hindiRegex = /[\u0900-\u097F]/;
    const sanskritRegex = /[\u0900-\u097F]|[अ-ह]/;
    const japaneseRegex = /[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FFF]/;
    const spanishRegex = /[áéíóúñ¿¡]/i;
    const frenchRegex = /[àâçéèêëîïôûùüÿæœ]/i;
    const germanRegex = /[äöüß]/i;

    if (hindiRegex.test(text)) return 'hi';
    if (sanskritRegex.test(text) && text.includes('अस्मि') || text.includes('विद्यार्थी')) return 'sa';
    if (japaneseRegex.test(text)) return 'ja';
    if (spanishRegex.test(text)) return 'es';
    if (frenchRegex.test(text)) return 'fr';
    if (germanRegex.test(text)) return 'de';
    return 'en';
  }
};

const TimeBasedGreeting = {
  getGreeting: (language = 'en') => {
    const hour = new Date().getHours();
    let timeOfDay = '';

    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const greetings = {
      morning: { en: 'Good morning', hi: 'शुभ प्रभात', fr: 'Bonjour', es: 'Buenos días', de: 'Guten Morgen', ja: 'おはようございます', sa: 'सुप्रभातम्' },
      afternoon: { en: 'Good afternoon', hi: 'शुभ दोपहर', fr: 'Bon après-midi', es: 'Buenas tardes', de: 'Guten Tag', ja: 'こんにちは', sa: 'सुभमध्याह्नम्' },
      evening: { en: 'Good evening', hi: 'शुभ संध्या', fr: 'Bonsoir', es: 'Buenas noches', de: 'Guten Abend', ja: 'こんばんは', sa: 'सुभसन्ध्याकालम्' },
      night: { en: 'Good night', hi: 'शुभ रात्रि', fr: 'Bonne nuit', es: 'Buenas noches', de: 'Gute Nacht', ja: 'おやすみなさい', sa: 'शुभरात्रिः' }
    };

    return greetings[timeOfDay][language] || greetings[timeOfDay].en;
  }
};

const SMART_AI = {
  isFirstInteraction: (conversation = []) =>
    conversation.length === 0 || (conversation.length === 1 && conversation[0].role === 'assistant'),

  getNameMessage: (language = 'en') => {
    const greeting = TimeBasedGreeting.getGreeting(language);
    const messages = {
      en: `${greeting}! 👋 Welcome to LearnILmWorld! To personalize your experience, could you please tell me your name?`,
      hi: `${greeting}! 👋 LearnILmWorld में आपका स्वागत है! आपके अनुभव को व्यक्तिगत बनाने के लिए, कृपया मुझे अपना नाम बताएं?`,
      fr: `${greeting}! 👋 Bienvenue sur LearnILmWorld ! Pour personnaliser votre expérience, pourriez-vous me dire votre nom ?`,
      es: `${greeting}! 👋 ¡Bienvenido a LearnILmWorld! Para personalizar su experiencia, ¿podría decirme su nombre?`,
      de: `${greeting}! 👋 Willkommen bei LearnILmWorld! Um Ihr Erlebnis zu personalisieren, könnten Sie mir bitte Ihren Namen mitteilen?`,
      ja: `${greeting}! 👋 LearnILmWorldへようこそ！あなたの体験をパーソナライズするために、お名前を教えていただけますか？`,
      sa: `${greeting}! 👋 LearnILmWorld प्रति स्वागतम्! भवतः अनुभवं वैयक्तिकीकर्तुं, कृपया भवतः नाम सूचयतु?`
    };
    return messages[language] || messages.en;
  },

  generateResponse: async (question, language = 'en', userContext = {}, conversation = []) => {
    const websiteData = searchScrapedData(question);
    const manualAnswer = generateStrictAnswer(question, websiteData, language);

    if (manualAnswer) {
      return { response: manualAnswer };
    }

    return {
      response: "I can help you with information about LearnILmWorld's learning programs and services!"
    };
  }
};

const UnifiedResponseGenerator = {
  generate: async (message, language = 'en', userContext = {}, conversation = []) => {
    const detectedLanguage = LanguageDetector.detect(message);
    const useLanguage = detectedLanguage !== 'en' ? detectedLanguage : language;

    if (userContext.collectingInfo || userContext.needsRole) {
      const smartResponse = await SMART_AI.generateResponse(message, useLanguage, userContext, conversation);
      return {
        response: smartResponse.response,
        source: 'smart_ai_info_collection',
        context: smartResponse.context || userContext
      };
    }

    try {
      const geminiResult = await GeminiService.generateResponse(message, conversation, useLanguage);

      if (geminiResult.success && geminiResult.response) {
        return {
          response: geminiResult.response,
          source: geminiResult.source || 'gemini_website',
          context: userContext
        };
      } else {
        throw new Error('Gemini service failed');
      }

    } catch (error) {
      const trainingResponse = await SMART_AI.generateResponse(message, useLanguage, userContext, conversation);
      return {
        response: trainingResponse.response,
        source: 'ultimate_fallback',
        context: trainingResponse.context || userContext
      };
    }
  }
};

// Routes (same as before)
router.post('/start', async (req, res) => {
  try {
    const { language = 'en', message } = req.body;
    let detectedLanguage = language;
    if (message) detectedLanguage = LanguageDetector.detect(message);

    const userId = `guest_${Math.random().toString(36).substr(2, 9)}`;
    const session = new Chatbot({
      sessionId: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId, userType: 'guest', language: detectedLanguage, conversation: [],
      userContext: { collectingInfo: true, currentStep: 'name' }
    });

    const welcomeMessage = SMART_AI.getNameMessage(detectedLanguage);
    session.conversation.push({ role: 'assistant', message: welcomeMessage });
    await session.save();

    res.json({ sessionId: session.sessionId, conversation: session.conversation, needsInfo: true, infoType: 'name', detectedLanguage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start chat' });
  }
});

router.post('/message', async (req, res) => {
  try {
    const { sessionId, message, language = 'en' } = req.body;
    const session = await Chatbot.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Chat session not found' });

    session.conversation.push({ role: 'user', message });
    session.userContext = session.userContext || {};

    const unifiedResponse = await UnifiedResponseGenerator.generate(message, language, session.userContext, session.conversation);

    session.conversation.push({ role: 'assistant', message: unifiedResponse.response, source: unifiedResponse.source });
    if (unifiedResponse.context) session.userContext = unifiedResponse.context;
    await session.save();

    res.json({ response: unifiedResponse.response, conversation: session.conversation, source: unifiedResponse.source });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
});

router.get('/history/:sessionId', async (req, res) => {
  try {
    const session = await Chatbot.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session.conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;