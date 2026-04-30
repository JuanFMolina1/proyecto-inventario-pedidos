-- ==========================================================
-- MODELO RELACIONAL EN 3FN
-- ==========================================================
-- 1) Cada tabla representa una entidad o relación específica.
-- 2) No hay grupos repetitivos ni atributos multivaluados.
-- 3) No hay dependencias parciales ni transitivas en atributos no clave.
-- ==========================================================
-- ==========================================================
-- TABLAS MAESTRAS (SIN CLAVES FORÁNEAS)
-- ==========================================================
CREATE TABLE clientes (
    id_cliente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del cliente',
    nombre VARCHAR(255) NOT NULL COMMENT 'Nombre del cliente',
    saldo DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Saldo actual del cliente',
    limite_credito DECIMAL(15, 2) NOT NULL COMMENT 'Límite de crédito autorizado',
    descuento DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT 'Porcentaje de descuento del cliente',
    CONSTRAINT chk_clientes_limite_credito CHECK (limite_credito <= 3000000.00),
    CONSTRAINT chk_clientes_saldo CHECK (saldo >= 0.00),
    CONSTRAINT chk_clientes_descuento CHECK (
        descuento >= 0.00
        AND descuento <= 100.00
    )
) ENGINE = InnoDB COMMENT = 'Tabla de clientes con condiciones comerciales y crédito';

CREATE TABLE articulos (
    id_articulo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del artículo',
    nombre VARCHAR(255) NOT NULL COMMENT 'Nombre del artículo',
    descripcion VARCHAR(255) NOT NULL COMMENT 'Descripción del artículo'
) ENGINE = InnoDB COMMENT = 'Catálogo de artículos comercializados';

CREATE TABLE fabricas (
    id_fabrica INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la fábrica',
    nombre VARCHAR(255) NOT NULL COMMENT 'Nombre de la fábrica',
    telefono VARCHAR(20) NOT NULL COMMENT 'Teléfono de contacto de la fábrica'
) ENGINE = InnoDB COMMENT = 'Fábricas proveedoras de artículos';

-- ==========================================================
-- TABLAS DEPENDIENTES
-- ==========================================================
CREATE TABLE direcciones (
    id_direccion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la dirección',
    id_cliente INT UNSIGNED NOT NULL COMMENT 'Cliente propietario de la dirección',
    numero VARCHAR(20) NOT NULL COMMENT 'Número de la dirección',
    calle VARCHAR(120) NOT NULL COMMENT 'Calle de la dirección',
    barrio VARCHAR(120) NOT NULL COMMENT 'Barrio de la dirección',
    ciudad VARCHAR(120) NOT NULL COMMENT 'Ciudad de la dirección',
    CONSTRAINT fk_direcciones_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE,
    -- Permite asegurar que el par (id_direccion, id_cliente) sea referenciable
    CONSTRAINT uq_direcciones_id_cliente UNIQUE (id_direccion, id_cliente),
    INDEX idx_direcciones_cliente (id_cliente)
) ENGINE = InnoDB COMMENT = 'Direcciones asociadas a clientes (1 cliente : N direcciones)';

CREATE TABLE articulo_fabrica (
    id_articulo INT UNSIGNED NOT NULL COMMENT 'Artículo producido/suministrado',
    id_fabrica INT UNSIGNED NOT NULL COMMENT 'Fábrica que produce/suministra el artículo',
    existencias INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Stock disponible del artículo en la fábrica',
    precio DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'Precio del artículo en la fábrica',
    PRIMARY KEY (id_articulo, id_fabrica),
    CONSTRAINT fk_articulo_fabrica_articulo FOREIGN KEY (id_articulo) REFERENCES articulos(id_articulo) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_articulo_fabrica_fabrica FOREIGN KEY (id_fabrica) REFERENCES fabricas(id_fabrica) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT chk_articulo_fabrica_existencias CHECK (existencias >= 0),
    CONSTRAINT chk_articulo_fabrica_precio CHECK (precio >= 0),
    INDEX idx_articulo_fabrica_fabrica (id_fabrica)
) ENGINE = InnoDB COMMENT = 'Relación N:M entre artículos y fábricas, con stock por fábrica';

CREATE TABLE articulo_fabrica_alternativa (
    id_articulo INT UNSIGNED NOT NULL COMMENT 'Artículo con fábrica alternativa',
    id_fabrica INT UNSIGNED NOT NULL COMMENT 'Fábrica marcada como alternativa para el artículo',
    PRIMARY KEY (id_articulo, id_fabrica),
    CONSTRAINT fk_alt_articulo_fabrica FOREIGN KEY (id_articulo, id_fabrica) REFERENCES articulo_fabrica(id_articulo, id_fabrica) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB COMMENT = 'Subconjunto de fábricas alternativas por artículo';

CREATE TABLE pedidos (
    id_pedido INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del pedido',
    id_cliente INT UNSIGNED NOT NULL COMMENT 'Cliente que realiza el pedido',
    id_direccion INT UNSIGNED NOT NULL COMMENT 'Dirección de despacho del pedido',
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del pedido',
    CONSTRAINT fk_pedidos_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    -- Asegura que la dirección pertenezca al mismo cliente del pedido
    CONSTRAINT fk_pedidos_direccion_cliente FOREIGN KEY (id_direccion, id_cliente) REFERENCES direcciones(id_direccion, id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_pedidos_cliente (id_cliente),
    INDEX idx_pedidos_direccion (id_direccion)
) ENGINE = InnoDB COMMENT = 'Cabecera de pedidos con cliente, dirección y fecha/hora';

CREATE TABLE detalle_pedido (
    id_detalle INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del detalle',
    id_pedido INT UNSIGNED NOT NULL COMMENT 'Pedido al que pertenece el ítem',
    id_articulo INT UNSIGNED NOT NULL COMMENT 'Artículo solicitado',
    cantidad INT UNSIGNED NOT NULL COMMENT 'Cantidad solicitada del artículo',
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detalle_articulo FOREIGN KEY (id_articulo) REFERENCES articulos(id_articulo) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
    CONSTRAINT uq_detalle_pedido_articulo UNIQUE (id_pedido, id_articulo),
    INDEX idx_detalle_articulo (id_articulo)
) ENGINE = InnoDB COMMENT = 'Líneas de detalle por pedido (artículo y cantidad)';
