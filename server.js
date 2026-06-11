import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/vaquinha", async (req, res) => {

  const pergunta = req.body.pergunta;

  const resposta = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Você é uma vaquinha do agro sustentável. Responda de forma divertida com "muuuu": ${pergunta}`
  });

  res.json({
    resposta: resposta.output_text
  });
});

app.listen(3000, () => console.log("Servidor rodando"));
