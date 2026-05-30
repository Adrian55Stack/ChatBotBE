import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an assistant" },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        res.json({ response: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error('Groq error:', error);
        res.status(500).json({ error: 'Unexpected error' });
    }
};