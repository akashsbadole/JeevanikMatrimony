export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Indian Matrimony platform, you accept and agree to be bound 
                by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You must be at least 18 years old to use our services</li>
                <li>You must be legally eligible for marriage in your jurisdiction</li>
                <li>You must provide accurate and truthful information</li>
                <li>You must not have been previously banned from our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You may create only one account per person</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>We reserve the right to suspend or terminate accounts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Profile Guidelines</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All profile information must be accurate and current</li>
                <li>Photos must be recent and clearly show your face</li>
                <li>No inappropriate, offensive, or misleading content</li>
                <li>No contact information in profile descriptions</li>
                <li>We reserve the right to remove non-compliant profiles</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Create fake or misleading profiles</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share inappropriate or offensive content</li>
                <li>Solicit money or engage in commercial activities</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to hack or disrupt our services</li>
                <li>Use automated tools or bots</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Premium Services</h2>
              <p className="text-gray-700 mb-4">
                All premium features are currently available for free to registered users. 
                This may change in the future with appropriate notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Wedding Services Marketplace</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We facilitate connections between users and service vendors</li>
                <li>We are not responsible for the quality of vendor services</li>
                <li>All transactions are between users and vendors directly</li>
                <li>Disputes should be resolved directly with vendors</li>
                <li>We may charge commission fees for successful bookings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy to understand 
                how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All platform content and features are our intellectual property</li>
                <li>You retain rights to your profile content</li>
                <li>You grant us license to use your content for platform operations</li>
                <li>You may not copy, modify, or distribute our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent text-gray-900 mb-4">10. Disclaimers</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We do not guarantee you will find a suitable match</li>
                <li>We are not responsible for user interactions or relationships</li>
                <li>We do not verify all user information</li>
                <li>Use our services at your own risk</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                We shall not be liable for any indirect, incidental, special, or consequential 
                damages arising from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You may delete your account at any time</li>
                <li>We may suspend or terminate accounts for violations</li>
                <li>Termination does not affect existing obligations</li>
                <li>We may retain certain information as required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms are governed by the laws of India. Any disputes will be resolved 
                in the courts of Bangalore, Karnataka.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may update these terms from time to time. Continued use of our services 
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@indianmatrimony.com<br />
                  <strong>Phone:</strong> +91-80-1234-5678<br />
                  <strong>Address:</strong> 123 Tech Park, Bangalore, Karnataka 560001, India
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
