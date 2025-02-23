'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useArticlesContext } from '@/app/context/admin/articles/ArticlesContext';
import moment from 'moment';
import Link from 'next/link';
import BlogPostLoader from '@/app/loaders/BlogPostLoader';

const BlogPosts: React.FC = () => {
  const { articles, fetchArticles, loading, error } = useArticlesContext();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  if (loading) return <BlogPostLoader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-2 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        Resources For Fundraising on Bantu Hive
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map(
          (
            article, // Limit to 3 articles
          ) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`} // Make the whole card clickable
              className="block bg-gray-50 hover:bg-gray-100 rounded-lg overflow-hidden"
            >
              {article.featured_image && (
                <div className="relative w-full h-48">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-700">{article.meta_description}</p>
                <p className="text-gray-500 text-sm mt-4">
                  Published on{' '}
                  {moment(article.created_at).format('MMMM Do, YYYY')}
                </p>
              </div>
            </Link>
          ),
        )}
      </div>
    </div>
  );
};

export default BlogPosts;
