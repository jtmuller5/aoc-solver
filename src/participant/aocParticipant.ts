import * as vscode from "vscode";
import { FetchDayCommand } from "../commands/fetchDayCommand";
import { SetSessionCommand } from "../commands/setSessionCommand";
import { SolveCommand } from "../commands/solveCommand";
import { SetYearCommand } from "../commands/setYearCommand";

export class AoCParticipant {
  private fetchCommand: FetchDayCommand;
  private sessionCommand: SetSessionCommand;
  private solveCommand: SolveCommand;
  private yearCommand: SetYearCommand;

  constructor(private context: vscode.ExtensionContext) {
    this.fetchCommand = new FetchDayCommand(context);
    this.sessionCommand = new SetSessionCommand(context);
    this.solveCommand = new SolveCommand(context);
    this.yearCommand = new SetYearCommand(context);
  }

  async handleRequest(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ) {
    // Parse command and args
    const match = request.prompt.match(/(\d+)/);
    if (!match) {
      console.log(request.prompt);
      stream.markdown("Please provide a day number like `5` or `3`");
      return;
    }

    const command = request.command;
    const arg = match[1];

    switch (command) {
      case "solve":
        await this.solveCommand.execute(stream, arg);
        break;
      case "fetch":
        await this.fetchCommand.execute(arg);
        break;
      case "session":
        await this.sessionCommand.execute(arg);
        break;
      case "year":
        await this.yearCommand.execute(arg);
        break;
      default:
        await stream.markdown(
          "Unknown command. Available commands: `/solve`, `/fetch`, `/session`"
        );
    }
  }
}
