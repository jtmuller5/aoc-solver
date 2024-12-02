import * as vscode from "vscode";
import { AocClient } from "../aocClient";

export class SolveCommand {
  constructor(private context: vscode.ExtensionContext) {}

  async execute(stream: vscode.ChatResponseStream, dayArg?: string) {
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        throw new Error("No workspace folder open");
      }

      // Parse day
      let dayNum: number;
      if (dayArg) {
        dayNum = parseInt(dayArg);
        if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
          throw new Error("Day must be a number between 1 and 25");
        }
      } else {
        const day = await vscode.window.showInputBox({
          prompt: "Enter the day number (1-25)",
          validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 1 || num > 25) {
              return "Please enter a number between 1 and 25";
            }
            return null;
          },
        });
        if (!day) return;
        dayNum = parseInt(day);
      }

      const dayStr = dayNum.toString().padStart(2, "0");

      // Report starting
      stream.progress(`Fetching Advent of Code day ${dayStr}...`);

      // Get client and fetch content
      const client = await this.getClient();

      // Fetch question and input
      const [question, input] = await Promise.all([
        client.fetchQuestion(dayNum),
        client.fetchInput(dayNum),
      ]);

      //stream.markdown(`# Day ${dayStr} Challenge\n\n${question}\n\n`);
      stream.progress("Analyzing problem and generating solution...");

      // Get language model
      const model = await this.getLanguageModel();

      // Prepare the prompt
      const prompt = [
        vscode.LanguageModelChatMessage.Assistant(
          "You are an expert programmer helping solve Advent of Code challenges. " +
            "When given a programming challenge, you should:\n" +
            "1. Analyze the problem requirements carefully\n" +
            "2. Design an efficient solution approach\n" +
            "3. Generate working code to solve it\n" +
            "Be concise but thorough in your explanations. Write the code so that it can work with an input file under inputs/dayXX.txt."
        ),
        vscode.LanguageModelChatMessage.User(
          "Here is the Advent of Code challenge. Please help solve it:\n\n" +
            "QUESTION:\n" +
            question
        ),
      ];
      // Get solution
      const response: vscode.LanguageModelChatResponse | undefined =
        await model.sendRequest(prompt);

      stream.markdown(`## Solution Strategy and Code\n\n`);

      for await (const fragment of response?.text || []) {
        stream.markdown(fragment);
      }
    } catch (error) {
      const errorMessage = `Error: ${
        error instanceof Error ? error.message : String(error)
      }`;
      stream.markdown(`❌ ${errorMessage}`);
    }
  }

  private async getClient(): Promise<AocClient> {
    const session = await this.context.secrets.get("aoc-session");
    if (!session) {
      throw new Error(
        'Please set your AoC session cookie first using the "Set AoC Session" command'
      );
    }
    return new AocClient(session, new Date().getFullYear());
  }

  private async getLanguageModel(): Promise<vscode.LanguageModelChat> {
    const [model] = await vscode.lm.selectChatModels({
      vendor: "copilot",
      family: "gpt-4o-mini",
    });
    return model;
  }
}
