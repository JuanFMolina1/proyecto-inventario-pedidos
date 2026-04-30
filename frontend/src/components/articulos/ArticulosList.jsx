import styles from '../../styles/Table.module.css'

function ArticulosList({ articulos }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Fabrica</th>
            <th>Stock</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo) => (
            <tr key={articulo.id}>
              <td>{articulo.nombre}</td>
              <td>{articulo.descripcion}</td>
              <td>{articulo.fabricas || '-'}</td>
              <td>{Number(articulo.stock || 0).toLocaleString('es-CO')}</td>
              <td>{articulo.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ArticulosList
