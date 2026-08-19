import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "src", "app_chunks");
if (!fs.existsSync(dir)) { console.log("No chunks, skip"); process.exit(0); }
const files = fs.readdirSync(dir).filter(f => f.endsWith(".txt")).sort();
let out = "";
for (const f of files) out += fs.readFileSync(path.join(dir, f), "utf8");
fs.writeFileSync(path.join(__dirname, "..", "src", "App.jsx"), out);
console.log("Assembled App.jsx", out.length, "from", files.length, "chunks");
