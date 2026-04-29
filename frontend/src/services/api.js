import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback
}

function mapCliente(cliente) {
  return {
    id: Number(cliente.id_cliente),
    numeroCliente: String(cliente.id_cliente),
    nombre: `Cliente ${cliente.id_cliente}`,
    saldo: Number(cliente.saldo),
    limiteCredito: Number(cliente.limite_credito),
    descuento: Number(cliente.descuento),
  }
}

function mapArticulo(articulo) {
  return {
    id: Number(articulo.id_articulo),
    nombre: articulo.descripcion,
    descripcion: articulo.descripcion,
  }
}

function mapFabrica(fabrica, stockPorFabrica) {
  return {
    id: Number(fabrica.id_fabrica),
    numero: String(fabrica.id_fabrica),
    telefono: fabrica.telefono,
    stock: Number(stockPorFabrica[fabrica.id_fabrica] || 0),
  }
}

export async function getClientes() {
  try {
    const { data } = await api.get('/clientes')
    return data.map(mapCliente)
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar clientes.'))
  }
}

export async function createCliente(clienteNuevo) {
  try {
    const payload = {
      saldo: Number(clienteNuevo.saldo),
      limite_credito: Number(clienteNuevo.limiteCredito),
      descuento: Number(clienteNuevo.descuento),
    }
    console.log('[API] createCliente payload:', payload)
    const { data } = await api.post('/clientes', payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible crear el cliente.'))
  }
}

export async function getArticulos() {
  try {
    const { data } = await api.get('/articulos')
    return data.map(mapArticulo)
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar articulos.'))
  }
}

export async function createArticulo(articuloNuevo) {
  try {
    // El backend solo espera 'descripcion', no 'nombre'
    const descripcion = articuloNuevo.descripcion?.trim() || articuloNuevo.nombre?.trim()
    console.log('[API] createArticulo payload:', { descripcion })
    const { data } = await api.post('/articulos', { descripcion })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible crear articulo.'))
  }
}

export async function getFabricas() {
  try {
    const [fabricasResp, articuloFabricaResp] = await Promise.all([
      api.get('/fabricas'),
      api.get('/articulo-fabrica'),
    ])

    const stockPorFabrica = articuloFabricaResp.data.reduce((acc, item) => {
      acc[item.id_fabrica] = (acc[item.id_fabrica] || 0) + Number(item.existencias || 0)
      return acc
    }, {})

    return fabricasResp.data.map((fabrica) => mapFabrica(fabrica, stockPorFabrica))
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar fabricas.'))
  }
}

export async function createFabrica(fabricaNueva) {
  try {
    const { data } = await api.post('/fabricas', { telefono: fabricaNueva.telefono })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible crear fabrica.'))
  }
}

export async function getDireccionesPorCliente(clienteId) {
  try {
    const { data } = await api.get(`/direcciones/cliente/${clienteId}`)
    return data.map((direccion) => ({
      id: Number(direccion.id_direccion),
      texto: `${direccion.calle} ${direccion.numero}, ${direccion.comuna} - ${direccion.ciudad}`,
    }))
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar direcciones.'))
  }
}

export async function getDirecciones() {
  try {
    const { data } = await api.get('/direcciones')
    return data.map((direccion) => ({
      id: Number(direccion.id_direccion),
      id_cliente: Number(direccion.id_cliente),
      numero: direccion.numero,
      calle: direccion.calle,
      comuna: direccion.comuna,
      ciudad: direccion.ciudad,
    }))
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar las direcciones.'))
  }
}

export async function createDireccion(direccionNueva) {
  try {
    const payload = {
      id_cliente: Number(direccionNueva.id_cliente),
      numero: direccionNueva.numero,
      calle: direccionNueva.calle,
      comuna: direccionNueva.comuna,
      ciudad: direccionNueva.ciudad,
    }
    console.log('[API] createDireccion payload:', payload)
    const { data } = await api.post('/direcciones', payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible crear la dirección.'))
  }
}

export async function deleteDireccion(id) {
  try {
    const { data } = await api.delete(`/direcciones/${id}`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible eliminar la dirección.'))
  }
}

export async function getPedidos() {
  try {
    const [pedidosResp, detallesResp] = await Promise.all([
      api.get('/pedidos'),
      api.get('/detalle-pedido'),
    ])

    const detallesPorPedido = detallesResp.data.reduce((acc, detalle) => {
      const key = Number(detalle.id_pedido)
      if (!acc[key]) acc[key] = []
      acc[key].push({
        articuloId: Number(detalle.id_articulo),
        cantidad: Number(detalle.cantidad),
      })
      return acc
    }, {})

    return pedidosResp.data.map((pedido) => ({
      id: Number(pedido.id_pedido),
      clienteId: Number(pedido.id_cliente),
      direccionId: Number(pedido.id_direccion),
      fecha: new Date(pedido.fecha_hora).toISOString().slice(0, 10),
      detalles: detallesPorPedido[Number(pedido.id_pedido)] || [],
    }))
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible cargar pedidos.'))
  }
}

export async function createPedido(pedidoNuevo) {
  try {
    const pedidoPayload = {
      id_cliente: Number(pedidoNuevo.clienteId),
      id_direccion: Number(pedidoNuevo.direccionId),
      fecha_hora: pedidoNuevo.fecha,
    }
    console.log('[API] createPedido payload:', pedidoPayload)

    const pedidoResp = await api.post('/pedidos', pedidoPayload)
    const idPedido = Number(pedidoResp.data.id)

    console.log('[API] Creating detalles for pedido:', idPedido)
    const detalles = pedidoNuevo.items.map((item) =>
      api.post('/detalle-pedido', {
        id_pedido: idPedido,
        id_articulo: Number(item.id),
        cantidad: Number(item.cantidad),
      }),
    )
    await Promise.all(detalles)

    return { id: idPedido }
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible crear el pedido.'))
  }
}
