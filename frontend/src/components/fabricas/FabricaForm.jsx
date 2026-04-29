import { useState } from 'react'
import styles from '../../styles/Form.module.css'

function FabricaForm({ onCrear }) {
  const [telefono, setTelefono] = useState('')

  async function manejarSubmit(evento) {
    evento.preventDefault()
    // Solo se envía el teléfono, el número se asigna automáticamente
    await onCrear({ telefono: telefono.trim() })
    setTelefono('')
  }

  return (
    <form className={styles.card} onSubmit={manejarSubmit}>
      <h3>Crear Fabrica</h3>
      <div className={styles.grid2}>
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
