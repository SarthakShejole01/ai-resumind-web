import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreResponse, MatchResponse } from "@/services/api";

interface ResultsScreenProps {
  mode: "score" | "match";
  onStartOver: () => void;
  results: ScoreResponse | MatchResponse | null;
}

const getScoreColor = (score: number) => {
  if (score >= 85) return "text-score-excellent";
  if (score >= 70) return "text-score-good";
  if (score >= 50) return "text-score-average";
  return "text-score-poor";
};

const getScoreLabel = (score: number) => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
};

const getScoreRingColor = (score: number) => {
  if (score >= 85) return "stroke-score-excellent";
  if (score >= 70) return "stroke-score-good";
  if (score >= 50) return "stroke-score-average";
  return "stroke-score-poor";
};

const ResultsScreen = ({ mode, onStartOver, results }: ResultsScreenProps) => {
  if (!results) {
    return (
      <section className="min-h-screen bg-hero-gradient py-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No results available</h2>
          <Button onClick={onStartOver}>Start Over</Button>
        </div>
      </section>
    );
  }

  // Normalize data access
  const score = 'score' in results ? results.score : (results as MatchResponse).matchScore;
  const summary = results.summary;

  // Lists
  const list1 = 'strengths' in results ? results.strengths : (results as MatchResponse).matchedSkills;
  const list1Title = mode === 'score' ? "Strengths" : "Matched Skills";

  const list2 = 'weaknesses' in results ? results.weaknesses : (results as MatchResponse).missingSkills;
  const list2Title = mode === 'score' ? "Areas to Improve" : "Missing Skills";

  const list3 = 'suggestions' in results ? results.suggestions : (results as MatchResponse).improvements;
  const list3Title = mode === 'score' ? "Suggestions" : "Recommended Actions";


  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <section className="min-h-screen bg-hero-gradient py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Your <span className="text-gradient">Results</span>
          </h1>
          <p className="text-muted-foreground">
            {mode === "score" ? "Resume Quality Analysis" : "Job Match Analysis"}
          </p>
        </motion.div>

        {/* Score circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="relative">
            <svg className="w-52 h-52 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="104"
                cy="104"
                r="90"
                className="fill-none stroke-secondary"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <motion.circle
                cx="104"
                cy="104"
                r="90"
                className={`fill-none ${getScoreRingColor(score)}`}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`font-display text-5xl font-bold ${getScoreColor(score)}`}
              >
                {score}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-muted-foreground mt-1"
              >
                {getScoreLabel(score)}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6 rounded-2xl"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">AI Summary</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{summary}</p>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* List 1 (Strengths / Matched) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-score-good/10">
                  <CheckCircle2 className="w-5 h-5 text-score-good" />
                </div>
                <h3 className="font-display text-lg font-semibold">{list1Title}</h3>
              </div>
              <ul className="space-y-3">
                {list1.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-score-good mt-0.5 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* List 2 (Weaknesses / Missing) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-score-average/10">
                  <AlertTriangle className="w-5 h-5 text-score-average" />
                </div>
                <h3 className="font-display text-lg font-semibold">{list2Title}</h3>
              </div>
              <ul className="space-y-3">
                {list2.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + index * 0.1 }}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <AlertTriangle className="w-4 h-4 text-score-average mt-0.5 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* List 3 (Suggestions / Improvements) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-2xl mb-8"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">{list3Title}</h3>
            </div>
            <ul className="space-y-3">
              {list3.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-semibold mt-0.5 shrink-0">
                    {index + 1}
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button variant="heroOutline" size="lg" onClick={onStartOver}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Analyze Another Resume
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsScreen;
