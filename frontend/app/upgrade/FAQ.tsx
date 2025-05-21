import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "What's included in the Marketing & Analytics Toolkit?",
      answer:
        'Our Marketing & Analytics Toolkit includes campaign performance dashboards, social media templates, audience targeting tools, and metrics analysis to help you optimize your campaign reach and conversions.',
    },
    {
      question: 'Can I upgrade my plan during a campaign?',
      answer:
        "Yes, you can upgrade your plan at any time. The new features will be available immediately, and you'll be charged the prorated difference for the remainder of your billing cycle.",
    },
    {
      question: 'Do you offer support for international campaigns?',
      answer:
        'Absolutely! Our support team works across multiple time zones to assist campaigns from around the world. We have experience with international payment systems and regional marketing strategies.',
    },
    {
      question: 'What channels can I use to reach support on the Pro+ plan?',
      answer:
        'With Pro+, in addition to email and Google Hangout, you can request support through WhatsApp, Slack, or phone calls based on your preference. We adapt to your communication style.',
    },
    {
      question: 'Is there a minimum commitment period?',
      answer:
        'No, all our plans are month-to-month with no long-term commitment. You can cancel anytime, though we recommend maintaining support throughout your campaign duration for best results.',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
