# Advent of Code Solver Extension

A VS Code extension to help you fetch, organize, and solve [Advent of Code](https://adventofcode.com/) challenges directly from your editor. This extension creates a structured workspace for your AoC solutions and leverages AI to help analyze and solve the daily puzzles.

## Features

- Automatically fetches daily challenges and inputs
- Organizes challenges into dedicated folders
- AI-powered problem analysis and solution suggestions
- Integrates with VS Code's GitHub Copilot Chat
- Maintains session management for secure API access

## Prerequisites

Before using this extension, you'll need:

1. A valid [Advent of Code](https://adventofcode.com/) account
2. Your AoC session cookie (for authentication)
3. VS Code with GitHub Copilot Chat installed
4. An empty workspace/folder for your AoC solutions

## Getting Started

1. Create a new empty folder for your Advent of Code solutions
2. Open the folder in VS Code
3. Install this extension from the VS Code Marketplace
4. Set your AoC session cookie using the command palette:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Search for "Set AoC Session"
   - Enter your session cookie when prompted

## Project Structure

The extension will create and maintain the following folder structure:

```
your-project/
├── input/
│   ├── day01.txt
│   ├── day02.txt
│   └── ...
└── question/
    ├── day01.txt
    ├── day02.txt
    └── ...
```

## Commands

### Via Command Palette

- `Set AoC Session`: Configure your Advent of Code session cookie
- `Fetch AoC Day`: Download the question and input for a specific day

### Via Chat (@aoc)

You can interact with the extension through VS Code's Chat view using the following commands:

- `/session <cookie>`: Set your AoC session cookie
- `/fetch <day>`: Fetch question and input for the specified day
- `/solve <day>`: Get AI-powered analysis and solution for the day's challenge

Example chat commands:
```
@aoc /session your-session-cookie
@aoc /fetch 1
@aoc /solve 1
```

## Session Cookie

To find your session cookie:

1. Log in to [Advent of Code](https://adventofcode.com/)
2. Open your browser's developer tools (usually F12)
3. Go to the Application/Storage tab
4. Find the cookie named "session" under Cookies
5. Copy the value and use it with the "Set AoC Session" command

Your session cookie is stored securely in VS Code's secret storage and is only used to authenticate requests to Advent of Code.

## Extension Settings

This extension contributes no additional settings.

## Known Issues

- The extension requires an active GitHub Copilot subscription for AI-powered solutions
- Session cookies expire after some time and will need to be updated

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License.

## Acknowledgments

- [Advent of Code](https://adventofcode.com/) for creating the wonderful programming challenges
- The VS Code team for the excellent extension API
- GitHub Copilot for AI assistance

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/your-username/your-repo/issues) on our GitHub repository.