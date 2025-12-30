import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

interface ProcessingScreenProps {
  mode: "score" | "match";
}

const ProcessingScreen = ({ mode }: ProcessingScreenProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(186 100% 50% / 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        {/* Animated loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-10"
        >
          {/* Outer rings */}
          <motion.div
            className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
          />
          
          {/* Main icon container */}
          <motion.div
            className="relative w-32 h-32 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center backdrop-blur-sm"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-12 h-12 text-primary" />
            </motion.div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/60"
              style={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [0, Math.cos((i * 60 * Math.PI) / 180) * 80],
                y: [0, Math.sin((i * 60 * Math.PI) / 180) * 80],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            {mode === "score" ? "Analyzing your resume" : "Matching your resume"}
            <span className="inline-flex">
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              >
                .
              </motion.span>
            </span>
          </h2>
          <p className="text-muted-foreground">
            This usually takes 10–20 seconds
          </p>
        </motion.div>

        {/* Progress indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          {[
            "Reading document structure",
            "Extracting key information",
            "Running AI analysis",
          ].map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground/70"
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
              {step}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessingScreen;
