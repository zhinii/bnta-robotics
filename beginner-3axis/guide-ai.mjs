import { validateGuideProposal } from "./guide-commands.mjs";

export async function requestGuide(payload, { fetcher = globalThis.fetch, signal } = {}) {
  const response = await fetcher("/api/guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  let data;
  try { data = await response.json(); } catch { throw new Error("invalid_response"); }
  if (!response.ok) throw new Error(data.error || "unavailable");
  if (data.source !== "qwen" || typeof data.reply !== "string" || !data.reply.trim() ||
      data.reply.length > 3200 || (data.command !== null && !validateGuideProposal(data.command)))
    throw new Error("invalid_response");
  return { reply: data.reply, command: data.command };
}
