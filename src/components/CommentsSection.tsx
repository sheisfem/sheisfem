import { useEffect, useState } from "react";
import "../styles/comments.css";

interface Comment {
  id: string;
  content: string;
  by_nickname: string;
  createdAt: string;
}

interface Props {
  appId: string;
  pageId: string;
  pageUrl: string;
  pageTitle: string;
}

const API = "https://cusdis.com/api/open/comments";

export default function CommentsSection({ appId, pageId, pageUrl, pageTitle }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "done" | "error">("loading");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    fetch(`${API}?appId=${appId}&pageId=${encodeURIComponent(pageId)}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((json) => {
        setComments(json?.data?.data ?? []);
        setLoadState("done");
      })
      .catch(() => setLoadState("error"));
  }, [appId, pageId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitState("submitting");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          pageId,
          pageUrl,
          pageTitle,
          nickname: name,
          email,
          content,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitState("success");
      setName("");
      setEmail("");
      setContent("");
    } catch {
      setSubmitState("error");
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="comments-root">
      <div className="comments-list">
        {loadState === "loading" && <p className="comments-placeholder">Loading…</p>}
        {loadState === "error" && <p className="comments-placeholder">Could not load comments.</p>}
        {loadState === "done" && comments.length === 0 && (
          <p className="comments-placeholder">No comments yet — be the first.</p>
        )}
        {loadState === "done" &&
          comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-meta">
                <span className="comment-author">{c.by_nickname}</span>
                <span className="comment-date kicker">{formatDate(c.createdAt)}</span>
              </div>
              <p className="comment-body">{c.content}</p>
            </div>
          ))}
      </div>

      <div className="comments-form-wrap">
        <p className="kicker" style={{ margin: "0 0 24px" }}>
          Leave a reply
        </p>

        {submitState === "success" ? (
          <p className="comments-notice">
            Thanks — your comment is awaiting moderation and will appear shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="comments-form" noValidate>
            <div className="comments-fields">
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email (not published)"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <textarea
              placeholder="Your comment"
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {submitState === "error" && (
              <p className="comments-error">Something went wrong — please try again.</p>
            )}
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitState === "submitting"}
              >
                {submitState === "submitting" ? "Sending…" : "Post comment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
