import { Link } from 'react-router'

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="brand">Personajes</Link>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/about">Acerca de</Link>
      </nav>
    </header>
  )
}

export default Header
