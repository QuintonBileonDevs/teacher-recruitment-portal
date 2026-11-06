import fs from 'fs';
import path from 'path';

function walkDir(dir: string) {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace text-blue-700
    content = content.replace(/text-blue-700(?!\s+dark:text-blue-[0-9]+)/g, 'text-blue-700 dark:text-blue-400');
    // Replace text-blue-600
    content = content.replace(/text-blue-600(?!\s+dark:text-blue-[0-9]+)/g, 'text-blue-600 dark:text-blue-400');
    // Replace text-blue-800
    content = content.replace(/text-blue-800(?!\s+dark:text-blue-[0-9]+)/g, 'text-blue-800 dark:text-blue-300');
    // Replace text-blue-900 (if it doesn't already have dark)
    content = content.replace(/text-blue-900(?!\s+dark:text-blue-[0-9]+)/g, 'text-blue-900 dark:text-blue-300');
    
    // Replace bg-blue-600
    content = content.replace(/bg-blue-600(?!\s+dark:bg-blue-[0-9]+)/g, 'bg-blue-600 dark:bg-blue-500');

    // hover:bg-blue-700
    content = content.replace(/hover:bg-blue-700(?!\s+dark:hover:bg-blue-[0-9]+)/g, 'hover:bg-blue-700 dark:hover:bg-blue-400');

    fs.writeFileSync(file, content, 'utf-8');
});
console.log("Blue dark mode classes applied.");
