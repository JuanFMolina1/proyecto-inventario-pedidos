import { useEffect, useState } from 'react'
import styles from '../styles/Dashboard.module.css'
import BurbujaVozIA from '../components/dashboard/BurbujaVozIA'
import OrdersByDayChart from '../components/dashboard/OrdersByDayChart'
import TopProductsChart from '../components/dashboard/TopProductsChart'
import TopClientsChart from '../components/dashboard/TopClientsChart'
import { getPedidos } from '../services/api'

const metricas = [
  { etiqueta: 'Pedidos hoy', valor: '128', variacion: '+18%' },
  { etiqueta: 'Clientes activos', valor: '74', variacion: '+6%' },
  { etiqueta: 'Articulos rotando', valor: '312', variacion: '+12%' },
  { etiqueta: 'Fabricas en linea', valor: '15', variacion: '+2%' },
]

const PEDIDOS_POR_PAGINA = 10

function Dashboard() {
  const [rangoFechas, setRangoFechas] = useState({
    desde: '2026-04-20',
    hasta: '2026-04-28',
  })
  const [refreshTick, setRefreshTick] = useState(0)
  const [pedidos, setPedidos] = useState([])
  const [loadingPedidos, setLoadingPedidos] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTick((previo) => previo + 1)
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    cargarPedidos()
  }, [refreshTick])

  async function cargarPedidos() {
    try {
      setLoadingPedidos(true)
      const data = await getPedidos()
      setPedidos(data)
    } catch (err) {
      console.error('Error cargando pedidos:', err)
    } finally {
      setLoadingPedidos(false)
    }
  }

  const totalPaginas = Math.ceil(pedidos.length / PEDIDOS_POR_PAGINA)
  const pedidosPaginados = pedidos.slice(
    (paginaActual - 1) * PEDIDOS_POR_PAGINA,
    paginaActual * PEDIDOS_POR_PAGINA
  )

  function cambiarPagina(nuevaPagina) {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina)
    }
  }

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
      </div>

      {/* Listado de Pedidos Paginado */}
      <div className={styles.card}>
        <h3>Listado de Pedidos</h3>
        {loadingPedidos ? (
          <p className={styles.muted}>Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p className={styles.muted}>No hay pedidos registrados.</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Dirección</th>
                  <th>Fecha</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {pedidosPaginados.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>Cliente {pedido.clienteId}</td>
                    <td>Dirección {pedido.direccionId}</td>
                    <td>{pedido.fecha}</td>
                    <td>{pedido.detalles?.length || 0} items</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Paginación */}
            <div className={styles.pagination}>
              <button 
                onClick={() => cambiarPagina(paginaActual - 1)} 
                disabled={paginaActual === 1}
                className={styles.pageBtn}
              >
                Anterior
              </button>
              <span>Página {paginaActual} de {totalPaginas}</span>
              <button 
                onClick={() => cambiarPagina(paginaActual + 1)} 
                disabled={paginaActual === totalPaginas}
                className={styles.pageBtn}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>

      <BurbujaVozIA />
    </section>
  )
}

export default Dashboard
