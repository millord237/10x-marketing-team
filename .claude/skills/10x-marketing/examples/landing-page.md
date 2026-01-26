# Landing Page Examples

## SaaS Product Landing Page

### Hero Section

```markdown
**Badge:** Trusted by 10,000+ teams

**Headline:** Create Marketing Videos 10x Faster

**Subheadline:** Transform your marketing with AI-powered video creation.
Social media clips, product demos, and ad creatives generated in minutes, not days.

**Primary CTA:** Start Creating Free
**Secondary CTA:** Watch Demo (with play icon)

**Stats:**
- 10x Faster Creation
- 50K+ Videos Generated
- 500+ Happy Teams
```

### Features Section

```markdown
**Section Headline:** Everything You Need to Scale Content

**Feature 1: Social Media Videos**
Icon: Video camera
Description: Generate TikToks, Reels, and Shorts optimized for each
platform with trending formats and music.

**Feature 2: Product Demos**
Icon: Desktop monitor
Description: Showcase your product features with dynamic animations,
screen recordings, and professional voiceovers.

**Feature 3: Ad Creatives**
Icon: Chart/analytics
Description: Create high-converting ad videos with dynamic text,
CTAs, and A/B testing variants at scale.

**Feature 4: AI-Powered**
Icon: Lightning bolt
Description: Claude AI writes scripts, generates visuals, and
optimizes content for maximum engagement.

**Feature 5: Template Library**
Icon: Grid/layout
Description: Start with 100+ professional templates or build
custom ones with our visual editor.

**Feature 6: API & Automation**
Icon: Code terminal
Description: Integrate with your workflow. Generate videos
programmatically with our powerful API.
```

### Social Proof Section

```markdown
**Section Headline:** Loved by Marketing Teams Worldwide

**Testimonial 1:**
"We reduced video production time by 80%. What used to take a week
now takes a few hours."
- Sarah Chen, Head of Marketing at TechCorp
[Photo] [Company logo]

**Testimonial 2:**
"The AI understands our brand voice perfectly. It's like having
an extra team member who never sleeps."
- Marcus Johnson, Creative Director at StartupXYZ
[Photo] [Company logo]

**Logo Bar:**
[Google] [Microsoft] [Shopify] [Stripe] [Notion]
"Trusted by teams at"
```

### Pricing Section

```markdown
**Section Headline:** Simple, Transparent Pricing

**Starter - $29/month**
- 50 videos per month
- 720p export quality
- 10 templates
- Basic analytics
- Email support
[Start Free Trial]

**Pro - $99/month** (MOST POPULAR)
- Unlimited videos
- 4K export quality
- All templates
- Advanced analytics
- Priority support
- API access
- Custom branding
[Get Started]

**Enterprise - Custom**
- Everything in Pro
- Dedicated account manager
- Custom integrations
- SLA guarantee
- On-premise option
- Training & onboarding
[Contact Sales]

**Note:** All plans include 14-day free trial. No credit card required.
```

### CTA Section

```markdown
**Headline:** Ready to 10x Your Marketing?

**Subheadline:** Join hundreds of marketing teams already creating
stunning videos with AI. Start your free trial today.

**Primary CTA:** Start Free Trial
**Secondary CTA:** Schedule Demo

**Trust Note:** No credit card required. 14-day free trial.
```

---

## Lead Generation Landing Page

### Above the Fold

```markdown
**Headline:** The Ultimate Guide to AI-Powered Marketing

**Subheadline:** Learn the exact strategies that helped 500+ companies
increase conversion rates by 47% in 90 days.

**Form Fields:**
- First Name
- Email Address
- Company Size (dropdown)

**CTA Button:** Get Free Guide

**Trust Elements:**
- "Join 10,000+ marketers"
- "No spam, unsubscribe anytime"
- Lock icon: "Your data is secure"
```

### What You'll Learn

