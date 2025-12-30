import axios from "axios";

// Configurable base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ai-resumind-backend.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export interface ScoreResponse {
    message: string;
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}

export interface MatchResponse {
    message: string;
    matchScore: number;
    summary: string;
    matchedSkills: string[];
    missingSkills: string[];
    improvements: string[];
}

export const analyzeResume = async (file: File): Promise<ScoreResponse> => {
    const formData = new FormData();
    formData.append("resume", "resume"); // Keyword as per requirements
    formData.append("resume", file);

    try {
        const response = await api.post<ScoreResponse>("/api/resume/score", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || error.message || "Failed to analyze resume");
        }
        throw new Error("An unexpected error occurred");
    }
};

export const matchResumeToJob = async (file: File, jobDescription: string): Promise<MatchResponse> => {
    const formData = new FormData();
    formData.append("resume", "resume");
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
        const response = await api.post<MatchResponse>("/api/jd/match", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || error.message || "Failed to match resume");
        }
        throw new Error("An unexpected error occurred");
    }
};


export default api;
