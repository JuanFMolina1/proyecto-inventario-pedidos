import { useState } from 'react'
import styles from '../../styles/Form.module.css'

function ArticuloForm({ onCrear, fabricas, creando }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [idFabrica, setIdFabrica] = useState('')
  const [existencias, setExistencias] = useState('')
  const [precio, setPrecio] = useState('')
  const [error, setError] = useState('')

  async function manejarSubmit(evento) {
    evento.preventDefault()
    setError('')

    if (!idFabrica) {
      setError('Selecciona una fábrica para relacionar el artículo.')
      return
    }

    if (Number(existencias) < 0) {
      setError('El stock no puede ser negativo.')
      return
    }

    if (Number(precio) < 0) {
      setError('El precio no puede ser negativo.')
      return
    }

    await onCrear({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      id_fabrica: Number(idFabrica),
      existencias: Number(existencias),
      precio: Number(precio),
    })
    setNombre('')
    setDescripcion('')
    setIdFabrica('')
    setExistencias('')
    setPrecio('')
  }

  return (
    <form className={styles.card} onSubmit={manejarSubmit}>
      <h3>Crear Articulo</h3>
      <div className={styles.grid2}>
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label>
          Descripcion
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </label>
        <label>
          Fabrica
          <select
            value={idFabrica}
            onChange={(e) => setIdFabrica(e.target.value)}
            required
            disabled={fabricas.length === 0}
          >
            <option value="">Selecciona fabrica</option>
            {fabricas.map((fabrica) => (
              <option key={fabrica.id} value={fabrica.id}>
                {fabrica.id} - {fabrica.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Stock inicial
          <input
            type="number"
            min="0"
            value={existencias}
            onChange={(e) => setExistencias(e.target.value)}
            required
          />
        </label>
        <label>
          Precio
          <input
            type="number"
            min="0"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </label>
      </div>
      {fabricas.length === 0 ? <p className={styles.error}>Debes registrar al menos una fábrica antes de crear artículos.</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.primaryBtn} type="submit" disabled={creando || fabricas.length === 0}>
        {creando ? 'Guardando...' : 'Guardar Articulo'}
      </button>
    </form>
  )
}

export default ArticuloForm
