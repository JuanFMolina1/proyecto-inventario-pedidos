import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getPedidos } from '../../services/api'
import {
  agruparPedidosPorDia,
  filtrarPedidosPorRango,
} from './chartTransforms'
import styles from '../../styles/Dashboard.module.css'

function OrdersByDayChart({ rangoFechas, refreshTick }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        setLoading(true)
        setError('')
        const pedidos = await getPedidos()
        const filtrados = filtrarPedidosPorRango(pedidos, rangoFechas)
        const transformada = agruparPedidosPorDia(filtrados)
        if (activo) setData(transformada)
      } catch (err) {
        if (activo) setError(err.message || 'Error cargando pedidos por dia.')
      } finally {
        if (activo) setLoading(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [rangoFechas.desde, rangoFechas.hasta, refreshTick])

  return (
    <article className={styles.chartCard}>
      <h3>Pedidos por dia</h3>
      {loading ? <p className={styles.chartState}>Cargando...</p> : null}
      {error ? <p className={styles.chartError}>{error}</p> : null}
      {!loading && !error && data.length === 0 ? <p className={styles.chartState}>No hay datos para este rango.</p> : null}
      {!loading && !error && data.length > 0 ? (
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7ecf8" />
              <XAxis dataKey="fecha" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4d74ff" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </article>
  )
}

export default OrdersByDayChart
