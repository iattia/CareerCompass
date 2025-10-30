export interface AssessmentAnswers {
  interests: string[];
  skills: string[];
  workStyle: string[];
  values: string[];
  subjects: string[];
  // Additional fields for comprehensive assessment
  aptitudes?: string[];
  workValues?: string[];
  workEnvironment?: string[];
  decisionMaking?: string[];
  energySources?: string[];
  stressResponse?: string[];
  learningStyle?: string[];
  workPace?: string[];
  impact?: string[];
  workRelationships?: string[];
}

export interface Career {
  name: string;
  match: number;
  category: string;
  description: string;
  salary: string;
  growth: string;
  education: string;
  isFavorite?: boolean;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  tags: string[];
  replies: Reply[];
  createdAt: Date;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface Scholarship {
  id: string;
  title: string;
  amount: string;
  deadline: string;
  description: string;
  eligibility: string[];
  url: string;
}
