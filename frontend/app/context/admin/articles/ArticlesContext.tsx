import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import {
  ArticleResponseDataType,
  ArticleState,
} from '../../../types/articles.types';
import { useAuth } from '../../auth/AuthContext';

const ArticlesContext = createContext<ArticleState | undefined>(undefined);

// Custom wrapper for Next.js fetch
const nextFetch = async (
  url: string,
  options: RequestInit & { cache?: RequestCache } = {},
) => {
  return fetch(url, { ...options, next: { revalidate: 10 } });
};

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<ArticleResponseDataType[]>([]);
  const [currentArticle, setCurrentArticle] =
    useState<ArticleResponseDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
  }>({
    currentPage: 1,
    totalPages: 1,
  });

  const { token } = useAuth();

  const handleApiError = (errorText: string) => {
    setError(errorText);
  };

  const fetchArticles = useCallback(
    async (page: number = 1, pageSize: number = 10): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/articles/articles?page=${page}&page_size=${pageSize}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          handleApiError("Couldn't fetch articles. Please refresh the page.");
          return;
        }

        const data = await response.json();
        setArticles(data.articles);
        setPagination({
          currentPage: data.current_page,
          totalPages: data.total_pages,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching articles',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchArticleById = useCallback(
    async (id: string): Promise<ArticleResponseDataType | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/articles/articles/${id}`,
          { method: 'GET' },
        );

        if (!response.ok) {
          handleApiError('Failed to fetch article. Please try again.');
          return null;
        }

        const fetchedArticle = await response.json();
        setCurrentArticle(fetchedArticle);
        return fetchedArticle;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching article');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createArticle = useCallback(
    async (article: FormData): Promise<ArticleResponseDataType | null> => {
      if (!token) {
        setError('Authentication token is missing');
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/articles/articles`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: article,
          },
        );

        if (!response.ok) {
          handleApiError("Couldn't create article. Please try again.");
          return null;
        }

        const createdArticle = await response.json();
        setArticles((prevArticles) => [...prevArticles, createdArticle]);
        return createdArticle;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating article');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateArticle = useCallback(
    async (
      id: string,
      article: FormData,
    ): Promise<ArticleResponseDataType | null> => {
      if (!token) {
        setError('Authentication token is missing');
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/articles/articles/${id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: article,
          },
        );

        if (!response.ok) {
          handleApiError('Failed to update article. Please try again.');
          return null;
        }

        const updatedArticle = await response.json();
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === Number(id) ? updatedArticle : article,
          ),
        );
        setCurrentArticle(updatedArticle);
        return updatedArticle;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error updating article');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const deleteArticle = useCallback(
    async (id: string): Promise<void> => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await nextFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/articles/articles/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleApiError('Failed to delete article. Please try again.');
          return;
        }

        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== Number(id)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting article');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const contextValue = useMemo(
    () => ({
      articles,
      currentArticle,
      loading,
      error,
      pagination,
      fetchArticles,
      fetchArticleById,
      createArticle,
      updateArticle,
      deleteArticle,
    }),
    [
      articles,
      currentArticle,
      loading,
      error,
      pagination,
      fetchArticles,
      fetchArticleById,
      createArticle,
      updateArticle,
      deleteArticle,
    ],
  );

  return (
    <ArticlesContext.Provider value={contextValue}>
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticlesContext = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error(
      'useArticlesContext must be used within an ArticlesProvider',
    );
  }
  return context;
};
