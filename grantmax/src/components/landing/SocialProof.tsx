import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, CheckCircle2, Users, FileCheck, DollarSign } from "lucide-react";

const SocialProof = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: <FileCheck className="w-5 h-5" />, value: "200+", label: "Proposals Checked" },
    { icon: <CheckCircle2 className="w-5 h-5" />, value: "847", label: "Errors Caught" },
    { icon: <DollarSign className="w-5 h-5" />, value: "$4.2M", label: "Waste Prevented" },
    { icon: <Users className="w-5 h-5" />, value: "300+", label: "On Waitlist" },
  ];

  const testimonials = [
    {
      quote: "This saved my proposal. I was missing 3 required attachments I didn't even know about.",
      author: "Research Administrator",
      org: "Major University",
    },
    {
      quote: "We caught budget errors that would have killed our NIH submission. Absolute lifesaver.",
      author: "Grant Writer",
      org: "Healthcare Nonprofit",
    },
    {
      quote: "Finally, a tool that actually understands grant compliance. No more manual checklists.",
      author: "Grants Manager",
      org: "Research Institute",
    },
  ];

  const logos = [
    "NIH", "NSF", "Gates Foundation", "DOE", "USDA", "EPA"
  ];

  return (
    <section className="py-20 lg:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-sm font-medium text-accent">Beta Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by grant professionals
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We launched our beta 6 weeks ago with 50 grant writers. 
            Here's what we've accomplished together.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:border-accent/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 relative"
            >
              <Quote className="w-8 h-8 text-accent/20 absolute top-6 right-6" />
              <p className="text-foreground mb-6 leading-relaxed relative z-10">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="font-medium text-foreground">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.org}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Funders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-6">
            Supports major funders including
          </p>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="text-lg font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
