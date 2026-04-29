import { useEffect, useState } from 'react'
import ArticuloForm from '../components/articulos/ArticuloForm'
import ArticulosList from '../components/articulos/ArticulosList'
import { createArticulo, getArticulos } from '../services/api'
import pageStyles from '../styles/Page.module.css'

function Articulos() {
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarArticulos()
  }, [])

  async function cargarArticulos() {
    try {
      setLoading(true)
      setError('')
      const data = await getArticulos()
      setArticulos(data)
    } catch (err) {
      setError(err.message || 'No fue posible cargar articulos.')
    } finally {
      setLoading(false)
    }
  }

  async function manejarCrear(articuloNuevo) {
    try {
      setError('')
      await createArticulo(articuloNuevo)
      await cargarArticulos()
    } catch (err) {
      setError(err.message || 'No fue posible crear articulo.')
    }
  }

  return (
    <section className={pageStyles.page}>
      <ArticuloForm onCrear={manejarCrear} />
      {error ? <p className={pageStyles.error}>{error}</p> : null}
      {loading ? <p className={pageStyles.muted}>Cargando articulos...</p> : <ArticulosList articulos={articulos} />}
    </section>
  )
}

export default Articulos
