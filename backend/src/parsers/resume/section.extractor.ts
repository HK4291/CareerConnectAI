export interface ResumeSections {
  summary: string;

  skills: string;

  education: string;

  experience: string;

  projects: string;

  certifications: string;

  languages: string;

  achievements: string;
}

export class SectionExtractor {
  private readonly headings: Record<string, keyof ResumeSections> = {
    summary: "summary",
    profile: "summary",
    objective: "summary",
    "professional summary": "summary",

    skills: "skills",
    "technical skills": "skills",
    technologies: "skills",

    education: "education",
    academics: "education",
    qualification: "education",

    experience: "experience",
    employment: "experience",
    "work experience": "experience",
    "professional experience": "experience",

    projects: "projects",
    "personal projects": "projects",

    certifications: "certifications",
    certificates: "certifications",

    languages: "languages",

    achievements: "achievements",
    awards: "achievements",
  };

  extract(text: string): ResumeSections {
    const sections: ResumeSections = {
      summary: "",
      skills: "",
      education: "",
      experience: "",
      projects: "",
      certifications: "",
      languages: "",
      achievements: "",
    };

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let currentSection: keyof ResumeSections | null = null;

    for (const line of lines) {
      const normalized = line.toLowerCase();

      const matchedHeading = this.headings[normalized];

      if (matchedHeading) {
        currentSection = matchedHeading;
        continue;
      }

      if (currentSection) {
        sections[currentSection] += line + "\n";
      }
    }

    Object.keys(sections).forEach((key) => {
      sections[key as keyof ResumeSections] =
        sections[key as keyof ResumeSections].trim();
    });

    return sections;
  }
}
