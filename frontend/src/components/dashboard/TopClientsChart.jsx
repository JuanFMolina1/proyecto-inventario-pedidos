import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getClientes, getPedidos } from '../../services/api'
import {
  contarPedidosPorCliente,
  filtrarPedidosPorRango,
} from './chartTransforms'
import styles from '../../styles/Dashboard.module.css'

function TopClientsChart({ rangoFechas, refreshTick }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        setLoading(true)
        setError('')
        const [pedidos, clientes] = await Promise.all([getPedidos(), getClientes()])
        const filtrados = filtrarPedidosPorRango(pedidos, rangoFechas)
        const transformada = contarPedidosPorCliente(filtrados, clientes)
        if (activo) setData(transformada)
      } catch (err) {
        if (activo) setError(err.message || 'Error cargando top clientes.')
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
      <h3>Pedidos por cliente (Top 5)</h3>
      {loading ? <p className={styles.chartState}>Cargando...</p> : null}
      {error ? <p className={styles.chartError}>{error}</p> : null}
      {!loading && !error && data.length === 0 ? <p className={styles.chartState}>No hay datos para este rango.</p> : null}
      {!loading && !error && data.length > 0 ? (
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7ecf8" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="cliente" width={120} />
              <Tooltip />
              <Bar dataKey="total" fill="#7b61ff" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </article>
  )
}

export default TopClientsChart
