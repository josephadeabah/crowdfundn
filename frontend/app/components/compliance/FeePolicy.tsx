import { useState } from 'react';
import { Card } from '@/app/components/ui/card';

interface Question {
  id: string;
  title: string;
  content: JSX.Element;
}

const Pricing = () => {
  const [selectedQuestion, setSelectedQuestion] =
    useState<string>('investment-fees');

  const questions: Question[] = [
    {
      id: 'investment-fees',
      title: 'What are the fees for investing on BantuHive?',
      content: (
        <div className="space-y-6">
          <p className="text-foreground/90">
            There is no fee for becoming a member of BantuHive's investor
            community.
          </p>
          <p className="text-foreground/90">
            When you make an investment on the platform, BantuHive charges an
            investment fee of <strong>7%</strong> which remains capped at a
            maximum of <strong>GHS 300</strong>.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              Please note that this change applies to investment offers that are
              launched after 2 September 2025. Please read the Summary of Key
              Information and payment information carefully when you are
              investing.
            </p>
          </div>
          <p className="text-foreground/90">
            This is collected when the payment for your investment is processed
            by BantuHive.
          </p>
          <p className="text-foreground/90">
            We also charge a <strong>5% success fee</strong> if you make a
            profit on your investment when the Company you invested in finally
            exits. This is to service the ongoing support we provide to
            represent your interests as a shareholder.
          </p>
        </div>
      ),
    },
    {
      id: 'investment-fee-details',
      title: 'Investment Fee Details',
      content: (
        <div className="space-y-6">
          <p className="text-foreground/90">
            When making an investment, a fee of <strong>7%</strong> of the
            amount invested is applied to each investment. The investment fee,
            including the exact amount being applied to your investment, is
            outlined in the investment process before your investment is
            pledged. This fee is capped at a maximum of <strong>GHS 300</strong>
            , and is collected when the payment for your investment is processed
            by BantuHive.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              What the Investment Fee Covers
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  The running and optimisation of the BantuHive platform, which
                  enables investors to access some of the most exciting and
                  ambitious businesses from across Africa 24/7.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Our compliance and legal team, which undertakes due diligence
                  to ensure a pitch is 'fair, clear and not misleading' for
                  investors.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Managing the completion of an investment including payment
                  capture, anti-money laundering (AML) checks and issuing of
                  share certificates.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Providing support to investors, both during and after a
                  campaign. Investors can contact us down the road and we will
                  always be available to help.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Fee Examples
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-3 text-sm font-semibold">
                      Your Investment
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      BantuHive's Investment Fee
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Total Amount Collected
                    </th>
                  </tr>
                </thead>
                <tbody className="text-foreground/90">
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 10</td>
                    <td className="p-3">
                      GHS 5 (Minimum fee of GHS 5 applied)
                    </td>
                    <td className="p-3">GHS 15</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 250</td>
                    <td className="p-3">GHS 17.50 (7% fee applied)</td>
                    <td className="p-3">GHS 267.50</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 2,500</td>
                    <td className="p-3">GHS 175 (7% fee applied)</td>
                    <td className="p-3">GHS 2,675</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 5,000</td>
                    <td className="p-3">GHS 300 (GHS 300 cap applied)</td>
                    <td className="p-3">GHS 5,300</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 25,000</td>
                    <td className="p-3">GHS 300 (GHS 300 cap applied)</td>
                    <td className="p-3">GHS 25,300</td>
                  </tr>
                  <tr>
                    <td className="p-3">GHS 250,000</td>
                    <td className="p-3">GHS 300 (GHS 300 cap applied)</td>
                    <td className="p-3">GHS 250,300</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'success-fee',
      title: 'Success Fee - Full Exit of Company',
      content: (
        <div className="space-y-6">
          <p className="text-foreground/90">
            The success fee aligns our long-term success to yours, so is only
            payable if you make a profit on your investment when a company you
            invested in is finally sold. There are{' '}
            <strong>no annual fees</strong> for the ongoing support we provide
            once you've made an investment.
          </p>
          <p className="text-foreground/90">
            If you make a return on your investment at the point of exit, you'll
            keep <strong>95%</strong> of any profit, and we'll take a{' '}
            <strong>5%</strong> fee for managing your investment over the years.
            If your investment doesn't make a profit on exit, then there is no
            charge.
          </p>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-foreground">Example:</h4>
            <p className="text-foreground/90">
              If you invest <strong>GHS 10,000</strong> and receive a return of{' '}
              <strong>GHS 100,000</strong>, you'll receive your GHS 10,000
              investment back, as well as 95% of the GHS 90,000 profit, which
              equates to <strong>GHS 85,500</strong>. BantuHive's success fee
              would be <strong>GHS 4,500</strong>, which equates to 5% of the
              GHS 90,000 profit.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              What the Success Fee Covers
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Liaising with companies to ensure you are kept up to date with
                  key business updates, and where relevant, managing investor
                  votes to ensure you have your say on important business
                  decisions.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Managing pre-emption and follow-on rounds to ensure you can
                  maintain your stake in the company and continue to fuel its
                  growth.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Taking care of all the admin needed to receive a return on
                  your investment when a business you have invested in exits,
                  pays a dividend or sells shares via a secondary share sale.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> BantuHive's success fee only applies when a
              "full exit" of a company occurs.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'platform-overview',
      title: 'Platform Fee Overview',
      content: (
        <div className="space-y-6">
          <p className="text-foreground/90">
            BantuHive is committed to transparent pricing. We only succeed when
            you do, which is why our fee structure is designed to align with
            your success.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Investment Fee
              </h3>
              <p className="text-3xl font-bold text-primary mb-2">7%</p>
              <p className="text-sm text-foreground/80">
                Capped at GHS 300 per investment
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Success Fee
              </h3>
              <p className="text-3xl font-bold text-secondary mb-2">5%</p>
              <p className="text-sm text-foreground/80">
                Only on profitable exits
              </p>
            </Card>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              No Hidden Costs
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>No membership fees</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>No annual management fees</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>No exit fees (only success fee on profits)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>No fees if your investment doesn't profit</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'donation-fees',
      title: 'What are the fees for donations on BantuHive?',
      content: (
        <div className="space-y-6">
          <p className="text-foreground/90">
            BantuHive is an all-in-one crowdfunding platform that supports both
            equity investments and donations. For donations, we maintain a
            transparent and simple fee structure.
          </p>

          <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Donation Platform Fee
            </h3>
            <p className="text-3xl font-bold text-primary mb-2">7%</p>
            <p className="text-foreground/90">
              BantuHive charges a <strong>7% platform fee</strong> on all
              donations made through the platform. This fee helps us maintain
              and improve the donation infrastructure, provide support to
              campaign organizers, and ensure the security of all transactions.
            </p>
          </div>

          <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Paystack Transaction Fee
            </h3>
            <p className="text-3xl font-bold text-secondary mb-2">1.95%</p>
            <p className="text-foreground/90">
              In addition to the platform fee,{' '}
              <strong>Paystack charges a 1.95% transaction fee</strong> on all
              transactions processed through the platform. This applies to both
              donations and equity investments.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Total Fee Breakdown
            </h3>
            <p className="text-foreground/90 mb-4">
              When you make a donation on BantuHive, the total fees consist of:
            </p>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong>7%</strong> - BantuHive platform fee
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong>1.95%</strong> - Paystack transaction fee
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  <strong>Total: 8.95%</strong> - Combined processing fees
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Donation Fee Examples
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-3 text-sm font-semibold">
                      Donation Amount
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      BantuHive Fee (7%)
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Paystack Fee (1.95%)
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Total Collected
                    </th>
                  </tr>
                </thead>
                <tbody className="text-foreground/90">
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 50</td>
                    <td className="p-3">GHS 3.50</td>
                    <td className="p-3">GHS 0.98</td>
                    <td className="p-3">GHS 54.48</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 100</td>
                    <td className="p-3">GHS 7.00</td>
                    <td className="p-3">GHS 1.95</td>
                    <td className="p-3">GHS 108.95</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 500</td>
                    <td className="p-3">GHS 35.00</td>
                    <td className="p-3">GHS 9.75</td>
                    <td className="p-3">GHS 544.75</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 1,000</td>
                    <td className="p-3">GHS 70.00</td>
                    <td className="p-3">GHS 19.50</td>
                    <td className="p-3">GHS 1,089.50</td>
                  </tr>
                  <tr>
                    <td className="p-3">GHS 5,000</td>
                    <td className="p-3">GHS 350.00</td>
                    <td className="p-3">GHS 97.50</td>
                    <td className="p-3">GHS 5,447.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              What the Donation Fee Covers
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Platform maintenance and hosting infrastructure</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Secure payment processing and fraud protection</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Campaign verification and monitoring</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  24/7 customer support for donors and campaign organizers
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Tools and resources for campaign success</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'why-fees',
      title: 'Why Does BantuHive Charge These Fees?',
      content: (
        <div className="space-y-6">
          <p className="text-foreground/90">
            BantuHive's fees are designed to maintain a world-class investment
            platform while ensuring transparency and fairness for all investors
            across Africa.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Platform Excellence
            </h3>
            <p className="text-foreground/90 mb-4">
              Your fees support the continuous improvement and security of the
              BantuHive platform, ensuring you have access to:
            </p>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Cutting-edge technology infrastructure</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Advanced security measures to protect your investments
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Regular platform updates and new features</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Mobile and web accessibility across devices</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Investor Protection
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Comprehensive due diligence on all investment opportunities
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Legal and compliance oversight</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Anti-money laundering (AML) checks</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Regulatory compliance across African markets</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Ongoing Support
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Dedicated investor support team</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Portfolio management tools and updates</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Regular company performance reports</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Exit facilitation and shareholder representation</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const selectedQuestionData = questions.find((q) => q.id === selectedQuestion);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Fees & Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Simple, fair pricing. BantuHive only makes money when you do.
          </p>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Questions List */}
          <aside className="lg:col-span-4">
            <Card className="p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                Topics
              </h2>
              <nav className="space-y-2">
                {questions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => setSelectedQuestion(question.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedQuestion === question.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-muted text-foreground/80 hover:text-foreground'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {question.title}
                    </span>
                  </button>
                ))}
              </nav>
            </Card>
          </aside>

          {/* Right Column - Answer Display */}
          <main className="lg:col-span-8">
            <Card className="p-6 md:p-8">
              {selectedQuestionData && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {selectedQuestionData.title}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    {selectedQuestionData.content}
                  </div>
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
