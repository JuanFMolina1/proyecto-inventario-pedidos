import express from 'express';
import { createServer } from 'http';
import 'dotenv/config';
import clienteRoutes from './src/routes/cliente.routes';
import articuloRoutes from './src/routes/articulo.routes';
import fabricaRoutes from './src/routes/fabrica.routes';
import direccionRoutes from './src/routes/direccion.routes';
import articuloFabricaRoutes from './src/routes/articulo-fabrica.routes';
import articuloFabricaAlternativaRoutes from './src/routes/articulo-fabrica-alternativa.routes';
import pedidoRoutes from './src/routes/pedido.routes';
import detallePedidoRoutes from './src/routes/detalle-pedido.routes';
import aiRoutes from './src/routes/ai.routes';

const app = express();
const server = createServer(app);

const { LOCAL_PORT } = process.env;

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Inventario y Pedidos',
    version: '1.0.0',
    endpoints: {
      clientes: '/api/clientes',
      articulos: '/api/articulos',
      fabricas: '/api/fabricas',
      direcciones: '/api/direcciones',
      articuloFabrica: '/api/articulo-fabrica',
      articuloFabricaAlternativa: '/api/articulo-fabrica-alternativa',
      pedidos: '/api/pedidos',
      detallePedido: '/api/detalle-pedido',
      ai: '/api/ai'
    }
  });
});

// Rutas de las APIs
app.use('/api/clientes', clienteRoutes);
app.use('/api/articulos', articuloRoutes);
app.use('/api/fabricas', fabricaRoutes);
app.use('/api/direcciones', direccionRoutes);
app.use('/api/articulo-fabrica', articuloFabricaRoutes);
app.use('/api/articulo-fabrica-alternativa', articuloFabricaAlternativaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalle-pedido', detallePedidoRoutes);
app.use('/api/ai', aiRoutes);

server.listen(LOCAL_PORT, () => {
  console.log(`Server is running on port http://localhost:${LOCAL_PORT}`);
});