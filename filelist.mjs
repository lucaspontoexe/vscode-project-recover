// ih
import { readFile, open, cp } from 'node:fs/promises';
import { cpSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const historyFolder = './History';

const folderlist = readdirSync(historyFolder); // array com as pastas

// path.join(folder, folderlist[0], "entries.json")

function getFolderFilename(folderName) {
    const filepath = path.join(historyFolder, folderName, "entries.json");
    if (!existsSync(filepath)) {
        const newFolderName = path.join(historyFolder, folderName);
        const files = readdirSync(newFolderName);
        if (files.length > 1) console.log('tem mais coisas aqui em ', newFolderName);
        return files[0];
    };

    const f = readFileSync(filepath, {encoding: 'utf8'});
    
    const json_obj = JSON.parse(f);
    return json_obj.resource;
}


/*

GET FILES list

async function getFolderFilenameAsync(folderName) {
    const filepath = path.join(folderPath, folderName, "entries.json");
    
    const f = await readFile(filepath, {encoding: 'utf8'});
    
    const json_obj = JSON.parse(f);
    return json_obj.resource;
}

const entriesList = folderlist.map(folder => getFolderFilename(folder) );
const diskFEntries = (entriesList.filter(i => i.includes('f%3A')))
    // 31 => devstuff index
    .map(e => e.substring(31))
    .map(decodeURIComponent); 

// console.log(entriesList.filter(name => name[0] !== 'f')); // non-file entries. é mais o yxid.js mesmo

console.log(diskFEntries);

*/

/** @typedef {object} json_obj
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
        console.log('um arquivo que não segue padrão apareceu')
        continue;
    };
    const f = readFileSync(filepath, {encoding: 'utf8'});
    /** @type json_obj */
    const json_obj = JSON.parse(f);

    if (!json_obj.resource.includes('f%3A')) continue;

    const source = (path.join(historyFolder, currentFolder, json_obj.entries.at(-1).id));
    const destination = (path.join('recovered2', decodeURIComponent(json_obj.resource.substring(31))));
    
    cpSync(source, destination, {recursive: true})
}