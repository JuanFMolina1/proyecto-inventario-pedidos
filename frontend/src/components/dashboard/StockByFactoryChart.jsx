import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getFabricas } from '../../services/api'
import { distribuirStockPorFabrica } from './chartTransforms'
import styles from '../../styles/Dashboard.module.css'

const colores = ['#4d74ff', '#00b4d8', '#7b61ff', '#34a853', '#f2994a']

function StockByFactoryChart({ refreshTick }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        setLoading(true)
        setError('')
        const fabricas = await getFabricas()
        const transformada = distribuirStockPorFabrica(fabricas)
        if (activo) setData(transformada)
      } catch (err) {
        if (activo) setError(err.message || 'Error cargando distribucion de stock.')
      } finally {
        if (activo) setLoading(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [refreshTick])

  return (
    <article className={styles.chartCard}>
      <h3>Distribucion de stock por fabrica</h3>
      {loading ? <p className={styles.chartState}>Cargando...</p> : null}
      {error ? <p className={styles.chartError}>{error}</p> : null}
      {!loading && !error && data.length === 0 ? <p className={styles.chartState}>No hay stock disponible.</p> : null}
      {!loading && !error && data.length > 0 ? (
        <div className={styles.chartAreaPie}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="valor"
                nameKey="nombre"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`${entry.nombre}-${index}`} fill={colores[index % colores.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className={styles.legend}>
            {data.map((item, index) => (
              <li key={item.nombre}>
                <span style={{ background: colores[index % colores.length] }} />
                {item.nombre} - {item.porcentaje}%
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  )
}

export default StockByFactoryChart
