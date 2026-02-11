import React from "react";
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back Button */}
        <Link 
          to="/" 
          className="text-[#FF8D28] hover:underline mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          TERMS & CONDITIONS
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          Wyvadot Projects & Resources Ltd
        </p>
        <p className="text-gray-600 mb-8">
          Effective Date: January 1st, 2026
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p>
              These Terms & Conditions ("Terms") govern your access to and use of the website <strong>wyvadotpr.com</strong> ("Website"), including all services, features, content, accounts, and transactions provided by <strong>Wyvadot Projects & Resources Ltd</strong> ("Wyvadot PR," "we," "our," or "us").
            </p>
            <p>
              By accessing or using this Website, creating an account, or engaging with any Wyvadot PR service, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree, you must discontinue use of the Website immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Definitions
            </h2>
            <p>For the purpose of these Terms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Company"</strong> refers to Wyvadot Projects & Resources Ltd.</li>
              <li><strong>"User," "you," or "your"</strong> refers to any individual or entity accessing the Website.</li>
              <li><strong>"Platform"</strong> means the Wyvadot PR Website, user account system, dashboard, shop, and all digital components.</li>
              <li><strong>"Account"</strong> means a registered user profile on the Website.</li>
              <li><strong>"Service Request"</strong> means any request submitted for professional services offered by Wyvadot PR.</li>
              <li><strong>"Reference ID"</strong> means the unique identifier generated for each service request.</li>
              <li><strong>"Project Tracking System"</strong> means the dashboard feature that displays updates on approved projects.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Eligibility & Acceptable Use
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may use this Website only for lawful purposes and in compliance with Nigerian laws.</li>
              <li>You must not engage in:
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>Unauthorized access, hacking, or password mining;</li>
                  <li>Uploading malicious or harmful content;</li>
                  <li>Automated scraping or data harvesting;</li>
                  <li>Activities that disrupt Website operations.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. User Accounts & Verification
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To access certain features, you must create an Account using accurate and complete information.</li>
              <li>You are responsible for safeguarding your login credentials.</li>
              <li>Wyvadot PR may suspend or terminate Accounts suspected of fraudulent activity or violations of these Terms.</li>
              <li>Email verification may be required to activate your Account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Services & Submissions
            </h2>
            <p>When you submit a Service Request:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A confirmation message is displayed;</li>
              <li>A unique Reference ID is generated;</li>
              <li>The submission is stored in the CMS backend;</li>
              <li>Admins may contact you for additional information.</li>
            </ul>
            <p className="mt-4">
              Wyvadot PR reserves the right to accept, decline, or request modifications to any Service Request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Project Tracking System
            </h2>
            <p>Approved services may be converted into projects and displayed in your account dashboard.</p>
            <p className="mt-2">You may view:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Project stage progress;</li>
              <li>Status updates;</li>
              <li>Notes from the project team;</li>
              <li>Uploaded documents;</li>
              <li>Assigned personnel.</li>
            </ul>
            <p className="mt-4">
              All project timelines are estimates unless formally agreed through a separate written contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Shop, Orders & Payments
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Product listings, prices, and descriptions may change without notice.</li>
              <li>Submitting an order constitutes an offer; Wyvadot PR may accept or reject any order.</li>
              <li>Payments are processed through third-party gateways. Wyvadot PR is not liable for:
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>Payment processor downtime;</li>
                  <li>Bank errors;</li>
                  <li>Transaction delays.</li>
                </ul>
              </li>
              <li>Delivery timelines are estimates and may vary.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Intellectual Property
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All Website content—including logos, text, images, graphics, code, and data—is owned by Wyvadot PR or licensed to it.</li>
              <li>No part of the Website may be copied, modified, distributed, or reproduced without written permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Third-Party Services & Integrations
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Website may integrate with third-party tools such as CRMs and payment processors.</li>
              <li>Wyvadot PR is not responsible for the privacy practices, security, or content of third-party platforms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Limitation of Liability
            </h2>
            <p>To the maximum extent permitted under Nigerian law, Wyvadot PR shall not be liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Indirect or consequential damages;</li>
              <li>Loss of profits or data;</li>
              <li>Business interruption;</li>
              <li>System downtime or errors.</li>
            </ul>
            <p className="mt-4">
              All services are provided "as is," except where expressly guaranteed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless Wyvadot PR, its employees, officers, and affiliates from any claims, damages, or losses arising out of your use of the Website or breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Termination
            </h2>
            <p>
              Wyvadot PR may suspend or terminate your Account or access to the Website at any time without notice if you violate these Terms or where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Governing Law & Jurisdiction
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>These Terms are governed by the laws of the Federal Republic of Nigeria.</li>
              <li>Any disputes shall be resolved exclusively by the courts in Nigeria.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Contact Information
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="font-semibold text-gray-900">Wyvadot Projects & Resources Ltd</p>
              <p className="text-gray-700 mt-2">Address: No. 10 Example Road, Victoria Island, Lagos</p>
              <p className="text-gray-700">Email: <a href="mailto:info@wyvadotpr.com" className="text-[#FF8D28] hover:underline">info@wyvadotpr.com</a></p>
              <p className="text-gray-700">Phone: +234 000 000 0000</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
