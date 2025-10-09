'use client';
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
            When you make an investment on the platform, BantuHive charges:
          </p>

          {/* Add platform fee */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <ul className="space-y-2 text-foreground/90">
              <li className="flex justify-between">
                <span>
                  <strong>Platform Fee:</strong>
                </span>
                <span>
                  <strong>3%</strong> of investment amount
                </span>
              </li>
              <li className="flex justify-between">
                <span>
                  <strong>Investment Fee:</strong>
                </span>
                <span>
                  <strong>7%</strong> (capped at GHS 300)
                </span>
              </li>
              <li className="flex justify-between border-t border-border pt-2">
                <span>
                  <strong>Total Initial Fees:</strong>
                </span>
                <span>
                  <strong>10%</strong> (7% investment + 3% platform)
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              Please note that this change applies to investment offers that are
              launched after 2 September 2025. Please read the Summary of Key
              Information and payment information carefully when you are
              investing.
            </p>
          </div>

          <p className="text-foreground/90">
            These fees are collected when the payment for your investment is
            processed by BantuHive.
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
            When making an investment, the following fees apply to each
            investment:
          </p>

          {/* Fee breakdown */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-3 text-foreground">
              Fee Structure:
            </h4>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex justify-between">
                <span>
                  <strong>Platform Fee:</strong>
                </span>
                <span>
                  <strong>3%</strong> of investment amount
                </span>
              </li>
              <li className="flex justify-between">
                <span>
                  <strong>Investment Fee:</strong>
                </span>
                <span>
                  <strong>7%</strong> of investment amount (capped at GHS 300)
                </span>
              </li>
              <li className="flex justify-between border-t border-border pt-2">
                <span>
                  <strong>Total Initial Fees:</strong>
                </span>
                <span>
                  <strong>10%</strong> (3% platform + 7% investment)
                </span>
              </li>
            </ul>
          </div>

          <p className="text-foreground/90">
            The investment fee is capped at a maximum of{' '}
            <strong>GHS 300</strong>, while the platform fee remains at 3%
            regardless of investment size. These fees, including the exact
            amounts being applied to your investment, are outlined in the
            investment process before your investment is pledged. Both fees are
            collected when the payment for your investment is processed by
            BantuHive.
          </p>

          {/* Fee examples table */}
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
                      Platform Fee (3%)
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Investment Fee (7%)
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Total Fees
                    </th>
                    <th className="text-left p-3 text-sm font-semibold">
                      Total Amount Collected
                    </th>
                  </tr>
                </thead>
                <tbody className="text-foreground/90">
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 10</td>
                    <td className="p-3">GHS 0.30</td>
                    <td className="p-3">GHS 5 (Minimum fee)</td>
                    <td className="p-3">GHS 5.30</td>
                    <td className="p-3">GHS 15.30</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 250</td>
                    <td className="p-3">GHS 7.50</td>
                    <td className="p-3">GHS 17.50</td>
                    <td className="p-3">GHS 25.00</td>
                    <td className="p-3">GHS 275.00</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 2,500</td>
                    <td className="p-3">GHS 75.00</td>
                    <td className="p-3">GHS 175.00</td>
                    <td className="p-3">GHS 250.00</td>
                    <td className="p-3">GHS 2,750.00</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 5,000</td>
                    <td className="p-3">GHS 150.00</td>
                    <td className="p-3">GHS 300 (cap applied)</td>
                    <td className="p-3">GHS 450.00</td>
                    <td className="p-3">GHS 5,450.00</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3">GHS 25,000</td>
                    <td className="p-3">GHS 750.00</td>
                    <td className="p-3">GHS 300 (cap applied)</td>
                    <td className="p-3">GHS 1,050.00</td>
                    <td className="p-3">GHS 26,050.00</td>
                  </tr>
                  <tr>
                    <td className="p-3">GHS 250,000</td>
                    <td className="p-3">GHS 7,500.00</td>
                    <td className="p-3">GHS 300 (cap applied)</td>
                    <td className="p-3">GHS 7,800.00</td>
                    <td className="p-3">GHS 257,800.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              What the Platform Fee Covers
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-blue-700">•</span>
                <span>
                  Platform infrastructure, maintenance, and security to ensure
                  reliable 24/7 access to investment opportunities across
                  Africa.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-700">•</span>
                <span>
                  Continuous development and optimization of the investor
                  experience with new features and tools.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-700">•</span>
                <span>
                  Customer support services for investors throughout their
                  investment journey.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              What the Investment Fee Covers
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  Comprehensive due diligence on investment opportunities to
                  ensure pitches are 'fair, clear and not misleading' for
                  investors.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  Legal and compliance oversight throughout the investment
                  process.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  Managing the completion of investments including issuer onboarding, payment
                  capture and anti-money laundering (AML) checks.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  Ongoing investor support and shareholder representation
                  services.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Important Notes
            </h3>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  The <strong>GHS 5 minimum fee</strong> applies to the
                  investment fee component for small investments.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  The <strong>GHS 300 cap</strong> applies only to the
                  investment fee (7%), not the platform fee (3%).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  These fees are separate from the{' '}
                  <strong>5% success fee</strong> that applies only when you
                  make a profit on your investment at exit.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  All fees are clearly displayed during the investment process
                  before you commit any funds.
                </span>
              </li>
            </ul>
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

          <div className="bg-green-700/5 border border-green-700/20 p-4 rounded-lg">
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
                <span className="text-green-700">•</span>
                <span>
                  Liaising with companies to ensure you are kept up to date with
                  key business updates, and where relevant, managing investor
                  votes to ensure you have your say on important business
                  decisions.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  Managing pre-emption and follow-on rounds to ensure you can
                  maintain your stake in the company and continue to fuel its
                  growth.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
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

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-700/5 to-blue-700/10 border-blue-700/20">
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Platform Fee
              </h3>
              <p className="text-3xl font-bold text-blue-500 mb-2">3%</p>
              <p className="text-sm text-foreground/80">
                Applied to only equity investments
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-700/5 to-green-700/10 border-green-700/20">
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Investment Fee
              </h3>
              <p className="text-3xl font-bold text-green-700 mb-2">7%</p>
              <p className="text-sm text-foreground/80">
                Capped at GHS 300 per investment
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange/5 to-orange/10 border-orange/20">
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Success Fee
              </h3>
              <p className="text-3xl font-bold text-orange mb-2">5%</p>
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
                <span className="text-green-700">✓</span>
                <span>No membership fees</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">✓</span>
                <span>No annual management fees</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">✓</span>
                <span>No exit fees (only success fee on profits)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">✓</span>
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

          <div className="bg-green-700/5 border border-green-700/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Donation Platform Fee
            </h3>
            <p className="text-3xl font-bold text-green-700 mb-2">7%</p>
            <p className="text-foreground/90">
              BantuHive charges a <strong>7% platform fee</strong> on all
              donations made through the platform. This fee helps us maintain
              and improve the donation infrastructure, provide support to
              campaign organizers, and ensure the security of all transactions.
            </p>
          </div>

          <div className="bg-orange/5 border border-orange/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Paystack Transaction Fee
            </h3>
            <p className="text-3xl font-bold text-orange mb-2">1.95%</p>
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
                <span className="text-green-700">•</span>
                <span>
                  <strong>7%</strong> - BantuHive platform fee
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  <strong>1.95%</strong> - Paystack transaction fee
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
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
                <span className="text-green-700">•</span>
                <span>Platform maintenance and hosting infrastructure</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>Secure payment processing and fraud protection</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>KYC verification and monitoring</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  24/7 customer support for donors and campaign organizers
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
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
            across the Globe.
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
                <span className="text-green-700">•</span>
                <span>Cutting-edge technology infrastructure</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>
                  Advanced security measures to protect your investments
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>Regular platform updates and new features</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
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
                <span className="text-green-700">•</span>
                <span>
                  Comprehensive due diligence on all investment opportunities
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>Legal and compliance oversight</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>Anti-money laundering (AML) checks</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
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
                <span className="text-green-700">•</span>
                <span>Dedicated investor support team</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>Portfolio management tools and updates</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
                <span>Regular company performance reports</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-700">•</span>
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
      <header className="border-b border-border bg-gray-50">
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
                        ? 'bg-green-600 text-white shadow-sm'
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