```markdown
**Section Headline:** Inside This Free Guide

**Chapter 1:** The AI Marketing Stack
What tools you actually need (and which ones are overhyped)

**Chapter 2:** Content at Scale
How to produce 10x more content without 10x the team

**Chapter 3:** Personalization That Works
Use AI to create 1:1 experiences for every visitor

**Chapter 4:** Measuring What Matters
The only 5 metrics you need to track

**Bonus:** Templates, prompts, and workflows you can use today
```

### Social Proof

```markdown
**Quote:** "This guide changed how we approach content marketing.
We've seen a 3x increase in qualified leads."
- Marketing Director, Fortune 500 Company

**Stats:**
- 10,000+ Downloads
- 4.9/5 Rating
- 47% Avg. Conversion Lift
```

---

## Product Launch Landing Page

### Hero

```markdown
**Badge:** 🚀 Just Launched

**Headline:** Meet VideoAI 2.0
The Future of Marketing Video

**Subheadline:** Everything you loved about VideoAI, now with
real-time collaboration, AI voice synthesis, and 4K exports.

**CTA:** See What's New

**Video/GIF:** Product demo showing new features
```

### What's New

```markdown
**Feature 1: Real-Time Collaboration**
Work with your team simultaneously. See changes instantly.
No more "who has the latest version?"

**Feature 2: AI Voice Synthesis**
Generate professional voiceovers in 50+ languages.
Sound like you hired a studio.

**Feature 3: 4K Exports**
Cinema-quality output for any platform.
Your videos deserve to look their best.

**Feature 4: Smart Templates**
AI analyzes your brand and suggests templates
that match your style.
```

### Launch Offer

```markdown
**Headline:** Limited Launch Pricing

**Offer:** Get 50% off your first year when you upgrade to 2.0

**Deadline:** Offer ends [Date] at midnight

**CTA:** Claim 50% Off

**Guarantee:** 30-day money-back guarantee. No questions asked.
```

---

## Component Code Patterns

### Hero with Gradient

```tsx
<section className="min-h-screen flex items-center justify-center
                    bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
  <div className="max-w-6xl mx-auto text-center px-6">
    <Badge>Powered by AI</Badge>
    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
      Your Headline
      <span className="text-gradient">Highlighted Text</span>
    </h1>
    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
      Your subheadline goes here with supporting details.
    </p>
    <div className="flex gap-4 justify-center">
      <Button variant="primary">Primary CTA</Button>
      <Button variant="secondary">Secondary CTA</Button>
    </div>
  </div>
</section>
```

### Feature Card

```tsx
<div className="glass-dark rounded-2xl p-8 hover:bg-white/10
                transition-all duration-300 hover:scale-105">
  <div className="w-14 h-14 rounded-xl bg-gradient-to-br
                  from-primary-500 to-accent-500
                  flex items-center justify-center text-white mb-4">
    <Icon />
  </div>
  <h3 className="text-xl font-semibold text-white mb-2">
    Feature Title
  </h3>
  <p className="text-gray-400">
    Feature description with benefit focus.
  </p>
</div>
```

### Pricing Card

```tsx
<div className={`rounded-2xl p-8 ${
  isPopular
    ? 'bg-gradient-to-b from-primary-500/20 to-accent-500/20 border-2 border-primary-500/50'
    : 'glass-dark'
}`}>
  {isPopular && (
    <span className="absolute -top-4 left-1/2 -translate-x-1/2
                     px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500
                     rounded-full text-sm font-medium text-white">
      Most Popular
    </span>
  )}
  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
  <div className="my-6">
    <span className="text-4xl font-bold text-white">{plan.price}</span>
    <span className="text-gray-400">/month</span>
  </div>
  <ul className="space-y-3 mb-8">
    {plan.features.map(feature => (
      <li className="flex items-center gap-2 text-gray-300">
        <CheckIcon className="text-green-400" />
        {feature}
      </li>
    ))}
  </ul>
  <Button fullWidth variant={isPopular ? 'primary' : 'secondary'}>
    {plan.cta}
  </Button>
</div>
```
