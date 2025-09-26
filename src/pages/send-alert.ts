import { supabaseServerClient } from '@/lib/supabaseServer';

// replace typed import with a dynamic require to avoid TS module errors
let nodemailer: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

export default async function handler(req: any, res: any) { // use any to avoid missing 'next' types
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, sensorName, message, value, unit, alertLevel } = req.body || {};

  if (!email || !sensorName) return res.status(400).json({ error: 'Missing required fields' });

  try {
    // insert into alerts table (optional schema)
    await supabaseServerClient.from('alerts').insert([{
      email,
      sensor_name: sensorName,
      message,
      value,
      unit,
      alert_level: alertLevel,
      created_at: new Date().toISOString(),
    }]);

    // try to send email if nodemailer is available and SMTP env provided
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    if (nodemailer && SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      const subject = `Alert: ${sensorName} — ${alertLevel || 'alert'}`;
      const html = `<p><strong>Sensor:</strong> ${sensorName}</p>
                    <p><strong>Value:</strong> ${value} ${unit}</p>
                    <p><strong>Level:</strong> ${alertLevel}</p>
                    <p><strong>Message:</strong> ${message}</p>`;
      await transporter.sendMail({
        from: `"No Reply" <${SMTP_USER}>`,
        to: email,
        subject,
        html,
      });
      return res.status(200).json({ ok: true, sent: true });
    }

    // nodemailer missing or SMTP not configured -> stored only
    return res.status(200).json({ ok: true, sent: false, note: 'Stored alert; SMTP not configured or nodemailer not installed' });
  } catch (err: any) {
    console.error('send-alert error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}
