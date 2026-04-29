export function filtrarPedidosPorRango(pedidos, rango) {
  if (!rango?.desde && !rango?.hasta) return pedidos

  const desde = rango.desde ? new Date(rango.desde) : null
  const hasta = rango.hasta ? new Date(rango.hasta) : null

  return pedidos.filter((pedido) => {
    const fecha = new Date(pedido.fecha)
    if (desde && fecha < desde) return false
    if (hasta && fecha > hasta) return false
    return true
  })
}

export function agruparPedidosPorDia(pedidos) {
  const mapa = pedidos.reduce((acc, pedido) => {
    acc[pedido.fecha] = (acc[pedido.fecha] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(mapa)
    .map(([fecha, total]) => ({ fecha, total }))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
}

export function sumarCantidadesPorArticulo(pedidos, articulos) {
  const mapaArticulos = articulos.reduce((acc, articulo) => {
    acc[articulo.id] = articulo.nombre
    return acc
  }, {})

  const totales = {}
  pedidos.forEach((pedido) => {
    ;(pedido.detalles ?? []).forEach((detalle) => {
      const nombre = mapaArticulos[detalle.articuloId] ?? detalle.articuloId
      totales[nombre] = (totales[nombre] ?? 0) + Number(detalle.cantidad || 0)
    })
  })

  return Object.entries(totales)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
}

export function contarPedidosPorCliente(pedidos, clientes) {
  const mapaClientes = clientes.reduce((acc, cliente) => {
    acc[cliente.id] = cliente.nombre
    return acc
  }, {})

  const conteo = pedidos.reduce((acc, pedido) => {
    const nombreCliente = mapaClientes[pedido.clienteId] ?? pedido.clienteId
    acc[nombreCliente] = (acc[nombreCliente] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(conteo)
    .map(([cliente, total]) => ({ cliente, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
}

export function distribuirStockPorFabrica(fabricas) {
  const totalStock = fabricas.reduce((acc, fabrica) => acc + Number(fabrica.stock || 0), 0)
  if (!totalStock) return []

  return fabricas.map((fabrica) => ({
    nombre: `Fabrica ${fabrica.numero}`,
    valor: Number(fabrica.stock || 0),
    porcentaje: Math.round((Number(fabrica.stock || 0) / totalStock) * 100),
  }))
}
