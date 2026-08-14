// =====================================================
// GROQ SERVICE
// =====================================================

let groqClient = null;

// =====================================================
// CHECK API KEY
// =====================================================

if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is missing from .env');
}

// =====================================================
// GROQ SETUP
// =====================================================

const MODEL_NAME =
  process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const getGroqClient = async () => {
  if (!groqClient) {
    const { default: Groq } = await import('groq-sdk');

    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groqClient;
};

// =====================================================
// CRISIS DETECTION
// =====================================================

const CRISIS_KEYWORDS = [
  'kill myself',
  'suicide',
  'end my life',
  'want to die',
  "don't want to live",
  'self harm',
  'self-harm',
  'hurt myself',
  'cutting myself',
  'no reason to live',
  'better off dead',
  "can't go on",
  'ending it all',
  'overdose',
];

const containsCrisisLanguage = (text = '') => {
  const lower = text.toLowerCase();

  return CRISIS_KEYWORDS.some((keyword) =>
    lower.includes(keyword)
  );
};

// =====================================================
// CRISIS RESPONSE
// =====================================================

const CRISIS_RESPONSE = `
I'm really glad you reached out. What you shared sounds serious, and your immediate safety matters.

I'm not able to provide emergency or crisis support.

Please contact local emergency services or a crisis support service in your area, or reach out to someone you trust who can stay with you right now.

If you may be in immediate danger, please move to a safer place and seek in-person help as soon as possible.

You can continue talking here, but please prioritize getting real-time human support.
`;

// =====================================================
// GITA SYSTEM PROMPT
// =====================================================

const GITA_SYSTEM_PROMPT = `
You are a compassionate mental wellness reflection assistant inspired by philosophical teachings from the Bhagavad Gita.

Your role is to provide calm, non-judgmental emotional support and reflective guidance.

IMPORTANT RULES:

- Never claim to be Krishna.
- Never claim to be a deity.
- Never claim to be a therapist, psychologist, psychiatrist, doctor, or medical professional.
- Do not diagnose mental health conditions.
- Do not recommend stopping medication or therapy.
- Do not shame users through religion, karma, morality, destiny, or spirituality.

Use Bhagavad Gita teachings only when they naturally relate to the user's concern.

Frame teachings using language such as:

"From the perspective of the Bhagavad Gita..."

or

"A teaching from the Gita that may help here is..."

Never pretend Krishna is directly speaking to the user.

Do NOT invent Sanskrit verses, quotations, chapter numbers, or verse numbers.

If you are completely confident about a verse reference, you may mention it while paraphrasing the teaching.

If you are unsure about the exact reference, explain the teaching without mentioning a chapter or verse number.

Use simple, warm and modern language.

Respond using exactly this structure:

### 🌸 What you may need to hear

Give a short and compassionate acknowledgement of what the user shared.

### 🦚 Gita Wisdom

Share a relevant Bhagavad Gita-inspired teaching in simple language.

### 🌿 What this means for you

Connect the teaching directly to the user's situation in modern and relatable language.

### ✨ Try this today

Give ONE small, realistic and practical action they can take today.

### 🪷 Reflection

Give one short first-person reflective statement.

Example:

"I will focus on what I can control and gently release what I cannot."

Keep the response supportive and not excessively long.
`;

// =====================================================
// COMPANION SYSTEM PROMPT
// =====================================================

const COMPANION_SYSTEM_PROMPT = `
You are Sukoon, a warm and emotionally supportive AI companion inside a mental wellness application.

Your purpose is to help users talk through everyday emotional struggles.

You can provide:

- active listening
- gentle emotional validation
- calming suggestions
- grounding techniques
- positive reframing
- encouragement
- simple practical next steps

IMPORTANT RULES:

- Never claim to be a therapist.
- Never claim to be a psychologist.
- Never claim to be a psychiatrist.
- Never claim to be a doctor.
- Do not diagnose mental health disorders.
- Do not prescribe treatments.
- Do not suggest stopping medication or therapy.

You may acknowledge feelings without giving them a clinical diagnosis.

Keep responses warm, conversational and concise.

Usually respond in 2-4 short paragraphs.

Ask at most one gentle follow-up question if it would genuinely help.

For serious or ongoing struggles, gently encourage seeking support from a qualified mental health professional.
`;

// =====================================================
// JOURNAL REFLECTION PROMPT
// =====================================================

const REFLECTION_SYSTEM_PROMPT = `
You are a gentle reflection assistant reviewing a personal journal entry.

Write a short 3-5 sentence reflection.

Your response should:

- acknowledge the person's feelings
- gently notice themes or emotional patterns
- remain non-judgmental
- avoid clinical diagnoses
- avoid moralizing
- provide gentle encouragement

Speak directly to the writer in warm, simple language.
`;

// =====================================================
// THOUGHT SORTING PROMPT
// =====================================================

const SORTING_SYSTEM_PROMPT = `
You help people organize overwhelming or racing thoughts.

Given a stream-of-consciousness brain dump, classify the thoughts into exactly these categories:

1. Things I can control
2. Things I cannot control
3. Things that need action
4. Things that can wait
5. Things I may be assuming

Then create exactly three small practical next steps.

Return ONLY valid JSON.

Do NOT use markdown code fences.

Do NOT include explanations outside the JSON.

Use exactly this structure:

{
  "canControl": ["..."],
  "cannotControl": ["..."],
  "needsAction": ["..."],
  "canWait": ["..."],
  "assumptions": ["..."],
  "nextSteps": ["...", "...", "..."]
}

Keep every item under 20 words.
`;

// =====================================================
// WEEKLY INSIGHT PROMPT
// =====================================================

const WEEKLY_INSIGHT_SYSTEM_PROMPT = `
You are a gentle wellness reflection assistant.

You will receive a summary of a user's:

- mood entries
- journal activity
- gratitude activity
- mindfulness activity

from the past seven days.

Write a short 3-5 sentence reflection.

Notice helpful patterns where possible.

Avoid diagnoses and clinical language.

Be encouraging, warm and specific.

Do not exaggerate conclusions if there is little data.
`;

// =====================================================
// MAIN GROQ CALL
// =====================================================

async function callGroq(
  systemPrompt,
  userContent,
  history = [],
  options = {}
) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        'GROQ_API_KEY is not configured'
      );
    }

    console.log(
      `🤖 Calling Groq model: ${MODEL_NAME}`
    );

    const groq = await getGroqClient();

    // MongoDB conversation history
    const chatHistory = history
      .filter(
        (message) =>
          message?.content &&
          message?.role
      )
      .map((message) => ({
        role:
          message.role === 'assistant'
            ? 'assistant'
            : 'user',
        content: message.content,
      }));

    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },

      ...chatHistory,

      {
        role: 'user',
        content: userContent,
      },
    ];

    const request = {
      model: MODEL_NAME,
      messages,
      temperature: options.temperature ?? 0.7,
      max_completion_tokens:
        options.maxTokens ?? 1000,
    };

    // Used for thought sorting
    if (options.json) {
      request.response_format = {
        type: 'json_object',
      };
    }

    const completion =
      await groq.chat.completions.create(request);

    const text =
      completion.choices?.[0]?.message?.content;

    if (!text || !text.trim()) {
      throw new Error(
        'Groq returned an empty response'
      );
    }

    console.log('✅ Groq response received');

    return text.trim();
  } catch (error) {
    console.error(
      '\n================ GROQ ERROR ================'
    );

    console.error(
      'Message:',
      error.message
    );

    console.error(
      'Status:',
      error.status ||
        error.response?.status ||
        'Unknown'
    );

    if (error.response?.data) {
      console.error(
        'Response:',
        error.response.data
      );
    }

    console.error(
      '============================================\n'
    );

    throw error;
  }
}

