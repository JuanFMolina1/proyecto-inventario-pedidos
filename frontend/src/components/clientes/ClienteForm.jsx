import { useState } from 'react'
import styles from '../../styles/Form.module.css'

const estadoInicial = {
  nombre: '',
  saldo: '',
  limiteCredito: '',
  descuento: '',
}

function ClienteForm({ onCrear, creando }) {
  const [formulario, setFormulario] = useState(estadoInicial)
  const [error, setError] = useState('')

  function actualizarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((previo) => ({ ...previo, [name]: value }))
  }

  async function manejarSubmit(evento) {
    evento.preventDefault()
    setError('')

    if (Number(formulario.limiteCredito) > 3000000) {
      setError('El limite de credito debe ser menor o igual a 3000000.')
      return
    }

    await onCrear({
      nombre: formulario.nombre.trim(),
      saldo: Number(formulario.saldo),
      limiteCredito: Number(formulario.limiteCredito),
      descuento: Number(formulario.descuento),
    })

    setFormulario(estadoInicial)
  }

  return (
    <form className={styles.card} onSubmit={manejarSubmit}>
      <h3>Crear Cliente</h3>
      <div className={styles.grid2}>
        <label>
          Nombre
          <input name="nombre" type="text" value={formulario.nombre} onChange={actualizarCampo} required />
        </label>
        <label>
          Saldo
          <input name="saldo" type="number" value={formulario.saldo} onChange={actualizarCampo} required />
        </label>
        <label>
          Limite de credito
          <input
            name="limiteCredito"
            type="number"
            value={formulario.limiteCredito}
            onChange={actualizarCampo}
            required
          />
        </label>
        <label>
          Descuento (%)
          <input name="descuento" type="number" value={formulario.descuento} onChange={actualizarCampo} required />
        </label>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button type="submit" className={styles.primaryBtn} disabled={creando}>
        {creando ? 'Guardando...' : 'Crear Cliente'}
      </button>
    </form>
  )
}

export default ClienteForm
