import { useState } from "react";
import { Helmet } from "react-helmet-async";
import LandingHero from "@/components/LandingHero";
import ResumeUpload from "@/components/ResumeUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import ProcessingScreen from "@/components/ProcessingScreen";
import ResultsScreen from "@/components/ResultsScreen";
import { analyzeResume, matchResumeToJob, ScoreResponse, MatchResponse } from "@/services/api";

type AppState = "landing" | "upload" | "jobDescription" | "processing" | "results";
type Mode = "score" | "match";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [mode, setMode] = useState<Mode>("score");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ScoreResponse | MatchResponse | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleScoreResume = () => {
    setMode("score");
    setAppState("upload");
    setError(null);
    setResumeFile(null);
  };

  const handleMatchResume = () => {
    setMode("match");
    setAppState("upload");
    setError(null);
    setResumeFile(null);
  };

  const handleResumeUpload = async (file: File) => {
    console.log("Resume uploaded:", file.name);
    setError(null);
    setResumeFile(file);

    if (mode === "match") {
      setAppState("jobDescription");
    } else {
      setIsLoading(true);
      try {
        const result = await analyzeResume(file);
        setAnalysisResult(result);
        setAppState("processing");
        setTimeout(() => {
          setAppState("results");
          setIsLoading(false);
        }, 2000);
      } catch (err: any) {
        console.error("Analysis failed:", err);
        setError(err.message || "Failed to analyze resume");
        setIsLoading(false);
      }
    }
  };

  const handleJobDescriptionSubmit = async (description: string) => {
    console.log("Job description submitted:", description.substring(0, 100));

    if (!resumeFile) {
      setError("Resume file missing. Please start over.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await matchResumeToJob(resumeFile, description);
      setAnalysisResult(result);
      setAppState("processing");
      setTimeout(() => {
        setAppState("results");
        setIsLoading(false);
      }, 2000);
    } catch (err: any) {
      console.error("Match failed:", err);
      // Show error on current screen ideally, but we might be navigating. 
      // For simple flow, simple alert or error state that is passed down could work.
      // Or we stay on this step and show error.
      setError(err.message || "Failed to match resume");
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setAppState("landing");
    setMode("score");
    setAnalysisResult(null);
    setError(null);
    setResumeFile(null);
  };

  const handleBack = () => {
    setError(null);
    switch (appState) {
      case "upload":
        setAppState("landing");
        break;
      case "jobDescription":
        setAppState("upload");
        break;
      default:
        setAppState("landing");
    }
  };

  return (
    <>
      <Helmet>
        <title>Resuvia - AI-Powered Resume Intelligence</title>
        <meta
          name="description"
          content="Unlock your career potential with Resuvia. Get AI-driven resume analysis, job matching, and personalized recommendations to land your dream job."
        />
        <meta name="keywords" content="resume analysis, AI resume, job matching, career tools, resume score" />
        <meta property="og:title" content="Resuvia - AI-Powered Resume Intelligence" />
        <meta
          property="og:description"
          content="Get instant AI-powered resume analysis and job matching to boost your career."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <main className="min-h-screen">
        {appState === "landing" && (
          <LandingHero onScoreResume={handleScoreResume} onMatchResume={handleMatchResume} />
        )}
        {appState === "upload" && (
          <ResumeUpload
            onUpload={handleResumeUpload}
            onBack={handleBack}
            isLoading={isLoading && mode === "score"}
            externalError={error}
          />
        )}
        {appState === "jobDescription" && (
          <JobDescriptionInput
            onSubmit={handleJobDescriptionSubmit}
            onBack={handleBack}
            isLoading={isLoading && mode === "match"}
          />
        )}
        {appState === "processing" && <ProcessingScreen mode={mode} />}
        {appState === "results" && (
          <ResultsScreen
            mode={mode}
            onStartOver={handleStartOver}
            results={analysisResult}
          />
        )}
      </main>
    </>
  );
};

export default Index;
