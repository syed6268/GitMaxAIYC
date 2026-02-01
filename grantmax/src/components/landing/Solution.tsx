import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Upload, Cpu, FileCheck, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const Solution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: <Upload className="w-6 h-6" />,
      number: "01",
      title: "Upload Your Package",
      description: "Drop your proposal narrative, budget worksheets, letters of support, and paste your FOA URL.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      number: "02",
      title: "AI Scans Everything",
      description: "Our AI agents analyze 127+ compliance checkpoints, comparing your submission against funder requirements.",
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      number: "03",
      title: "Get Your Fix List",
      description: "Receive prioritized issues with color-coded severity — fix, re-upload, and iterate until green.",
    },
  ];

  return (
    <section id="solution" className="py-20 lg:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-sm font-medium text-accent">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Three steps to{" "}
            <span className="text-accent">compliance confidence</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Upload, analyze, fix. Our AI catches what humans miss, giving you 
            a clear path from red flags to green lights.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
              )}
              
              <div className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-accent/20 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-muted-foreground/20">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
            {/* Window Header */}
            <div className="bg-secondary/50 border-b border-border px-6 py-4 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-coral/50" />
                <div className="w-3 h-3 rounded-full bg-amber/50" />
                <div className="w-3 h-3 rounded-full bg-accent/50" />
              </div>
              <div className="text-sm text-muted-foreground font-medium ml-4">
                Compliance Dashboard — NIH R01-AI-2025-001
              </div>
            </div>

            <div className="p-6 lg:p-10">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left - Checklist */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-accent" />
                    Compliance Checklist
                  </h4>
                  
                  <div className="space-y-3">
                    <ChecklistItem status="error" label="Subaward commitment letter" value="Missing" />
                    <ChecklistItem status="warning" label="Budget narrative" value="7/5 pages" />
                    <ChecklistItem status="error" label="Equipment justification" value="Not found" />
                    <ChecklistItem status="success" label="Research Strategy" value="15/15 pages" />
                    <ChecklistItem status="success" label="Font & margins" value="Arial 11pt ✓" />
                    <ChecklistItem status="success" label="Biographical sketches" value="NIH format ✓" />
                    <ChecklistItem status="success" label="Data Management Plan" value="Complete ✓" />
                  </div>
                </div>

                {/* Right - Scores */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-accent" />
                    Quality Prediction
                  </h4>

                  <div className="space-y-4">
                    <ScoreBar label="Significance" score={6.2} max={9} />
                    <ScoreBar label="Investigator(s)" score={7.1} max={9} />
                    <ScoreBar label="Innovation" score={2.8} max={9} isWeak />
                    <ScoreBar label="Approach" score={5.5} max={9} />
                    <ScoreBar label="Environment" score={6.8} max={9} />
                  </div>

                  <div className="mt-8 p-5 bg-accent/5 border border-accent/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Overall Predicted Score</span>
                      <span className="text-2xl font-bold text-accent">4.2 → 6.8</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      With Priority 1+2 fixes, your score could improve significantly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl shadow-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Ready to Submit</div>
              <div className="text-xs text-muted-foreground">All critical issues resolved</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

interface ChecklistItemProps {
  status: "success" | "warning" | "error";
  label: string;
  value: string;
}

const ChecklistItem = ({ status, label, value }: ChecklistItemProps) => {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-accent" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber" />,
    error: <XCircle className="w-4 h-4 text-coral" />,
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30">
      <div className="flex items-center gap-2">
        {icons[status]}
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className={`text-sm font-medium ${
        status === "success" ? "text-accent" :
        status === "warning" ? "text-amber" : "text-coral"
      }`}>
        {value}
      </span>
    </div>
  );
};

interface ScoreBarProps {
  label: string;
  score: number;
  max: number;
  isWeak?: boolean;
}

const ScoreBar = ({ label, score, max, isWeak }: ScoreBarProps) => {
  const percentage = (score / max) * 100;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-foreground">{label}</span>
        <span className={`text-sm font-semibold ${isWeak ? "text-coral" : "text-muted-foreground"}`}>
          {score}/{max}
          {isWeak && <span className="ml-1 text-xs">⚠️</span>}
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={`h-full rounded-full ${isWeak ? "bg-coral" : "bg-accent"}`}
        />
      </div>
    </div>
  );
};

export default Solution;
