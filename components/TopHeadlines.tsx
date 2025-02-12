"use client"

import { useEffect, useState } from "react"
import NewsItem from "./NewsItem"
import Pagination from "./Pagination"

export default function TopHeadlines() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
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
  }, [page])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsItem key={index} article={article} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={Math.ceil(totalResults / 20)} onPageChange={setPage} />
    </div>
  )
}

