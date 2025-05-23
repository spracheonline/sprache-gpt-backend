import { fetch } from 'undici';

export default async function handler(req, res) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Kein Nachrichtentext erhalten." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4", // або "gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content: "Du bist ein hilfreicher Erklär-Bot für den Einbürgerungstest. Erkläre kurz und verständlich, warum die Antwort richtig ist."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await openaiRes.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: "Interner Serverfehler." });
  }
}
