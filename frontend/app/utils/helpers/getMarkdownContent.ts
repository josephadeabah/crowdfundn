import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// Function to read and process Markdown content
export async function getMarkdownContent(fileName: string) {
  const markdownFilePath = path.join(
    process.cwd(),
    'public',
    'content',
    fileName,
  );

  const fileContent = fs.readFileSync(markdownFilePath, 'utf-8');
  const processedContent = await remark().use(html).process(fileContent);

  return processedContent.toString(); // Convert the processed buffer to string
}
