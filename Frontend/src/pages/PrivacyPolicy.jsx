import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
          PRIVACY POLICY
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
              This Privacy Policy explains how <strong>Wyvadot Projects & Resources Ltd</strong> ("Wyvadot PR," "we," "our," or "us") collects, uses, stores, discloses, and protects your personal data when you visit <strong>wyvadotpr.com</strong>, create an account, submit a service request, make a purchase, or interact with any feature of our platform.
            </p>
            <p>
              We process personal data in compliance with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nigeria Data Protection Act (NDPA) 2023</li>
              <li>Nigeria Data Protection Regulation (NDPR)</li>
              <li>NDPR Implementation Framework</li>
            </ul>
            <p>
              By accessing or using this Website, you consent to the practices described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Definitions
            </h2>
            <p>For the purposes of this Privacy Policy:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable individual.</li>
              <li><strong>"Processing"</strong> means any operation performed on personal data, including collection, storage, retrieval, use, disclosure, or deletion.</li>
              <li><strong>"User," "you," or "your"</strong> refers to any individual or entity accessing the Website.</li>
              <li><strong>"Platform"</strong> refers to the Wyvadot PR website, shop system, service request system, dashboard, and all related digital interfaces.</li>
              <li><strong>"Controller"</strong> refers to Wyvadot PR as the entity that determines the purpose and method of processing personal data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Categories of Data We Collect
            </h2>
            <p>We may collect the following categories of personal data:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.1 Identification Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Residential or delivery address (where provided)</li>
              <li>Account details and login credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.2 Technical & Usage Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type and identifiers</li>
              <li>Cookies and tracking technologies</li>
              <li>Pages accessed, timestamps, and navigation patterns</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.3 Service & Project Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Service request information</li>
              <li>Uploaded documents and attachments</li>
              <li>Notes, messages, and communication metadata</li>
              <li>Unique Reference IDs</li>
              <li>Project progress information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.4 Order & Transaction Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Product orders and history</li>
              <li>Billing and delivery information</li>
              <li>Payment confirmation data (processed by third-party gateways)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Legal Basis for Processing
            </h2>
            <p>We process personal data in line with the lawful bases permitted under Nigerian law, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consent</strong> – when you voluntarily provide information.</li>
              <li><strong>Contract</strong> – to process service requests, project tracking, and purchases.</li>
              <li><strong>Legal Obligation</strong> – when required by regulatory or statutory compliance.</li>
              <li><strong>Legitimate Interest</strong> – to improve security, user experience, and platform performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. How We Use Your Personal Data
            </h2>
            <p>Personal data may be used for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and manage services requested by you.</li>
              <li>To create, maintain, and secure your account or dashboard.</li>
              <li>To process product orders, payments, and deliveries.</li>
              <li>To manage project and service tracking features.</li>
              <li>To send administrative notifications, status updates, and service alerts.</li>
              <li>To enhance Website functionality and customer experience.</li>
              <li>To conduct security monitoring, fraud prevention, and risk assessment.</li>
              <li>To comply with legal, regulatory, or contractual requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal Data will be retained only for as long as necessary to fulfill the purposes stated in this Policy.</li>
              <li>We retain certain information where required by law, including for audit, legal claims, and regulatory obligations.</li>
              <li>When data is no longer needed, we securely delete or anonymize it.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Data Sharing & Third-Party Access
            </h2>
            <p>Your data may be shared with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers</strong> – including hosting companies, CRMs, analytics services, and infrastructure providers.</li>
              <li><strong>Payment Processors</strong> – solely for processing transactions.</li>
              <li><strong>Professional Partners</strong> – only where required for service delivery.</li>
              <li><strong>Government or Law Enforcement Agencies</strong> – where disclosure is required by applicable law.</li>
            </ul>
            <p className="mt-2">
              <strong>Wyvadot PR does NOT sell, rent, or trade personal data.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Data Security Measures
            </h2>
            <p>We implement appropriate technical and organizational measures to protect personal data, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption and secure transmission protocols.</li>
              <li>Access control and authentication safeguards.</li>
              <li>Regular system monitoring and security reviews.</li>
              <li>Protection against unauthorized access, alteration, disclosure, or destruction.</li>
            </ul>
            <p className="mt-2">
              However, we cannot guarantee absolute security of digital transmissions over the internet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. User Rights Under NDPA/NDPR
            </h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access</strong> – obtain a copy of your personal data.</li>
              <li><strong>Right to Rectification</strong> – correct inaccurate or incomplete data.</li>
              <li><strong>Right to Erasure</strong> – request deletion where applicable.</li>
              <li><strong>Right to Object</strong> – prevent processing for certain purposes.</li>
              <li><strong>Right to Data Portability</strong> – request transfer of your data.</li>
              <li><strong>Right to Withdraw Consent</strong> – where processing is consent-based.</li>
              <li><strong>Right to Lodge a Complaint</strong> – with the Nigeria Data Protection Commission (NDPC).</li>
            </ul>
            <p className="mt-2">
              Requests may be submitted to: <strong>privacy@wyvadotpr.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Cookies & Tracking Technologies
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We use cookies, analytics tools, and tracking technologies to enhance the Website's performance and personalize user experience.</li>
              <li>You may disable cookies via your browser settings, but doing so may limit certain Website functionalities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. International Data Transfers
            </h2>
            <p>Where personal data must be transferred outside Nigeria for processing, we ensure that such transfers:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Comply with NDPA/NDPR requirements, and</li>
              <li>Are protected by adequate safeguards or contractual clauses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Children's Data
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our Website is not intended for individuals under 18 years of age.</li>
              <li>We do not knowingly collect personal data from minors.</li>
              <li>If such data is inadvertently collected, it will be deleted upon discovery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Data Breach Notification
            </h2>
            <p>In the event of a data breach affecting your Personal Data, Wyvadot PR will:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Notify you promptly where required;</li>
              <li>Report the breach to the Nigeria Data Protection Commission (NDPC) where legally mandated;</li>
              <li>Take reasonable steps to mitigate any potential harm.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Updates to This Privacy Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wyvadot PR may update or revise this Policy periodically to reflect operational, legal, or regulatory changes.</li>
              <li>The updated version will be posted on the Website with a revised "Effective Date."</li>
              <li>Continued use of the Website constitutes acceptance of any changes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              15. Contact Information
            </h2>
            <p>For questions, concerns, or rights requests, contact:</p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="font-semibold text-gray-900">Wyvadot Projects & Resources Ltd</p>
              <p className="text-gray-700">Email: <a href="mailto:wyvadotpr@gmail.com" className="text-[#FF8D28] hover:underline">wyvadotpr@gmail.com</a></p>
              <p className="text-gray-700">Phone: +234 810 273 0544</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
