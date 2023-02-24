import { createGitgraph } from "@gitgraph/js";

export const createGit = (graphContainer, options) => {
  let gitgraphUserApi = createGitgraph(graphContainer, options);

  gitgraphUserApi.openDetail = function(commit) {
    commit.body = "aaa";
    // このthisはGitgraphUserApi
    // see: portfolio/node_modules/@gitgraph/core/lib/user-api/gitgraph-user-api.js
    console.log(this._graph.commits)
    this._onGraphUpdate();
  }

  gitgraphUserApi.closeDetailAll = function() {
    this._graph.commits.forEach(commit => {
      commit.body = "";
    });
    // this._onGraphUpdate();
  }
  return gitgraphUserApi;
}