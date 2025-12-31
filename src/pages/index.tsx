import React, { useState, useEffect } from 'react';
import { generateNextSeo } from 'next-seo/pages';
import PortfolioLayout from '../components/PortfolioLayout';
import OGPImage from '../components/OGPImage';
import ProjectModal from '../components/ProjectModal';
import ArticlesSection from '../components/ArticlesSection';
import { CommonDataService } from '../services/CommonDataService';
import { IPageHead } from '../core/types/NotionPageApiResponses';
import styles from '../styles/Home.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  projectUrl: string;
  tags: string[];
  category: 'personal' | 'work';
}

interface Job {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  current?: boolean;
  companyUrl?: string;
  projects?: Array<{
    name: string;
    url: string;
  }>;
}

interface HomePageProps {
  latestArticles: IPageHead[];
}

const projects: Project[] = [
  // 個人開発
  {
    id: 'in-grok-mind',
    title: 'Grokの気持ち',
    description: 'AI-powered thinking tool that helps organize and develop ideas',
    projectUrl: 'https://in-grok-mind.shaba.dev',
    tags: ['AI', 'React', 'TypeScript'],
    category: 'personal',
  },
  {
    id: 'braindump',
    title: 'BrainDump',
    description: 'Quick note-taking app for capturing fleeting thoughts',
    projectUrl: 'https://braindump.shaba.dev',
    tags: ['React', 'Note-taking', 'PWA'],
    category: 'personal',
  },
  {
    id: 'honnyasan',
    title: 'Honnyasan',
    description: 'Book management and reading tracker application',
    projectUrl: 'https://honnyasan.shaba.dev',
    tags: ['React', 'Books', 'Tracking'],
    category: 'personal',
  },
  {
    id: 'realtime-qr',
    title: 'Realtime QR Generator',
    description: 'Generate QR codes in real-time with various customization options',
    projectUrl: 'https://from-garage.github.io/realtime-qr-generator',
    tags: ['JavaScript', 'QR Code', 'Tools'],
    category: 'personal',
  },
  {
    id: 'devtools-mcp',
    title: 'DevTools MCP',
    description: 'Model Context Protocol server for development tools integration',
    projectUrl: 'https://github.com/shabaraba/devtools-mcp',
    tags: ['TypeScript', 'MCP', 'Developer Tools'],
    category: 'personal',
  },
  {
    id: 'yozakura-nvim',
    title: 'Yozakura.nvim',
    description: 'A beautiful Neovim colorscheme inspired by cherry blossoms at night',
    projectUrl: 'https://github.com/shabaraba/yozakura.nvim',
    tags: ['Neovim', 'Lua', 'Colorscheme'],
    category: 'personal',
  },
  {
    id: 'pile-nvim',
    title: 'Pile.nvim',
    description: 'Neovim plugin for managing and organizing code snippets',
    projectUrl: 'https://github.com/shabaraba/pile.nvim',
    tags: ['Neovim', 'Lua', 'Plugin'],
    category: 'personal',
  },
];

