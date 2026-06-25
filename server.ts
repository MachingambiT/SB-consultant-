import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

let ai: GoogleGenAI | null = null;
function getAi() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const app = express();
app.use(express.json());
const PORT = 3000;

// API: Book a service
app.post('/api/book', async (req, res) => {
  try {
    const { name, email, phone, service, date, time, notes } = req.body;
    
    // Send emails
    if (resend) {
      await resend.emails.send({
        from: 'SB Elite Consultancy <onboarding@resend.dev>',
        to: email,
        subject: 'Booking Confirmation - SB Elite Consultancy',
        html: `<p>Hi ${name},</p><p>We have received your booking for <strong>${service}</strong> on ${date} at ${time}. Our team will contact you shortly to confirm.</p><p>Best,<br>SB Elite Consultancy</p>`,
      });
      await resend.emails.send({
        from: 'SB Elite Consultancy <onboarding@resend.dev>',
        to: 'tatendagumbo38@gmail.com', // Admin email from metadata
        subject: 'New Booking Received',
        html: `<p>New booking from ${name} (${email}, ${phone}) for ${service} on ${date} at ${time}.</p><p>Notes: ${notes}</p>`,
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Text to Speech
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    
    const aiClient = getAi();
    const interaction = await aiClient.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" }
          }
        }
      }
    });
    
    let audioBase64 = interaction.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    res.json({ success: true, audioBase64 });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

const server = createServer(app);

// WebSocket for Live API Proxy
const wss = new WebSocketServer({ server, path: '/api/live' });

wss.on('connection', async (ws) => {
  console.log('Client connected to Live API Proxy');
  
  try {
    const aiClient = getAi();
    const session = await aiClient.live.connect({
      model: "gemini-3.1-flash-live-preview",
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) ws.send(JSON.stringify({ audio }));
          if (message.serverContent?.interrupted) {
            ws.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
        systemInstruction: {
          parts: [{ text: "You are the AI Assistant for SB Elite Consultancy. We provide business registration and compliance services in Zimbabwe. Our prices range from $30 for NSSA registration to $130 for Private Limited Company Registration. Our office is at Cnr Robert Mugabe & Leopold Takawira, Karimapondo Building, 1st Floor, Office G53, Harare, Zimbabwe. Phone: 0715 772 159. Be helpful, professional, and concise." }]
        }
      }
    });

    ws.on('message', (data) => {
      try {
        const { audio } = JSON.parse(data.toString());
        if (audio) {
          session.sendRealtimeInput({
            audio: { data: audio, mimeType: "audio/pcm;rate=16000" }
          });
        }
      } catch (e) {
        console.error("Error processing websocket message", e);
      }
    });

    ws.on('close', () => {
      session.close();
      console.log('Client disconnected from Live API Proxy');
    });

  } catch (error) {
    console.error("Error setting up Live API session:", error);
    ws.close();
  }
});

setupVite().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});
