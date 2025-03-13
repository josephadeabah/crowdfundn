export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  title: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string; // Optional alt text for images
  }[];
}

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'product',
    name: 'Product Launch',
    description: 'Perfect for introducing a new product to the market',
    title: 'Introducing [Your Product]: The Future of [Industry]',
    content: `
      <h1>Introducing Our Groundbreaking Product</h1>
      <p>We're excited to unveil [Product Name], a revolutionary solution designed to transform how you [main benefit].</p>
      <h2>The Problem We're Solving</h2>
      <p>For too long, [describe industry problem]. This has led to [negative consequences].</p>
      <h2>Our Solution</h2>
      <p>After [time period] of research and development, we've created a product that offers:</p>
      <ul>
        <li><strong>Key Feature 1:</strong> Description of how this feature benefits the user</li>
        <li><strong>Key Feature 2:</strong> Description of how this feature benefits the user</li>
        <li><strong>Key Feature 3:</strong> Description of how this feature benefits the user</li>
      </ul>
      <h2>Why We Need Your Support</h2>
      <p>To bring [Product Name] to market, we need to [specific use of funds]. Your support will directly contribute to:</p>
      <ul>
        <li>Manufacturing the first production run</li>
        <li>Final certification and testing</li>
        <li>Building our distribution network</li>
      </ul>
    `,
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        alt: 'Product prototype',
      },
    ],
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit Cause',
    description: 'Ideal for charitable initiatives and social causes',
    title: 'Help Us [Accomplish Mission] for [Beneficiary Group]',
    content: `
      <h1>Making a Difference Together</h1>
      <p>At [Organization Name], we believe that [core belief related to your cause]. Today, we're launching a campaign to [specific goal].</p>
      <h2>The Challenge We're Addressing</h2>
      <p>[Describe the problem in detail, using statistics when possible]. This situation directly affects [describe who is impacted and how].</p>
      <h2>Our Approach</h2>
      <p>We have developed a comprehensive plan to address this issue through:</p>
      <ul>
        <li><strong>Initiative 1:</strong> Description of this component and its impact</li>
        <li><strong>Initiative 2:</strong> Description of this component and its impact</li>
        <li><strong>Initiative 3:</strong> Description of this component and its impact</li>
      </ul>
      <h2>Impact of Your Support</h2>
      <p>Your contribution will directly help us to [specific outcomes]. Here's how different donation levels translate to real-world impact:</p>
      <ul>
        <li><strong>$25:</strong> Provides [specific impact]</li>
        <li><strong>$50:</strong> Enables us to [specific impact]</li>
        <li><strong>$100:</strong> Supports [specific impact]</li>
      </ul>
    `,
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
    ],
  },
  {
    id: 'creative',
    name: 'Creative Project',
    description: 'Great for films, books, music, and artistic ventures',
    title: '[Your Creative Project]: Bringing [Vision] to Life',
    content: `
      <h1>A Creative Vision Coming to Life</h1>
      <p>We're excited to share [Project Name] with you—a [type of creative project] that [brief description of concept and vision].</p>
      <h2>The Creative Vision</h2>
      <p>[Detailed description of your creative concept, inspiration, and what makes it unique]. This project explores themes of [themes or ideas] through [medium or approach].</p>
      <h2>Why This Matters</h2>
      <p>In today's world, [explain why this creative project is timely, important, or fills a gap]. Our project will [intended impact on audience or art form].</p>
      <h2>What We've Accomplished So Far</h2>
      <p>We've already invested [time period] in developing this project and have completed:</p>
      <ul>
        <li>[Milestone 1] - [Brief description]</li>
        <li>[Milestone 2] - [Brief description]</li>
        <li>[Milestone 3] - [Brief description]</li>
      </ul>
    `,
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        alt: 'Creative project inspiration',
      },
    ],
  },
  {
    id: 'education',
    name: 'Education Initiative',
    description:
      'Perfect for educational programs, scholarships, or school projects',
    title: 'Support [Educational Initiative]: Empowering [Target Group]',
    content: `
      <h1>Empowering Through Education</h1>
      <p>We're launching [Educational Initiative] to provide [specific educational opportunity] for [target group].</p>
      <h2>The Need</h2>
      <p>[Describe the educational gap or need]. Without intervention, [negative consequences].</p>
      <h2>Our Plan</h2>
      <p>We aim to [specific goals] through:</p>
      <ul>
        <li><strong>Program 1:</strong> Description of this program</li>
        <li><strong>Program 2:</strong> Description of this program</li>
        <li><strong>Program 3:</strong> Description of this program</li>
      </ul>
      <h2>How You Can Help</h2>
      <p>Your support will fund:</p>
      <ul>
        <li><strong>$25:</strong> Provides [specific impact]</li>
        <li><strong>$50:</strong> Enables us to [specific impact]</li>
        <li><strong>$100:</strong> Supports [specific impact]</li>
      </ul>
    `,
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        alt: 'Students studying in a library',
      },
    ],
  },
  {
    id: 'tech',
    name: 'Tech Innovation',
    description: 'Ideal for tech startups and innovative projects',
    title: 'Revolutionizing [Industry] with [Tech Innovation]',
    content: `
      <h1>Introducing [Tech Innovation]</h1>
      <p>We're developing [Tech Innovation], a cutting-edge solution that will transform [industry].</p>
      <h2>The Problem</h2>
      <p>[Describe the industry problem]. This has led to [negative consequences].</p>
      <h2>Our Solution</h2>
      <p>Our technology addresses this problem by [explain how it works]. Key features include:</p>
      <ul>
        <li><strong>Feature 1:</strong> Description of this feature</li>
        <li><strong>Feature 2:</strong> Description of this feature</li>
        <li><strong>Feature 3:</strong> Description of this feature</li>
      </ul>
      <h2>Why We Need Your Support</h2>
      <p>To bring [Tech Innovation] to market, we need to [specific use of funds]. Your support will help us:</p>
      <ul>
        <li>Develop the final prototype</li>
        <li>Conduct user testing</li>
        <li>Launch the product</li>
      </ul>
    `,
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/embed/9bZkp7q19f0',
      },
    ],
  },
  {
    id: 'community',
    name: 'Community Project',
    description: 'Great for local community initiatives and events',
    title: 'Building a Better [Community Name] Together',
    content: `
      <h1>Join Us in Building a Better [Community Name]</h1>
      <p>We're launching [Community Project] to improve [specific aspect of community life].</p>
      <h2>The Need</h2>
      <p>[Describe the community need]. Without action, [negative consequences].</p>
      <h2>Our Plan</h2>
      <p>We aim to [specific goals] through:</p>
      <ul>
        <li><strong>Initiative 1:</strong> Description of this initiative</li>
        <li><strong>Initiative 2:</strong> Description of this initiative</li>
        <li><strong>Initiative 3:</strong> Description of this initiative</li>
      </ul>
      <h2>How You Can Help</h2>
      <p>Your support will fund:</p>
      <ul>
        <li><strong>$25:</strong> Provides [specific impact]</li>
        <li><strong>$50:</strong> Enables us to [specific impact]</li>
        <li><strong>$100:</strong> Supports [specific impact]</li>
      </ul>
    `,
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        alt: 'Community gathering',
      },
    ],
  },
];
