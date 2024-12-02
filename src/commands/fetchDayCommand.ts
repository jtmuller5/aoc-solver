import * as vscode from "vscode";
import * as path from "path";
import { AocClient } from "../aocClient";

export class FetchDayCommand {
  constructor(private context: vscode.ExtensionContext) {}

  async execute(dayArg?: string) {
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        throw new Error("No workspace folder open");
      }

      let dayNum: number;

      if (dayArg) {
        // Use the provided day argument
        dayNum = parseInt(dayArg);
        if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
          throw new Error("Day must be a number between 1 and 25");
        }
      } else {
        // If no day provided, prompt for input
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

        if (!day) {
          return;
        }
        dayNum = parseInt(day);
      }

      const dayStr = dayNum.toString().padStart(2, "0");
      const workspaceRoot = workspaceFolders[0].uri.fsPath;

      // Ensure directories exist
      await this.createDirectories(workspaceRoot);

      // Get client
      const client = await this.getClient();

      // Show progress
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Fetching Advent of Code day ${dayStr}`,
          cancellable: false,
        },
        async (progress) => {
          // Fetch and save question
          progress.report({ message: "Fetching question..." });
          const question = await client.fetchQuestion(dayNum);
          const questionPath = path.join(
            workspaceRoot,
            "question",
            `day${dayStr}.txt`
          );
          await vscode.workspace.fs.writeFile(
            vscode.Uri.file(questionPath),
            Buffer.from(question)
          );

          // Fetch and save input
          progress.report({ message: "Fetching input..." });
          const input = await client.fetchInput(dayNum);
          const inputPath = path.join(
            workspaceRoot,
            "input",
            `day${dayStr}.txt`
          );
          await vscode.workspace.fs.writeFile(
            vscode.Uri.file(inputPath),
            Buffer.from(input)
          );

          vscode.window.showInformationMessage(
            `Successfully saved day ${dayStr} files!`
          );
        }
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async createDirectories(workspaceRoot: string) {
    const fs = vscode.workspace.fs;

    for (const dir of ["input", "question"]) {
      const dirUri = vscode.Uri.file(path.join(workspaceRoot, dir));
      try {
        await fs.createDirectory(dirUri);
      } catch (error) {
        // Directory might already exist, which is fine
      }
    }
  }

  private async getClient(): Promise<AocClient> {
    const session = await this.context.secrets.get("aoc-session");
    if (!session) {
      throw new Error(
        'Please set your AoC session cookie first using the "Set AoC Session" command'
      );
    }
    // Get year from global state or use current year as default
    const year =
      this.context.globalState.get<number>("aoc-year") ||
      new Date().getFullYear();
    return new AocClient(session, year);
  }
}
