'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useArticlesContext } from '@/app/context/admin/articles/ArticlesContext';
import moment from 'moment';

const BlogPostView: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query; // Get article slug from URL
  const { currentArticle, fetchArticleById, loading, error } =
    useArticlesContext();

  useEffect(() => {
    if (slug) {
      fetchArticleById(slug as string);
    }
  }, [slug, fetchArticleById]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!currentArticle) return <p className="text-center">Article not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">
        {currentArticle.title}
      </h1>

      {currentArticle.featured_image && (
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={currentArticle.featured_image}
            alt={currentArticle.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}

      <p className="text-gray-500 text-sm mt-4 text-center">
        Published on{' '}
        {moment(currentArticle.published_at).format('MMMM Do, YYYY')}
      </p>

      <div className="prose dark:prose-dark max-w-none mt-6 text-lg text-gray-800">
        <p
          dangerouslySetInnerHTML={{ __html: currentArticle.description.body }}
        />
      </div>
    </div>
  );
};

export default BlogPostView;
