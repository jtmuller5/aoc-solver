import * as vscode from "vscode";
import { FetchDayCommand } from "./commands/fetchDayCommand";
import { SetSessionCommand } from "./commands/setSessionCommand";
import { AoCParticipant } from "./participant/aocParticipant";
import { SolveCommand } from "./commands/solveCommand";
import { SetYearCommand } from "./commands/setYearCommand";

export function activate(context: vscode.ExtensionContext) {
  // Create command instances
  const fetchDayCommand = new FetchDayCommand(context);
  const setSessionCommand = new SetSessionCommand(context);
  const solveCommand = new SolveCommand(context);
  const setYearCommand = new SetYearCommand(context);

  // Create and register chat participant
  const aocParticipant = new AoCParticipant(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("aoc-solver.setYear", (args) =>
      setYearCommand.execute(args)
    )
  );

  context.subscriptions.push(
    vscode.chat.createChatParticipant(
      "aoc-solver.aoc",
      aocParticipant.handleRequest.bind(aocParticipant)
    )
  );
}

export function deactivate() {}
