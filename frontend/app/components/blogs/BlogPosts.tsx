//@/app/components/blogs/BlogPosts.tsx

'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useArticlesContext } from '@/app/context/admin/articles/ArticlesContext';
import moment from 'moment';
import Link from 'next/link';

const BlogPosts: React.FC = () => {
  const { articles, fetchArticles } = useArticlesContext();

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="max-w-7xl mx-auto px-2 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Latest Blog Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
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
                Published on:{' '}
                {moment(article.published_at).format('MMMM Do, YYYY')}
              </p>
              <Link
                href={`/blog/${article.slug}`} // Use slug instead of id
                className="text-amber-600 mt-4 inline-block"
              >
                View More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
