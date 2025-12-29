import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string) => void;
  onBack: () => void;
}

const JobDescriptionInput = ({ onSubmit, onBack }: JobDescriptionInputProps) => {
  const [jobDescription, setJobDescription] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJobDescription(text);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "text/plain") {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

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

        {/* Input mode toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Button
            variant={inputMode === "text" ? "default" : "ghost"}
            size="sm"
            onClick={() => setInputMode("text")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Paste Text
          </Button>
          <Button
            variant={inputMode === "file" ? "default" : "ghost"}
            size="sm"
            onClick={() => setInputMode("file")}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {inputMode === "text" ? (
            <div className="relative">
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[300px] bg-card/50 border-border/50 backdrop-blur-sm rounded-2xl p-6 text-base resize-none focus:border-primary/50 transition-colors"
              />
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                {jobDescription.length} characters
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`
                relative rounded-2xl border-2 border-dashed p-12 transition-all duration-300 text-center
                ${isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-card/50 hover:border-primary/50"
                }
                backdrop-blur-sm min-h-[300px] flex flex-col items-center justify-center
              `}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                Drop a text file here
              </h3>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
              <input
                type="file"
                accept=".txt,text/plain"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </motion.div>

        {/* Preview if file uploaded */}
        {inputMode === "file" && jobDescription && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 rounded-xl bg-card/50 border border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <p className="text-sm line-clamp-3">{jobDescription}</p>
          </motion.div>
        )}

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
            disabled={!jobDescription.trim()}
            className="order-1 sm:order-2 w-full sm:w-auto group"
          >
            Compare with Resume
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default JobDescriptionInput;
