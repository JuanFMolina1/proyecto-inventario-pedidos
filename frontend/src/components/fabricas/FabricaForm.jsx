import { useState } from 'react'
import styles from '../../styles/Form.module.css'

function FabricaForm({ onCrear }) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')

  async function manejarSubmit(evento) {
    evento.preventDefault()
    await onCrear({ nombre: nombre.trim(), telefono: telefono.trim() })
    setNombre('')
    setTelefono('')
  }

  return (
    <form className={styles.card} onSubmit={manejarSubmit}>
      <h3>Crear Fabrica</h3>
      <div className={styles.grid2}>
        <label>
          Nombre
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Fábrica Norte"
            required
          />
        </label>
        <label>
          Teléfono
          <input 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            placeholder="+57 300 123 4567"
            required 
          />
        </label>
      </div>
      <button className={styles.primaryBtn} type="submit">
        Guardar Fabrica
      </button>
    </form>
  )
}

export default FabricaForm
