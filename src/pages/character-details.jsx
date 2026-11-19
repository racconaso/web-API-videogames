import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { API_URL } from '../config'

const CharacterDetailsPage = () => {
  const { id } = useParams()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(`${API_URL}/api/characters/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) throw new Error('Personaje no encontrado')
        if (!res.ok) throw new Error('Fallo al obtener el personaje')
        return res.json()
      })
      .then((data) => {
        setCharacter(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [id])

  if (loading) return <p>Cargando...</p>
  if (error) return <div className="error">{error}</div>

  return (
    <section className="details">
      <Link to="/">← Volver</Link>
      <div className="details-card">
        <img
          src={`${API_URL}${character.image}`}
          alt={character.name}
          className="details-image"
        />
        <div>
          <h1>{character.name}</h1>
          <p className="game">{character.game}</p>
          <p><strong>Rol:</strong> {character.role}</p>
          <p>{character.description}</p>
          <p className="tags">
            {character.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

export default CharacterDetailsPage
