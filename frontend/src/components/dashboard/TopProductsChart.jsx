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
import { getArticulos, getPedidos } from '../../services/api'
import {
  filtrarPedidosPorRango,
  sumarCantidadesPorArticulo,
} from './chartTransforms'
import styles from '../../styles/Dashboard.module.css'

function TopProductsChart({ rangoFechas, refreshTick }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        setLoading(true)
        setError('')
        const [pedidos, articulos] = await Promise.all([getPedidos(), getArticulos()])
        const filtrados = filtrarPedidosPorRango(pedidos, rangoFechas)
        const transformada = sumarCantidadesPorArticulo(filtrados, articulos)
        if (activo) setData(transformada)
      } catch (err) {
        if (activo) setError(err.message || 'Error cargando productos mas vendidos.')
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
      <h3>Productos mas vendidos</h3>
      {loading ? <p className={styles.chartState}>Cargando...</p> : null}
      {error ? <p className={styles.chartError}>{error}</p> : null}
      {!loading && !error && data.length === 0 ? <p className={styles.chartState}>No hay datos para este rango.</p> : null}
      {!loading && !error && data.length > 0 ? (
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7ecf8" />
              <XAxis dataKey="nombre" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#00b4d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </article>
  )
}

export default TopProductsChart
