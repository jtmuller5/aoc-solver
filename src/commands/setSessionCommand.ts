import * as vscode from "vscode";

export class SetSessionCommand {
  constructor(private context: vscode.ExtensionContext) {}

  async execute(sessionArg?: string) {
    try {
      let session: string | undefined;

      if (sessionArg) {
        // Use the provided session argument
        session = sessionArg.trim();
      } else {
        // If no session provided, prompt for input
        session = await vscode.window.showInputBox({
          prompt: "Enter your Advent of Code session cookie",
          password: true,
        });
      }

      if (session) {
        await this.context.secrets.store("aoc-session", session);
        vscode.window.showInformationMessage("AoC session cookie saved!");
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error saving session: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}