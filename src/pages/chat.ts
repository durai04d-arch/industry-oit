import { supabaseServerClient } from '@/lib/supabaseServer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body || {};
  const { sensorName, message } = body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  try {
    // fetch recent readings for context (adjust table/columns as needed)
    let query: any = supabaseServerClient
      .from('sensor_readings')
      .select('created_at,value,unit,sensor_name')
      .order('created_at', { ascending: false })
      .limit(10);
    if (sensorName) query = query.eq('sensor_name', sensorName);
    const { data: readings, error } = await query;
    if (error) console.warn('supabase read warning', error);

    const context = (readings || []).map((r: any) =>
      `${r.sensor_name || sensorName} ${r.value}${r.unit || ''} at ${new Date(r.created_at).toLocaleString()}`
    ).join('\n');

    const prompt = `You are a helpful sensor assistant. The user question:\n${message}\n\nRecent sensor context:\n${context}\n\nAnswer concisely and provide actionable guidance.`;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

    const gResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.2,
          maxOutputTokens: 512,
        }),
      }
    );
    const gJson = await gResp.json();
    const reply =
      gJson?.candidates?.[0]?.output ||
      gJson?.output?.[0]?.content?.[0]?.text ||
      gJson?.output?.[0]?.content ||
      (gJson?.candidates ? JSON.stringify(gJson.candidates) : JSON.stringify(gJson));

    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('chat error', err);
    res.status(500).json({ error: err?.message || 'Internal error' });
  }
}
