"use client"

import { useEffect, useState } from "react"
import NewsItem from "./NewsItem"
import Pagination from "./Pagination"

export default function SearchNews() {
  const [articles, setArticles] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      if (!query.trim()) return

      setLoading(true)
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
        )
        const data = await response.json()
        if (data.status === "error") {
          throw new Error(data.message)
        }
        setArticles(data.articles || [])
        setTotalResults(data.totalResults || 0)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [query, page])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    const formData = new FormData(e.target as HTMLFormElement);
    const searchQuery = (formData.get("search") as string).trim();
  
    if (!searchQuery) {
      setError("Search query cannot be empty");
      return;
    }
  
    setQuery(searchQuery);
  };
  

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <input type="text" name="search" placeholder="Search for news..." className="p-2 border rounded w-full" />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsItem key={index} article={article} />
        ))}
      </div>
      {articles.length > 0 && (
        <Pagination currentPage={page} totalPages={Math.ceil(totalResults / 20)} onPageChange={setPage} />
      )}
    </div>
  )
}

