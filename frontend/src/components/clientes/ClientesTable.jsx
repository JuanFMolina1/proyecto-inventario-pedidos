import styles from '../../styles/Table.module.css'

function ClientesTable({ clientes }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Numero de cliente</th>
            <th>Saldo</th>
            <th>Limite de credito</th>
            <th>Descuento</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.numeroCliente}</td>
              <td>${cliente.saldo.toLocaleString('es-CO')}</td>
              <td>${cliente.limiteCredito.toLocaleString('es-CO')}</td>
              <td>{cliente.descuento}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClientesTable
