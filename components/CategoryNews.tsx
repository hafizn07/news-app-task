"use client"

import { useEffect, useState } from "react";
import NewsItem from "@/components/NewsItem";
import Pagination from "@/components/Pagination";

const categories = ["general", "business", "technology", "sports", "health", "entertainment", "science"]

export default function CategoryNews() {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState("general")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
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
  }, [category, page])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
    setPage(1)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <select value={category} onChange={handleCategoryChange} className="mb-6 p-2 border rounded">
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsItem key={index} article={article} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={Math.ceil(totalResults / 20)} onPageChange={setPage} />
    </div>
  )
}

