import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  onBack: () => void;
  isLoading?: boolean;
  externalError?: string | null;
}

type UploadState = "empty" | "selected" | "error";

const ResumeUpload = ({ onUpload, onBack, isLoading = false, externalError = null }: ResumeUploadProps) => {
  const [uploadState, setUploadState] = useState<UploadState>("empty");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);



  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a PDF or DOCX file");
      setUploadState("error");
      return false;
    }

    if (file.size > maxSize) {
      setErrorMessage("File size must be less than 5MB");
      setUploadState("error");
      return false;
    }

    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadState("selected");
      setErrorMessage("");
    }
  }, []);

  // Effect to handle external errors
  // Effect to handle external errors
  useEffect(() => {
    if (externalError) {
      setErrorMessage(externalError);
      setUploadState("error");
    }
  }, [externalError]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadState("empty");
    setErrorMessage("");
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient py-12 px-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/8 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Upload Your <span className="text-gradient">Resume</span>
          </h1>
          <p className="text-muted-foreground">
            We'll analyze it and provide actionable insights
          </p>
        </motion.div>

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`
              relative rounded-3xl border-2 border-dashed p-8 md:p-12 transition-all duration-300
              ${isDragOver
                ? "border-primary bg-primary/5 scale-[1.02]"
                : uploadState === "error"
                  ? "border-destructive/50 bg-destructive/5"
                  : uploadState === "selected"
                    ? "border-accent/50 bg-accent/5"
                    : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card/80"
              }
              backdrop-blur-sm
            `}
          >
            <AnimatePresence mode="wait">
              {uploadState === "empty" && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Drag & drop your resume
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    PDF or DOCX • Max 5MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </motion.div>
              )}

              {uploadState === "selected" && selectedFile && (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                    <button
                      onClick={handleRemoveFile}
                      className="p-1 rounded-full hover:bg-destructive/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </motion.div>
              )}

              {uploadState === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-destructive">
                    Upload Error
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {errorMessage}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleRemoveFile}>
                    Try Again
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button variant="ghost" onClick={onBack} disabled={isLoading} className="order-2 sm:order-1">
            Back
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={handleAnalyze}
            disabled={uploadState !== "selected" || isLoading}
            className="order-1 sm:order-2 w-full sm:w-auto"
          >
            {isLoading ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeUpload;
