'use client';

import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for individuals and small projects',
    features: [
      '50 videos per month',
      '720p export quality',
      '10 templates',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For growing teams and agencies',
    features: [
      'Unlimited videos',
      '4K export quality',
      'All templates',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom branding',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option',
      'Training & onboarding',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-20 px-6" id="pricing">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent
            <span className="text-gradient"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-primary-500/20 to-accent-500/20 border-2 border-primary-500/50'
                  : 'glass-dark'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-300">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600'
                    : 'glass text-white hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
