const FilterInput = ({ filter, onFilterChange }) => {
  return (
    <div className="filter">
      <input
        type="text"
        value={filter}
        placeholder="Buscar por nombre, descripción o etiqueta"
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </div>
  )
}

export default FilterInput
