import axios from "axios";
import toml from "toml";
import { PostHeadDto } from "../objects/dtos/PostHeadDto";

export default class GitHubRepository {
  
  public async getPostList(): Promise<PostHeadDto[]> {
    const response = await axios.get('https://raw.githubusercontent.com/shabaraba/Articles/main/index.toml');
    const data = toml.parse(response.data);
    return data.articles.map(article => new PostHeadDto({
      id: article.slug,
      title: article.title,
      coverImageUrl: article.cover,
      iconText: "",
      slug: article.slug,
      tags: article.tags.map(tag => {return {name: tag, color: 'gray'}}),
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
    }))
  }
}
