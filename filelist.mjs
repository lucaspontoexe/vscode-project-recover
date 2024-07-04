import { cpSync, existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

// windows:  %appdata%\code\user\history
// linux:   ~/.config/Code/User/History
const historyFolder = "./History";

const folderlist = readdirSync(historyFolder); // array com as pastas

// path.join(folder, folderlist[0], "entries.json")

/** @typedef {object} entries_json
 * @property {number} version
 * @property {string} resource
 * @property {object[]} entries
 * @property {string} entries.id
 * @property {number} entries.timestamp
 * @property {string} entries.source
 */

for (let currentFolder of folderlist) {
  const filepath = path.join(historyFolder, currentFolder, "entries.json");
  if (!existsSync(filepath)) {
    console.log("um arquivo que não segue padrão apareceu");
    continue;
  }
  const f = readFileSync(filepath, { encoding: "utf8" });
  /** @type entries_json */
  const entries_json = JSON.parse(f);

  // idea: filter files
  // if (!entries_json.resource.includes("f%3A")) continue;

  // grab most recent file
  // idea: select biggest/latest
  const source = path.join(historyFolder, currentFolder, entries_json.entries.at(-1).id);
  const destination = path.join(
    "recovered",
    // remove invalid windows chars
    decodeURIComponent(entries_json.resource).replaceAll(':', '') 
  );

  cpSync(source, destination, { recursive: true });
}
