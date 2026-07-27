export interface ATSBreakdown {
  contactInformation: number;
  summary: number;
  education: number;
  experience: number;
  projects: number;
  skills: number;
  formatting: number;
  atsCompatibility: number;
}

export interface AIATSResponse {
  overallScore: number;

  breakdown: ATSBreakdown;

  strengths: string[];

  weaknesses: string[];

  missingSections: string[];

  suggestions: string[];

  priorityImprovements: string[];
}
