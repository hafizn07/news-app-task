"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Params {
  title: string;
}

interface Article {
  title: string;
  urlToImage?: string;
  description: string;
  content: string;
  publishedAt: string;
  url: string;
}

export default function ArticlePage({ params }: { params: Params }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            params.title
          )}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch news article");
        }

        if (!data.articles || data.articles.length === 0) {
          throw new Error("No articles found for this title");
        }

        setArticle(data.articles[0]);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.title]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!article) return <p>Article not found</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      {article.urlToImage && (
        <Image
          src={article.urlToImage || "/placeholder.svg"}
          alt={article.title || "No Image Available"}
          width={800}
          height={400}
          className="w-full h-64 object-cover mb-4"
        />
      )}
      <p className="text-gray-600 mb-4">{article.description}</p>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
      <p className="mt-4 text-gray-500">
        Published on: {new Date(article.publishedAt).toLocaleDateString()}
      </p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Read full article
      </a>
    </div>
  );
}
