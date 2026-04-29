import { useEffect, useMemo, useState } from 'react'
import CarritoPedido from '../components/pedidos/CarritoPedido'
import {
  createPedido,
  getArticulos,
  getClientes,
  getDireccionesPorCliente,
} from '../services/api'
import pageStyles from '../styles/Page.module.css'
import formStyles from '../styles/Form.module.css'

function Pedidos() {
  const [clientes, setClientes] = useState([])
  const [articulos, setArticulos] = useState([])
  const [direcciones, setDirecciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const [clienteId, setClienteId] = useState('')
  const [direccionId, setDireccionId] = useState('')
  const [articuloId, setArticuloId] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [items, setItems] = useState([])

  const fechaActual = useMemo(() => new Date().toISOString().slice(0, 10), [])

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    async function cargarDirecciones() {
      if (!clienteId) {
        setDirecciones([])
        setDireccionId('')
        return
      }
      const data = await getDireccionesPorCliente(clienteId)
      setDirecciones(data)
      setDireccionId(data[0]?.id ? String(data[0].id) : '')
    }

    cargarDirecciones()
  }, [clienteId])

  async function cargarDatos() {
    try {
      setLoading(true)
      setError('')
      console.log('[Pedidos] Cargando clientes y artículos...')
      
      const [clientesData, articulosData] = await Promise.all([
        getClientes(),
        getArticulos(),
      ])
      
      console.log('[Pedidos] Datos cargados:', { clientesData, articulosData })
      
      setClientes(clientesData)
      setArticulos(articulosData)
    } catch (err) {
      console.error('[Pedidos] Error cargando datos:', err)
      setError(err.message || 'No fue posible cargar los datos de pedido.')
    } finally {
      setLoading(false)
    }
  }

  function agregarArticulo() {
    console.log('[Pedidos] Intentando agregar artículo:', { articuloId, cantidad, articulos })
    
    // Validar que hay artículos cargados
    if (!articulos || articulos.length === 0) {
      setError('No hay artículos disponibles. Carga los datos primero.')
      return
    }
    
    // Validar que se seleccionó un artículo
    if (!articuloId) {
      setError('Selecciona un artículo de la lista.')
      return
    }
    
    // Validar cantidad
    if (Number(cantidad) <= 0) {
      setError('La cantidad debe ser mayor a cero.')
      return
    }

    // Convertir a número para comparación correcta
    const articuloIdNum = Number(articuloId)
    console.log('[Pedidos] Buscando artículo con id:', articuloIdNum)
    
    const articulo = articulos.find((item) => item.id === articuloIdNum)
    console.log('[Pedidos] Artículo encontrado:', articulo)
    
    if (!articulo) {
      setError('El artículo seleccionado no existe en la lista.')
      return
    }

    setError('')
    setItems((previo) => {
      const existente = previo.find((item) => item.id === articulo.id)
      if (existente) {
        return previo.map((item) =>
          item.id === articulo.id
            ? { ...item, cantidad: item.cantidad + Number(cantidad) }
            : item,
        )
      }
      return [...previo, { id: articulo.id, nombre: articulo.nombre, cantidad: Number(cantidad) }]
    })
    setArticuloId('')
    setCantidad(1)
  }

  function eliminarArticulo(id) {
    setItems((previo) => previo.filter((item) => item.id !== id))
  }

  async function crearPedidoActual() {
    if (!clienteId || !direccionId || items.length === 0) {
      setError('Completa cliente, direccion y al menos un articulo en el carrito.')
      return
    }

    try {
      setError('')
      setMensaje('')
      const nuevoPedido = await createPedido({
        clienteId,
        direccionId,
        fecha: fechaActual,
        items,
      })
      setMensaje(`Pedido ${nuevoPedido.id} creado correctamente.`)
      setItems([])
      setClienteId('')
      setDireccionId('')
    } catch (err) {
      setError(err.message || 'No fue posible crear el pedido.')
    }
  }

  if (loading) {
    return <p className={pageStyles.muted}>Cargando informacion para pedidos...</p>
  }

  return (
    <section className={pageStyles.page}>
      <div className={formStyles.card}>
        <h3>Datos generales del pedido</h3>
        <div className={formStyles.grid3}>
          <label>
            Cliente
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              <option value="">Selecciona cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.numeroCliente} - {cliente.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Direccion
            <select
              value={direccionId}
              onChange={(e) => setDireccionId(e.target.value)}
              disabled={!clienteId}
            >
              <option value="">Selecciona direccion</option>
              {direcciones.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.texto}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha
            <input value={fechaActual} readOnly />
          </label>
        </div>
      </div>

      <div className={formStyles.card}>
        <h3>Carrito de articulos</h3>
        <div className={formStyles.grid3}>
          <label>
            Articulo
            <select value={articuloId} onChange={(e) => setArticuloId(e.target.value)}>
              <option value="">Selecciona articulo</option>
              {articulos.map((articulo) => (
                <option key={articulo.id} value={articulo.id}>
                  {articulo.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Cantidad
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </label>

          <button className={pageStyles.primaryBtn} onClick={agregarArticulo}>
            Agregar
          </button>
        </div>
        <CarritoPedido items={items} onEliminar={eliminarArticulo} />
        <button className={pageStyles.primaryBtn} onClick={crearPedidoActual}>
          Crear Pedido
        </button>
      </div>

      {error ? <p className={pageStyles.error}>{error}</p> : null}
      {mensaje ? <p className={pageStyles.success}>{mensaje}</p> : null}
    </section>
  )
}

export default Pedidos
