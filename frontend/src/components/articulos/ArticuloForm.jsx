import { useState } from 'react'
import styles from '../../styles/Form.module.css'

function ArticuloForm({ onCrear }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')

  async function manejarSubmit(evento) {
    evento.preventDefault()
    await onCrear({ nombre: nombre.trim(), descripcion: descripcion.trim() })
    setNombre('')
    setDescripcion('')
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
      </div>
      <button className={styles.primaryBtn} type="submit">
        Guardar Articulo
      </button>
    </form>
  )
}

export default ArticuloForm
