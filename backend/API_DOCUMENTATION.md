# API REST - Sistema de Inventario y Pedidos

API REST desarrollada con Express y TypeScript siguiendo el patrón MVC (Modelo-Vista-Controlador) para gestión de inventarios y pedidos.

## 🚀 Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar archivo de configuración
cp .env.example .env

# Configurar variables de entorno en .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventario_pedidos
LOCAL_PORT=3000

# Ejecutar la base de datos
# Asegúrate de ejecutar el script database/scheme.sql en tu servidor MySQL

# Iniciar servidor
pnpm start
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración de base de datos
│   ├── models/          # Modelos de datos
│   ├── services/        # Lógica de negocio
│   ├── controllers/     # Controladores de rutas
│   ├── routes/          # Definición de rutas
│   └── utils/           # Utilidades compartidas
├── database/
│   └── scheme.sql       # Esquema de base de datos
└── index.ts             # Punto de entrada de la aplicación
```

## 📋 Endpoints Disponibles

### 1. Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente por ID
- `POST /api/clientes` - Crear un nuevo cliente
- `PUT /api/clientes/:id` - Actualizar un cliente
- `DELETE /api/clientes/:id` - Eliminar un cliente

**Ejemplo de body para crear/actualizar:**
```json
{
  "saldo": 0,
  "limite_credito": 1500000,
  "descuento": 5.5
}
```

### 2. Artículos
- `GET /api/articulos` - Obtener todos los artículos
- `GET /api/articulos/:id` - Obtener un artículo por ID
- `POST /api/articulos` - Crear un nuevo artículo
- `PUT /api/articulos/:id` - Actualizar un artículo
- `DELETE /api/articulos/:id` - Eliminar un artículo

**Ejemplo de body:**
```json
{
  "descripcion": "Laptop Dell XPS 15"
}
```

### 3. Fábricas
- `GET /api/fabricas` - Obtener todas las fábricas
- `GET /api/fabricas/:id` - Obtener una fábrica por ID
- `POST /api/fabricas` - Crear una nueva fábrica
- `PUT /api/fabricas/:id` - Actualizar una fábrica
- `DELETE /api/fabricas/:id` - Eliminar una fábrica

**Ejemplo de body:**
```json
{
  "telefono": "+56912345678"
}
```

### 4. Direcciones
- `GET /api/direcciones` - Obtener todas las direcciones
- `GET /api/direcciones/:id` - Obtener una dirección por ID
- `GET /api/direcciones/cliente/:idCliente` - Obtener direcciones de un cliente
- `POST /api/direcciones` - Crear una nueva dirección
- `PUT /api/direcciones/:id` - Actualizar una dirección
- `DELETE /api/direcciones/:id` - Eliminar una dirección

**Ejemplo de body:**
```json
{
  "id_cliente": 1,
  "numero": "123",
  "calle": "Avenida Libertador",
  "comuna": "Las Condes",
  "ciudad": "Santiago"
}
```

### 5. Artículos por Fábrica
- `GET /api/articulo-fabrica` - Obtener todas las relaciones
- `GET /api/articulo-fabrica/:idArticulo/:idFabrica` - Obtener una relación específica
- `GET /api/articulo-fabrica/articulo/:idArticulo` - Obtener fábricas de un artículo
- `GET /api/articulo-fabrica/fabrica/:idFabrica` - Obtener artículos de una fábrica
- `POST /api/articulo-fabrica` - Crear una nueva relación
- `PUT /api/articulo-fabrica/:idArticulo/:idFabrica` - Actualizar existencias
- `DELETE /api/articulo-fabrica/:idArticulo/:idFabrica` - Eliminar una relación

**Ejemplo de body para crear:**
```json
{
  "id_articulo": 1,
  "id_fabrica": 1,
  "existencias": 100
}
```

**Ejemplo de body para actualizar:**
```json
{
  "existencias": 150
}
```

### 6. Fábricas Alternativas
- `GET /api/articulo-fabrica-alternativa` - Obtener todas las alternativas
- `GET /api/articulo-fabrica-alternativa/:idArticulo/:idFabrica` - Obtener una alternativa específica
- `GET /api/articulo-fabrica-alternativa/articulo/:idArticulo` - Obtener alternativas de un artículo
- `POST /api/articulo-fabrica-alternativa` - Marcar fábrica como alternativa
- `DELETE /api/articulo-fabrica-alternativa/:idArticulo/:idFabrica` - Eliminar alternativa

**Ejemplo de body:**
```json
{
  "id_articulo": 1,
  "id_fabrica": 2
}
```

### 7. Pedidos
- `GET /api/pedidos` - Obtener todos los pedidos
- `GET /api/pedidos/:id` - Obtener un pedido por ID
- `GET /api/pedidos/cliente/:idCliente` - Obtener pedidos de un cliente
- `POST /api/pedidos` - Crear un nuevo pedido
- `PUT /api/pedidos/:id` - Actualizar un pedido
- `DELETE /api/pedidos/:id` - Eliminar un pedido

**Ejemplo de body:**
```json
{
  "id_cliente": 1,
  "id_direccion": 1,
  "fecha_hora": "2026-04-27T20:00:00"
}
```

### 8. Detalle de Pedidos
- `GET /api/detalle-pedido` - Obtener todos los detalles
- `GET /api/detalle-pedido/:id` - Obtener un detalle por ID
- `GET /api/detalle-pedido/pedido/:idPedido` - Obtener detalles de un pedido
- `POST /api/detalle-pedido` - Crear un nuevo detalle
- `PUT /api/detalle-pedido/:id` - Actualizar un detalle
- `DELETE /api/detalle-pedido/:id` - Eliminar un detalle

**Ejemplo de body:**
```json
{
  "id_pedido": 1,
  "id_articulo": 1,
  "cantidad": 5
}
```

## 🔧 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express 5** - Framework web
- **TypeScript** - Tipado estático
- **MySQL2** - Cliente de base de datos
- **pnpm** - Gestor de paquetes

## 📝 Validaciones Implementadas

### Clientes
- Límite de crédito máximo: $3,000,000
- Saldo no puede ser negativo
- Descuento entre 0 y 100%

### Artículos y Fábricas
- Descripción/teléfono no puede estar vacío

### Existencias
- No pueden ser negativas

### Pedidos
- Cantidad debe ser mayor a 0
- Cliente y dirección son requeridos
- La dirección debe pertenecer al cliente del pedido

## 🎯 Estado HTTP de las Respuestas

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## 🔐 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventario_pedidos
LOCAL_PORT=3000
```

## 📄 Licencia

Este proyecto es privado.
