import { useEffect, useState } from 'react'
import styles from '../styles/Dashboard.module.css'
import BurbujaVozIA from '../components/dashboard/BurbujaVozIA'
import OrdersByDayChart from '../components/dashboard/OrdersByDayChart'
import TopProductsChart from '../components/dashboard/TopProductsChart'
import TopClientsChart from '../components/dashboard/TopClientsChart'
import { getArticulos, getFabricas, getPedidos } from '../services/api'

const PEDIDOS_POR_PAGINA = 10

function formatearFechaInput(fecha) {
  const offset = fecha.getTimezoneOffset() * 60000
  return new Date(fecha.getTime() - offset).toISOString().slice(0, 10)
}

function obtenerRangoPorDefecto() {
  const hoy = new Date()
  const hace30Dias = new Date()
  hace30Dias.setDate(hoy.getDate() - 29)

  return {
    desde: formatearFechaInput(hace30Dias),
    hasta: formatearFechaInput(hoy),
  }
}

function Dashboard() {
  const [rangoFechas, setRangoFechas] = useState(() => obtenerRangoPorDefecto())
  const [refreshTick, setRefreshTick] = useState(0)
  const [pedidos, setPedidos] = useState([])
  const [loadingPedidos, setLoadingPedidos] = useState(true)
  const [loadingResumen, setLoadingResumen] = useState(true)
  const [resumen, setResumen] = useState([
    { etiqueta: 'Pedidos en rango', valor: '0', detalle: 'Cargando datos...' },
    { etiqueta: 'Clientes activos', valor: '0', detalle: 'Cargando datos...' },
    { etiqueta: 'Articulos vendidos', valor: '0', detalle: 'Cargando datos...' },
    { etiqueta: 'Fabricas con stock', valor: '0', detalle: 'Cargando datos...' },
  ])
  const [paginaActual, setPaginaActual] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTick((previo) => previo + 1)
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        setLoadingPedidos(true)
        const data = await getPedidos()
        if (activo) setPedidos(data)
      } catch (err) {
        console.error('Error cargando pedidos:', err)
      } finally {
        if (activo) setLoadingPedidos(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [refreshTick])

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        setLoadingResumen(true)
        const [pedidosData, fabricasData, articulosData] = await Promise.all([
          getPedidos(),
          getFabricas(),
          getArticulos(),
        ])

        const pedidosEnRango = pedidosData.filter((pedido) => {
          const fecha = new Date(pedido.fecha)
          const desde = rangoFechas.desde ? new Date(rangoFechas.desde) : null
          const hasta = rangoFechas.hasta ? new Date(rangoFechas.hasta) : null
          if (desde && fecha < desde) return false
          if (hasta && fecha > hasta) return false
          return true
        })

        const clientesActivos = new Set(pedidosEnRango.map((pedido) => pedido.clienteId)).size
        const articulosVendidos = pedidosEnRango.reduce(
          (total, pedido) =>
            total +
            (pedido.detalles ?? []).reduce(
              (subtotal, detalle) => subtotal + Number(detalle.cantidad || 0),
              0,
            ),
          0,
        )
        const fabricasConStock = fabricasData.filter((fabrica) => Number(fabrica.stock || 0) > 0).length

        if (!activo) return

        setResumen([
          {
            etiqueta: 'Pedidos en rango',
            valor: String(pedidosEnRango.length),
            detalle: `Rango ${rangoFechas.desde} a ${rangoFechas.hasta}`,
          },
          {
            etiqueta: 'Clientes activos',
            valor: String(clientesActivos),
            detalle: `${clientesActivos} clientes con pedidos reales`,
          },
          {
            etiqueta: 'Articulos vendidos',
            valor: String(articulosVendidos),
            detalle: `${articulosData.length} articulos disponibles`,
          },
          {
            etiqueta: 'Fabricas con stock',
            valor: String(fabricasConStock),
            detalle: `${fabricasData.length} fabricas registradas`,
          },
        ])
      } catch (err) {
        console.error('Error cargando resumen del dashboard:', err)
      } finally {
        if (activo) setLoadingResumen(false)
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [rangoFechas.desde, rangoFechas.hasta, refreshTick])

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
        {resumen.map((item) => (
          <article key={item.etiqueta} className={styles.metricCard}>
            <p>{item.etiqueta}</p>
            <strong>{loadingResumen ? '...' : item.valor}</strong>
            <span>{item.detalle}</span>
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
                    <td>
                      {pedido.detalles?.length ? (
                        <ul className={styles.orderItems}>
                          {pedido.detalles.map((item) => (
                            <li key={`${pedido.id}-${item.articuloId}`}>
                              {item.articuloNombre} x{item.cantidad}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className={styles.muted}>Sin items</span>
                      )}
                    </td>
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
