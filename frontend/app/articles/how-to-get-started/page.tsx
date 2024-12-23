import React from 'react';
import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import { remark } from 'remark';
import html from 'remark-html';
import { Button } from '@/app/components/button/Button';

// Component to render the Markdown content
const HowToGetStarted = ({ content }: { content: string }) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        How to Get Started with Bantuhive
      </h1>

      <section className="bg-white p-12 rounded-lg shadow-lg mb-16">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      <div className="text-center">
        <Button className="text-xl py-3 px-6" size="lg" variant="outline">
          Start Fundraising Now
        </Button>
      </div>
    </div>
  );
};

// Next.js function to read and parse the Markdown file during build time
export const getStaticProps: GetStaticProps = async () => {
  // Path to the markdown file
  const markdownFilePath = path.join(process.cwd(), 'content', 'how-to-get-started.md');
  
  // Read the markdown file
  const fileContent = fs.readFileSync(markdownFilePath, 'utf-8');
  
  // Parse the markdown content to HTML using remark
  const processedContent = await remark().use(html).process(fileContent);
  
  // Convert buffer to string
  const content = processedContent.toString();
  
  return {
    props: {
      content,
    },
  };
};

export default HowToGetStarted;
