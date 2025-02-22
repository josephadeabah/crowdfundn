export interface ArticleResponseDataType {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: string;
  meta_description: string;
  published_at: string;
  featured_image: string;
  featured_image_filename: string;
  author: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ArticleState {
  articles: ArticleResponseDataType[];
  currentArticle: ArticleResponseDataType | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  fetchArticles: () => Promise<void>;
  fetchArticleById: (id: string) => Promise<ArticleResponseDataType | null>;
  createArticle: (article: FormData) => Promise<ArticleResponseDataType | null>;
  updateArticle: (
    id: string,
    article: FormData,
  ) => Promise<ArticleResponseDataType | null>;
  deleteArticle: (id: string) => Promise<void>;
}
