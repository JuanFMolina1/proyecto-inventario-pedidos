import styles from '../styles/Page.module.css'
import dashboardStyles from '../styles/Dashboard.module.css'
import BurbujaVozIA from '../components/dashboard/BurbujaVozIA'

function InteligenciaArtificial() {
  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Inteligencia Artificial</h2>
          <p>Consulta la base de datos en lenguaje natural y revisa el SQL generado.</p>
        </div>
      </div>

      <div className={dashboardStyles.contentGrid}>
        <BurbujaVozIA />

        <article className={dashboardStyles.activityCard}>
          <h3>Qué puedes hacer</h3>
          <ul>
            <li>Consultar clientes, pedidos, artículos, direcciones y fábricas.</li>
            <li>Obtener SQL generado por el modelo antes de revisarlo.</li>
            <li>Ver el estado del servicio y la configuración activa.</li>
            <li>Revisar datos crudos cuando necesites validar la respuesta.</li>
          </ul>

          <h3 style={{ marginTop: '20px' }}>Ejemplos rápidos</h3>
          <ul>
            <li>“¿Cuáles son los 5 clientes con mayor límite de crédito?”</li>
            <li>“Muéstrame los artículos con menos de 10 unidades.”</li>
            <li>“Dame los últimos 10 pedidos con cliente y fecha.”</li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default InteligenciaArtificial

