import { useState } from "react";
import { Helmet } from "react-helmet-async";
import LandingHero from "@/components/LandingHero";
import ResumeUpload from "@/components/ResumeUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import ProcessingScreen from "@/components/ProcessingScreen";
import ResultsScreen from "@/components/ResultsScreen";

type AppState = "landing" | "upload" | "jobDescription" | "processing" | "results";
type Mode = "score" | "match";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [mode, setMode] = useState<Mode>("score");

  const handleScoreResume = () => {
    setMode("score");
    setAppState("upload");
  };

  const handleMatchResume = () => {
    setMode("match");
    setAppState("upload");
  };

  const handleResumeUpload = (file: File) => {
    console.log("Resume uploaded:", file.name);
    if (mode === "match") {
      setAppState("jobDescription");
    } else {
      setAppState("processing");
      // Simulate processing time
      setTimeout(() => {
        setAppState("results");
      }, 3000);
    }
  };

  const handleJobDescriptionSubmit = (description: string) => {
    console.log("Job description submitted:", description.substring(0, 100));
    setAppState("processing");
    // Simulate processing time
    setTimeout(() => {
      setAppState("results");
    }, 3000);
  };

  const handleStartOver = () => {
    setAppState("landing");
    setMode("score");
  };

  const handleBack = () => {
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
        <title>ResuMind - AI-Powered Resume Intelligence</title>
        <meta
          name="description"
          content="Unlock your career potential with ResuMind. Get AI-driven resume analysis, job matching, and personalized recommendations to land your dream job."
        />
        <meta name="keywords" content="resume analysis, AI resume, job matching, career tools, resume score" />
        <meta property="og:title" content="ResuMind - AI-Powered Resume Intelligence" />
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
          <ResumeUpload onUpload={handleResumeUpload} onBack={handleBack} />
        )}
        {appState === "jobDescription" && (
          <JobDescriptionInput onSubmit={handleJobDescriptionSubmit} onBack={handleBack} />
        )}
        {appState === "processing" && <ProcessingScreen mode={mode} />}
        {appState === "results" && (
          <ResultsScreen mode={mode} onStartOver={handleStartOver} />
        )}
      </main>
    </>
  );
};

export default Index;
