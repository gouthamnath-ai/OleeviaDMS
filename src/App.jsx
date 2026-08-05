import React from "react";
import OLEEVIA_LOGO from "./logo.js";

/**
 * PLACEHOLDER — the full Oleevia DocFlow App.jsx (~200KB with logo,
 * or ~123KB with logo split to logo.js) could not be pushed through
 * the API tool in one shot because of payload size limits.
 *
 * To finish the deploy, from the unzipped package:
 *
 *   cd oleevia-deploy
 *   git clone https://github.com/gouthamnath-ai/OleeviaDMS.git repo
 *   cp src/App.jsx repo/src/App.jsx
 *   # optional: keep src/logo.js or use the original single-file App.jsx
 *   cd repo && git add src/App.jsx && git commit -m "Add full App.jsx" && git push
 *
 * Then reconnect the Vercel project to this GitHub repo (or re-run
 * vercel --prod) so production picks up the full app.
 */
export default function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 40, maxWidth: 560, margin: "40px auto" }}>
      <img src={OLEEVIA_LOGO} alt="Oleevia" style={{ height: 48 }} />
      <h1 style={{ marginTop: 16, fontSize: 22 }}>Oleevia DocFlow</h1>
      <p style={{ color: "#555", lineHeight: 1.5 }}>
        Scaffold is on GitHub and Vercel. Push the full <code>src/App.jsx</code> from
        <code> oleevia-deploy.zip</code> to finish the live demo.
      </p>
      <p style={{ color: "#888", fontSize: 13 }}>
        Repo: <a href="https://github.com/gouthamnath-ai/OleeviaDMS">gouthamnath-ai/OleeviaDMS</a>
      </p>
    </div>
  );
}
