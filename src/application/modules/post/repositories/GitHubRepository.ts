import axios from "axios";
import toml from "toml";
import { PostHeadDto } from "../objects/dtos/PostHeadDto";
import { PostDetailEntity } from "../objects/entities/PostDetailEntity";
import { Paragraph } from "../objects/entities/blocks/Paragraph";
import { BlockList } from "../objects/entities/blocks";
import { MarkdownDxo } from "./MarkdownDxo";

export default class GitHubRepository {
  
  private _cache: PostHeadDto[];
  
  public async getPostList(): Promise<PostHeadDto[]> {
    if (this._cache !== undefined) return this._cache;

    const response = await axios.get('https://raw.githubusercontent.com/shabaraba/Articles/main/index.toml');
    const data = toml.parse(response.data).articles.map(article => new PostHeadDto({
      id: article.slug,
      title: article.title,
      coverImageUrl: article.cover,
      iconText: "",
      slug: article.slug,
      tags: article.tags.map(tag => {return {name: tag, color: 'gray'}}),
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
    }))
    
    this._cache = data;
    return data;
  }

  public async getPageHeadBySlug(slug: string): Promise<PostHeadDto> {
    if (this._cache === undefined) {
      await this.getPostList();
    }
    return this._cache.find(postHeadDto => postHeadDto.slug === slug);
  }

  public async getPostByTitle(title: string): Promise<BlockList> {
    const response = await axios.get(encodeURI(`https://raw.githubusercontent.com/shabaraba/Articles/main/articles/${title}.md`));
    const data = response.data;
    console.log(data);

    return MarkdownDxo.convertToBlockList(data);
  }

}

