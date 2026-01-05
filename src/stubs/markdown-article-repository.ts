// Empty stub for MarkdownArticleRepository to prevent browser-side imports
// This file is used by Turbopack's resolveAlias to replace server-only modules in browser builds

export class MarkdownArticleRepository {
  constructor() {
    throw new Error('MarkdownArticleRepository can only be used on the server side');
  }
}

export default MarkdownArticleRepository;
