import styles from '../../styles/Table.module.css'

function FabricasList({ fabricas }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Numero</th>
            <th>Telefono</th>
          </tr>
        </thead>
        <tbody>
          {fabricas.map((fabrica) => (
            <tr key={fabrica.id}>
              <td>{fabrica.nombre}</td>
              <td>{fabrica.numero}</td>
              <td>{fabrica.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FabricasList