const jobs: Job[] = [
  {
    id: 'cybozu',
    title: 'プロダクトエンジニア',
    company: 'サイボウズ株式会社',
    period: '2022.08 - Present',
    description: 'kintoneのアプリ運用機能開発を担当した後、SDK/CLIツール開発に参画。モブプログラミングやスクラム開発を実践している。採用活動やオンボーディングにも積極的に参加。',
    technologies: ['Java', 'JavaScript', 'TypeScript', 'SpringBoot', 'React'],
    current: true,
    companyUrl: 'https://kintone.cybozu.co.jp',
    projects: [
      { name: 'kintone JavaScript SDK', url: 'https://github.com/kintone/js-sdk' },
      { name: 'cli-kintone', url: 'https://cli.kintone.dev/' },
    ],
  },
  {
    id: 'smaregi',
    title: 'フルスタックエンジニア',
    company: '株式会社スマレジ',
    period: '2020.02 - 2022.07',
    description: 'POSアプリ管理画面の開発を担当。巨大化したコアロジックのリファクタリングを自発的に提案・実施し、適切なクラス設計と木構造を導入。他にも多くの改善案を提案・実装。',
    technologies: ['PHP', 'JavaScript', 'jQuery'],
    companyUrl: 'https://smaregi.jp',
  },
  {
    id: 'kawasaki',
    title: 'QA・テストエンジニア',
    company: '川崎重工業株式会社',
    period: '2018.06 - 2020.01',
    description: '産業用ロボットソフトウェアの評価業務をリーダーとして担当。VBSとUWSCを使用した評価工程の自動化スクリプトを開発し、評価工数を約30%削減。進捗管理の改善により、プロジェクト全体の透明性を向上。',
    technologies: ['VBS', 'UWSC', 'VBA', 'Redmine'],
    companyUrl: 'https://kawasakirobotics.com',
  },
  {
    id: 'brother',
    title: 'エンジニア',
    company: 'ブラザー工業株式会社',
    period: '2017.04 - 2018.05',
    description: '工作機械のソフトウェア設計・テスト業務を経験。製造から営業まで幅広い現場を体験。',
    technologies: ['C', 'Arduino', 'Linux'],
    companyUrl: 'https://www.brother.co.jp',
  },
];

