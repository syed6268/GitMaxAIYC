import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { XCircle, DollarSign, Clock, FileX } from "lucide-react";

const Problem = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      icon: <FileX className="w-6 h-6" />,
      value: "40%",
      label: "of proposals auto-rejected",
      description: "Before any human review",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      value: "$4B",
      label: "wasted annually",
      description: "On rejected proposals",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: "200-400",
      label: "hours per proposal",
      description: "Staff time lost",
    },
    {
      icon: <XCircle className="w-6 h-6" />,
      value: "$50K",
      label: "average prep cost",
      description: "Per major grant",
    },
  ];

  const rejectionReasons = [
    "Missing required attachment?",
    "Budget math doesn't add up?",
    "Proposal is 26 pages instead of 25?",
    "Wrong font or margins?",
  ];

  return (
    <section id="problem" className="py-20 lg:py-32 bg-primary" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            The $4 Billion Problem
          </h2>
          <p className="text-lg text-primary-foreground/70 leading-relaxed">
            Every year, the federal government, foundations, and corporations offer 
            $400 billion in grants. Yet 40% of proposals never reach a human reviewer — 
            not because the ideas are bad, but because of <span className="text-accent font-semibold">fixable compliance errors</span>.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent">
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-primary-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-primary-foreground/50">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Rejection Reasons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-primary-foreground mb-2">
              Common rejection triggers:
            </h3>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {rejectionReasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3 bg-coral/10 border border-coral/20 rounded-xl px-5 py-4"
              >
                <XCircle className="w-5 h-5 text-coral flex-shrink-0" />
                <span className="text-primary-foreground font-medium">{reason}</span>
                <span className="text-coral font-bold ml-auto">Rejected.</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-8 text-primary-foreground/60 text-sm"
          >
            There's no automated way to check compliance before you hit submit.
            <br />
            <span className="text-accent font-semibold">Until now.</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;
