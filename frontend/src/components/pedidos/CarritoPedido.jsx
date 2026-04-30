import styles from '../../styles/Table.module.css'

function CarritoPedido({ items, onEliminar }) {
  if (!items.length) {
    return <p className={styles.empty}>No hay articulos agregados al pedido.</p>
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Articulo</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>
                {Number(item.precio || 0).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </td>
              <td>{item.cantidad}</td>
              <td>
                {(Number(item.precio || 0) * Number(item.cantidad || 0)).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </td>
              <td>
                <button className={styles.dangerBtn} onClick={() => onEliminar(item.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CarritoPedido
