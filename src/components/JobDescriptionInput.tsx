import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const JobDescriptionInput = ({ onSubmit, onBack, isLoading = false }: JobDescriptionInputProps) => {
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = () => {
    if (jobDescription.trim()) {
      onSubmit(jobDescription);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient py-12 px-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-accent/8 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Enter <span className="text-gradient">Job Description</span>
          </h1>
          <p className="text-muted-foreground">
            Paste the job description to match with your resume
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="relative">
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[300px] bg-card/50 border-border/50 backdrop-blur-sm rounded-2xl p-6 text-base resize-none focus:border-primary/50 transition-colors"
              disabled={isLoading}
            />
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
              {jobDescription.length} characters
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button variant="ghost" onClick={onBack} className="order-2 sm:order-1">
            Back
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={handleSubmit}
            disabled={!jobDescription.trim() || isLoading}
            className="order-1 sm:order-2 w-full sm:w-auto group"
          >
            {isLoading ? "Matching..." : "Compare with Resume"}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default JobDescriptionInput;
