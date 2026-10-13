"use client"; // Replaces the root layout when it fails, so it brings its own <html> and plain styles

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f8f5ec", color: "#1f2318" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <h1 style={{ fontSize: 26, marginBottom: 12 }}>GutVaidya is having trouble loading</h1>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
              Please try again in a moment. If this keeps happening, email support@thegutvaidya.com or call +91 78928 91239.
            </p>
            <button
              onClick={() => retry()}
              style={{ marginTop: 16, padding: "12px 24px", borderRadius: 999, border: 0, background: "#1f4f16", color: "#fff", fontWeight: 700, cursor: "pointer" }}
            >
              Try Again
            </button>
            {error.digest ? <p style={{ fontSize: 11, opacity: 0.5, marginTop: 16, fontFamily: "monospace" }}>Reference: {error.digest}</p> : null}
          </div>
        </main>
      </body>
    </html>
  );
}
