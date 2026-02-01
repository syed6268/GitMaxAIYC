import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Shield, 
  Brain, 
  Zap, 
  FileSearch, 
  Calculator, 
  BookOpen,
  MessageSquare,
  BarChart3
} from "lucide-react";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "127+ Compliance Checkpoints",
      description: "Every rule from page limits to font sizes, budget requirements to attachment counts — we check them all automatically.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Predictive Quality Scoring",
      description: "Trained on thousands of funded proposals, we predict your reviewer score and show you exactly how to improve it.",
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Budget Auditing",
      description: "Catches math errors, budget-narrative mismatches, and unallowable costs before they sink your proposal.",
    },
    {
      icon: <FileSearch className="w-6 h-6" />,
      title: "Document Parsing",
      description: "AI-powered parsing of complex PDFs, extracting structure, formatting, and content with high accuracy.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "100+ Funder Templates",
      description: "NIH, NSF, Gates Foundation, DOE — we've coded the specific requirements for the top funders.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Copilot Q&A",
      description: "Ask questions like 'Why is my Innovation score low?' and get actionable, specific guidance.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Results",
      description: "What takes consultants 2 weeks, we do in minutes. Check proposals as many times as you need.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Benchmarking",
      description: "Compare your proposal against similar funded awards. See what successful proposals include.",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-sm font-medium text-accent">Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything you need to{" "}
            <span className="text-accent">win more grants</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From compliance checking to quality optimization, GrantGuard 
            covers every aspect of grant proposal preparation.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-accent/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
