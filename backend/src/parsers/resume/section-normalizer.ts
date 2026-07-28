import { ResumeSections } from "./section.extractor";

export class SectionNormalizer {
  normalize(sections: ResumeSections) {
    return {
      summary: sections.summary,

      skills: this.normalizeList(sections.skills),

      education: this.normalizeParagraphs(sections.education),

      experience: this.normalizeParagraphs(sections.experience),

      projects: this.normalizeParagraphs(sections.projects),

      certifications: this.normalizeList(sections.certifications),

      languages: this.normalizeList(sections.languages),

      achievements: this.normalizeList(sections.achievements),
    };
  }

  /**
   * Used for sections like Skills, Languages, Certifications.
   */
  private normalizeList(section: string): string[] {
    if (!section.trim()) {
      return [];
    }

    return section
      .split(/\n|,|•|·|\||;/)
      .map((item) => item.replace(/^[-*✓●▪◦]\s*/, "").trim())
      .filter(Boolean);
  }

  /**
   * Used for sections like Education, Experience, Projects.
   * Keeps each logical line intact.
   */
  private normalizeParagraphs(section: string): string[] {
    if (!section.trim()) {
      return [];
    }

    return section
      .split(/\n{2,}|\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
}
