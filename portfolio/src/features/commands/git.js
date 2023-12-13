export default (args) => {
    const [arg, ...options] = args;
    let output = "";
    switch (arg){
        case "checkout":
            // const target = options[0];
            // if (branches.find(b => target == b) == undefined) return;
            // branch = target;
            // output += `Switched to branch '${branch}'.`;
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
