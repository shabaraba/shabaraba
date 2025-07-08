import React, { useEffect } from 'react';
import styles from './ProjectModal.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  projectUrl: string;
  tags: string[];
}

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getProjectDetails = (projectId: string) => {
    switch (projectId) {
      // 会社のプロダクト
      case 'kintone':
        return {
          fullDescription: 'サイボウズのクラウドサービス「kintone」のアプリ運用機能開発を担当。モブプログラミングを通じて新機能実装、自動テスト作成、ドキュメントメンテナンスに従事。不確実性の高いバックログに対してはプロトタイプを作成し、実装方針の提案・議論をリード。',
          features: [
            'アプリ運用機能の開発',
            'モブプログラミング実践',
            'プロトタイプ作成・提案',
            'リードタイム削減への貢献'
          ],
          technologies: ['Java', 'SpringBoot', 'React', 'TypeScript'],
          status: '現在参画中'
        };
      case 'kintone-js-sdk':
        return {
          fullDescription: 'kintone開発者向けのJavaScript SDKの開発を担当。パートナー企業向けのプラグイン開発支援ツールとして、APIクライアントの対応コスト削減を目的とした自動生成ソリューションを考案・提案。',
          features: [
            'プラグイン開発支援',
            'APIクライアント自動生成',
            '開発者体験の向上',
            'ドキュメント整備'
          ],
          technologies: ['TypeScript', 'JavaScript', 'SDK', 'API'],
          status: '開発中'
        };
      case 'cli-kintone':
        return {
          fullDescription: 'kintone導入企業の情報システム部門向けCLIツールの開発チームに参画。自身の提案した自動生成ソリューションがプロダクトロードマップに正式採用され、プロダクト改善の方向性に影響を与える。',
          features: [
            '情シス向けCLIツール',
            'ロードマップへの提案採用',
            'チーム体制強化',
            'オンボーディング整備'
          ],
          technologies: ['TypeScript', 'Node.js', 'CLI', 'kintone API'],
          status: '開発中'
        };
      case 'smaregi':
        return {
          fullDescription: 'iPadで使えるPOSレジアプリ「スマレジ」の管理画面開発を担当。巨大化した取引ロジックを自ら分析し、適切なクラス設計と木構造の導入によるリファクタリングを主導。広告管理システムの改善など多くの改善案を提案・実装。',
          features: [
            'POS管理画面の開発',
            '取引ロジックリファクタリング',
            '広告管理システム改善',
            'E2Eテスト自動化'
          ],
          technologies: ['PHP', 'JavaScript', 'jQuery', 'Postman'],
          status: '参画完了'
        };
      case 'kawasaki-robots':
        return {
          fullDescription: '半導体ウェハー搬送用産業用ロボットのソフトウェア評価業務をリーダーとして担当。VBSとUWSCを使用した評価工程の自動化スクリプトを独自に開発し、評価工数を約30%削減。進捗管理の改善により、プロジェクト全体の透明性を向上。',
          features: [
            '産業用ロボット評価',
            '評価工程自動化（30%削減）',
            'VBA進捗管理ツール開発',
            'チーム標準プロセス化'
          ],
          technologies: ['VBS', 'UWSC', 'VBA', 'Redmine'],
          status: '参画完了'
        };
      case 'brother-speedio':
        return {
          fullDescription: 'ブラザー工業の工作機械「SPEEDIO」のソフトウェア設計・テスト業務を担当。新規コマンドの入力処理開発や、マインドストームを使ったライントレースロボットの設計・実装をソフトウェアリーダーとして担当。製造から営業まで幅広い現場を体験。',
          features: [
            '工作機械ソフトウェア設計',
            'ロボット製作実習リーダー',
            '新規コマンド入力処理開発',
            '製造・営業現場体験'
          ],
          technologies: ['C', 'Linux', 'Arduino', '組み込み'],
          status: '参画完了'
        };
      // 個人開発
      case 'in-grok-mind':
        return {
          fullDescription: 'Grokの気持ち（In Grok Mind）は、Grokになりきってファクトチェックの精度を競うジョークアプリです。',
          features: [
            'AIによるファクトチェック精度の点数化'
          ],
          technologies: ['React', 'TypeScript', 'Next.js', 'AI/ML'],
          status: '運用中'
        };
      case 'braindump':
        return {
          fullDescription: 'BrainDumpは、AIライティングアシスタントサービスです。思考を書きなぐるだけで、Geminiがいい感じの文章にまとめ上げてくれるサービスです。',
          features: [
            'AI文章改善・校正',
            '多様な文体への変換',
            'リアルタイム編集',
          ],
          technologies: ['React', 'Next.js', 'Supabase', 'Gemini'],
          status: 'βリリース'
        };
      case 'honnyasan':
        return {
          fullDescription: 'ほんやさんは、リアルの書店の体験をwebで再現、をコンセプトにしたサービスです。ブラウジング体験をモットーとしているため、あえて検索機能はつけていません。実際に購入もできます。',
          features: [
            '面置き、棚置き機能',
            '購入機能',
          ],
          technologies: ['React', 'TypeScript', 'RakutenBooks API'],
          status: 'βリリース'
        };
      case 'realtime-qr':
        return {
          fullDescription: 'QRコードをリアルタイム生成できるツールです。一文字入力するたびに生成されます。',
          features: [
            'リアルタイムQR生成',
          ],
          technologies: ['JavaScript', 'HTML5 Canvas', 'QR.js'],
          status: '運用中'
        };
      case 'devtools-mcp':
        return {
          fullDescription: 'DevTools MCPは、開発ツール統合のためのMCP サーバーです。同梱しているchrome拡張を入れることで、Claude.aiなどのAIエージェントが直接ブラウザログを確認することが出来るようになります。',
          features: [
            'リアルタイムプロセス管理',
            'ブラウザログ収集',
          ],
          technologies: ['TypeScript', 'Node.js', 'MCP'],
          status: '運用中'
        };
      case 'yozakura-nvim':
        return {
          fullDescription: 'Yozakura.nvimは、夜桜をイメージした美しいNeovimカラースキームです。目に優しいダークテーマで長時間のコーディングをサポートし、シンタックスハイライトも美しく設計されています。',
          features: [
            '目に優しいダークテーマ',
            '豊富なシンタックスハイライト',
            'プラグイン対応',
            'カスタマイズ可能'
          ],
          technologies: ['Lua', 'Neovim', 'Color Theory'],
          status: '運用中'
        };
      case 'pile-nvim':
        return {
          fullDescription: 'pile.nvimは、垂直タブ形式でバッファ管理を行うNeovimプラグインです。',
          features: [
            'バッファ管理'
          ],
          technologies: ['Lua', 'Neovim API'],
          status: '運用中'
        };
      default:
        return {
          fullDescription: project.description,
          features: [],
          technologies: project.tags,
          status: '不明'
        };
    }
  };

  const details = getProjectDetails(project.id);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.projectTitle}>{project.title}</h2>
          <span className={styles.status}>{details.status}</span>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.contentGrid}>
            <div className={styles.imageSection}>
              <div className={styles.screenshotContainer}>
                <img
                  src={`/screenshots/${project.id}.png`}
                  alt={`${project.title}のスクリーンショット`}
                  className={styles.screenshot}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className={styles.screenshotFallback}>
                  <span>スクリーンショット準備中</span>
                </div>
              </div>
            </div>

            <div className={styles.infoSection}>
              <p className={styles.fullDescription}>{details.fullDescription}</p>

              {details.features.length > 0 && (
                <div className={styles.section}>
                  <h3>主な機能</h3>
                  <ul className={styles.featureList}>
                    {details.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.section}>
                <h3>使用技術</h3>
                <div className={styles.techTags}>
                  {details.technologies.map((tech, index) => (
                    <span key={index} className={styles.techTag}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitButton}
                >
                  プロダクトページを見る
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
