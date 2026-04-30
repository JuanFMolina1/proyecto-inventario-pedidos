# API REST - Sistema de Inventario y Pedidos

API REST desarrollada con Express y TypeScript siguiendo el patrón MVC (Modelo-Vista-Controlador) para gestión de inventarios y pedidos. Incluye capacidades de consulta inteligente mediante IA con OpenAI para obtener información de la base de datos usando lenguaje natural.

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
OPENAI_API_KEY=sk-tu-api-key-aqui  # Opcional: para usar el servicio de IA

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
│   │   ├── ai.service.ts           # 🤖 Servicio de IA con OpenAI
│   │   └── ...
│   ├── controllers/     # Controladores de rutas
│   │   ├── ai.controller.ts        # 🤖 Controlador de IA
│   │   └── ...
│   ├── routes/          # Definición de rutas
│   │   ├── ai.routes.ts            # 🤖 Rutas de IA
│   │   └── ...
│   └── utils/           # Utilidades compartidas
├── database/
│   └── scheme.sql       # Esquema de base de datos
├── AI_ENDPOINT_DOCUMENTATION.md    # Documentación detallada del endpoint de IA
├── EJEMPLOS_PRUEBA_AI.md           # Ejemplos de uso del endpoint de IA
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
  "nombre": "Cliente Juan Pérez",
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
  "nombre": "Laptop Dell XPS 15",
  "descripcion": "Laptop Dell XPS 15",
  "id_fabrica": 1,
  "existencias": 25,
  "precio": 4250000
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
  "nombre": "Fábrica Centro",
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
  "barrio": "Las Condes",
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
  "existencias": 100,
  "precio": 399990
}
```

**Ejemplo de body para actualizar:**
```json
{
  "existencias": 150,
  "precio": 389990
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
  "fecha_hora": "2026-04-27T20:00:00",
  "items": [
    {
      "id": 1,
      "cantidad": 2
    }
  ]
}
```

Al crear un pedido, el sistema:
- descuenta el stock de los artículos
- actualiza el saldo del cliente
- valida que el saldo del cliente alcance para cubrir el total del pedido

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

### 9. 🤖 Inteligencia Artificial (AI Query Service)

Endpoints para realizar consultas en lenguaje natural sobre la base de datos usando OpenAI con contexto completo del esquema (Model Context Protocol).

#### 9.1. Consultar con IA
- `POST /api/ai/query` - Procesa una consulta en lenguaje natural

**Características:**
- Consultas en español sobre cualquier tabla de la base de datos
- Generación automática de SQL optimizado
- Interpretación inteligente de resultados
- Solo operaciones de lectura (SELECT)
- Contexto completo del esquema de base de datos (MCP)

**Ejemplo de body:**
```json
{
  "query": "¿Cuáles son los 5 clientes con mayor límite de crédito?"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "query": "¿Cuáles son los 5 clientes con mayor límite de crédito?",
  "response": "# Análisis de Clientes con Mayor Límite de Crédito\n\nBasándome en los datos consultados, estos son los 5 clientes con mayor límite de crédito:\n\n1. **Juan Pérez** - Límite: $3,000,000.00\n2. **María García** - Límite: $2,800,000.00\n3. **Carlos López** - Límite: $2,500,000.00\n...",
  "sqlQuery": "SELECT nombre, limite_credito FROM clientes ORDER BY limite_credito DESC LIMIT 5",
  "data": [
    {
      "nombre": "Juan Pérez",
      "limite_credito": 3000000.00
    },
    {
      "nombre": "María García",
      "limite_credito": 2800000.00
    }
  ],
  "timestamp": "2026-04-29T12:00:00.000Z"
}
```

**Ejemplos de consultas válidas:**

**Consultas de datos:**
- "Muéstrame todos los clientes con saldo mayor a 100,000"
- "¿Qué artículos tienen menos de 10 unidades en existencia?"
- "Dame un reporte de los últimos 10 pedidos con información del cliente"
- "¿Cuántas fábricas proveen cada artículo?"

**Inserción de datos:**
- "Agrega un nuevo cliente llamado 'Tech Solutions' con límite de crédito de 1500000"
- "Inserta un artículo llamado 'Mouse Inalámbrico' en la base de datos"

**Actualización de datos:**
- "Actualiza el saldo del cliente con ID 5 a 50000"
- "Incrementa en 10 las existencias del artículo 3 en la fábrica 2"
- "Cambia el teléfono de la fábrica 1 a '+56912345678'"

**Eliminación de datos:**
- "Elimina el pedido con ID 15"
- "Borra la dirección con ID 8"

**Validaciones:**
- `query` es requerido (string)
- Longitud máxima: 2000 caracteres
- Todas las operaciones SQL están permitidas: SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, etc.

**Posibles errores (400):**
```json
{
  "success": false,
  "error": "Se requiere una consulta de texto válida en el campo 'query'"
}
```

```json
{
  "success": false,
  "error": "La consulta es demasiado larga. Máximo 2000 caracteres."
}
```

**Error de ejecución SQL (500):**
```json
{
  "success": false,
  "error": "Error al ejecutar la consulta SQL",
  "response": "Lo siento, ocurrió un error al procesar tu consulta."
}
```

#### 9.2. Estado del Servicio de IA
- `GET /api/ai/health` - Verifica el estado del servicio de IA

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "status": "operational",
  "openai": true,
  "timestamp": "2026-04-29T12:00:00.000Z"
}
```

