'use client';

import { useSelector } from 'react-redux';

export default function NewsSection() {
  const { articles, loading, error, lastUpdated } = useSelector(state => state.news);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Crypto News
        </h2>
        {lastUpdated && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Updated: {formatDate(lastUpdated)}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading news...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {articles.map((article, index) => (
            <article
              key={index}
              className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0"
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -mx-2 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {article.description?.slice(0, 150)}
                  {article.description?.length > 150 ? '...' : ''}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{article.source_id}</span>
                  <span>{formatDate(article.pubDate)}</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
} 