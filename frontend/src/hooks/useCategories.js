import { useEffect, useState } from 'react'

const STORAGE_KEY = 'playlistCategories'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

// Maps playlist IDs to a category, remembered across sessions in this browser
const useCategories = () => {
  const [categories, setCategories] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    } catch {
      // Storage unavailable; categories still work for this session
    }
  }, [categories])

  const assign = (playlistIds, category) => {
    setCategories((current) => {
      const next = { ...current }
      playlistIds.forEach((id) => {
        if (category) next[id] = category
        else delete next[id]
      })
      return next
    })
  }

  return [categories, assign]
}

export default useCategories
