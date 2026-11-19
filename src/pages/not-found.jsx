import { Link } from 'react-router'

const NotFoundPage = () => {
  return (
    <section>
      <h1>404</h1>
      <p>Esta página no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}

export default NotFoundPage
