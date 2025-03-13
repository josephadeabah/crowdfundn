export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  title: string;
  content: string;
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
        
        <h2>How It Works</h2>
        
        <p>Our technology works by [brief explanation of technology]. This approach allows us to [unique advantage].</p>
        
        <h2>Why We Need Your Support</h2>
        
        <p>To bring [Product Name] to market, we need to [specific use of funds]. Your support will directly contribute to:</p>
        
        <ul>
          <li>Manufacturing the first production run</li>
          <li>Final certification and testing</li>
          <li>Building our distribution network</li>
        </ul>
        
        <h2>Our Team</h2>
        
        <p>We're a passionate group of [industry] specialists with a combined [X] years of experience. Our diverse backgrounds in [relevant fields] give us the perfect foundation to make this project a success.</p>
        
        <h2>Timeline</h2>
        
        <p>Here's our roadmap for bringing [Product Name] to life:</p>
        
        <ul>
          <li><strong>Month 1-2:</strong> Finalize design and begin manufacturing</li>
          <li><strong>Month 3-4:</strong> Quality testing and certification</li>
          <li><strong>Month 5-6:</strong> Shipping to backers</li>
        </ul>
        
        <h2>Join Us</h2>
        
        <p>By supporting this campaign, you're not just pre-ordering a fantastic product—you're helping to [larger mission or impact]. Be part of our journey to [vision statement].</p>
        
        <p>Thank you for your support!</p>
      `,
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
        
        <h2>About Our Organization</h2>
        
        <p>[Organization Name] has been working in [field/area] since [founding year]. Over the past [time period], we have [mention previous achievements or impact].</p>
        
        <h2>Meet the Team</h2>
        
        <p>Our dedicated team brings together experts in [relevant fields] who share a common passion for [cause]. With [X] years of combined experience, we have the expertise needed to make this project successful.</p>
        
        <h2>Timeline</h2>
        
        <ul>
          <li><strong>Phase 1 (Months 1-2):</strong> [Description of activities]</li>
          <li><strong>Phase 2 (Months 3-4):</strong> [Description of activities]</li>
          <li><strong>Phase 3 (Months 5-6):</strong> [Description of activities]</li>
        </ul>
        
        <h2>Transparency Commitment</h2>
        
        <p>We are committed to complete transparency throughout this project. We will provide regular updates on our progress, challenges, and how funds are being used.</p>
        
        <h2>Join Our Community</h2>
        
        <p>By supporting this campaign, you become part of a community dedicated to [shared vision or goal]. Together, we can [aspirational outcome].</p>
        
        <p>Thank you for your compassion and generosity!</p>
      `,
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
        
        <h2>The Next Steps</h2>
        
        <p>To complete [Project Name], we need to [outline the remaining work]. Your support will directly fund:</p>
        
        <ul>
          <li><strong>[Component 1]:</strong> [Description and cost]</li>
          <li><strong>[Component 2]:</strong> [Description and cost]</li>
          <li><strong>[Component 3]:</strong> [Description and cost]</li>
        </ul>
        
        <h2>Meet the Creative Team</h2>
        
        <p>Our team brings together talented individuals with backgrounds in [relevant fields]:</p>
        
        <ul>
          <li><strong>[Team Member 1]:</strong> [Role and brief bio]</li>
          <li><strong>[Team Member 2]:</strong> [Role and brief bio]</li>
          <li><strong>[Team Member 3]:</strong> [Role and brief bio]</li>
        </ul>
        
        <h2>What You'll Receive</h2>
        
        <p>As a backer, you'll get [list of perks, rewards, or exclusive content]. But beyond the tangible rewards, you'll be supporting [broader impact of the project on art/culture/society].</p>
        
        <h2>Production Timeline</h2>
        
        <ul>
          <li><strong>[Month/Year]:</strong> [Production milestone]</li>
          <li><strong>[Month/Year]:</strong> [Production milestone]</li>
          <li><strong>[Month/Year]:</strong> [Delivery of final project or rewards]</li>
        </ul>
        
        <h2>Join Our Creative Journey</h2>
        
        <p>By backing this project, you become an essential part of bringing [Project Name] to life. You'll receive exclusive updates throughout the creative process and have the satisfaction of knowing you helped make this [type of art] possible.</p>
        
        <p>Thank you for supporting independent creativity!</p>
      `,
  },
];
