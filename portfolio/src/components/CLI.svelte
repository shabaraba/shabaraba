<script>
  import { onMount } from "svelte";
  let commandLine;
  let input = "";
  let history = [];
  let directories = ["~"];
  const branches = [
    "main",
    "ブラザー工業株式会社",
    "川崎重工業株式会社",
    "株式会社スマレジ",
    "サイボウズ株式会社",
  ];
  const commits = [
    {
      branch: "main",
      commits: [
`
commit abc123
Merge: 1946a5bb982 7d00efdd7bd
Date:   Mon Mar 27 02:31:10 2023 +0000

  Merge pull request #123 from branch-name

  branch-name -> mainへのマージ`,

`
commit abc12345
Date:   Mon Mar 27 11:01:01 2023 +0900

  number 不要になったログを削除`,
      ],
    }
  ];
  let branch = branches[0];

  onMount(focusCommandLine);

  function focusCommandLine() {
    commandLine.focus();
  }

  function handleInput(event) {
    input = event.target.value;
  }

  function executeCommand(input) {
    const [command, ...args] = input.split(" ");
    let output = "";
    switch (command) {
      case "h":
      case "help":
        output += "Commands:\n";
        output += "  help - List available commands\n";
        output += "  cd <dir> - Change directory\n";
        output += "  ls - List files in current directory\n";
        output += "  clear - Clear console\n";
        output += "  echo <text> - Print text\n";
        break;
      case "git":
        output = execGitCommand(args);
        break;
      case "ls":
        output += ".md\n";
        output += "file2.md\n";
        output += "file3.md\n";
        break;
      case "clear":
        history = [];
        output = "";
        break;
      case "cd ..":
        currentDir = "~";
        break;
      case "cd folder":
        currentDir = "~/folder";
        break;
      case "echo hello":
        output += "hello\n";
        break;
      default:
        output += `Command not found: ${input}\n`;
        break;
    }
    return output;
  }

  function execGitCommand(args) {
    const [arg, ...options] = args;
    let output = "";
    switch (arg){
      case "checkout":
        const target = options[0];
        if (branches.find(b => target == b) == undefined) return;
        branch = target;
        output += `Switched to branch '${branch}'.`;
        break;
      case "branch":
        const branchList = branches.map((b) => (b === branch) ? "*"+b : "  "+b);
        output += branchList.join("\n");
        break;
      case "log":
        console.log(commits.filter(commit => commit.branch == branch));
        output += commits.find(commit => commit.branch == branch).commits.join("\n");
        break;
    }
    return output;
  }

  function autoComplete() {
    const lastInput = input.trim().split(" ").pop();
    switch (lastInput) {
      case "cd":
        input += " folder";
        break;
      case "echo":
        input += " hello";
        break;
      default:
        break;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (input.trim() !== "") {
      const cmd = { input: input, output: "empty" };
      console.log(cmd);
      history = [...history, cmd];
      cmd.output = executeCommand(input);
      input = "";
    }
    directories = ["~"];
  }
</script>

<div class="terminal" on:mouseenter={focusCommandLine}>
  {#each history as line}
    <div class="output-line">
      <span class="directories">{directories.join("/")}</span>
      <span class="branch">[{branch}]</span>
      <span class=""> {" "}{">"}{" "} </span>
      <span class=""> {line.input} </span>
      <!-- {company && <span class="company">@{company}</span>} -->
    </div>
    <div class="output-line">
      {line.output}
    </div>
  {/each}
  <form on:submit={handleSubmit} class="input-line">
    <span class="directories">{directories.join("/")}</span>
    <span class="branch">[{branch}]</span>
    <span class=""> {" "}{">"}{" "} </span>
    <span class="command-line">
      <input
        bind:this={commandLine}
        type="text"
        placeholder="Type command here..."
        value={input}
        on:input={handleInput}
      />
    </span>
  </form>
</div>

<style>
  .terminal {
    background-color: #1f1f1f;
    color: #ffffff;
    font-family: monospace;
    font-size: 16px;
    line-height: 1.2;
    overflow-y: scroll;
    padding: 1rem;
    height: 80%;
    width: 60%;
  }

  .input-line {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .command-line {
    flex-grow: 1;
  }

  .command-line input {
    background-color: transparent;
    border: none;
    color: #ffffff;
    font-family: monospace;
    font-size: 16px;
    margin-right: 0.5rem;
    outline: none;
    width: 100%;
  }

  .command-line input:focus {
    border-bottom: 2px solid #ffffff;
  }

  .output-line {
    margin: 0.5rem 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .directories {
    color: #4caf50;
  }

  .branch {
    color: #ff9800;
  }

  .company {
    color: #2196f3;
  }
</style>
