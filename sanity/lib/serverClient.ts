// sanity/lib/serverClient.ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Verificar se o token existe
if (!process.env.SANITY_SERVER_API_TOKEN) {
  console.warn("⚠️ SANITY_SERVER_API_TOKEN não está configurado. Operações de escrita falharão.");
}

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // MUDANÇA CRÍTICA: false para escrita!
  token: process.env.SANITY_SERVER_API_TOKEN,
});