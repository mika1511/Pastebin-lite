import express from "express";
import { redis } from "../redis.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

function now(req) {
    if (
        process.env.TEST_MODE === "1" &&
        req.headers["x-test-now-ms"]
    ) {
        return Number(req.headers["x-test-now-ms"]);
    }
    return Date.now();
}

function validateCreateInput(body) {
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
        return "content is required and must be a non-empty string";
    }

    if (
        ttl_seconds !== undefined &&
        (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
        return "ttl_seconds must be an integer >= 1";
    }

    if (
        max_views !== undefined &&
        (!Number.isInteger(max_views) || max_views < 1)
    ) {
        return "max_views must be an integer >= 1";
    }

    return null;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

router.post("/api/pastes", async (req, res) => {
    const error = validateCreateInput(req.body);

    if (error) {
        return res.status(400).json({ error });
    }

    const { content, ttl_seconds, max_views } = req.body;

    const id = uuid();

    const expiresAt = ttl_seconds
        ? now(req) + ttl_seconds * 1000
        : null;

    const paste = {
        content,
        expiresAt,
        maxViews: max_views ?? null,
        views: 0,
    };

    try {
        await redis.set(`paste:${id}`, JSON.stringify(paste));

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        res.status(201).json({
            id,
            url: `${baseUrl}/p/${id}`,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to create paste" });
    }
});


router.get("/api/pastes/:id", async (req, res) => {

    const { id } = req.params;

    const raw = await redis.get(`paste:${id}`);

    if (!raw) {
        return res.status(404).json({ error: "Paste not found" });
    }

    const paste = JSON.parse(raw);

    const currentTime = now(req);

    if (paste.expiresAt && currentTime > paste.expiresAt) {
        return res.status(404).json({ error: "Paste expired" });
    }

    if (
        paste.maxViews !== null &&
        paste.views >= paste.maxViews
    ) {
        return res.status(404).json({ error: "View limit exceeded" });
    }

    paste.views += 1;

    await redis.set(`paste:${id}`, JSON.stringify(paste));


    const remainingViews =
        paste.maxViews !== null
            ? paste.maxViews - paste.views
            : null;

    const expiresAtISO = paste.expiresAt
        ? new Date(paste.expiresAt).toISOString()
        : null;

    res.status(200).json({
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: expiresAtISO,
    });


});

router.get("/p/:id", async (req, res) => {
  const { id } = req.params;

  const raw = await redis.get(`paste:${id}`);

  if (!raw) {
    return res.status(404).send("Paste not found");
  }

  const paste = JSON.parse(raw);
  const currentTime = now(req);

  if (paste.expiresAt && currentTime > paste.expiresAt) {
    return res.status(404).send("Paste expired");
  }

  if (
    paste.maxViews !== null &&
    paste.views >= paste.maxViews
  ) {
    return res.status(404).send("View limit exceeded");
  }

  paste.views += 1;
  await redis.set(`paste:${id}`, JSON.stringify(paste));

  const safeContent = escapeHtml(paste.content);

  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Paste</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <pre>${safeContent}</pre>
      </body>
    </html>
  `);
});


export default router;
