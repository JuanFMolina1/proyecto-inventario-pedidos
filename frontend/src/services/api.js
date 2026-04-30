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
    nombre: cliente.nombre ?? `Cliente ${cliente.id_cliente}`,
    saldo: Number(cliente.saldo),
    limiteCredito: Number(cliente.limite_credito),
    descuento: Number(cliente.descuento),
  }
}

function mapArticulo(articulo) {
  return {
    id: Number(articulo.id_articulo),
    nombre: articulo.nombre ?? articulo.descripcion ?? '',
    descripcion: articulo.descripcion ?? '',
    precio: Number(articulo.precio || 0),
    stock: Number(articulo.stock || 0),
    fabricas: articulo.fabricas ?? '',
  }
}

function mapFabrica(fabrica, stockPorFabrica) {
  return {
    id: Number(fabrica.id_fabrica),
    numero: String(fabrica.id_fabrica),
    nombre: fabrica.nombre ?? `Fabrica ${fabrica.id_fabrica}`,
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
      nombre: clienteNuevo.nombre?.trim(),
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
    const payload = {
      nombre: articuloNuevo.nombre?.trim(),
      descripcion: articuloNuevo.descripcion?.trim(),
      id_fabrica: articuloNuevo.id_fabrica ? Number(articuloNuevo.id_fabrica) : undefined,
      existencias: articuloNuevo.existencias !== undefined ? Number(articuloNuevo.existencias) : undefined,
      precio: articuloNuevo.precio !== undefined ? Number(articuloNuevo.precio) : undefined,
    }
    console.log('[API] createArticulo payload:', payload)
    const { data } = await api.post('/articulos', payload)
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
    const { data } = await api.post('/fabricas', {
      nombre: fabricaNueva.nombre?.trim(),
      telefono: fabricaNueva.telefono,
    })
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
      texto: `${direccion.calle} ${direccion.numero}, ${direccion.barrio} - ${direccion.ciudad}`,
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
      barrio: direccion.barrio,
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
      barrio: direccionNueva.barrio,
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

export async function getAiInfo() {
  try {
    const { data } = await api.get('/ai/info')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible obtener la información de la IA.'))
  }
}

export async function getAiHealth() {
  try {
    const { data } = await api.get('/ai/health')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible verificar el estado de la IA.'))
  }
}

export async function queryAi(query) {
  try {
    const { data } = await api.post('/ai/query', { query })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible ejecutar la consulta de IA.'))
  }
}

export async function getPedidos() {
  try {
    const [pedidosResp, detallesResp, articulosResp] = await Promise.all([
      api.get('/pedidos'),
      api.get('/detalle-pedido'),
      api.get('/articulos'),
    ])

    const articulosPorId = articulosResp.data.reduce((acc, articulo) => {
      acc[Number(articulo.id_articulo)] = {
        nombre: articulo.nombre ?? articulo.descripcion ?? '',
        precio: Number(articulo.precio || 0),
      }
      return acc
    }, {})

    const detallesPorPedido = detallesResp.data.reduce((acc, detalle) => {
      const key = Number(detalle.id_pedido)
      if (!acc[key]) acc[key] = []
      const articulo = articulosPorId[Number(detalle.id_articulo)] || {}
      acc[key].push({
        articuloId: Number(detalle.id_articulo),
        articuloNombre: articulo.nombre ?? `Articulo ${detalle.id_articulo}`,
        precioUnitario: Number(articulo.precio || 0),
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
      items: pedidoNuevo.items.map((item) => ({
        id: Number(item.id),
        cantidad: Number(item.cantidad),
      })),
    }
    console.log('[API] createPedido payload:', pedidoPayload)

    const { data } = await api.post('/pedidos', pedidoPayload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'No fue posible crear el pedido.'))
  }
}
