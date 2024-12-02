import * as vscode from "vscode";

export class SetYearCommand {
  constructor(private context: vscode.ExtensionContext) {}

  async execute(yearArg?: string) {
    try {
      let year: string | undefined;

      if (yearArg) {
        // Use the provided year argument
        year = yearArg.trim();
      } else {
        // If no year provided, prompt for input with current year as default
        const currentYear = new Date().getFullYear();
        year = await vscode.window.showInputBox({
          prompt: "Enter the Advent of Code year",
          value: currentYear.toString(),
          validateInput: (value) => {
            const num = parseInt(value);
            // First AOC was in 2015
            if (isNaN(num) || num < 2015 || num > currentYear) {
              return `Please enter a year between 2015 and ${currentYear}`;
            }
            return null;
          }
        });
      }

      if (year) {
        const yearNum = parseInt(year);
        await this.context.globalState.update("aoc-year", yearNum);
        vscode.window.showInformationMessage(`AoC year set to ${yearNum}!`);
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error setting year: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}