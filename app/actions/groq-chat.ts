"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendMessage(
  messages: ChatMessage[],
  systemPrompt?: string
) {
  // Opcional: verificar autenticação mas não bloquear para demonstração
  const { userId } = await auth();
  console.log("User ID:", userId || "Sem autenticação");

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  try {
    const allMessages: ChatMessage[] = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : messages;

    const completion = await groq.chat.completions.create({
      messages: allMessages,
      model: "llama-3.3-70b-versatile", // ✅ MODELO ATUALIZADO
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    return completion.choices[0]?.message?.content || "Sem resposta";
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Falha ao obter resposta do Groq");
  }
}