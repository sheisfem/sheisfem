import { afterEach, describe, expect, it, vi } from "vitest";
import { ALL, POST } from "../pages/api/newsletter";

const request = (body: unknown) =>
  new Request("https://sheisfem.test/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const responseBody = async (response: Response) =>
  response.json() as Promise<Record<string, unknown>>;

describe("Given the newsletter endpoint", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("rejects malformed requests and invalid email addresses", async () => {
    const malformed = await POST({ request: request("not json") } as never);
    const invalid = await POST({ request: request({ email: "not-an-email" }) } as never);

    expect(malformed.status).toBe(400);
    expect(await responseBody(malformed)).toEqual({ ok: false, error: "Invalid JSON body." });
    expect(invalid.status).toBe(400);
    expect(await responseBody(invalid)).toEqual({
      ok: false,
      error: "Please enter a valid email address.",
    });
  });

  it("reports a server error when Kit is not configured", async () => {
    vi.stubEnv("KIT_API_KEY", "");
    vi.stubEnv("KIT_FORM_ID", "");
    vi.stubEnv("KIT_TAG_ID", "");
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST({ request: request({ email: "reader@example.com" }) } as never);

    expect(response.status).toBe(500);
    expect(await responseBody(response)).toEqual({
      ok: false,
      error: "Newsletter signup is not configured.",
    });
    expect(error).toHaveBeenCalledWith("Kit API key is not configured.");
  });

  it("requires either a Kit form or tag", async () => {
    vi.stubEnv("KIT_API_KEY", "kit-key");
    vi.stubEnv("KIT_FORM_ID", "");
    vi.stubEnv("KIT_TAG_ID", "");
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST({ request: request({ email: "reader@example.com" }) } as never);

    expect(response.status).toBe(500);
    expect(error).toHaveBeenCalledWith("Kit form or tag ID is not configured.");
  });

  it("creates a subscriber and adds them to the configured form", async () => {
    vi.stubEnv("KIT_API_KEY", "kit-key");
    vi.stubEnv("KIT_FORM_ID", "form/id");
    vi.stubEnv("KIT_TAG_ID", "");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST({ request: request({ email: " Reader@Example.com " }) } as never);

    expect(response.status).toBe(201);
    expect(await responseBody(response)).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenNthCalledWith(1, "https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": "kit-key" },
      body: JSON.stringify({ email_address: "reader@example.com", state: "active" }),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.kit.com/v4/forms/form%2Fid/subscribers",
      expect.objectContaining({ body: JSON.stringify({ email_address: "reader@example.com" }) })
    );
  });

  it("adds a subscriber to a tag and handles Kit failures", async () => {
    vi.stubEnv("KIT_API_KEY", "kit-key");
    vi.stubEnv("KIT_FORM_ID", "");
    vi.stubEnv("KIT_TAG_ID", "tag/id");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 201 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ errors: ["Tag is unavailable."] }), { status: 422 })
      );
    vi.stubGlobal("fetch", fetchMock);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST({ request: request({ email: "reader@example.com" }) } as never);

    expect(response.status).toBe(500);
    expect(await responseBody(response)).toEqual({
      ok: false,
      error: "Newsletter signup failed. Please try again.",
    });
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://api.kit.com/v4/tags/tag%2Fid/subscribers",
      expect.any(Object)
    );
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ message: "Tag is unavailable." }));
  });

  it("rejects unsupported methods", async () => {
    const response = await ALL({} as never);

    expect(response.status).toBe(405);
    expect(await responseBody(response)).toEqual({ ok: false, error: "Method not allowed." });
  });
});
