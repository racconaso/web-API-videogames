import { Link } from 'react-router'
import { API_URL } from '../config'

const CharacterCard = ({ character }) => {
  return (
    <Link to={`/character/${character.id}`} className="card-link">
      <div className="character-card">
        <img
          src={`${API_URL}${character.image}`}
          alt={character.name}
          className="character-image"
          loading="lazy"
        />
        <h2>{character.name}</h2>
        <p className="game">{character.game}</p>
        <p className="role">{character.role}</p>
      </div>
    </Link>
  )
}

export default CharacterCard
