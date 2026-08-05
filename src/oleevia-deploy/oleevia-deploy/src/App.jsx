import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import OLEEVIA_LOGO from "./logo.js";

const ROLE_LABELS = { admin: "Admin", requester: "Requester", approver: "Approver", accounts: "Accounts" };
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
  { employeeId: "admin", name: "System Admin", password: "admin", role: "admin", department: null, email: "admin@company.com", active: true },
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
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const result = await localOnly.get("dms_users_v2");
        if (result && result.value) {
          setUsers(JSON.parse(result.value));
        } else {
          const seeded = await buildSeedUsers();
          setUsers(seeded);
          await localOnly.set("dms_users_v2", JSON.stringify(seeded));
        }
      } catch (e) {
        const seeded = await buildSeedUsers();
        setUsers(seeded);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function handleLogin() {
    const user = users.find((u) => u.employeeId.toLowerCase() === employeeId.trim().toLowerCase());
    if (!user) {
      setError("Incorrect employee ID or password.");
      return;
    }
    try {
      const attemptedHash = await hashPassword(password, user.salt);
      if (attemptedHash !== user.passwordHash) {
        setError("Incorrect employee ID or password.");
        return;
      }
    } catch (e) {
      setError("Couldn't verify password. Please refresh.");
      return;
    }
    if (!user.active) {
      setError("This account has been deactivated.");
      return;
    }
    setError("");
    setCurrentUser(user);
  }

  if (!loaded) {
    return <div className="w-full h-screen bg-neutral-50" />;
  }

  if (!currentUser) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center overflow-y-auto py-8"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.65)), url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-sm px-4">
          <div className="flex items-center justify-center mb-8 pt-6">
            <img src={OLEEVIA_LOGO} alt="Oleevia" className="h-12 w-auto max-w-[200px] object-contain" style={{ display: "block" }} />
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3 shadow-lg">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Employee ID</label>
              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="e.g. admin"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-emerald-800"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-neutral-50 flex" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="w-56 bg-white border-r border-neutral-200 p-5 flex flex-col">
        <img src={OLEEVIA_LOGO} alt="Oleevia" className="h-8 w-auto max-w-[140px] object-contain mb-4" />
        <p className="text-xs text-neutral-500 mb-4">Signed in as {currentUser.name}</p>
        <button
          type="button"
          onClick={() => setCurrentUser(null)}
          className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-auto"
        >
          <LogOut size={12} /> Sign out
        </button>
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Welcome, {currentUser.name} ({ROLE_LABELS[currentUser.role]}).
        </p>
      </div>
    </div>
  );
}
