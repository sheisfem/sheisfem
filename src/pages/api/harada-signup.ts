import type { APIRoute } from "astro";

export const prerender = false;

const KIT_API_BASE = "https://api.kit.com/v4";
const HARADA_FORM_ID = "9759283";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const isValidEmail = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const email = value.trim();
  return email.length <= 254 && EMAIL_PATTERN.test(email);
};

const callKit = async (path: string, apiKey: string, body: Record<string, unknown>) => {
  const response = await fetch(`${KIT_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) return;

  let message = "Kit request failed.";
  try {
    const data = await response.json();
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      message = data.errors.join(" ");
    }
  } catch {
    // Keep the generic error when Kit does not return JSON.
  }

  throw new Error(message);
};

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }

  const emailValue =
    typeof body === "object" && body !== null && "email" in body
      ? (body as { email?: unknown }).email
      : undefined;

  if (!isValidEmail(emailValue)) {
    return json({ ok: false, error: "Please enter a valid email address." }, 400);
  }

  const apiKey = import.meta.env.KIT_API_KEY;
  if (!apiKey) {
    console.error("Kit API key is not configured.");
    return json({ ok: false, error: "Lead magnet signup is not configured." }, 500);
  }

  const email = emailValue.trim().toLowerCase();

  try {
    await callKit("/subscribers", apiKey, {
      email_address: email,
      state: "active",
    });

    await callKit(`/forms/${HARADA_FORM_ID}/subscribers`, apiKey, {
      email_address: email,
    });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "Signup failed. Please try again." }, 500);
  }

  return json({ ok: true }, 201);
};

export const ALL: APIRoute = async () => json({ ok: false, error: "Method not allowed." }, 405);
