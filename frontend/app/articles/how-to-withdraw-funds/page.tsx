import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

export default async function HowToWithdrawFunds() {
  // Path to the markdown file
  const markdownFilePath = path.join(
    process.cwd(),
    'public',
    'content',
    'how-to-withdraw-funds.md',
  );

  // Read the markdown file
  const fileContent = fs.readFileSync(markdownFilePath, 'utf-8');

  // Parse the markdown content to HTML using remark
  const processedContent = await remark().use(html).process(fileContent);

  // Convert buffer to string
  const content = processedContent.toString();

  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        How to Withdraw Funds
      </h1>

      <section className="bg-white p-12 rounded-lg mb-16">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>
    </div>
  );
}
