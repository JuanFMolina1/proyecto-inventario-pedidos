import { useEffect, useState } from 'react'
import ArticuloForm from '../components/articulos/ArticuloForm'
import ArticulosList from '../components/articulos/ArticulosList'
import { createArticulo, getArticulos, getFabricas } from '../services/api'
import pageStyles from '../styles/Page.module.css'

function Articulos() {
  const [articulos, setArticulos] = useState([])
  const [fabricas, setFabricas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      setLoading(true)
      setError('')
      const [articulosData, fabricasData] = await Promise.all([getArticulos(), getFabricas()])
      setArticulos(articulosData)
      setFabricas(fabricasData)
    } catch (err) {
      setError(err.message || 'No fue posible cargar articulos.')
    } finally {
      setLoading(false)
    }
  }

  async function manejarCrear(articuloNuevo) {
    try {
      setCreando(true)
      setError('')
      await createArticulo(articuloNuevo)
      await cargarDatos()
    } catch (err) {
      setError(err.message || 'No fue posible crear articulo.')
    } finally {
      setCreando(false)
    }
  }

  return (
    <section className={pageStyles.page}>
      <ArticuloForm onCrear={manejarCrear} fabricas={fabricas} creando={creando} />
      {error ? <p className={pageStyles.error}>{error}</p> : null}
      {loading ? <p className={pageStyles.muted}>Cargando articulos...</p> : <ArticulosList articulos={articulos} />}
    </section>
  )
}

export default Articulos
