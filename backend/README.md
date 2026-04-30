# Backend - API de Inventario y Pedidos

API REST completa para gestión de inventario, pedidos, clientes y fábricas con capacidades de consulta de IA usando OpenAI.

## 🚀 Características

- ✅ API RESTful completa para inventario y pedidos
- 🤖 **Endpoint de IA con OpenAI** - Consultas en lenguaje natural a la base de datos
- 🔐 Validaciones y seguridad en consultas
- 📊 Integración con MySQL
- 🏗️ Arquitectura MVC (Model-View-Controller)
- 📝 TypeScript para type-safety

## 📦 Instalación

### Prerequisitos

- Node.js 18+
- pnpm (recomendado) o npm
- MySQL Server
- OpenAI API Key

### Instalar dependencias

```bash
pnpm install
```

## ⚙️ Configuración

1. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Configura las variables de entorno en `.env`:

```env
# Base de datos
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventario_db

# Servidor
LOCAL_PORT=3000

# OpenAI API
OPENAI_API_KEY=sk-tu-api-key-aqui
```

3. Crea la base de datos ejecutando el script SQL:

```bash
mysql -u root -p < database/scheme.sql
```

## 🏃 Ejecución

### Modo desarrollo

```bash
pnpm run dev
```

### Modo producción

```bash
pnpm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Endpoints

### Endpoints Tradicionales

- `GET /` - Información de la API
- `GET|POST|PUT|DELETE /api/clientes` - Gestión de clientes
- `GET|POST|PUT|DELETE /api/articulos` - Gestión de artículos
- `GET|POST|PUT|DELETE /api/fabricas` - Gestión de fábricas
- `GET|POST|PUT|DELETE /api/direcciones` - Gestión de direcciones
- `GET|POST|PUT|DELETE /api/pedidos` - Gestión de pedidos
- `GET|POST|PUT|DELETE /api/detalle-pedido` - Detalles de pedidos
- `GET|POST|PUT|DELETE /api/articulo-fabrica` - Relación artículo-fábrica
- `GET|POST|PUT|DELETE /api/articulo-fabrica-alternativa` - Fábricas alternativas

### 🤖 Endpoints de IA (NUEVO)

- `POST /api/ai/query` - Consulta en lenguaje natural a la base de datos
- `GET /api/ai/health` - Estado del servicio de IA
- `GET /api/ai/info` - Información del servicio de IA

#### Ejemplo de uso del endpoint de IA:

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d '{"query": "¿Cuáles son los 5 clientes con mayor límite de crédito?"}'
```

**Respuesta:**
```json
{
  "success": true,
  "query": "¿Cuáles son los 5 clientes con mayor límite de crédito?",
  "response": "Análisis detallado en lenguaje natural...",
  "sqlQuery": "SELECT nombre, limite_credito FROM clientes ORDER BY limite_credito DESC LIMIT 5",
  "data": [...],
  "timestamp": "2026-04-29T12:00:00.000Z"
}
```

## 📖 Documentación Completa

Para más información sobre el endpoint de IA:
- **[Documentación del Endpoint de IA](AI_ENDPOINT_DOCUMENTATION.md)** - Guía completa
- **[Ejemplos de Prueba](EJEMPLOS_PRUEBA_AI.md)** - Ejemplos de cURL y casos de uso

Para la documentación completa de todos los endpoints:
- **[API Documentation](API_DOCUMENTATION.md)** - Documentación de endpoints tradicionales

## 🏗️ Estructura del Proyecto

```
backend/
├── database/
│   └── scheme.sql              # Esquema de la base de datos
├── src/
│   ├── config/
│   │   └── database.ts         # Configuración de la conexión a MySQL
│   ├── controllers/            # Controladores de las rutas
│   │   ├── ai.controller.ts    # 🤖 Controlador de IA
│   │   ├── cliente.controller.ts
│   │   └── ...
│   ├── models/                 # Modelos de datos
│   ├── routes/                 # Definición de rutas
│   │   ├── ai.routes.ts        # 🤖 Rutas de IA
│   │   ├── cliente.routes.ts
│   │   └── ...
│   ├── services/               # Lógica de negocio
│   │   ├── ai.service.ts       # 🤖 Servicio de IA con OpenAI
│   │   ├── cliente.service.ts
│   │   └── ...
│   └── utils/
│       └── params.ts           # Utilidades
├── index.ts                    # Punto de entrada
├── package.json
└── tsconfig.json
```

## 🔒 Consideraciones del Endpoint de IA

**⚠️ IMPORTANTE: El endpoint tiene acceso completo a la base de datos**

Características:

1. **Operaciones completas**: Permite SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, y todas las operaciones SQL
2. **Límite de caracteres**: Máximo 2000 caracteres por consulta
3. **Validación de entrada**: Type-checking y validación de formato
4. **Conexiones seguras**: Pool de conexiones con límites
5. **Interpretación inteligente**: Respuestas contextualizadas según el tipo de operación

**Recomendaciones de seguridad:**
- Mantener backups regulares de la base de datos
- Usar con precaución en entornos de producción
- Considerar implementar autenticación y autorización
- Revisar logs de operaciones realizadas

## 🛠️ Tecnologías

- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js
- **Base de Datos**: MySQL con mysql2
- **IA**: OpenAI GPT-4o-mini
- **MCP**: Model Context Protocol SDK
- **Variables de entorno**: dotenv

## 📊 Base de Datos

El proyecto incluye un esquema de base de datos en 3FN (Tercera Forma Normal) con las siguientes tablas:

- `clientes` - Información de clientes
- `articulos` - Catálogo de artículos
- `fabricas` - Fábricas proveedoras
- `direcciones` - Direcciones de clientes
- `pedidos` - Cabecera de pedidos
- `detalle_pedido` - Líneas de detalle de pedidos
- `articulo_fabrica` - Relación artículo-fábrica con stock
- `articulo_fabrica_alternativa` - Fábricas alternativas por artículo

## 🧪 Pruebas

Para probar el endpoint de IA, revisa los ejemplos en [EJEMPLOS_PRUEBA_AI.md](EJEMPLOS_PRUEBA_AI.md).

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas

- El proyecto fue inicialmente creado con Bun pero funciona perfectamente con Node.js y pnpm
- El endpoint de IA usa GPT-4o-mini para balance entre costo y rendimiento
- Las consultas de IA pueden tomar varios segundos dependiendo de la complejidad

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Versión**: 1.0.0  
**Última actualización**: Abril 29, 2026
