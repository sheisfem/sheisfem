import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import CommentsSection from "./CommentsSection";

const props = {
  appId: "app-123",
  pageId: "post/with spaces",
  pageUrl: "https://sheisfem.test/blog/post",
  pageTitle: "A Field Note",
};

const mockFetch = (responses: Array<Promise<Response> | Response>) => {
  const fetchMock = vi.fn(async () => {
    const response = responses.shift();

    if (!response) {
      throw new Error("Unexpected fetch call");
    }

    return response;
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const deferredResponse = () => {
  let resolve!: (response: Response) => void;
  const promise = new Promise<Response>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
};

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

describe("Given CommentsSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("When comments are loaded", () => {
    it("Then renders comments from Cusdis", async () => {
      const fetchMock = mockFetch([
        jsonResponse({
          data: {
            data: [
              {
                id: "comment-1",
                by_nickname: "Tomi",
                content: "This made the raise conversation feel clearer.",
                createdAt: "2026-06-08T12:00:00.000Z",
              },
            ],
          },
        }),
      ]);

      render(<CommentsSection {...props} />);

      expect(screen.getByText("Loading…")).toBeInTheDocument();
      expect(await screen.findByText("Tomi")).toBeInTheDocument();
      expect(
        screen.getByText("This made the raise conversation feel clearer.")
      ).toBeInTheDocument();
      expect(screen.getByText("June 8, 2026")).toBeInTheDocument();
      expect(fetchMock).toHaveBeenCalledWith(
        "https://cusdis.com/api/open/comments?appId=app-123&pageId=post%2Fwith%20spaces"
      );
    });
  });

  describe("When no comments exist", () => {
    it("Then shows an empty state", async () => {
      mockFetch([jsonResponse({ data: { data: [] } })]);

      render(<CommentsSection {...props} />);

      expect(await screen.findByText("No comments yet — be the first.")).toBeInTheDocument();
    });
  });

  describe("When fetching comments fails", () => {
    it("Then shows a load error", async () => {
      mockFetch([new Response(null, { status: 500 })]);

      render(<CommentsSection {...props} />);

      expect(await screen.findByText("Could not load comments.")).toBeInTheDocument();
    });
  });

  describe("When the user submits a comment", () => {
    it("Then shows the moderation notice on success", async () => {
      const postResponse = deferredResponse();
      const fetchMock = mockFetch([jsonResponse({ data: { data: [] } }), postResponse.promise]);
      const user = userEvent.setup();

      render(<CommentsSection {...props} />);
      await screen.findByText("No comments yet — be the first.");

      await user.type(screen.getByPlaceholderText("Name"), "Amina");
      await user.type(screen.getByPlaceholderText("Email (not published)"), "amina@example.com");
      await user.type(screen.getByPlaceholderText("Your comment"), "This was useful.");
      await user.click(screen.getByRole("button", { name: "Post comment" }));

      expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
      postResponse.resolve(new Response(null));

      await waitFor(() => {
        expect(
          screen.getByText("Thanks — your comment is awaiting moderation and will appear shortly.")
        ).toBeInTheDocument();
      });

      expect(fetchMock).toHaveBeenLastCalledWith("https://cusdis.com/api/open/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: props.appId,
          pageId: props.pageId,
          pageUrl: props.pageUrl,
          pageTitle: props.pageTitle,
          nickname: "Amina",
          email: "amina@example.com",
          content: "This was useful.",
        }),
      });
    });

    it("Then shows a submit error on failure", async () => {
      mockFetch([jsonResponse({ data: { data: [] } }), new Response(null, { status: 500 })]);
      const user = userEvent.setup();

      render(<CommentsSection {...props} />);
      await screen.findByText("No comments yet — be the first.");

      await user.type(screen.getByPlaceholderText("Name"), "Amina");
      await user.type(screen.getByPlaceholderText("Email (not published)"), "amina@example.com");
      await user.type(screen.getByPlaceholderText("Your comment"), "This was useful.");
      await user.click(screen.getByRole("button", { name: "Post comment" }));

      expect(
        await screen.findByText("Something went wrong — please try again.")
      ).toBeInTheDocument();
    });
  });
});
