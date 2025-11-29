import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">About Power Modz</h1>
        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            Welcome to Power Modz, your number one source for all things digital. We're dedicated to providing you the very best of apps, mods, and multimedia content, with an emphasis on speed, security, and quality.
          </p>
          <p>
            Founded in 2024, Power Modz has come a long way from its beginnings. When we first started out, our passion for "Powering Up Your Digital Life" drove us to start this portal.
          </p>
          <p>
            We hope you enjoy our content as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
          </p>
          <h3>Our Mission</h3>
          <p>
            To provide a clean, fast, and safe environment for downloading digital assets without the clutter of excessive ads or deceptive links.
          </p>
        </div>
      </div>
    </div>
  );
};
