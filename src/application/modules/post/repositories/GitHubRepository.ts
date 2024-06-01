import axios from "axios";
import toml from "toml";
import { PostHeadDto } from "../objects/dtos/PostHeadDto";

export default class GitHubRepository {
  
  public async getPostList(): Promise<PostHeadDto[]> {
    const response = await axios.get('https://raw.githubusercontent.com/shabaraba/Articles/main/index.toml');
    const data = toml.parse(response.data);
    console.log(data.articles);
    return data.articles.map(article => new PostHeadDto({
      id: article.slug,
      title: article.title,
      coverImageUrl: article.cover,
      iconText: "test",
      slug: article.slug,
      tags: article.tags,
      publishedAt: "1991-11-28",
      updatedAt: "1991-11-28",
    }))
  }
}
