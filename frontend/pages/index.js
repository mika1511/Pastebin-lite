import { useState } from "react";
import axios from "axios";

// Backend API base URL
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { content };
      if (ttl) body.ttl_seconds = Number(ttl);
      if (maxViews) body.max_views = Number(maxViews);

      const res = await axios.post(
        `${API_BASE}/api/pastes`,
        body,
        { headers: { "Content-Type": "application/json" } }
      );

      setPasteUrl(res.data.url);
    } catch (err) {
      alert(err.response?.data?.error || "Error creating paste");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          cols={50}
          required
        />
        <br />

        <input
          type="number"
          placeholder="TTL seconds (optional)"
          value={ttl}
          min="1"
          onChange={(e) => setTtl(e.target.value)}
        />
        <br />

        <input
          type="number"
          placeholder="Max views (optional)"
          value={maxViews}
          min="1"
          onChange={(e) => setMaxViews(e.target.value)}
        />
        <br />

        <button type="submit">Create Paste</button>
      </form>

      {pasteUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>Paste created! Access it here:</p>
          <a href={pasteUrl} target="_blank" rel="noopener noreferrer">
            {pasteUrl}
          </a>
        </div>
      )}
    </div>
  );
}
