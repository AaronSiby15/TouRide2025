import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
const supabaseAdmin = createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    })
);
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, userId } = req.body;
        const lineItems = items.map(({ name, price, quantity }) => ({
            price_data: {
                currency: 'usd',
                product_data: { name },
                unit_amount: Math.round(price * 100),
            },
            quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // redirect
            success_url: `${process.env.BACKEND_URL}/api/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}`,      // back to your payment page or home
            metadata: { userId },                           // stash the userId for later
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err);
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: message });
    }
});

app.get('/api/checkout-success', async (req, res) => {
    const sessionId = req.query.session_id;
    if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).send('Missing or invalid session_id');
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // pull your saved userId
        const userId = session.metadata?.userId;
        if (userId) {
            // user_payment paid = TRUE
            await supabaseAdmin
                .from('user_payments')
                .update({ paid: true })
                .eq('id', userId)
                .eq('product_id', '1');
        }

        // send them into your React dashboard
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (err) {
        console.error('Error fetching session:', err);
        return res.status(500).send('Error handling checkout success');
    }
});

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;
        const lineItems = items.map(({ name, price, quantity }) => ({
            price_data: {
                currency: 'usd',
                product_data: { name },
                unit_amount: Math.round(price * 100),
            },
            quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/dashboard`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-fail`,
        });

        return res.json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err);
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/chat', async (req, res) => {
    const { history = [], message } = req.body;

    // Rebuild Gemini history
    let geminiHistory = history
        .map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
        }))
        .concat();
    if (geminiHistory.length && geminiHistory[0].role !== 'user') {
        const idx = geminiHistory.findIndex((h) => h.role === 'user');
        geminiHistory = idx >= 0 ? geminiHistory.slice(idx) : [];
    }

    // System prompt—inject
    const SYSTEM_INJECTION = `
  You are an expert Canadian driving-instructor chatbot.  
  Use proper **Markdown** formatting in every response:
    - **#** for main headers  
    - **##** for sub-headers  
    - Bullet lists (\`- item\`) for steps  
    - **Bold** important terms  
    - *Italics* for emphasis  
    - Short paragraphs and numbered lists for procedures  
  Base all answers on Ontario’s MTO handbook and recognized Driver’s Ed sources.  
  Answer only questions about Canadian driving regulations.
  `.trim();

    // If there's no prior user turn, prepend system + the incoming message
    const firstMessage =
        geminiHistory.length === 0
            ? `${SYSTEM_INJECTION}\n\n${message}`
            : message;

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.0-flash',
            history: geminiHistory,
        });

        const response = await chat.sendMessage({ message: firstMessage });
        return res.json({ reply: response.text });
    } catch (err) {
        console.error('AI Error:', err);
        return res.status(500).json({ error: 'AI generation failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
