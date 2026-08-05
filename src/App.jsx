import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, FilePlus2, FolderOpen, LayoutTemplate, Search,
  Check, X, Clock, IndianRupee, ChevronRight, Trash2, ArrowLeft, FileText, Mail, Send, LogOut, Lock, ShieldCheck,
  Users, UserPlus, KeyRound, Power, Paperclip, History, ChevronDown, UserCircle, Settings, RefreshCw, Plane, ShoppingCart, MessageSquare
} from "lucide-react";
import OLEEVIA_LOGO from "./logo.js";

const ROLE_LABELS = { admin: "Admin", requester: "Requester", approver: "Approver", accounts: "Accounts" };
const DEPARTMENTS = ["IT Department", "Accounts", "Operations", "Administration", "Audit", "Complaints"];
const DEPARTMENT_EMAILS = {
  "IT Department": "it.head@company.com",
  Accounts: "accounts.head@company.com",
  Operations: "ops.head@company.com",
  Administration: "admin.head@company.com",
  Audit: "audit.head@company.com",
  Complaints: "complaints.head@company.com",
};
const APPROVER_EMAIL = "approvals@company.com";
const ACCOUNTS_EMAIL = "accounts@company.com";
const CEO_EMAIL = "ceo@company.com";

const storage = {
  get: (key) => window.storage.get(key),
  set: (key, value) => window.storage.set(key, value),
  delete: (key) => window.storage.delete(key),
};
const localOnly = {
  get: (key) => window.storage.get(key),
  set: (key, value) => window.storage.set(key, value),
  delete: (key) => window.storage.delete(key),
};

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function genSalt() {
  const arr = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
  return sha256Hex(`${salt}:${password}`);
}

const SEED_USERS = [
  { employeeId: "OGC100", name: "System Admin", password: "Admin@123", role: "admin", department: null, email: "admin@company.com", active: true },
  { employeeId: "OGC111", name: "IT Department", password: "Welcome@123", role: "requester", department: "IT Department", email: DEPARTMENT_EMAILS["IT Department"], active: true },
  { employeeId: "OGC112", name: "Approving Authority", password: "Welcome@123", role: "approver", department: null, email: APPROVER_EMAIL, active: true },
  { employeeId: "OGC113", name: "Accounts Team", password: "Welcome@123", role: "accounts", department: null, email: ACCOUNTS_EMAIL, active: true },
];

async function buildSeedUsers() {
  return Promise.all(
    SEED_USERS.map(async (u) => {
      const salt = genSalt();
      const passwordHash = await hashPassword(u.password, salt);
      const { password, ...rest } = u;
      return { ...rest, salt, passwordHash };
    })
  );
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [ready, setReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (!window.storage) throw new Error("storage missing");
        const result = await localOnly.get("dms_demo_users");
        if (result && result.value) {
          setUsers(JSON.parse(result.value));
        } else {
          const seeded = await buildSeedUsers();
          setUsers(seeded);
          await localOnly.set("dms_demo_users", JSON.stringify(seeded));
        }
      } catch (e) {
        try {
          const seeded = await buildSeedUsers();
          setUsers(seeded);
        } catch (e2) {
          setError("Init failed");
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function handleLogin() {
    setError("");
    const user = users.find((u) => u.employeeId.toLowerCase() === employeeId.trim().toLowerCase());
    if (!user) { setError("Incorrect employee ID or password."); return; }
    try {
      const attemptedHash = await hashPassword(password, user.salt);
      if (attemptedHash !== user.passwordHash) { setError("Incorrect employee ID or password."); return; }
      if (!user.active) { setError("This account has been deactivated."); return; }
      setCurrentUser(user);
    } catch (e) {
      setError("Couldn't verify password. Refresh and try again.");
    }
  }

  if (!ready) return <div className="w-full h-screen bg-neutral-50" />;

  if (!currentUser) {
    return (
      <div className="w-full h-screen bg-neutral-50 flex items-center justify-center" style={{ fontFamily: "system-ui" }}>
        <div className="w-full max-w-sm px-4">
          <div className="flex justify-center mb-2"><img src={OLEEVIA_LOGO} alt="Oleevia" className="h-12" /></div>
          <p className="text-[11px] text-neutral-400 text-center mb-5 tracking-wide">DOCFLOW</p>
          <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Employee ID</label>
              <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="e.g. OGC111" className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg" />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg" />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button onClick={handleLogin} className="w-full bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-emerald-800">Sign in</button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {SEED_USERS.map((u) => (
              <button key={u.employeeId} type="button" onClick={() => { setEmployeeId(u.employeeId); setPassword(u.password); }}
                className="text-left bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs hover:border-emerald-300">
                <span className="font-medium">{ROLE_LABELS[u.role]}</span>
                <span className="block text-neutral-400 font-mono mt-0.5">{u.employeeId}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-neutral-50 flex" style={{ fontFamily: "system-ui" }}>
      <div className="w-56 bg-white border-r border-neutral-200 p-5">
        <img src={OLEEVIA_LOGO} alt="Oleevia" className="h-8 mb-4" />
        <p className="text-xs text-neutral-500 mb-4">Signed in as {currentUser.name}</p>
        <button type="button" onClick={() => setCurrentUser(null)} className="text-xs text-red-600 hover:underline flex items-center gap-1"><LogOut size={12} /> Sign out</button>
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Welcome, {currentUser.name} ({ROLE_LABELS[currentUser.role]}).</p>
      </div>
    </div>
  );
}
