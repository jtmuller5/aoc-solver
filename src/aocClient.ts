import axios from "axios";
import * as cheerio from "cheerio";

export class AocClient {
  private readonly client: typeof axios;
  private readonly session: string;
  private readonly year: number;

  constructor(session: string, year: number) {
    this.client = axios;
    this.session = session;
    this.year = year;
  }

  async fetchQuestion(day: number): Promise<string> {
    try {
      const url = `https://adventofcode.com/${this.year}/day/${day}`;
      const response = await this.client.get(url, {
        headers: {
          Cookie: `session=${this.session}`,
        },
      });

      const $ = cheerio.load(response.data);
      let questionText = "";

      $("article").each((_, element) => {
        questionText += $(element).text() + "\n\n";
      });

      return questionText;
    } catch (error) {
      throw new Error(
        `Failed to fetch question: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async fetchInput(day: number): Promise<string> {
    try {
      const url = `https://adventofcode.com/${this.year}/day/${day}/input`;
      const response = await this.client.get(url, {
        headers: {
          Cookie: `session=${this.session}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch input: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
