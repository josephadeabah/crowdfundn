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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">
        Crowdfunding Tips
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {articles.slice(0, 4).map((article) => (
          <div key={article.id} className="flex flex-col">
            {article.featured_image && (
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority
                />
              </div>
            )}
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {article.meta_description}
              </p>
              <p className="text-gray-400 text-xs">
                Published on{' '}
                {moment(article.created_at).format('MMMM Do, YYYY')}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link
          href="/blog"
          className="inline-block px-6 py-3 bg-white text-emerald-600 border border-fundify-primary rounded-md hover:bg-primary-dark transition-colors"
        >
          See More Tips
        </Link>
      </div>
    </div>
  );
};

export default BlogPosts;
