import { useMemo, useState } from 'react'
import styles from '../../styles/Dashboard.module.css'

const estadosIA = [
  {
    id: 'escucha',
    titulo: 'Escuchando...',
    detalle: 'Detectando intencion de negocio y palabras clave.',
  },
  {
    id: 'proceso',
    titulo: 'Procesando...',
    detalle: 'Correlacionando pedidos, clientes y fabricas en tiempo real.',
  },
  {
    id: 'respuesta',
    titulo: 'IA respondiendo',
    detalle: 'Sugerencia: prioriza clientes con mayor saldo pendiente hoy.',
  },
]

function BurbujaVozIA() {
  const [indiceEstado, setIndiceEstado] = useState(0)
  const estadoActual = useMemo(() => estadosIA[indiceEstado], [indiceEstado])

  function cambiarEstado() {
    setIndiceEstado((previo) => (previo + 1) % estadosIA.length)
  }

  return (
    <section className={styles.voiceCard}>
      <div className={styles.voiceHeader}>
        <span className={styles.puntoVivo} />
        <p>Asistente IA de voz</p>
      </div>

      <button className={styles.orbeIA} onClick={cambiarEstado} title="Cambiar estado de voz IA">
        <span className={styles.orbeNucleo} />
        <span className={styles.onda1} />
        <span className={styles.onda2} />
      </button>

      <div className={styles.voiceText}>
        <h3>{estadoActual.titulo}</h3>
        <p>{estadoActual.detalle}</p>
      </div>

      <div className={styles.voiceActions}>
        <button className={styles.voiceBtnPrimario}>Iniciar chat por voz</button>
      </div>
    </section>
  )
}

export default BurbujaVozIA
