'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useArticlesContext } from '@/app/context/admin/articles/ArticlesContext';
import moment from 'moment';
import Link from 'next/link';
import BlogPostLoader from '@/app/loaders/BlogPostLoader';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

const BlogPosts: React.FC = () => {
  const { articles, fetchArticles, loading, error } = useArticlesContext();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  if (loading) return <BlogPostLoader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Handle empty articles
  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-left mb-10">
          Hive Builder Tips
        </h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            No crowdfunding tips available at the moment.
          </p>
          <Link
            href="/articles"
            className="inline-block px-6 py-3 bg-white text-emerald-600 border border-fundify-primary rounded-md hover:bg-emerald-600 hover:text-white transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-left mb-10">Hive Builder Tips</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {articles.slice(0, 4).map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="flex flex-col group"
          >
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
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-emerald-600 group-hover:text-fundify-primary transition-colors">
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
          </Link>
        ))}
      </div>
      <div className="text-center">
        <a href="/articles">
          <Button
            variant="outline"
            className="border-fundify-primary text-emerald-600"
          >
            See More Tips
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  );
};

export default BlogPosts;
