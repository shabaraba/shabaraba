<script lang="ts">
  import { createGit } from '../libs/GitGraph.mjs';
  import { templateExtend, TemplateName } from "@gitgraph/core";
  import { onMount } from 'svelte';

  // see: portfolio/node_modules/@gitgraph/core/lib/template.js

  let options = {
    template: templateExtend(TemplateName.Metro, {
      // colors: ["red", "blue", "orange"],
      branch: { lineWidth: 4 },
      commit: {
        dot: { size: 12 },
        message: {
          displayAuthor: false,
        },
      },
    }),
  };

  let graphContainer: HTMLElement | null;
  let gitgraph: any;

  const handleMouseOver = (commit: any) => {
    // gitgraph.closeDetailAll();
    // gitgraph.openDetail(commit);
  };

  onMount(() => {
    if (graphContainer !== null) {
      gitgraph = createGit(graphContainer, options);

      const main = gitgraph.branch("main");
      // chore タスクファイルなどプロダクションに影響のない修正
      // docs  ドキュメントの更新
      // feat ユーザー向けの機能の追加や変更
      // fix  ユーザー向けの不具合の修正
      // refactor リファクタリングを目的とした修正
      // style フォーマットなどのスタイルに関する修正
      // test テストコードの追加や修正
      main.commit({
        subject: "大阪大学大学院基礎工学研究科修了",
        dotText: "❤️",
        tag: "v1.2",
        style: {
          // Specific style for this commit
        },
        onMouseOver: handleMouseOver,
        onClick: handleMouseOver,
        onMessageClick: handleMouseOver,
      });
      main.tag("v1.0");

      const job = gitgraph.branch("job");
      job.commit({
        subject: "社会人生活開始",
        onClick: handleMouseOver,
        onMessageClick: handleMouseOver,
      });
      const brother = gitgraph.branch("brother");
      brother.commit({
        subject: "[入社] ブラザー工業株式会社",
      });
      job.merge(brother, "[退職] ブラザー工業株式会社");
      const khi = gitgraph.branch("khi");
      khi.commit({
        subject: "[入社] 川崎重工業株式会社",
      });
      job.merge(khi, "[退職] 川崎重工業株式会社");
    }
  });
</script>

<div id="gitgraph" bind:this={graphContainer} />

<style>
</style>
