export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'admin';
  is_active: boolean;
  created_at: string;
  profile?: StudentProfile;
}

export interface StudentProfile {
  id: string;
  phone?: string;
  college?: string;
  degree?: string;
  graduation_year?: number;
  target_job_role?: string;
  bio?: string;
  experience_level?: string;
  github_url?: string;
  linkedin_url?: string;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TargetRoleInfo {
  role_title: string;
  description: string;
  required_skills: string[];
  core_subjects: string[];
}

export interface ResumeData {
  id: string;
  user_id: string;
  filename: string;
  file_size: number;
  raw_text?: string;
  parsed_skills: string[];
  parsed_experience: any[];
  parsed_education: any[];
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  suggested_topics: string[];
  is_active: boolean;
  created_at: string;
}

export interface ResumeAnalysisResponse {
  resume_id: string;
  target_role: string;
  match_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
  suggested_topics: string[];
  extracted_summary: {
    filename: string;
    skills_count: number;
    skills: string[];
  };
  demo_mode: boolean;
}

export interface AptitudeQuestion {
  id: string;
  category: string;
  topic: string;
  difficulty: string;
  question_text: string;
  options: string[];
}

export interface QuestionReviewItem {
  question_id: string;
  question_text: string;
  options: string[];
  selected_option: number | null;
  correct_option: number;
  is_correct: boolean;
  explanation: string;
}

export interface AptitudeAttempt {
  id: string;
  user_id: string;
  category: string;
  difficulty: string;
  total_questions: number;
  correct_count: number;
  score_percentage: number;
  time_taken_seconds: number;
  detailed_review: QuestionReviewItem[];
  created_at: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  description: string;
  constraints?: string;
  input_format?: string;
  output_format?: string;
  sample_input?: string;
  sample_output?: string;
  sample_explanation?: string;
  python_starter_code: string;
  java_starter_code: string;
  created_at: string;
}

export interface ExecutionResult {
  status: string;
  stdout?: string;
  stderr?: string;
  runtime_ms: number;
  memory_kb: number;
  test_cases_passed: number;
  total_test_cases: number;
  test_case_details: Array<{
    test_case_num: number;
    input: string;
    expected_output: string;
    actual_output?: string;
    status: string;
    is_hidden?: boolean;
  }>;
  is_sandboxed: boolean;
  provider: string;
}

export interface CodingSubmission {
  id: string;
  user_id: string;
  problem_id: string;
  language: string;
  source_code: string;
  status: string;
  test_cases_passed: number;
  total_test_cases: number;
  runtime_ms: number;
  memory_kb: number;
  created_at: string;
}

export interface InterviewQuestionItem {
  id: string;
  question_order: number;
  question_text: string;
  category: string;
  response?: {
    student_answer: string;
    score: number;
    ai_feedback: string;
    expected_answer_guide: string;
  } | null;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  session_type: string;
  target_role: string;
  subjects: string[];
  difficulty: string;
  total_questions: number;
  status: string;
  overall_score: number;
  feedback_summary?: string;
  created_at: string;
  questions: InterviewQuestionItem[];
}

export interface InterviewEvaluation {
  response_id: string;
  score: number;
  correctness: number;
  completeness: number;
  clarity: number;
  relevance: number;
  ai_feedback: string;
  expected_answer_guide: string;
  areas_to_improve: string[];
  cross_round_claim_identified?: {
    claim_text: string;
    status: string;
  } | null;
}

export interface FollowUpQuestion {
  id: string;
  claim_id: string;
  question_text: string;
  rationale: string;
  student_clarification?: string;
  status: 'pending' | 'clarified';
  created_at: string;
  answered_at?: string;
}

export interface EvidenceClaim {
  id: string;
  user_id: string;
  claim_text: string;
  source_type: string;
  source_reference?: string;
  supporting_evidence?: string;
  status: 'Supported by available evidence' | 'Needs clarification' | 'Not verified from available sources' | 'Potentially inconsistent';
  confidence_score: number;
  reasoning?: string;
  created_at: string;
  updated_at: string;
  follow_ups: FollowUpQuestion[];
}

export interface EvidenceSummary {
  total_claims: number;
  supported_count: number;
  needs_clarification_count: number;
  not_verified_count: number;
  potentially_inconsistent_count: number;
  pending_follow_ups: number;
  consistency_health_score: number;
  claims: EvidenceClaim[];
}

export interface LearningRecommendation {
  id: string;
  user_id: string;
  title: string;
  category: string;
  topic: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggested_action: string;
  resource_link?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface DashboardMetrics {
  placement_readiness_score: number;
  aptitude_accuracy: number;
  coding_pass_rate: number;
  technical_interview_score: number;
  hr_communication_score: number;
  project_defense_score: number;
  evidence_consistency_score: number;
  total_aptitude_attempts: number;
  total_coding_submissions: number;
  total_interviews_completed: number;
  total_evidence_claims: number;
  strong_topics: string[];
  weak_topics: string[];
  recent_activities: Array<{
    type: string;
    title: string;
    score: string;
    date: string;
  }>;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  filename: string;
  file_type: string;
  chunk_count: number;
  created_at: string;
}

export interface ProjectData {
  id: string;
  user_id: string;
  title: string;
  problem_statement?: string;
  objectives?: string;
  technologies: string[];
  architecture_overview?: string;
  database_design?: string;
  implementation_details?: string;
  testing_approach?: string;
  challenges_and_solutions?: string;
  documents: ProjectDocument[];
  created_at: string;
  updated_at: string;
}

export interface CandidateCohortItem {
  id: string;
  full_name: string;
  email: string;
  stream: string;
  degree: string;
  target_role: string;
  readiness_score: number;
  aptitude_score: number;
  coding_score: number;
  interview_score: number;
  evidence_status: string;
  status: 'Placement Ready' | 'In Progress' | 'Needs Practice';
}

export interface CampusDriveItem {
  id: string;
  company: string;
  role: string;
  package_ctc: string;
  eligible_streams: string[];
  min_readiness_score: number;
  drive_date: string;
  status: string;
  applied_count: number;
}

export interface StreamAnalyticsItem {
  stream: string;
  total_candidates: number;
  placement_ready_rate: number;
  avg_aptitude: number;
  avg_coding: number;
  avg_interview: number;
  top_companies: string[];
}

