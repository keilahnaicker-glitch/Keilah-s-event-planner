import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.post('/api/planora/ask', async (req, res) => {
  try {
    const { query, event, history } = req.body;
    if (!ai) {
      return res.status(200).json({ reply: null, reason: 'No API key configured, using engine fallback' });
    }

    const eventContext = JSON.stringify({
      eventName: event?.eventName,
      eventType: event?.eventType,
      date: event?.date,
      startTime: event?.startTime,
      endTime: event?.endTime,
      location: event?.location,
      venue: event?.venue,
      guestCount: event?.guestCount,
      budget: event?.budget,
      currency: event?.currency,
      theme: event?.theme,
      vibe: event?.vibe,
      mealStyle: event?.mealStyle,
      tableCount: event?.tables?.length,
      dietary: event?.dietaryRequirements,
      notes: event?.notes,
    });

    const prompt = `You are Planora AI, an intelligent, warm, calm, highly organized, and creative professional event coordinator.
Your personality: Warm, helpful, creative, calm, organized, professional, encouraging, practical.
Avoid robotic phrasing. Avoid saying "As an AI...". Use clear headings, bullet points, and practical advice.
Always respect the event parameters, budget, and guest count.

CURRENT EVENT CONTEXT:
${eventContext}

USER'S QUESTION:
${query}

Respond directly as Planora:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Error in /api/planora/ask:', err);
    return res.status(200).json({ reply: null, error: err.message });
  }
});

app.post('/api/planora/build-event', async (req, res) => {
  try {
    const { event } = req.body;
    if (!ai) {
      return res.status(200).json({ plan: null, reason: 'No API key, using engine fallback' });
    }

    const prompt = `You are Planora AI, the master event coordinator.
Analyze the following event details and generate a cohesive, realistic, and organized event plan in valid JSON format.
Event Details:
- Name: ${event.eventName}
- Type: ${event.eventType}
- Date: ${event.date} (${event.startTime} - ${event.endTime})
- Venue: ${event.venue} (${event.indoorOutdoor}) in ${event.location}
- Guests: ${event.guestCount}
- Budget: ${event.currency} ${event.budget}
- Theme: ${event.theme}
- Vibe: ${event.vibe} (${event.formality})
- Meal Style: ${event.mealStyle}
- Dietary: ${JSON.stringify(event.dietaryRequirements)}
- Notes: ${event.notes}

Return ONLY valid JSON matching this schema:
{
  "overview": {
    "eventName": string,
    "type": string,
    "date": string,
    "location": string,
    "guestCount": number,
    "budget": number,
    "theme": string,
    "mainObjective": string
  },
  "concept": {
    "atmosphere": string,
    "themeInterpretation": string,
    "stylingDirection": string,
    "memorableFeatureIdeas": string[]
  },
  "colourPalette": [
    {"name": string, "hex": string, "usage": string}
  ],
  "decorPlan": {
    "tables": string,
    "centrepieces": string,
    "backdrop": string,
    "entrance": string,
    "signage": string,
    "lighting": string,
    "flowers": string,
    "candles": string,
    "tableStyling": string,
    "stageOrPodium": string,
    "photoArea": string
  },
  "foodPlan": {
    "mealStyle": string,
    "recommendations": string[],
    "dietaryNotes": string,
    "drinksPairing": string[]
  },
  "cakeDessert": {
    "cakeConcept": string,
    "dessertOptions": string[]
  },
  "entertainment": {
    "mainActivities": string[],
    "musicDirection": string,
    "guestEngagement": string
  },
  "photography": {
    "importantPhotos": string[],
    "photoMoments": string[],
    "photoBoothConcept": string,
    "groupPhotoTiming": string,
    "memorableShots": string[]
  },
  "wowFactor": string[],
  "risks": string[],
  "nextActions": {
    "urgent": string[],
    "soon": string[],
    "later": string[]
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const plan = JSON.parse(text);
    return res.json({ plan });
  } catch (err: any) {
    console.error('Error in /api/planora/build-event:', err);
    return res.status(200).json({ plan: null, error: err.message });
  }
});

app.post('/api/planora/ideas', async (req, res) => {
  try {
    const { category, modifier, event } = req.body;
    if (!ai) {
      return res.status(200).json({ ideas: null });
    }

    const prompt = `You are Planora AI event coordinator.
Generate 4 fresh, creative, highly practical ideas for category "${category}" for an event with:
- Type: ${event.eventType}
- Guests: ${event.guestCount}
- Budget: ${event.currency} ${event.budget}
- Theme & Vibe: ${event.theme}, ${event.vibe}
${modifier ? `Specific tone requirement: ${modifier}` : ''}

Return JSON array of objects:
[
  {
    "title": "Short creative title",
    "description": "Specific execution instructions",
    "estimatedCost": "Approximate cost or 'Budget-Friendly'",
    "impact": "Why guests will remember it"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const ideas = JSON.parse(response.text || '[]');
    return res.json({ ideas });
  } catch (err: any) {
    console.error('Error in /api/planora/ideas:', err);
    return res.status(200).json({ ideas: null });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Planora AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
