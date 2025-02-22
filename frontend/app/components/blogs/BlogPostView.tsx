'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useArticlesContext } from '@/app/context/admin/articles/ArticlesContext';
import moment from 'moment';
import BlogPostViewLoader from '@/app/loaders/BlogPostViewLoader';

const BlogPostView: React.FC = () => {
  const pathname = usePathname();
  const slug = pathname.split('/').pop(); // Extract the slug from the URL
  const { currentArticle, fetchArticleById, loading, error } =
    useArticlesContext();

  useEffect(() => {
    if (slug) {
      fetchArticleById(slug as string);
    }
  }, [slug, fetchArticleById]);

  if (loading) return <BlogPostViewLoader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!currentArticle) return <p className="text-center">Article not found</p>;

  return (
    <div className="flex flex-col items-center">
      {/* Title & Featured Image (max-w-7xl) */}
      <div className="max-w-7xl w-full px-2 py-8">
        <h1 className="text-6xl font-bold text-center mb-6">
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
      </div>

      {/* Rest of the Content (max-w-4xl) */}
      <div className="max-w-4xl w-full px-4 py-8 bg-white">
        <p className="text-gray-500 text-sm mt-4 text-center">
          Published on{' '}
          {moment(currentArticle.published_at).format('MMMM Do, YYYY')}
        </p>

        <div className="prose dark:prose-dark max-w-none mt-6 text-lg text-gray-800">
          <p
            dangerouslySetInnerHTML={{
              __html: currentArticle.description.body,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostView;
