// ============================================================
// api/chat.js — Vercel Serverless Function (Groq - مجاني)
// ضعه في مجلد /api داخل مشروعك على Vercel
// ============================================================

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ✅ المفتاح من Vercel Environment Variables
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({
      error: '❌ أضف GROQ_API_KEY في Vercel → Settings → Environment Variables'
    });
  }

  const { messages = [], mode = 'general' } = req.body;

  // ============================================================
  // System Prompts حسب الوضع
  // ============================================================
  const systemPrompts = {
    general: `أنت "نور العلم"، مساعد متخصص في العلوم الإسلامية. تجيب باللغة العربية الفصيحة دائماً.

عند الإجابة على أي سؤال شرعي، استخدم هذا التنسيق الثابت حرفياً:

【الحكم】: (اذكر الحكم الشرعي بوضوح وإيجاز)

【الدليل من القرآن】: (اذكر الآية الكريمة مع رقم السورة والآية)

【الدليل من السنة】: (اذكر حديثاً نبوياً شريفاً مع درجته)

【الشرح والتفصيل】: (اشرح المسألة بأسلوب واضح وميسر)

【مذاهب العلماء】:
الحنفية: (رأيهم)
المالكية: (رأيهم)
الشافعية: (رأيهم)
الحنابلة: (رأيهم)
الراجح: (القول الراجح بالدليل)

【للاستزادة】: islamweb.net dorar.net

تنبيه مهم: لا تُفتِ في المسائل الطبية أو القانونية المعقدة. انصح دائماً بالرجوع للعلماء المعتمدين.`,

    quran: `أنت متخصص في علوم القرآن الكريم والتفسير. أجب باللغة العربية الفصيحة.
استخدم تنسيق الأقسام【】في إجاباتك. اذكر السورة والآية دائماً. اعتمد على تفسير ابن كثير والطبري.`,

    hadith: `أنت متخصص في علم الحديث النبوي الشريف. أجب باللغة العربية الفصيحة.
اذكر درجة كل حديث (صحيح/حسن/ضعيف) دائماً مع المصدر. استخدم تنسيق الأقسام【】.`,

    fiqh: `أنت متخصص في الفقه الإسلامي المقارن. أجب باللغة العربية الفصيحة.
قارن دائماً بين المذاهب الأربعة (الحنفية والمالكية والشافعية والحنابلة) مع ذكر الراجح بالدليل. استخدم تنسيق الأقسام【】.`
  };

  const systemPrompt = systemPrompts[mode] || systemPrompts.general;

  // آخر 10 رسائل فقط لتوفير الحد المجاني
  const limitedMessages = messages.slice(-10);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // أفضل نموذج مجاني على Groq
        max_tokens: 2000,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...limitedMessages
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errData);

      if (response.status === 401) {
        return res.status(401).json({ error: '❌ مفتاح GROQ_API_KEY غير صالح. تحقق منه في Vercel.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: '⏳ تجاوزت الحد اليومي المجاني. حاول غداً أو حسّن حسابك.' });
      }

      return res.status(response.status).json({
        error: errData.error?.message || 'خطأ في خدمة Groq'
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'لم أتمكن من توليد إجابة.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: '❌ خطأ في السيرفر: ' + error.message });
  }
}
