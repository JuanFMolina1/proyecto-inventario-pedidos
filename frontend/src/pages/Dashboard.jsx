import { useEffect, useState } from 'react'
import styles from '../styles/Dashboard.module.css'
import BurbujaVozIA from '../components/dashboard/BurbujaVozIA'
import OrdersByDayChart from '../components/dashboard/OrdersByDayChart'
import TopProductsChart from '../components/dashboard/TopProductsChart'
import TopClientsChart from '../components/dashboard/TopClientsChart'
import StockByFactoryChart from '../components/dashboard/StockByFactoryChart'

const metricas = [
  { etiqueta: 'Pedidos hoy', valor: '128', variacion: '+18%' },
  { etiqueta: 'Clientes activos', valor: '74', variacion: '+6%' },
  { etiqueta: 'Articulos rotando', valor: '312', variacion: '+12%' },
  { etiqueta: 'Fabricas en linea', valor: '15', variacion: '+2%' },
]

function Dashboard() {
  const [rangoFechas, setRangoFechas] = useState({
    desde: '2026-04-20',
    hasta: '2026-04-28',
  })
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTick((previo) => previo + 1)
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className={styles.dashboard}>
      <div className={styles.hero}>
        <div>
          <p className={styles.badge}>Centro inteligente de operaciones</p>
          <h1>Controla pedidos, inventario y clientes con IA conversacional</h1>
          <p className={styles.subtitle}>
            Visualiza datos clave y ejecuta acciones por voz desde un solo panel.
          </p>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {metricas.map((item) => (
          <article key={item.etiqueta} className={styles.metricCard}>
            <p>{item.etiqueta}</p>
            <strong>{item.valor}</strong>
            <span>{item.variacion} vs. semana anterior</span>
          </article>
        ))}
      </div>

      <div className={styles.toolbar}>
        <label>
          Desde
          <input
            type="date"
            value={rangoFechas.desde}
            onChange={(event) =>
              setRangoFechas((previo) => ({ ...previo, desde: event.target.value }))
            }
          />
        </label>
        <label>
          Hasta
          <input
            type="date"
            value={rangoFechas.hasta}
            onChange={(event) =>
              setRangoFechas((previo) => ({ ...previo, hasta: event.target.value }))
            }
          />
        </label>
      </div>

      <div className={styles.chartsGrid}>
        <OrdersByDayChart rangoFechas={rangoFechas} refreshTick={refreshTick} />
        <TopProductsChart rangoFechas={rangoFechas} refreshTick={refreshTick} />
        <TopClientsChart rangoFechas={rangoFechas} refreshTick={refreshTick} />
        <StockByFactoryChart refreshTick={refreshTick} />
      </div>

      <BurbujaVozIA />
    </section>
  )
}

export default Dashboard
