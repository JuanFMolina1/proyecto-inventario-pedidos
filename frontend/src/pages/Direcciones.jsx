import { useEffect, useState } from 'react'
import { getDirecciones, createDireccion, deleteDireccion } from '../services/api'
import pageStyles from '../styles/Page.module.css'
import formStyles from '../styles/Form.module.css'
import tableStyles from '../styles/Table.module.css'

function Direcciones() {
  const [direcciones, setDirecciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [creando, setCreando] = useState(false)

  const [formulario, setFormulario] = useState({
    id_cliente: '',
    numero: '',
    calle: '',
    comuna: '',
    ciudad: '',
  })

  useEffect(() => {
    cargarDirecciones()
  }, [])

  async function cargarDirecciones() {
    try {
      setLoading(true)
      setError('')
      const data = await getDirecciones()
      setDirecciones(data)
    } catch (err) {
      setError(err.message || 'No fue posible cargar las direcciones.')
    } finally {
      setLoading(false)
    }
  }

  function actualizarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((previo) => ({ ...previo, [name]: value }))
  }

  async function manejarSubmit(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    if (!formulario.id_cliente || !formulario.numero || !formulario.calle || !formulario.comuna || !formulario.ciudad) {
      setError('Todos los campos son requeridos.')
      return
    }

    try {
      setCreando(true)
      await createDireccion({
        id_cliente: Number(formulario.id_cliente),
        numero: formulario.numero.trim(),
        calle: formulario.calle.trim(),
        comuna: formulario.comuna.trim(),
        ciudad: formulario.ciudad.trim(),
      })
      setMensaje('Dirección creada correctamente.')
      setFormulario({
        id_cliente: '',
        numero: '',
        calle: '',
        comuna: '',
        ciudad: '',
      })
      await cargarDirecciones()
    } catch (err) {
      setError(err.message || 'No fue posible crear la dirección.')
    } finally {
      setCreando(false)
    }
  }

  async function manejarEliminar(id) {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) {
      return
    }

    try {
      setError('')
      await deleteDireccion(id)
      setMensaje('Dirección eliminada correctamente.')
      await cargarDirecciones()
    } catch (err) {
      setError(err.message || 'No fue posible eliminar la dirección.')
    }
  }

  if (loading) {
    return <p className={pageStyles.muted}>Cargando direcciones...</p>
  }

  return (
    <section className={pageStyles.page}>
      <form className={formStyles.card} onSubmit={manejarSubmit}>
        <h3>Crear Dirección</h3>
        <div className={formStyles.grid2}>
          <label>
            ID Cliente
            <input
              name="id_cliente"
              type="number"
              value={formulario.id_cliente}
              onChange={actualizarCampo}
              required
            />
          </label>
          <label>
            Número
            <input
              name="numero"
              type="text"
              value={formulario.numero}
              onChange={actualizarCampo}
              placeholder="123"
              required
            />
          </label>
          <label>
            Calle
            <input
              name="calle"
              type="text"
              value={formulario.calle}
              onChange={actualizarCampo}
              placeholder="Av. Principal"
              required
            />
          </label>
          <label>
            Comuna
            <input
              name="comuna"
              type="text"
              value={formulario.comuna}
              onChange={actualizarCampo}
              placeholder="Santiago"
              required
            />
          </label>
          <label>
            Ciudad
            <input
              name="ciudad"
              type="text"
              value={formulario.ciudad}
              onChange={actualizarCampo}
              placeholder="Santiago"
              required
            />
          </label>
        </div>
        {error ? <p className={formStyles.error}>{error}</p> : null}
        {mensaje ? <p className={pageStyles.success}>{mensaje}</p> : null}
        <button type="submit" className={formStyles.primaryBtn} disabled={creando}>
          {creando ? 'Guardando...' : 'Crear Dirección'}
        </button>
      </form>

      <div className={formStyles.card}>
        <h3>Lista de Direcciones</h3>
        {direcciones.length === 0 ? (
          <p className={pageStyles.muted}>No hay direcciones registradas.</p>
        ) : (
          <div className={tableStyles.wrapper}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Dirección</th>
                  <th>Comuna</th>
                  <th>Ciudad</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {direcciones.map((dir) => (
                  <tr key={dir.id}>
                    <td>{dir.id}</td>
                    <td>{dir.id_cliente}</td>
                    <td>{dir.calle} {dir.numero}</td>
                    <td>{dir.comuna}</td>
                    <td>{dir.ciudad}</td>
                    <td>
                      <button
                        className={formStyles.dangerBtn}
                        onClick={() => manejarEliminar(dir.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Direcciones