export class TextCleaner {
  static clean(text: string): string {
    if (!text) {
      return "";
    }

    return (
      text
        // Normalize unicode characters
        .normalize("NFKC")

        // Convert Windows line endings to Unix
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")

        // Replace tabs with spaces
        .replace(/\t/g, " ")

        // Remove multiple spaces
        .replace(/[ ]{2,}/g, " ")

        // Remove trailing spaces from each line
        .replace(/[ \t]+$/gm, "")

        // Limit multiple blank lines
        .replace(/\n{3,}/g, "\n\n")

        // Remove invisible control characters
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")

        // Trim final output
        .trim()
    );
  }
}
