const DEMORA_MS = 350

const clientes = [
  {
    id: 'C001',
    numeroCliente: '1001',
    nombre: 'Comercial Andina',
    saldo: 540000,
    limiteCredito: 1500000,
    descuento: 8,
    direcciones: ['Calle 10 #5-20', 'Bodega Norte - Zona Industrial'],
  },
  {
    id: 'C002',
    numeroCliente: '1002',
    nombre: 'Distribuciones Sol',
    saldo: 220000,
    limiteCredito: 2800000,
    descuento: 5,
    direcciones: ['Av. Siempre Viva 742', 'Sucursal Centro'],
  },
]

const articulos = [
  { id: 'A001', nombre: 'Tornillo 1/4', descripcion: 'Caja x 100 unidades' },
  { id: 'A002', nombre: 'Arandela plana', descripcion: 'Paquete industrial' },
]

const fabricas = [
  { id: 'F001', numero: '300', telefono: '6015551000', stock: 1200 },
  { id: 'F002', numero: '301', telefono: '6015552000', stock: 900 },
  { id: 'F003', numero: '302', telefono: '6015553000', stock: 600 },
]

const pedidos = [
  {
    id: 'P0001',
    clienteId: 'C001',
    fecha: '2026-04-20',
    detalles: [
      { articuloId: 'A001', cantidad: 10 },
      { articuloId: 'A002', cantidad: 8 },
    ],
  },
  {
    id: 'P0002',
    clienteId: 'C002',
    fecha: '2026-04-21',
    detalles: [{ articuloId: 'A001', cantidad: 15 }],
  },
  {
    id: 'P0003',
    clienteId: 'C001',
    fecha: '2026-04-22',
    detalles: [{ articuloId: 'A002', cantidad: 12 }],
  },
  {
    id: 'P0004',
    clienteId: 'C002',
    fecha: '2026-04-23',
    detalles: [
      { articuloId: 'A001', cantidad: 7 },
      { articuloId: 'A002', cantidad: 14 },
    ],
  },
  {
    id: 'P0005',
    clienteId: 'C001',
    fecha: '2026-04-24',
    detalles: [{ articuloId: 'A001', cantidad: 11 }],
  },
]

function simularRespuesta(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), DEMORA_MS)
  })
}

function simularError(mensaje) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(mensaje)), DEMORA_MS)
  })
}

export function getClientes() {
  return simularRespuesta([...clientes])
}

export function createCliente(clienteNuevo) {
  if (Number(clienteNuevo.limiteCredito) > 3000000) {
    return simularError('El limite de credito no puede superar 3000000.')
  }

  const nuevo = {
    id: `C${String(clientes.length + 1).padStart(3, '0')}`,
    ...clienteNuevo,
    saldo: Number(clienteNuevo.saldo),
    limiteCredito: Number(clienteNuevo.limiteCredito),
    descuento: Number(clienteNuevo.descuento),
    direcciones: clienteNuevo.direcciones ?? ['Direccion principal'],
  }

  clientes.push(nuevo)
  return simularRespuesta(nuevo)
}

export function getArticulos() {
  return simularRespuesta([...articulos])
}

export function createArticulo(articuloNuevo) {
  const nuevo = {
    id: `A${String(articulos.length + 1).padStart(3, '0')}`,
    ...articuloNuevo,
  }
  articulos.push(nuevo)
  return simularRespuesta(nuevo)
}

export function getFabricas() {
  return simularRespuesta([...fabricas])
}

export function createFabrica(fabricaNueva) {
  const nueva = {
    id: `F${String(fabricas.length + 1).padStart(3, '0')}`,
    ...fabricaNueva,
  }
  fabricas.push(nueva)
  return simularRespuesta(nueva)
}

export function getDireccionesPorCliente(clienteId) {
  const cliente = clientes.find((item) => item.id === clienteId)
  return simularRespuesta(cliente?.direcciones ?? [])
}

export function getPedidos() {
  return simularRespuesta([...pedidos])
}

export function createPedido(pedidoNuevo) {
  const nuevo = {
    id: `P${String(pedidos.length + 1).padStart(4, '0')}`,
    ...pedidoNuevo,
    detalles:
      pedidoNuevo.detalles ??
      (pedidoNuevo.items ?? []).map((item) => ({
        articuloId: item.id,
        cantidad: Number(item.cantidad),
      })),
  }
  pedidos.push(nuevo)
  return simularRespuesta(nuevo)
}
