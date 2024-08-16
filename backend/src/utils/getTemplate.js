import fs from 'fs';
import path from 'path';

function getTemplate(templateName) {
  const __dirname = path.resolve();
  const filePath = path.join(
    __dirname,
    './src/templates',
    `${templateName}.html`
  );
  return fs.readFileSync(filePath, 'utf8');
}

export default getTemplate;
