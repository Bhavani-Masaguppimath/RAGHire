import axios from 'axios';
import {
  AuthResponse,
  User,
  StudentProfile,
  ResumeData,
  ResumeAnalysisResponse,
  TargetRoleInfo,
  AptitudeQuestion,
  AptitudeAttempt,
  CodingProblem,
  ExecutionResult,
  CodingSubmission,
  InterviewSession,
  InterviewEvaluation,
  EvidenceSummary,
  EvidenceClaim,
  FollowUpQuestion,
  LearningRecommendation,
  DashboardMetrics,
  ProjectData,
  ProjectDocument
} from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('raghire_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('raghire_token');
      localStorage.removeItem('raghire_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 1. Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },
  register: async (
    email: string, 
    password: string, 
    fullName: string, 
    role = 'student',
    stream?: string,
    degree?: string,
    college?: string
  ): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', { 
      email, 
      password, 
      full_name: fullName, 
      role,
      stream,
      degree,
      college
    });
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
};

// 2. Profile API
export const profileApi = {
  getProfile: async (): Promise<StudentProfile> => {
    const res = await api.get<StudentProfile>('/profile/');
    return res.data;
  },
  updateProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const res = await api.put<StudentProfile>('/profile/', data);
    return res.data;
  },
  getTargetRoles: async (): Promise<TargetRoleInfo[]> => {
    const res = await api.get<TargetRoleInfo[]>('/profile/target-roles');
    return res.data;
  },
};

// 3. Resume API
export const resumeApi = {
  uploadResume: async (file: File, targetRole: string): Promise<ResumeAnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_role', targetRole);
    const res = await api.post<ResumeAnalysisResponse>('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getActiveResume: async (): Promise<ResumeData> => {
    const res = await api.get<ResumeData>('/resume/active');
    return res.data;
  },
  loadSample: async (targetRole = 'Full Stack Software Engineer'): Promise<ResumeAnalysisResponse> => {
    const res = await api.post<ResumeAnalysisResponse>('/resume/load-sample', null, {
      params: { target_role: targetRole },
    });
    return res.data;
  },
  editExtracted: async (data: { parsed_skills?: string[]; target_job_role?: string }): Promise<ResumeData> => {
    const res = await api.put<ResumeData>('/resume/edit-extracted', data);
    return res.data;
  },
};

// 4. Aptitude API
export const aptitudeApi = {
  getCategories: async () => {
    const res = await api.get('/aptitude/categories');
    return res.data;
  },
  getQuestions: async (category: string, difficulty?: string, limit = 10): Promise<AptitudeQuestion[]> => {
    const res = await api.get<AptitudeQuestion[]>('/aptitude/questions', {
      params: { category, difficulty, limit },
    });
    return res.data;
  },
  submitTest: async (category: string, difficulty: string, timeTaken: number, userAnswers: Record<string, number>): Promise<AptitudeAttempt> => {
    const res = await api.post<AptitudeAttempt>('/aptitude/submit-test', {
      category,
      difficulty,
      time_taken_seconds: timeTaken,
      user_answers: userAnswers,
    });
    return res.data;
  },
  getHistory: async (): Promise<AptitudeAttempt[]> => {
    const res = await api.get<AptitudeAttempt[]>('/aptitude/history');
    return res.data;
  },
};

// 5. Coding API
export const codingApi = {
  getProblems: async (difficulty?: string, topic?: string): Promise<CodingProblem[]> => {
    const res = await api.get<CodingProblem[]>('/coding/problems', { params: { difficulty, topic } });
    return res.data;
  },
  getProblemDetail: async (id: string): Promise<CodingProblem> => {
    const res = await api.get<CodingProblem>(`/coding/problems/${id}`);
    return res.data;
  },
  runCode: async (problemId: string, language: string, sourceCode: string, customInput?: string): Promise<ExecutionResult> => {
    const res = await api.post<ExecutionResult>('/coding/run', {
      problem_id: problemId,
      language,
      source_code: sourceCode,
      custom_input: customInput,
    });
    return res.data;
  },
  submitCode: async (problemId: string, language: string, sourceCode: string): Promise<ExecutionResult> => {
    const res = await api.post<ExecutionResult>('/coding/submit', {
      problem_id: problemId,
      language,
      source_code: sourceCode,
    });
    return res.data;
  },
  getSubmissions: async (problemId?: string): Promise<CodingSubmission[]> => {
    const res = await api.get<CodingSubmission[]>('/coding/submissions', { params: { problem_id: problemId } });
    return res.data;
  },
};

