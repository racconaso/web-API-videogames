import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { API_URL } from './config'

import HomePage from './pages/home'
import AboutPage from './pages/about'
import NotFoundPage from './pages/not-found'
import CharacterDetailsPage from './pages/character-details'

import Header from './components/Header'

const App = () => {
  const [characters, setCharacters] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [limit, setLimit] = useState(10)
  const [filter, setFilter] = useState('')
  const [game, setGame] = useState('')

  // Lista de juegos para el selector (solo al montar)
  useEffect(() => {
    fetch(`${API_URL}/api/games`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar la lista de juegos')
        return res.json()
      })
      .then((data) => setGames(data.data))
      .catch(() => setGames([]))
  }, [])

  // Personajes: se vuelve a pedir cuando cambian filtros o límite
  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ limit: String(limit) })
    if (filter) params.set('q', filter)
    if (game) params.set('game', game)

    setLoading(true)
    setError(null)

    fetch(`${API_URL}/api/characters?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Fallo al obtener los personajes')
        return res.json()
      })
      .then((data) => {
        setCharacters(data.data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [limit, filter, game])

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              characters={characters}
              games={games}
              filter={filter}
              setFilter={setFilter}
              game={game}
              setGame={setGame}
              limit={limit}
              setLimit={setLimit}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path="/character/:id" element={<CharacterDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
