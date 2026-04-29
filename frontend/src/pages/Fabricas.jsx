import { useEffect, useState } from 'react'
import FabricaForm from '../components/fabricas/FabricaForm'
import FabricasList from '../components/fabricas/FabricasList'
import { createFabrica, getFabricas } from '../services/api'
import pageStyles from '../styles/Page.module.css'

function Fabricas() {
  const [fabricas, setFabricas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarFabricas()
  }, [])

  async function cargarFabricas() {
    try {
      setLoading(true)
      setError('')
      const data = await getFabricas()
      setFabricas(data)
    } catch (err) {
      setError(err.message || 'No fue posible cargar fabricas.')
    } finally {
      setLoading(false)
    }
  }

  async function manejarCrear(fabricaNueva) {
    try {
      setError('')
      await createFabrica(fabricaNueva)
      await cargarFabricas()
    } catch (err) {
      setError(err.message || 'No fue posible crear fabrica.')
    }
  }

  return (
    <section className={pageStyles.page}>
      <FabricaForm onCrear={manejarCrear} />
      {error ? <p className={pageStyles.error}>{error}</p> : null}
      {loading ? <p className={pageStyles.muted}>Cargando fabricas...</p> : <FabricasList fabricas={fabricas} />}
    </section>
  )
}

export default Fabricas
