import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-accent">Now in Beta — 300+ on waitlist</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              Stop losing grants to{" "}
              <span className="text-accent">stupid mistakes</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              AI-powered compliance checking that catches errors before submission. 
              Know exactly what's wrong, what's missing, and how to fix it — so you 
              don't get auto-rejected.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Button variant="hero" size="xl" className="group" asChild>
                <Link to="/upload">
                  Check Your Proposal Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="xl">
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>200+ proposals checked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>94% accuracy rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>$4.2M in waste prevented</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Compliance Report</h3>
                    <p className="text-sm text-muted-foreground">NIH R01 Grant Proposal</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent">94%</div>
                  <div className="text-xs text-muted-foreground">Compliant</div>
                </div>
              </div>

              {/* Compliance Items */}
              <div className="space-y-3 mb-6">
                <ComplianceItem
                  status="error"
                  title="Missing subaward commitment letter"
                  description="Required by FOA Section IV.2"
                />
                <ComplianceItem
                  status="warning"
                  title="Budget narrative: 7/5 pages"
                  description="Exceeds limit by 2 pages"
                />
                <ComplianceItem
                  status="success"
                  title="Research Strategy format"
                  description="Arial 11pt, 0.5in margins"
                />
                <ComplianceItem
                  status="success"
                  title="Biographical sketches"
                  description="NIH format, 5 pages ✓"
                />
              </div>

              {/* Score Preview */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Predicted Score</span>
                  <span className="text-sm text-muted-foreground">After fixes: <span className="text-accent font-semibold">6.8/9</span></span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -top-4 -right-4 bg-card rounded-xl border border-border shadow-lg p-3 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-coral" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">3 Critical</div>
                <div className="text-xs text-muted-foreground">Auto-reject risks</div>
              </div>
            </motion.div>

            {/* Floating Badge 2 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-card rounded-xl border border-border shadow-lg p-3 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">847 Errors</div>
                <div className="text-xs text-muted-foreground">Caught in beta</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface ComplianceItemProps {
  status: "success" | "warning" | "error";
  title: string;
  description: string;
}

const ComplianceItem = ({ status, title, description }: ComplianceItemProps) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-accent" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber" />,
    error: <XCircle className="w-5 h-5 text-coral" />,
  };

  const bgColors = {
    success: "bg-accent/5",
    warning: "bg-amber/5",
    error: "bg-coral/5",
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${bgColors[status]}`}>
      <div className="mt-0.5">{icons[status]}</div>
      <div>
        <div className="font-medium text-foreground text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
};

export default Hero;