**Posibles estados:**
- `operational` - Servicio funcionando correctamente
- `degraded` - Servicio con problemas de conectividad
- `error` - Servicio no disponible

#### 9.3. Información del Servicio
- `GET /api/ai/info` - Obtiene información detallada del servicio de IA

**Respuesta (200):**
```json
{
  "success": true,
  "service": "AI Query Service",
  "version": "1.0.0",
  "description": "Servicio de consultas a la base de datos usando OpenAI con contexto del esquema de base de datos (MCP)",
  "endpoints": {
    "query": {
      "method": "POST",
      "path": "/api/ai/query",
      "description": "Envía una consulta en lenguaje natural para obtener información de la base de datos",
      "body": {
        "query": "string (requerido, máx. 2000 caracteres)"
      },
      "example": {
        "query": "¿Cuáles son los 5 clientes con mayor límite de crédito?"
      }
    },
    "health": {
      "method": "GET",
      "path": "/api/ai/health",
      "description": "Verifica el estado del servicio de AI"
    },
    "info": {
      "method": "GET",
      "path": "/api/ai/info",
      "description": "Obtiene información sobre el servicio"
    }
  },
  "features": [
    "Consultas en lenguaje natural",
    "Generación automática de SQL",
    "Interpretación inteligente de resultados",
    "Operaciones completas de base de datos (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP)",
    "Contexto completo del esquema de base de datos"
  ],
  "security": {
    "readOnly": false,
    "allowedOperations": ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP", "TRUNCATE"],
    "note": "El modelo tiene acceso completo a la base de datos. Usar con precaución."
  }
}
```

**Requisitos para usar el servicio de IA:**
- Variable de entorno `OPENAI_API_KEY` configurada
- Conexión activa a la base de datos
- API Key válida de OpenAI

**Notas importantes:**
- Las consultas consumen tokens de tu cuenta de OpenAI
- El modelo utilizado es GPT-4o-mini (balance entre costo y rendimiento)
- La respuesta puede tomar varios segundos según la complejidad
- **⚠️ El modelo tiene acceso completo a la base de datos, incluyendo operaciones de modificación y eliminación**
- Se recomienda tener backups de la base de datos antes de realizar operaciones críticas
- Para más detalles, ver [AI_ENDPOINT_DOCUMENTATION.md](AI_ENDPOINT_DOCUMENTATION.md)

## 🔧 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express 5** - Framework web
- **TypeScript** - Tipado estático
- **MySQL2** - Cliente de base de datos
- **OpenAI SDK** - Integración con GPT-4o-mini para consultas en lenguaje natural
- **MCP SDK** - Model Context Protocol para contexto de base de datos
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
# Conexión a la base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventario_pedidos

# Puerto del servidor
LOCAL_PORT=3000

# API Key de OpenAI para el servicio de IA
# Obtén tu API Key en: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-tu-api-key-aqui
```

## � Documentación Adicional

Para información más detallada sobre características específicas:

- **[Documentación del Endpoint de IA](AI_ENDPOINT_DOCUMENTATION.md)** - Guía completa sobre el servicio de consultas con IA, características avanzadas, arquitectura MCP, troubleshooting y recursos adicionales.
- **[Ejemplos de Prueba con IA](EJEMPLOS_PRUEBA_AI.md)** - Ejemplos prácticos con cURL, PowerShell y scripts para probar el endpoint de IA con múltiples casos de uso.

## �📄 Licencia

Este proyecto es privado.
