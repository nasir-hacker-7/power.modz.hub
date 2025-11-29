import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">Privacy Policy</h1>
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Power Modz. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. The Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Identity Data:</strong> includes username or similar identifier.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>To provide the services you have requested (Downloads, Uploads).</li>
            <li>To manage your relationship with us.</li>
            <li>To improve our website, products/services, marketing or customer relationships.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </p>
        </div>
      </div>
    </div>
  );
};
