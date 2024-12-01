'use client';

import React, { useState } from 'react';

const FeePolicy: React.FC = () => {
  // Set the default active accordion to 'bantuhive' to open it by default
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    'bantuhive',
  );

  const handleAccordionClick = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <section className="max-w-7xl mx-auto p-12 bg-white">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Fee Policy
      </h1>

      <div className="text-center w-full py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Simple, fair pricing
        </h2>
        <p>Bantuhive.com only makes money when you do.</p>
      </div>

      <div className="space-y-4">
        {/* Paystack Fees Accordion */}
        <div className="space-y-2">
          <div
            className="cursor-pointer p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => handleAccordionClick('paystack')}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Paystack Fees
            </h2>
            <p className="text-sm text-gray-500">
              Click to view Paystack fee details for each country
            </p>
          </div>
          {activeAccordion === 'paystack' && (
            <div className="space-y-4 bg-white p-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Nigeria</h3>
                <p className="text-gray-600">
                  <strong>Local Transactions:</strong> 1.5% + ₦100. The ₦100 fee
                  is waived for transactions under ₦2500. Local transaction fees
                  are capped at ₦2000 per transaction.
                </p>
                <p className="text-gray-600">
                  <strong>International Transactions:</strong> 3.9% + ₦100.
                  Payments can be received from international customers, settled
                  in Naira by default (or USD if selected).
                </p>
                <p className="text-gray-600">
                  <strong>Transfers:</strong>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>
                      Transfers of NGN 5,000 and below: NGN 10 per transfer
                    </li>
                    <li>
                      Transfers between NGN 5,001 and NGN 50,000: NGN 25 per
                      transfer
                    </li>
                    <li>Transfers above NGN 50,000: NGN 50 per transfer</li>
                  </ul>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Ghana</h3>
                <p className="text-gray-600">
                  <strong>Local Transactions:</strong> 1.95%. No upfront fees.
                  Payments can be accepted via multiple channels, including
                  Mobile Money.
                </p>
                <p className="text-gray-600">
                  <strong>International Transactions:</strong> 1.95%. Payments
                  from international customers are settled in Cedis by default.
                </p>
                <p className="text-gray-600">
                  <strong>Transfers:</strong>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Transfers to Mobile Money: GHS 1 per transfer</li>
                    <li>Transfers to bank accounts: GHS 8 per transfer</li>
                  </ul>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  South Africa
                </h3>
                <p className="text-gray-600">
                  <strong>Local Transactions:</strong> 2.9% + ZAR 1 (excluding
                  VAT). EFT transactions are charged at 2% with no flat fee. ZAR
                  1 fee is waived for transactions under ZAR 10.
                </p>
                <p className="text-gray-600">
                  <strong>International Transactions:</strong> 3.1% + ZAR 1
                  (excluding VAT). Payments from international customers are
                  settled in ZAR by default.
                </p>
                <p className="text-gray-600">
                  <strong>Transfers:</strong>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>
                      Transfers to bank accounts: ZAR 3 per transfer (successful
                      or failed)
                    </li>
                  </ul>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Kenya</h3>
                <p className="text-gray-600">
                  <strong>M-PESA Transactions:</strong> 1.5%. No upfront or
                  monthly fees.
                </p>
                <p className="text-gray-600">
                  <strong>Card Transactions:</strong> 2.9% for local card
                  transactions, 3.8% for international card transactions. You
                  can charge international cards in KES or USD, and get settled
                  in either currency.
                </p>
                <p className="text-gray-600">
                  <strong>Transfers:</strong>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>
                      Transfers to M-PESA wallet:
                      <ul className="list-disc pl-6 text-gray-600">
                        <li>
                          KES 20 for transfers between KES 1 and KES 1,500
                        </li>
                        <li>
                          KES 40 for transfers between KES 1,501 and KES 20,000
                        </li>
                        <li>KES 60 for transfers above KES 20,001</li>
                      </ul>
                    </li>
                    <li>
                      Transfers to M-PESA Paybill/Till:
                      <ul className="list-disc pl-6 text-gray-600">
                        <li>
                          KES 40 for transfers between KES 1 and KES 1,500
                        </li>
                        <li>
                          KES 80 for transfers between KES 1,501 and KES 10,000
                        </li>
                        <li>
                          KES 140 for transfers between KES 10,001 and KES
                          40,000
                        </li>
                        <li>
                          KES 180 for transfers between KES 40,001 and KES
                          999,999
                        </li>
                        <li>KES 350 for transfers above KES 1,000,000</li>
                      </ul>
                    </li>
                    <li>
                      Transfers to bank accounts:
                      <ul className="list-disc pl-6 text-gray-600">
                        <li>
                          KES 80 for transfers between KES 1 and KES 10,000
                        </li>
                        <li>
                          KES 120 for transfers between KES 10,001 and KES
                          50,000
                        </li>
                        <li>
                          KES 140 for transfers between KES 50,001 and KES
                          999,999
                        </li>
                        <li>KES 350 for transfers above KES 1,000,000</li>
                      </ul>
                    </li>
                  </ul>
                </p>
                <p className="py-2">
                  For more information visit{' '}
                  <a
                    href="https://paystack.com/pricing"
                    target="_blank"
                    className="text-green-600"
                  >
                    Paystack pricing
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bantuhive Platform Fee Accordion */}
        <div className="space-y-2">
          <div
            className="cursor-pointer p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => handleAccordionClick('bantuhive')}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Bantuhive Platform Fee
            </h2>
            <p className="text-sm text-gray-500">
              Click to view Bantuhive's platform fee policy.
            </p>
          </div>
          {activeAccordion === 'bantuhive' && (
            <div className="space-y-4 bg-white p-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Platform Fee
                </h3>
                <p className="text-gray-600">
                  Bantuhive charges a platform fee of 1.5% on all successful
                  funding transactions. This fee is deducted after Paystack’s
                  processing fee.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  What it covers
                </h3>
                <p className="text-gray-600">
                  The Bantuhive platform fee covers the cost of maintaining the
                  platform, customer support, and other operational expenses to
                  ensure the success of your fundraising campaign.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Fee Structure
                </h3>
                <p className="text-gray-600">
                  The 1.5% fee is automatically deducted before the funds are
                  transferred to the campaign owner's account.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Fee Subject to Change
                </h3>
                <p className="text-gray-600">
                  Bantuhive's platform fee is subject to change based on certain
                  necessary conditions, which may include:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>
                    Adjustment for inflation or changes in the economic
                    environment
                  </li>
                  <li>
                    Additional services or features provided by the platform
                    that require financial support
                  </li>
                  <li>
                    Any changes in the legal or regulatory landscape that affect
                    Bantuhive’s operations
                  </li>
                  <li>
                    Other circumstances that may necessitate adjustments to
                    maintain the quality of the platform
                  </li>
                </ul>
                <p className="text-gray-600 mt-2">
                  Any changes to the platform fee will be communicated to users
                  in advance, and the new fee structure will be applied to
                  future transactions.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Refund Policy Accordion */}
        <div className="space-y-2">
          <div
            className="cursor-pointer p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => handleAccordionClick('refundPolicy')}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Refund Policy
            </h2>
            <p className="text-sm text-gray-500">
              Click to view Bantuhive's refund policy.
            </p>
          </div>
          {activeAccordion === 'refundPolicy' && (
            <div className="space-y-4 bg-white p-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Refunds for Donations
                </h3>
                <p className="text-gray-600">
                  Bantuhive does not provide refunds for donations made to
                  campaigns unless:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>
                    The campaign has been deemed fraudulent or violated
                    Bantuhive's terms of service.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  How to Request a Refund
                </h3>
                <p className="text-gray-600">
                  If you believe you are eligible for a refund, you may submit a
                  request to Bantuhive’s support team by emailing
                  support@bantuhive.com. Please include the following
                  information in your request:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Your transaction ID and the amount you donated.</li>
                  <li>
                    A brief explanation of why you are requesting the refund.
                  </li>
                  <li>The date and time of the donation.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Refund Processing Time
                </h3>
                <p className="text-gray-600">
                  Refund requests will be reviewed within 5-7 business days. If
                  your refund request is approved, you will receive the refunded
                  amount to your original payment method. Please note that
                  processing times may vary based on your payment provider.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Non-Refundable Donations
                </h3>
                <p className="text-gray-600">
                  Donations made to campaigns that have already reached their
                  fundraising goal or are in the process of being withdrawn are
                  non-refundable. Additionally, donations made to campaigns that
                  explicitly state no refunds are allowed are also
                  non-refundable.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Platform Fees
                </h3>
                <p className="text-gray-600">
                  Please note that Bantuhive's platform fees and Paystack's
                  processing fees are non-refundable. If a refund is issued, the
                  platform fee and transaction fee will not be refunded, as they
                  are deducted at the time of donation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeePolicy;
