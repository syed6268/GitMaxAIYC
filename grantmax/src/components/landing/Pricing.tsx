import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try GrantGuard risk-free",
      features: [
        "1 proposal check per month",
        "Basic compliance checking",
        "PDF/DOCX support",
        "Email support",
      ],
      cta: "Get Started Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Starter",
      price: "$99",
      period: "per month",
      description: "For solo grant writers",
      features: [
        "10 proposals per month",
        "Full compliance checking",
        "Quality scoring",
        "Budget auditing",
        "AI Copilot Q&A",
        "Priority support",
      ],
      cta: "Start Free Trial",
      variant: "hero" as const,
      popular: true,
    },
    {
      name: "Pro",
      price: "$499",
      period: "per month",
      description: "For teams & consultants",
      features: [
        "Unlimited proposals",
        "Everything in Starter",
        "Team collaboration",
        "Custom funder templates",
        "API access",
        "Dedicated account manager",
      ],
      cta: "Start Free Trial",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "annually",
      description: "For universities & large orgs",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "SSO & advanced security",
        "Custom integrations",
        "On-premise deployment",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      variant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-sm font-medium text-accent">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Plans that scale with you
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From individual grant writers to enterprise research offices, 
            we have a plan that fits your needs.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className={`relative bg-card border rounded-2xl p-6 lg:p-8 ${
                plan.popular 
                  ? "border-accent shadow-lg shadow-accent/10 ring-1 ring-accent" 
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} className="w-full" size="lg">
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Enterprise callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
