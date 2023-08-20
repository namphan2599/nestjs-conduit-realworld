import { UserRO } from "src/user/user.interface";
import { Article } from "./article.entity";

export interface ArticleRO  {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  author: UserRO;
  created: Date;
  updated: Date;
  favoriteCount: number;
  favorited: boolean;
}