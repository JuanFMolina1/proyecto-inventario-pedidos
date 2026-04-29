# proyecto-inventario-pedidos

## Ejecutar en modo productivo local

### Requisitos
- Docker Desktop activo
- Node.js + npm instalados

### 1) Instalar dependencias
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2) Configurar backend
```bash
cp backend/.env.example backend/.env
```

### 3) Levantar todo
```bash
npm run dev:all
```

Esto levanta:
- MySQL en Docker (con esquema inicial)
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173`

### Detener base de datos
```bash
npm run stop:db
```