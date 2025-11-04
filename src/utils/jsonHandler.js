import { promises as fs } from "fs";
import path from "path";
import url from "url";

// resuelve rutas tipo "data/tareas.json" relativo a /src/
function resolveDataPath(relPath) {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  return path.join(__dirname, "..", relPath);
}

// lee un json y si no existe devuelve []
export async function readJSON(relPath) {
  const fullPath = resolveDataPath(relPath);
  try {
    const raw = await fs.readFile(fullPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// guarda un json bonito con indentación
export async function writeJSON(relPath, data) {
  const fullPath = resolveDataPath(relPath);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf8");
}
