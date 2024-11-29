import React from 'react';

const Terms = () => {
  return (
    <section className="px-12 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-8">
        Terms of Service
      </h1>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">1. TARGET AUDIENCE</h2>
        <p className="text-lg leading-relaxed">
          Bantuhive.com is a crowdfunding platform primarily designed to serve
          individuals, organizations, and communities within Africa and its
          global diaspora. Our platform connects campaign owners with supporters
          to fund projects that address local and international needs. We
          welcome users from all corners of the world, but our primary focus is
          on creating meaningful impact within Africa.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">2. CONTENT RIGHTS</h2>
        <p className="text-lg leading-relaxed">
          By submitting content to Bantuhive, whether it's campaign materials,
          text, photos, videos, or other content, you retain full ownership of
          your intellectual property. However, by uploading content, you grant
          Bantuhive a non-exclusive, worldwide, royalty-free license to display,
          distribute, and promote the content on our platform, across social
          media, and through marketing materials to further the success of your
          campaign.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          You represent and warrant that the content you submit does not
          infringe on any third-party intellectual property rights, and you are
          solely responsible for all legal consequences related to the content.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">3. ACCOUNT REGISTRATION</h2>
        <p className="text-lg leading-relaxed">
          Signup is optional for all users, but it is required for campaign
          owners to create and manage campaigns on Bantuhive. When registering,
          you will be asked to provide accurate and up-to-date information. You
          are responsible for maintaining the confidentiality of your account
          credentials and for all activities that occur under your account.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Users must be at least 18 years old to create an account. If you are
          under 18, you may only use Bantuhive with the consent of a parent or
          guardian.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">
          4. BUSINESS MODEL, PAYMENT, AND USER RIGHTS
        </h2>
        <p className="text-lg leading-relaxed">
          Bantuhive operates on a business model that involves one-time and
          recurring donations to support campaigns.Recurring payments are fixed
          (i.e, hourly, daily, weekly and so on). Backers/Donors have the
          freedom to cancel subscriptions on their own terms. Donors receive
          notifications of upcoming transactions.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          All payment transactions are processed securely through trusted
          payment gateways. Bantuhive charges a platform fee on all funds
          raised, which is clearly stated in our
          <a href="/pricing" className="text-blue-500 ml-1">
            fee policy
          </a>
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Users (donors and campaign owners) retain the right to withdraw from a
          campaign or cancel a recurring donation at any time. Refund policies
          are subject to the terms outlined in our our
          <a href="/pricing" className="text-blue-500 ml-1">
            fee policy
          </a>
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">5. COMMON PROVISIONS</h2>
        <ul className="list-inside list-disc text-lg leading-relaxed">
          <li>
            <strong>Governing Law:</strong> These terms are governed by the laws
            of the jurisdiction in which Bantuhive is incorporated, without
            regard to conflict of law principles.
          </li>
          <li>
            <strong>Dispute Resolution:</strong> Any disputes arising from the
            use of Bantuhive will be resolved through binding arbitration in
            accordance with the laws of the applicable jurisdiction. By using
            Bantuhive, you agree to submit to arbitration and waive the right to
            participate in a class action lawsuit.
          </li>
          <li>
            <strong>Severability:</strong> If any provision of these terms is
            deemed invalid or unenforceable, the remaining provisions will
            continue in full force and effect.
          </li>
          <li>
            <strong>Changes to Terms:</strong> Bantuhive reserves the right to
            modify these terms at any time. Users will be notified of any
            material changes through the platform.
          </li>
        </ul>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">
          6. DISCLAIMERS OF WARRANTIES, LIMITATIONS OF LIABILITY, AND INDEMNITY
        </h2>
        <p className="text-lg leading-relaxed">
          Bantuhive provides the platform "as is" and does not guarantee the
          accuracy, reliability, or availability of the services. We disclaim
          all warranties, whether express or implied, including but not limited
          to the implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          In no event shall Bantuhive be liable for any indirect, incidental,
          special, or consequential damages arising from the use of the
          platform, including but not limited to the loss of profits, data, or
          goodwill.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          You agree to indemnify, defend, and hold harmless Bantuhive, its
          affiliates, officers, and employees from any claim, loss, or liability
          (including reasonable attorney fees) arising out of your use of the
          platform, breach of these terms, or violation of the rights of any
          third party.
        </p>
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg font-medium">
          By using Bantuhive.com, you acknowledge and agree to these terms and
          conditions. If you do not agree to these terms, you must refrain from
          using the platform.
        </p>
      </div>
    </section>
  );
};

export default Terms;
