import { createGitgraph } from "@gitgraph/js";
import { GitgraphCore } from "@gitgraph/core";
import { BranchesOrder } from "@gitgraph/core/lib/branches-order";
import {GraphRows, createGraphRows} from "@gitgraph/core/lib/graph-rows";
import {
  createSvg,
  createG,
  createText,
  createForeignObject,
} from "@gitgraph/js/lib/svg-elements";

export const createGit = (graphContainer, options) => {
  let gitgraphUserApi = createGitgraph(graphContainer, options);
  gitgraphUserApi._graph.createBranch2 = function (args) {
    const t = this.createBranch(args);
    return t;
  };

  gitgraphUserApi._graph.computeRenderedCommits = function () {
    const branches = this.getBranches();
    // Commits that are not associated to a branch in `branches`
    // were in a deleted branch. If the latter was merged beforehand
    // they are reachable and are rendered. Others are not
    const reachableUnassociatedCommits = (() => {
      const unassociatedCommits = new Set(
        this.commits.reduce(
          (commits, { hash }) =>
            !branches.has(hash) ? [...commits, hash] : commits,
          []
        )
      );
      const tipsOfMergedBranches = this.commits.reduce(
        (tipsOfMergedBranches, commit) =>
          commit.parents.length > 1
            ? [
                ...tipsOfMergedBranches,
                ...commit.parents
                  .slice(1)
                  .map((parentHash) =>
                    this.commits.find(({ hash }) => parentHash === hash)
                  ),
              ]
            : tipsOfMergedBranches,
        []
      );
      console.log(tipsOfMergedBranches)
      const reachableCommits = new Set();
      tipsOfMergedBranches.forEach((tip) => {
        let currentCommit = tip;
        while (currentCommit && unassociatedCommits.has(currentCommit.hash)) {
          reachableCommits.add(currentCommit.hash);
          currentCommit =
            currentCommit.parents.length > 0
              ? this.commits.find(
                  ({ hash }) => currentCommit.parents[0] === hash
                )
              : undefined;
        }
      });
      return reachableCommits;
    })();
    const commitsToRender = this.commits.filter(
      ({ hash }) => branches.has(hash) || reachableUnassociatedCommits.has(hash)
    );
    const commitsWithBranches = commitsToRender.map((commit) =>
      this.withBranches(branches, commit)
    );
    const rows = createGraphRows(this.mode, commitsToRender);
    const branchesOrder = new BranchesOrder(
      commitsWithBranches,
      this.template.colors,
      this.branchesOrderFunction
    );
    return (
      commitsWithBranches
        .map((commit) => commit.setRefs(this.refs))
        .map((commit) => this.withPosition(rows, branchesOrder, commit))
        // Fallback commit computed color on branch color.
        .map((commit) =>
          commit.withDefaultColor(
            this.getBranchDefaultColor(branchesOrder, commit.branchToDisplay)
          )
        )
        // Tags need commit style to be computed (with default color).
        .map((commit) =>
          commit.setTags(
            this.tags,
            (name) =>
              Object.assign({}, this.tagStyles[name], this.template.tag),
            (name) => this.tagRenders[name]
          )
        )
    );
  };

  gitgraphUserApi.openDetail = function (commit) {
    commit.body = "aaa";
    // このthisはGitgraphUserApi
    // see: portfolio/node_modules/@gitgraph/core/lib/user-api/gitgraph-user-api.js
    console.log(this._graph.commits);
    this._onGraphUpdate();
  };

  gitgraphUserApi.closeDetailAll = function () {
    this._graph.commits.forEach((commit) => {
      commit.body = "";
    });
    // this._onGraphUpdate();
  };

  gitgraphUserApi.deleteBranch = function () {
    console.log(this._graph);
    console.log(this._graph.branchesOrder);
  };

  gitgraphUserApi.setBody = function (commit) {
    return createG({
      translate: { x: 0, y: commit.style.dot.size },
      children: [
        createText({
          fill: commit.style.dot.color,
          content: `${commit.hashAbbrev} - ${commit.subject}`,
        }),
        createForeignObject({
          width: 400,
          translate: { x: 10, y: 15 },
          content: commit.body,
        }),
      ],
    });
  };

  gitgraphUserApi.branch = function (args) {
    const t = this._graph.createBranch2(args);
    return t.getUserApi();
  };

  gitgraphUserApi.commit = function (options) {
    console.log("commit");
    this._graph.currentBranch.getUserApi().commit(options);
    return this;
  };

  // const _createBranch = (args) => {
  //   const defaultParentBranchName = "HEAD";
  //   let options = {
  //     gitgraph: this._graph,
  //     name: "",
  //     parentCommitHash: this._graph.refs.getCommit(defaultParentBranchName),
  //     style: this._graph.template.branch,
  //     onGraphUpdate: () => this._graph.next(),
  //   };
  //   if (typeof args === "string") {
  //     options.name = args;
  //     options.parentCommitHash = this._graph.refs.getCommit(
  //       defaultParentBranchName
  //     );
  //   } else {
  //     const parentBranchName = args.from
  //       ? args.from.name
  //       : defaultParentBranchName;
  //     const parentCommitHash =
  //       this._graph.refs.getCommit(parentBranchName) ||
  //       (this._graph.refs.hasCommit(args.from) ? args.from : undefined);
  //     args.style = args.style || {};
  //     options = Object.assign({}, options, args, {
  //       parentCommitHash,
  //       style: Object.assign({}, options.style, args.style, {
  //         label: Object.assign({}, options.style.label, args.style.label),
  //       }),
  //     });
  //   }
  //   const branch = new branch_1.Branch(options);
  //   this._graph.branches.set(branch.name, branch);
  //   return branch;
  // };
  return gitgraphUserApi;
};
