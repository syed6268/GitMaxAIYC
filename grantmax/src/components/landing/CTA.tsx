import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 lg:py-32 bg-primary relative overflow-hidden" ref={ref}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-8">
            <Shield className="w-8 h-8 text-accent" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Stop losing grants to{" "}
            <span className="text-accent">preventable mistakes</span>
          </h2>
          
          <p className="text-lg text-primary-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Every year, billions of dollars are wasted on rejected proposals. 
            Join 300+ organizations already on our waitlist and be the first 
            to access GrantGuard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="heroWhite" size="xl" className="group" asChild>
              <Link to="/upload">
                Check Your First Proposal Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Schedule a Demo
            </Button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-sm text-primary-foreground/50"
          >
            No credit card required • 1 free proposal check • Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
