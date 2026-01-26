'use client';

const footerLinks = {
  Product: ['Features', 'Templates', 'Pricing', 'API'],
  Resources: ['Documentation', 'Blog', 'Tutorials', 'Examples'],
  Company: ['About', 'Careers', 'Contact', 'Press'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-gradient mb-4">10x Marketing</div>
            <p className="text-gray-400 text-sm">
              AI-powered video creation for modern marketing teams.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            2026 10x Marketing Team. Built with Remotion + Claude.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {['twitter', 'github', 'linkedin', 'youtube'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">{social}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