// =====================================================
// ASK KRISHNA
// =====================================================

const getGitaWisdom = async (userMessage) => {
  if (containsCrisisLanguage(userMessage)) {
    return {
      text: CRISIS_RESPONSE,
      crisis: true,
    };
  }

  const text = await callGroq(
    GITA_SYSTEM_PROMPT,
    userMessage,
    [],
    {
      temperature: 0.65,
      maxTokens: 900,
    }
  );

  return {
    text,
    crisis: false,
  };
};

// =====================================================
// TALK TO SUKOON
// =====================================================

const getCompanionReply = async (
  userMessage,
  history = []
) => {
  if (containsCrisisLanguage(userMessage)) {
    return {
      text: CRISIS_RESPONSE,
      crisis: true,
    };
  }

  const text = await callGroq(
    COMPANION_SYSTEM_PROMPT,
    userMessage,
    history,
    {
      temperature: 0.75,
      maxTokens: 700,
    }
  );

  return {
    text,
    crisis: false,
  };
};

// =====================================================
// JOURNAL REFLECTION
// =====================================================

const getJournalReflection = async (
  journalContent
) => {
  return await callGroq(
    REFLECTION_SYSTEM_PROMPT,
    journalContent,
    [],
    {
      temperature: 0.7,
      maxTokens: 400,
    }
  );
};

// =====================================================
// SORT THOUGHTS
// =====================================================

const sortThoughts = async (brainDump) => {
  const raw = await callGroq(
    SORTING_SYSTEM_PROMPT,
    brainDump,
    [],
    {
      temperature: 0.3,
      maxTokens: 700,
      json: true,
    }
  );

  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      '❌ Groq JSON parse error:',
      error.message
    );

    console.log(
      'Raw Groq response:',
      cleaned
    );

    return {
      canControl: [],
      cannotControl: [],
      needsAction: [],
      canWait: [],
      assumptions: [],
      nextSteps: [],
      raw: cleaned,
    };
  }
};

// =====================================================
// WEEKLY INSIGHT
// =====================================================

const getWeeklyInsight = async (
  summaryText
) => {
  return await callGroq(
    WEEKLY_INSIGHT_SYSTEM_PROMPT,
    summaryText,
    [],
    {
      temperature: 0.65,
      maxTokens: 450,
    }
  );
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getGitaWisdom,
  getCompanionReply,
  getJournalReflection,
  sortThoughts,
  getWeeklyInsight,
  containsCrisisLanguage,
  CRISIS_RESPONSE,
};