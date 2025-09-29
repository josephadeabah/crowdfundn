'use client';
import { useAuth } from '@/app/context/auth/AuthContext';

const NomineeAgreement = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white p-6 text-gray-800">
      <div className="max-w-7xl mx-auto px-3">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase mb-2">
          BANTUHIVE CROWDFUNDING NOMINEE LTD.
        </h1>
        <h2 className="text-xl font-semibold">
          NOMINEE AGREEMENT FOR BENEFICIAL OWNERSHIP
        </h2>
      </div>

      {/* Important */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <p className="text-sm font-medium">
          Important: This is the final Nominee Agreement that governs your
          investment through BantuHive Crowdfunding. By accepting this
          agreement, you authorize BantuHive Crowdfunding Nominee Ltd. to hold
          legal title to your securities while you retain full beneficial
          ownership. Please read this document carefully before proceeding with
          your investment.
        </p>
      </div>

      <div className="border-b-2 border-gray-300 my-6"></div>

      {/* Agreement Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase mb-2">
          BANTUHIVE CROWDFUNDING NOMINEE LTD.
        </h1>
        <h2 className="text-xl font-semibold">NOMINEE AGREEMENT</h2>
        <p className="mt-4">
          This NOMINEE AGREEMENT (this "Agreement") is made and effective as of
          September 29, 2025 (the "Effective Date")
        </p>
      </div>

      {/* Parties */}
      <div className="mb-8">
        <h3 className="font-bold uppercase mb-4">BETWEEN:</h3>
        <div className="ml-6 space-y-4">
          <div>
            <p>
              (1) BANTUHIVE CROWDFUNDING NOMINEE LTD., a company incorporated
              under the Companies Act, 2019 (Act 992) of Ghana with registration
              number [CS185241124], whose registered office is at [HOUSE NO.
              B293, APOLLO, TAKORADI] (the "Nominee"); and
            </p>
          </div>
          <div>
            <p>
              (2) {user?.full_name || '[INVESTOR NAME]'}, a [Individual/Entity]
              residing/registered at [Address], with BantuHive Platform User ID:
              [{user?.full_name}] (the "Beneficial Owner" or "You").
            </p>
          </div>
        </div>
      </div>

      {/* Recitals */}
      <div className="mb-8">
        <h3 className="font-bold uppercase mb-4">RECITALS:</h3>
        <div className="ml-6 space-y-3">
          <p>
            <span className="font-semibold">A.</span> The Nominee is a
            wholly-owned subsidiary of BantuHive Ltd. ("BantuHive Platform") and
            has been established to act as the registered shareholder of
            securities in portfolio companies ("Portfolio Companies") on behalf
            of individuals who invest through the BantuHive crowdfunding
            platform.
          </p>
          <p>
            <span className="font-semibold">B.</span> The Beneficial Owner
            wishes to invest in securities offered by Portfolio Companies listed
            on the BantuHive Platform.
          </p>
          <p>
            <span className="font-semibold">C.</span> It is a condition of
            investment that the legal title to such securities be held by the
            Nominee, with the Beneficial Owner retaining the full beneficial and
            economic ownership, subject to the terms and conditions set forth
            herein.
          </p>
        </div>
        <div className="mt-4 text-center font-semibold">
          NOW, THEREFORE, in consideration of the mutual covenants contained
          herein, the parties agree as follows:
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-6">
        {/* Section 1 */}
        <div>
          <h4 className="font-bold text-lg">1. APPOINTMENT AND ACCEPTANCE</h4>
          <div className="ml-4 mt-2 space-y-2">
            <p>
              <span className="font-semibold">1.1.</span> The Beneficial Owner
              hereby irrevocably appoints the Nominee to act as its agent and
              nominee to:
            </p>
            <div className="ml-6">
              <p>
                (a) subscribe for, acquire, and hold legal title to the
                securities as detailed in the Investment Schedule (Annex A) (the
                "Securities") in the Nominee's name; and
              </p>
              <p>
                (b) act as the registered shareholder of the Securities in the
                books of the Portfolio Company.
              </p>
            </div>
            <p>
              <span className="font-semibold">1.2.</span> The Nominee accepts
              this appointment on the terms and conditions of this Agreement.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h4 className="font-bold text-lg">2. BENEFICIAL OWNERSHIP</h4>
          <div className="ml-4 mt-2 space-y-2">
            <p>
              <span className="font-semibold">2.1.</span> The parties expressly
              agree and declare that the Nominee shall hold the legal title to
              the Securities IN TRUST for the Beneficial Owner.
            </p>
            <p>
              <span className="font-semibold">2.2.</span> The Beneficial Owner
              is and shall remain the absolute beneficial owner of the
              Securities and is entitled to all economic benefits attaching
              thereto, including but not limited to dividends, interest, and
              other distributions, and the proceeds of any sale, redemption, or
              exit event (collectively, "Economic Benefits").
            </p>
            <p>
              <span className="font-semibold">2.3.</span> The Nominee shall have
              no beneficial interest in the Securities and shall not use,
              pledge, charge, or otherwise encumber the Securities for its own
              benefit.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <h4 className="font-bold text-lg">3. NOMINEE'S POWERS AND DUTIES</h4>
          <p className="mt-2">
            The Nominee shall have the authority to exercise all rights and
            powers incidental to the legal ownership of the Securities, but
            SHALL ONLY EXERCISE SUCH POWERS STRICTLY IN ACCORDANCE WITH THE
            DIRECT INSTRUCTIONS OF THE BENEFICIAL OWNER, as facilitated through
            the BantuHive Platform's voting and instruction mechanisms.
            Specifically:
          </p>
          <div className="ml-4 mt-2 space-y-2">
            <p>
              <span className="font-semibold">3.1. Voting Rights:</span> The
              Nominee shall not exercise any voting rights attached to the
              Securities unless and until it has received instructions from the
              Beneficial Owner via a poll or referendum conducted through the
              BantuHive Platform. The Nominee shall cast its vote(s) strictly in
              proportion to the instructions received from the Beneficial Owners
              for each class of Security.
            </p>
            <p>
              <span className="font-semibold">
                3.2. Receipt of Economic Benefits:
              </span>{' '}
              The Nominee shall receive all Economic Benefits paid by the
              Portfolio Company. Upon receipt and following necessary AML/KYC
              checks, the Nominee shall promptly distribute the net Economic
              Benefits to the Beneficial Owner, after deducting any applicable
              taxes or fees as permitted under this Agreement.
            </p>
            <p>
              <span className="font-semibold">
                3.3. Information & Communications:
              </span>{' '}
              The Nominee shall promptly make available to the Beneficial Owner,
              via the BantuHive Platform, all formal communications, reports,
              and notices received from the Portfolio Company.
            </p>
            <p>
              <span className="font-semibold">3.4. Standard of Care:</span> The
              Nominee shall exercise the degree of care, diligence, and skill
              that a reasonably prudent professional nominee would exercise in
              comparable circumstances. The Nominee's duties are limited to
              those expressly set out in this Agreement and are purely
              administrative and ministerial in nature.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div>
          <h4 className="font-bold text-lg">
            4. LIMITATION OF LIABILITY AND INDEMNITY
          </h4>
          <div className="ml-4 mt-2 space-y-2">
            <p>
              <span className="font-semibold">4.1.</span> No Liability for
              Portfolio Company Actions: The Nominee shall not be liable for any
              acts, omissions, defaults, or insolvency of the Portfolio Company.
            </p>
            <p>
              <span className="font-semibold">4.2.</span> Limitation of
              Liability: The Nominee's aggregate liability to the Beneficial
              Owner, whether in contract, tort (including negligence), or
              otherwise, shall under no circumstances exceed the total fees paid
              by the Beneficial Owner to the Nominee in the twelve (12) months
              preceding the event giving rise to the claim.
            </p>
            <p>
              <span className="font-semibold">4.3.</span> Indemnity: The
              Beneficial Owner agrees to indemnify and hold harmless the
              Nominee, its directors, officers, and employees (including those
              seconded from BantuHive Ltd.) from and against any and all losses,
              claims, damages, and liabilities arising out of or in connection
              with the Nominee's good faith performance of its duties under this
              Agreement, except to the extent such losses are finally judicially
              determined to have resulted from the Nominee's gross negligence,
              willful misconduct, or fraud.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div>
          <h4 className="font-bold text-lg">5. FEES AND EXPENSES</h4>
          <div className="ml-4 mt-2 space-y-2">
            <p>
              <span className="font-semibold">5.1.</span> The Beneficial Owner
              agrees to pay the Nominee an annual administration fee as detailed
              in the Fee Schedule on the BantuHive Platform. This fee may be
              deducted directly from distributions before they are paid to the
              Beneficial Owner.
            </p>
            <p>
              <span className="font-semibold">5.2.</span> All stamp duties,
              registration fees, and other taxes payable in respect of the
              acquisition or holding of the Securities shall be borne by the
              Beneficial Owner.
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div>
          <h4 className="font-bold text-lg">6. TERM AND TERMINATION</h4>
          <div className="ml-4 mt-2 space-y-2">
            <p>
              <span className="font-semibold">6.1.</span> This Agreement shall
              remain in full force and effect for as long as the Nominee holds
              the Securities on behalf of the Beneficial Owner.
            </p>
            <p>
              <span className="font-semibold">6.2.</span> The Beneficial Owner
              may request termination by instructing the Nominee, via the
              platform, to transfer the legal title of the Securities. Such
              transfer is subject to:
            </p>
            <div className="ml-6">
              <p>
                (a) The restrictions contained in the constitutional documents
                of the Portfolio Company and any shareholders' agreement;
              </p>
              <p>(b) Compliance with applicable securities laws; and</p>
              <p>
                (c) The receipt of a valid instrument of transfer and payment of
                any applicable transfer fees.
              </p>
            </div>
            <p>
              <span className="font-semibold">6.3.</span> The Nominee may resign
              by giving [90] days' written notice to the Beneficial Owner via
              the platform. Upon resignation, the Nominee shall take all
              necessary steps to transfer the legal title of the Securities to
              the Beneficial Owner or a new nominee appointed by the Beneficial
              Owner, subject to the same conditions in clause 6.2.
            </p>
          </div>
        </div>

        {/* Section 7 */}
        <div>
          <h4 className="font-bold text-lg">
            7. GOVERNING LAW AND DISPUTE RESOLUTION
          </h4>
          <div className="ml-4 mt-2 space-y-2">
            <p>
              <span className="font-semibold">7.1.</span> This Agreement shall
              be governed by and construed in accordance with the laws of the
              Republic of Ghana.
            </p>
            <p>
              <span className="font-semibold">7.2.</span> Any dispute arising
              out of or in connection with this Agreement shall be first
              submitted to mediation in accordance with the rules of the [Ghana
              Arbitration Centre]. If mediation fails, the dispute shall be
              finally settled by arbitration in [Accra, Ghana].
            </p>
          </div>
        </div>

        {/* Section 8 */}
        <div>
          <h4 className="font-bold text-lg">8. MISCELLANEOUS</h4>
          <div className="ml-4 mt-2 space-y-2">
            <p>
              <span className="font-semibold">8.1.</span> Entire Agreement: This
              Agreement, together with the BantuHive Platform Terms of Service,
              constitutes the entire agreement between the parties.
            </p>
            <p>
              <span className="font-semibold">8.2.</span> Severability: If any
              provision is found to be invalid, the remainder of the Agreement
              shall remain in force.
            </p>
            <p>
              <span className="font-semibold">8.3.</span> Notices: All notices
              shall be communicated electronically through the BantuHive
              Platform and shall be deemed received upon sending.
            </p>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-12 space-y-8">
        <div className="text-center italic">
          IN WITNESS WHEREOF, the parties have executed this Agreement by their
          duly authorized representatives. The Beneficial Owner acknowledges
          agreement to these terms by clicking "I Agree" on the BantuHive
          Platform investment page, which constitutes a binding electronic
          signature.
        </div>

        <div className="flex justify-between">
          <div className="w-1/2">
            <p className="font-semibold mb-4">For and on behalf of</p>
            <p className="font-bold text-lg">
              BANTUHIVE CROWDFUNDING NOMINEE LTD.
            </p>
            <div className="border-b border-gray-400 my-6 w-3/4"></div>
            <p>Name: Nqoba Manana</p>
            <p>Title: Director</p>
            <p>Date: [{new Date().toLocaleDateString()}]</p>
          </div>

          <div className="w-1/2">
            <p className="font-semibold mb-4">THE BENEFICIAL OWNER</p>
            <div className="border-b border-gray-400 my-6 w-3/4"></div>
            <p>{user?.full_name || '[Investor Name]'}</p>
            <p>By: Electronic Acceptance on the BantuHive Platform</p>
            <p>Date: [{new Date().toLocaleDateString()}]</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NomineeAgreement;
