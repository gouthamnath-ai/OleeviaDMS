import "./storage-shim.js";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  LayoutDashboard, FilePlus2, FolderOpen, LayoutTemplate, Search,
  Check, X, Clock, IndianRupee, ChevronRight, Trash2, ArrowLeft, FileText, Mail, Send, LogOut, Lock, ShieldCheck,
  Users, UserPlus, KeyRound, Power, Paperclip, History, ChevronDown, UserCircle, Settings, RefreshCw, Plane, ShoppingCart, MessageSquare
} from "lucide-react";

const LucideReact = {
  LayoutDashboard, FilePlus2, FolderOpen, LayoutTemplate, Search,
  Check, X, Clock, IndianRupee, ChevronRight, Trash2, ArrowLeft, FileText, Mail, Send, LogOut, Lock, ShieldCheck,
  Users, UserPlus, KeyRound, Power, Paperclip, History, ChevronDown, UserCircle, Settings, RefreshCw, Plane, ShoppingCart, MessageSquare
};

const APP_URL =
  "https://cdn.jsdelivr.net/gh/gouthamnath-ai/OleeviaDMS@bf961c8b8aedffb20c2e11aaf839ea34208f1517/src/oleevia-deploy/oleevia-deploy/src/App.jsx";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(s);
  });
}

async function loadFullApp() {
  await loadScript("https://unpkg.com/@babel/standalone@7.26.0/babel.min.js");
  const res = await fetch(APP_URL);
  if (!res.ok) throw new Error("Failed to fetch App.jsx: " + res.status);
  const source = await res.text();

  const { code } = window.Babel.transform(source, {
    presets: [["react", { runtime: "classic" }]],
    plugins: [["transform-modules-commonjs", { strictMode: false }]],
    filename: "App.jsx",
  });

  const exports = {};
  const module = { exports };
  const require = (name) => {
    if (name === "react") return React;
    if (name === "lucide-react") return LucideReact;
    throw new Error("Cannot require: " + name);
  };

  // eslint-disable-next-line no-new-func
  const fn = new Function("exports", "require", "module", "React", code);
  fn(exports, require, module, React);

  return module.exports.default || exports.default || module.exports;
}

function Boot() {
  const [App, setApp] = React.useState(null);
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {
    loadFullApp()
      .then((C) => setApp(() => C))
      .catch((e) => {
        console.error(e);
        setErr(String(e && e.message ? e.message : e));
      });
  }, []);

  if (err) {
    return (
      <div style={{ fontFamily: "system-ui", padding: 40, color: "#b91c1c" }}>
        <h1>Failed to load DocFlow</h1>
        <p>{err}</p>
        <p style={{ color: "#666", fontSize: 13 }}>
          Try a hard refresh. If this persists, re-upload App.jsx to the repo.
        </p>
      </div>
    );
  }

  if (!App) {
    return (
      <div
        style={{
          fontFamily: "system-ui",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
        }}
      >
        Loading Oleevia DocFlow…
      </div>
    );
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Boot />
  </React.StrictMode>
);
