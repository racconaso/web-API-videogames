import CharacterCard from '../components/CharacterCard'
import FilterInput from '../components/FilterInput'

const HomePage = ({
  characters,
  games,
  filter,
  setFilter,
  game,
  setGame,
  limit,
  setLimit,
  loading,
  error,
}) => {
  return (
    <div>
      <h1>Personajes de videojuegos</h1>

      <div className="top-controls">
        <FilterInput filter={filter} onFilterChange={setFilter} />

        <div className="controls">
          <label htmlFor="game">Juego: </label>
          <select id="game" value={game} onChange={(e) => setGame(e.target.value)}>
            <option value="">Todos</option>
            {games.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <label htmlFor="limit">Mostrar: </label>
          <select id="limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && characters.length === 0 && (
        <p>No se encontraron personajes con ese filtro.</p>
      )}

      {!loading && !error && (
        <main className="grid">
          {characters.map((character) => (
            <CharacterCard character={character} key={character.id} />
          ))}
        </main>
      )}
    </div>
  )
}

export default HomePage
