import { useEffect, useState } from 'react'
import ClienteForm from '../components/clientes/ClienteForm'
import ClientesTable from '../components/clientes/ClientesTable'
import { createCliente, getClientes } from '../services/api'
import pageStyles from '../styles/Page.module.css'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    cargarClientes()
  }, [])

  async function cargarClientes() {
    try {
      setLoading(true)
      setError('')
      const data = await getClientes()
      setClientes(data)
    } catch (err) {
      setError(err.message || 'No fue posible cargar clientes.')
    } finally {
      setLoading(false)
    }
  }

  async function manejarCrear(clienteNuevo) {
    try {
      setCreando(true)
      setError('')
      await createCliente(clienteNuevo)
      await cargarClientes()
      setMostrarFormulario(false)
    } catch (err) {
      setError(err.message || 'No fue posible crear el cliente.')
    } finally {
      setCreando(false)
    }
  }

  return (
    <section className={pageStyles.page}>
      <div className={pageStyles.pageHeader}>
        <p>Administra la cartera y condiciones comerciales de los clientes.</p>
        <button className={pageStyles.primaryBtn} onClick={() => setMostrarFormulario((v) => !v)}>
          {mostrarFormulario ? 'Cerrar formulario' : 'Crear Cliente'}
        </button>
      </div>

      {error ? <p className={pageStyles.error}>{error}</p> : null}
      {mostrarFormulario ? <ClienteForm onCrear={manejarCrear} creando={creando} /> : null}

      {loading ? (
        <p className={pageStyles.muted}>Cargando clientes...</p>
      ) : (
        <ClientesTable clientes={clientes} />
      )}
    </section>
  )
}

export default Clientes
