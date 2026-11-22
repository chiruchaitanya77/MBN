// tree.js
const fs = require("fs");
const path = require("path");

// Add folders you want to exclude here
const EXCLUDED = ["node_modules", ".git", "dist", "build", ".next",".idea", "External Libraries", "Scratches and Consoles"];

function printTree(dirPath, prefix = "") {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    items.forEach((item, index) => {

        // Skip excluded folders
        if (EXCLUDED.includes(item.name)) return;

        const isLast = index === items.length - 1;
        const connector = isLast ? "└── " : "├── ";
        const itemPath = path.join(dirPath, item.name);

        console.log(prefix + connector + item.name);

        if (item.isDirectory()) {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            printTree(itemPath, newPrefix);
        }
    });
}

// ---- main ----
const inputPath = "/Users/chiru/WebstormProjects/mbn_nextjs"

if (!inputPath) {
    console.error("Usage: node tree.js <folder-path>");
}

const rootPath = path.resolve(inputPath);
console.log(rootPath);
printTree(rootPath);