// 6. Interview API
export const interviewApi = {
  startSession: async (sessionType: string, subjects: string[], targetRole?: string, totalQuestions = 5): Promise<InterviewSession> => {
    const res = await api.post<InterviewSession>('/interview/start', {
      session_type: sessionType,
      subjects,
      target_role: targetRole,
      total_questions: totalQuestions,
    });
    return res.data;
  },
  getSession: async (sessionId: string): Promise<InterviewSession> => {
    const res = await api.get<InterviewSession>(`/interview/sessions/${sessionId}`);
    return res.data;
  },
  submitAnswer: async (questionId: string, studentAnswer: string, inputMode = 'text'): Promise<InterviewEvaluation> => {
    const res = await api.post<InterviewEvaluation>('/interview/answer', {
      question_id: questionId,
      student_answer: studentAnswer,
      input_mode: inputMode,
    });
    return res.data;
  },
  completeSession: async (sessionId: string) => {
    const res = await api.post(`/interview/sessions/${sessionId}/complete`);
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get('/interview/history');
    return res.data;
  },
};

// 7. Project Defense API
export const projectDefenseApi = {
  getProjects: async (): Promise<ProjectData[]> => {
    const res = await api.get<ProjectData[]>('/project-defense/projects');
    return res.data;
  },
  createProject: async (data: any): Promise<ProjectData> => {
    const res = await api.post<ProjectData>('/project-defense/projects', data);
    return res.data;
  },
  uploadDocument: async (projectId: string, file: File): Promise<ProjectDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ProjectDocument>(`/project-defense/projects/${projectId}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  loadSampleDocument: async (projectId: string): Promise<ProjectDocument> => {
    const res = await api.post<ProjectDocument>(`/project-defense/projects/${projectId}/load-sample-document`);
    return res.data;
  },
  generateQuestions: async (projectId: string) => {
    const res = await api.post(`/project-defense/projects/${projectId}/generate-questions`);
    return res.data;
  },
  evaluateAnswer: async (projectId: string, questionText: string, studentAnswer: string) => {
    const res = await api.post('/project-defense/evaluate-defense-answer', null, {
      params: {
        project_id: projectId,
        question_text: questionText,
        student_answer: studentAnswer,
      },
    });
    return res.data;
  },
};

// 8. Evidence API
export const evidenceApi = {
  getSummary: async (): Promise<EvidenceSummary> => {
    const res = await api.get<EvidenceSummary>('/evidence/');
    return res.data;
  },
  createClaim: async (data: Partial<EvidenceClaim>): Promise<EvidenceClaim> => {
    const res = await api.post<EvidenceClaim>('/evidence/claims', data);
    return res.data;
  },
  clarifyFollowUp: async (followUpId: string, clarificationText: string): Promise<FollowUpQuestion> => {
    const res = await api.post<FollowUpQuestion>(`/evidence/follow-ups/${followUpId}/clarify`, {
      clarification_text: clarificationText,
    });
    return res.data;
  },
};

// 9. Recommendations API
export const recommendationApi = {
  getRecommendations: async (): Promise<LearningRecommendation[]> => {
    const res = await api.get<LearningRecommendation[]>('/recommendations/');
    return res.data;
  },
  refreshRecommendations: async (): Promise<LearningRecommendation[]> => {
    const res = await api.post<LearningRecommendation[]>('/recommendations/refresh');
    return res.data;
  },
  toggleRecommendation: async (id: string, isCompleted: boolean): Promise<LearningRecommendation> => {
    const res = await api.patch<LearningRecommendation>(`/recommendations/${id}/toggle`, {
      is_completed: isCompleted,
    });
    return res.data;
  },
};

// 10. Analytics API
export const analyticsApi = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await api.get<DashboardMetrics>('/analytics/dashboard');
    return res.data;
  },
  getComprehensiveReport: async () => {
    const res = await api.get('/analytics/reports');
    return res.data;
  },
};

// 11. Admin API
export const adminApi = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getCandidates: async () => {
    const res = await api.get('/admin/candidates');
    return res.data;
  },
  getStreamAnalytics: async () => {
    const res = await api.get('/admin/stream-analytics');
    return res.data;
  },
  getCampusDrives: async () => {
    const res = await api.get('/admin/drives');
    return res.data;
  },
  createCampusDrive: async (data: any) => {
    const res = await api.post('/admin/drives', null, { params: data });
    return res.data;
  },
  createAptitudeQuestion: async (data: any) => {
    const res = await api.post('/admin/questions/aptitude', data);
    return res.data;
  },
  createCodingProblem: async (data: any) => {
    const res = await api.post('/admin/problems/coding', data);
    return res.data;
  },
  getResources: async () => {
    const res = await api.get('/admin/resources');
    return res.data;
  },
  createLearningResource: async (data: { title: string; category: string; topic: string; content: string }) => {
    const res = await api.post('/admin/resources', null, {
      params: data,
    });
    return res.data;
  },
};

export default api;
