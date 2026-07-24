import { ParsedResume } from "../../types/parsed-resume";

export class RegexExtractor {
  extract(text: string): ParsedResume["personal"] {
    return {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      linkedin: this.extractLinkedIn(text),
      github: this.extractGithub(text),
      portfolio: this.extractPortfolio(text),
    };
  }

  private extractName(text: string): string | undefined {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return undefined;
    }

    const firstLine = lines[0];

    // Ignore headings that are clearly not names
    if (
      /resume|curriculum|vitae|profile|software|engineer|developer/i.test(
        firstLine,
      )
    ) {
      return undefined;
    }

    return firstLine;
  }

  private extractEmail(text: string): string | undefined {
    const match = text.match(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
    );

    return match?.[0];
  }

  private extractPhone(text: string): string | undefined {
    const match = text.match(
      /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,6}/,
    );

    return match?.[0];
  }

  private extractLinkedIn(text: string): string | undefined {
    const match = text.match(
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+/i,
    );

    return match?.[0];
  }

  private extractGithub(text: string): string | undefined {
    const match = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s]+/i);

    return match?.[0];
  }

  private extractPortfolio(text: string): string | undefined {
    const urls = text.match(/https?:\/\/[^\s]+/g);

    if (!urls) {
      return undefined;
    }

    return urls.find(
      (url) => !url.includes("linkedin.com") && !url.includes("github.com"),
    );
  }
}
