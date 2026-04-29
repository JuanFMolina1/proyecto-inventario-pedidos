import { useState } from 'react'
import styles from '../../styles/Form.module.css'

function FabricaForm({ onCrear }) {
  const [numero, setNumero] = useState('')
  const [telefono, setTelefono] = useState('')

  async function manejarSubmit(evento) {
    evento.preventDefault()
    await onCrear({ numero: numero.trim(), telefono: telefono.trim() })
    setNumero('')
    setTelefono('')
  }

  return (
    <form className={styles.card} onSubmit={manejarSubmit}>
      <h3>Crear Fabrica</h3>
      <div className={styles.grid2}>
        <label>
          Numero
          <input value={numero} onChange={(e) => setNumero(e.target.value)} required />
        </label>
        <label>
          Telefono
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </label>
      </div>
      <button className={styles.primaryBtn} type="submit">
        Guardar Fabrica
      </button>
    </form>
  )
}

export default FabricaForm
