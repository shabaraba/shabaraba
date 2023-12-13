<script lang="ts">
  import { createGit } from "../libs/GitGraph.mjs";
  import { templateExtend, TemplateName } from "@gitgraph/core";
  import { onMount } from "svelte";

  // see: portfolio/node_modules/@gitgraph/core/lib/template.js

  let options = {
    template: templateExtend(TemplateName.Metro, {
      colors: ["#555", "#a0a", "#0aa"],
      branch: {
        lineWidth: 4,
        label: {
          display: false,
        },
      },
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
      main.checkout();
      // chore タスクファイルなどプロダクションに影響のない修正
      // docs  ドキュメントの更新
      // feat ユーザー向けの機能の追加や変更
      // fix  ユーザー向けの不具合の修正
      // refactor リファクタリングを目的とした修正
      // style フォーマットなどのスタイルに関する修正
      // test テストコードの追加や修正
      gitgraph.commit({
        subject: "大阪大学大学院基礎工学研究科修了",
        style: {
          // Specific style for this commit
        },
        onMouseOver: handleMouseOver,
        onClick: handleMouseOver,
        onMessageClick: handleMouseOver,
      });
      main.tag("v1.0");

      main.commit({
        subject: "[入社] ブラザー工業株式会社",
        onClick: handleMouseOver,
        onMessageClick: handleMouseOver,
      });
      const brother = gitgraph.branch("brother");
      brother.checkout();
      gitgraph.commit({
        subject: "[C言語] 工作機械SPEEDIO",
        body: "gコードのパーサーの設計・開発・テストを担当",
        renderMessage: gitgraph.setBody,
      });
      main.merge(brother, "[退職] ブラザー工業株式会社");
      main.checkout();
      gitgraph.deleteBranch();

      main.commit({
        subject: "[入社] 川崎重工業株式会社",
      });
      const khi = gitgraph.branch("khi");
      khi.commit({
        subject: "[AS] ウェハ搬送ロボット",
        body: "ソフトウェアのQAを担当。ASという独自言語で書かれたソースコードを読んでロジックの理解にも努めた。",
        renderMessage: gitgraph.setBody,
      });
      khi.commit({
        subject: "[VBA/VBS] 業務改善",
        body: "業務の傍らにロボットの試験の半自動化や、テスト進捗確認の可視化を実施。およそ30%の省力化に寄与。",
        renderMessage: gitgraph.setBody,
      });
      main.commit({
        subject: "[life] 結婚",
        dotText: "❤️",
      });
      main.merge(khi, "[退職] 川崎重工業株式会社");

      main.commit({
        subject: "[入社] 株式会社スマレジ",
      });
      const smaregi = gitgraph.branch("smaregi");
      smaregi.commit({
        subject: "[PHP/Laravel] 社内システムの機能開発",
        body: "パートナー開発者の報酬金管理処理の実装",
        renderMessage: gitgraph.setBody,
      });
      smaregi.commit({
        subject: "[PHP] スマレジの機能開発・保守",
        body: "タブレット型POSレジシステムのスマレジの管理画面やAPIの機能開発や、お問い合わせ業務の対応を行う。",
        renderMessage: gitgraph.setBody,
      });
      main.merge(smaregi, "[退職] 株式会社スマレジ");

      main.commit({
        subject: "[入社] サイボウズ株式会社",
      });
      const cybozu = gitgraph.branch("cybozu");
      cybozu.commit({
        subject: "[Java/SpringBoot] kintoneの新機能開発",
        body: "パートナー開発者の報酬金管理処理の実装",
        renderMessage: gitgraph.setBody,
      });
      cybozu.commit({
        subject: "[Java/SpringBoot] kintoneのコード分割",
        body: "巨大なモノリス構造であるkintoneをmoduleごとに分割するプロジェクトに参画",
        renderMessage: gitgraph.setBody,
      });
    }
  });
</script>

<div id="gitgraph" bind:this={graphContainer} />

<style>
</style>
