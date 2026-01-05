/**
 * GitHub GraphQL API Client
 * 記事コンテンツをshabaraba/articlesリポジトリから取得
 */

export interface GitHubConfig {
  token?: string;
  owner: string;
  repo: string;
  branch?: string;
}

export interface GitHubFile {
  path: string;
  content: string; // Base64エンコードされたコンテンツ
  sha: string;
}

export class GitHubClient {
  private config: GitHubConfig;
  private apiUrl = 'https://api.github.com/graphql';

  constructor(config: GitHubConfig) {
    this.config = {
      ...config,
      branch: config.branch || 'main',
    };
  }

  /**
   * GraphQL クエリを実行
   */
  private async query<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  /**
   * ディレクトリ内の全ファイルを取得（1階層のみ、.mdファイルのみ）
   */
  async getDirectoryFiles(dirPath: string): Promise<GitHubFile[]> {
    const query = `
      query($owner: String!, $repo: String!, $expression: String!) {
        repository(owner: $owner, name: $repo) {
          object(expression: $expression) {
            ... on Tree {
              entries {
                name
                type
                object {
                  ... on Blob {
                    text
                    oid
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      owner: this.config.owner,
      repo: this.config.repo,
      expression: `${this.config.branch}:${dirPath}`,
    };

    const data = await this.query<any>(query, variables);

    if (!data.repository?.object?.entries) {
      return [];
    }

    const files: GitHubFile[] = [];

    for (const entry of data.repository.object.entries) {
      // ファイル（blob）のみ処理、ディレクトリは無視
      if (entry.type === 'blob' && entry.object?.text) {
        // .mdファイルまたは.tomlファイルのみ取得
        if (entry.name.endsWith('.md') || entry.name.endsWith('.toml')) {
          files.push({
            path: `${dirPath}/${entry.name}`,
            content: entry.object.text,
            sha: entry.object.oid,
          });
        }
      }
    }

    return files;
  }

  /**
   * 単一ファイルを取得
   */
  async getFile(filePath: string): Promise<GitHubFile | null> {
    const query = `
      query($owner: String!, $repo: String!, $expression: String!) {
        repository(owner: $owner, name: $repo) {
          object(expression: $expression) {
            ... on Blob {
              text
              oid
            }
          }
        }
      }
    `;

    const variables = {
      owner: this.config.owner,
      repo: this.config.repo,
      expression: `${this.config.branch}:${filePath}`,
    };

    const data = await this.query<any>(query, variables);

    if (!data.repository?.object) {
      return null;
    }

    return {
      path: filePath,
      content: data.repository.object.text,
      sha: data.repository.object.oid,
    };
  }

  /**
   * 画像URLを生成（raw.githubusercontent.com経由）
   */
  getImageUrl(imagePath: string): string {
    return `https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}/${imagePath}`;
  }
}