const HomePage: React.FC<HomePageProps> = ({ latestArticles }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {generateNextSeo({
        title: "Shaba - Portfolio",
        description: "Shaba's Portfolio - Works, About, and Contact",
        canonical: "https://shaba.dev/",
        openGraph: {
          url: 'https://shaba.dev/',
          title: 'Shaba - Web Developer & Solopreneur',
          description: 'Portfolio showcasing works, career journey, and projects by Shaba - Web Developer & Solopreneur',
          images: [
            {
              url: 'https://shaba.dev/og-images/default.png',
              width: 1200,
              height: 630,
              alt: 'Shaba Portfolio',
            },
          ],
        },
      })}

      <PortfolioLayout>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.greeting}>Hello, I'm</span>
            <span className={styles.name}>Shaba</span>
          </h1>
          <p className={styles.tagline}>
            Web Developer & Solopreneur
          </p>
          <div className={styles.introduction}>
            <p>開発に関わるあらゆることが好きです。</p>
            <p>本業の傍らで、個人開発にも勤しんでいます。</p>
            <p>情熱を持って、本当にほしいと思えるアプリケーション開発を目指しています。</p>
          </div>
          
        </section>

        {/* About Section */}
        <section id="about" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>About Me</h2>
            <div className={styles.aboutContent}>
              <div className={styles.aboutText}>
                <p>
                  多様な業界での経験を持つエンジニアとして、常に技術革新と業務効率化を追求してきました。
                  特に主体的な課題発見と解決提案を得意としており、「効率化」と「品質向上」を一貫したキャリアの軸としています。
                </p>
                <h3>Skills & Technologies</h3>
                <div className={styles.skillsGrid}>
                  <div className={styles.skillCategory}>
                    <h4>Frontend</h4>
                    <ul>
                      <li>React / Next.js</li>
                      <li>jQuery</li>
                      <li>TypeScript / JavaScript</li>
                      <li>CSS / Tailwind CSS</li>
                    </ul>
                  </div>
                  <div className={styles.skillCategory}>
                    <h4>Backend</h4>
                    <ul>
                      <li>Java / SpringBoot</li>
                      <li>PHP</li>
                      <li>Node.js</li>
                      <li>C / Arduino</li>
                    </ul>
                  </div>
                  <div className={styles.skillCategory}>
                    <h4>Tools & Others</h4>
                    <ul>
                      <li>Neovim</li>
                      <li>Git / GitHub</li>
                      <li>スクラム / アジャイル</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section id="jobs" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Career Journey</h2>
            <div className={styles.timeline}>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`${styles.jobCard} ${job.current ? styles.current : ''}`}
                >
                  <div className={styles.timelineDot} />
                  <div className={styles.jobContent}>
                    <div className={styles.jobInfo}>
                      <div className={styles.jobHeader}>
                        <h3 className={styles.jobTitle}>{job.title}</h3>
                        {job.current && <span className={styles.currentBadge}>Current</span>}
                      </div>
                      <h4 className={styles.company}>{job.company}</h4>
                      <p className={styles.period}>{job.period}</p>
                      <p className={styles.description}>{job.description}</p>
                      <div className={styles.technologies}>
                        {job.technologies.map((tech) => (
                          <span key={tech} className={styles.tech}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {(job.companyUrl || (job.projects && job.projects.length > 0)) && (
                      <div className={styles.companySection}>
                        {job.companyUrl && (
                          <a
                            href={job.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.companyImageContainer}
                          >
                            <OGPImage
                              url={job.companyUrl}
                              alt={`${job.company}のロゴ`}
                              className={styles.companyImage}
                            />
                          </a>
                        )}
                        {job.projects && job.projects.length > 0 && (
                          <>
                            {job.projects.map((project) => (
                              <a
                                key={project.name}
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.projectImageContainer}
                                title={project.name}
                              >
                                <OGPImage
                                  url={project.url}
                                  alt={project.name}
                                  className={styles.projectImage}
                                />
                              </a>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Works Section */}
        <section id="works" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Solo Projects</h2>
            
            {/* 個人開発 */}
            <div className={styles.worksCategory}>
              <div className={styles.gallery}>
                {projects.filter(project => project.category === 'personal').map((project) => (
                  <div
                    key={project.id}
                    className={styles.projectCard}
                    onClick={() => openModal(project)}
                  >
                    <div className={styles.imageContainer}>
                      <OGPImage
                        url={project.projectUrl}
                        alt={project.title}
                        className={styles.projectImage}
                      />
                    </div>
                    <div className={styles.projectContent}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <p className={styles.projectDescription}>{project.description}</p>
                      <div className={styles.tags}>
                        {project.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section id="articles" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Latest Articles</h2>
            <ArticlesSection articles={latestArticles} />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Get In Touch</h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <h3>Contact Information</h3>
                
                <div className={styles.contactItem}>
                  <h4>Email</h4>
                  <a href="mailto:shaba.from-garage@gmail.com" className={styles.contactLink}>
                    shaba.from-garage@gmail.com
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <h4>GitHub</h4>
                  <a 
                    href="https://github.com/shabaraba" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    @shabaraba
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <h4>Social</h4>
                  <div className={styles.socialLinks}>
                    <a 
                      href="https://twitter.com/shaba_dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <span className={styles.socialIcon}>𝕏</span>
                      X
                    </a>
                    <a 
                      href="https://qiita.com/shabaraba" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <span className={styles.socialIcon}>📄</span>
                      Qiita
                    </a>
                  </div>
                </div>
              </div>

              <div className={styles.contactForm}>
                <h3>Send a Message</h3>
                <p className={styles.formDescription}>
                  お仕事のご依頼、技術相談、またはただのご挨拶でも、お気軽にご連絡ください。
                </p>
                
                <a 
                  href="https://forms.gle/5KLSAY1KkvAXQ5wi8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.formButton}
                >
                  お問い合わせフォームを開く
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}

        {/* Scroll Indicator - Global */}
        {showScrollIndicator && (
          <div 
            className={styles.scrollIndicator}
            onClick={() => {
              const aboutSection = document.getElementById('about');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <span className={styles.scrollText}>Scroll Down</span>
            <div className={styles.scrollArrow}></div>
          </div>
        )}
      </PortfolioLayout>
    </>
  );
};

export async function getStaticProps() {
  try {
    console.log('HomePage getStaticProps: Fetching latest articles');
    
    // 最新記事5件を取得
    const latestArticles = await CommonDataService.getLatestArticles(5);
    
    console.log(`HomePage getStaticProps: Fetched ${latestArticles.length} articles`);
    
    return {
      props: {
        latestArticles,
      },
    };
  } catch (error) {
    console.error('Error in HomePage getStaticProps:', error);
    return {
      props: {
        latestArticles: [],
      },
    };
  }
}

export default HomePage;
