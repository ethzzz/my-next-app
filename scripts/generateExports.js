const fs = require('fs');
const path = require('path');

const functionDir = path.resolve(__dirname, '../src/components/Functions');
const indexFile = path.join(functionDir, 'index.ts');

const files = fs.readdirSync(functionDir).filter((file) => {
    const filePath = path.join(functionDir, file);
    return fs.statSync(filePath).isDirectory() || file.endsWith('.tsx');
});

const exportStatements = files
    .map((file) => {
        const name = file.replace(/\.tsx$/, '');
        return `export { ${name} } from './${name}';`;
    })
    .join('\n');

fs.writeFileSync(indexFile, exportStatements, 'utf8');
console.log('index.ts generated successfully!');