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
    
    // Replace dark:text-blue-400 with dark:text-blue-300 to make it lighter
    content = content.replace(/dark:text-blue-400/g, 'dark:text-blue-300');
    // Replace text-blue-600 with dark:text-blue-300 if dark is not present
    content = content.replace(/text-blue-600(?!\s+dark:text-blue-[0-9]+)/g, 'text-blue-600 dark:text-blue-300');
    // Replace text-blue-700 with dark:text-blue-300 if dark is not present
    content = content.replace(/text-blue-700(?!\s+dark:text-blue-[0-9]+)/g, 'text-blue-700 dark:text-blue-300');

    fs.writeFileSync(file, content, 'utf-8');
});
console.log("Blue dark mode classes applied.");
