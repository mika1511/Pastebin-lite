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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f4f8",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: "#333", marginBottom: "1.5rem" }}>Pastebin Lite</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <textarea
          placeholder="Enter your text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
            fontSize: "1rem",
            resize: "vertical",
          }}
        />

        <input
          type="number"
          placeholder="TTL seconds (optional)"
          value={ttl}
          min="1"
          onChange={(e) => setTtl(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
            fontSize: "1rem",
          }}
        />

        <input
          type="number"
          placeholder="Max views (optional)"
          value={maxViews}
          min="1"
          onChange={(e) => setMaxViews(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "1.5rem",
            fontSize: "1rem",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#4338ca")}
          onMouseOut={(e) => (e.target.style.background = "#4f46e5")}
        >
          Create Paste
        </button>
      </form>

      {pasteUrl && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#e0e7ff",
            borderRadius: "6px",
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
            wordBreak: "break-all",
          }}
        >
          <p style={{ marginBottom: "0.5rem" }}>Paste created! Access it here:</p>
          <a
            href={pasteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#3730a3", textDecoration: "underline" }}
          >
            {pasteUrl}
          </a>
        </div>
      )}
    </div>
  );
}
