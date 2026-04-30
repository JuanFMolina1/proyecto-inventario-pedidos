import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from '../../styles/Dashboard.module.css'
import { getAiHealth, getAiInfo, queryAi } from '../../services/api'

const sugerencias = [
  {
    titulo: 'Top clientes',
    consulta: '¿Cuáles son los 5 clientes con mayor límite de crédito?',
  },
  {
    titulo: 'Inventario bajo',
    consulta: '¿Qué artículos tienen menos de 10 unidades en existencia?',
  },
  {
    titulo: 'Pedidos recientes',
    consulta: 'Muéstrame los últimos 10 pedidos realizados con información del cliente.',
  },
]

function getStatusLabel(health) {
  if (!health) return 'Cargando'
  if (health.status === 'operational') return 'Operativo'
  if (health.status === 'degraded') return 'Degradado'
  return 'Sin estado'
}

function BurbujaVozIA() {
  const [consulta, setConsulta] = useState(sugerencias[0].consulta)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [respuesta, setRespuesta] = useState('')
  const [sqlQuery, setSqlQuery] = useState('')
  const [resultado, setResultado] = useState(null)
  const [queryType, setQueryType] = useState('')
  const [health, setHealth] = useState(null)
  const [serviceInfo, setServiceInfo] = useState(null)

  const mensajeActual = useMemo(() => {
    if (respuesta) {
      return {
        titulo: 'Resultado listo',
        detalle: 'La consulta ya fue procesada por el backend de IA.',
      }
    }

    return {
      titulo: 'Asistente IA',
      detalle: 'Haz una pregunta en lenguaje natural y el backend generará SQL por ti.',
    }
  }, [respuesta])

  useEffect(() => {
    let activo = true

    async function cargarEstado() {
      try {
        const [healthData, infoData] = await Promise.all([getAiHealth(), getAiInfo()])
        if (!activo) return
        setHealth(healthData)
        setServiceInfo(infoData)
      } catch (err) {
        if (activo) {
          setError(err.message || 'No fue posible cargar el estado del servicio de IA.')
        }
      }
    }

    cargarEstado()

    return () => {
      activo = false
    }
  }, [])

  async function enviarConsulta(evento) {
    evento.preventDefault()

    const texto = consulta.trim()
    if (!texto) {
      setError('Escribe una consulta antes de enviarla.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await queryAi(texto)
      setRespuesta(data.response)
      setSqlQuery(data.sqlQuery || '')
      setResultado(data.data ?? null)
      setQueryType(data.queryType || '')
    } catch (err) {
      setError(err.message || 'No fue posible procesar la consulta.')
      setRespuesta('')
      setSqlQuery('')
      setResultado(null)
      setQueryType('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.chatCard}>
      <div className={styles.chatHeader}>
        <div className={styles.chatAvatar} aria-hidden="true">
          IA
        </div>
        <div className={styles.chatHeaderText}>
          <p>Asistente IA por chat</p>
          <span>Consulta la base de datos en lenguaje natural</span>
        </div>
        <div className={styles.chatStatusWrap}>
          <span
            className={
              health?.status === 'operational'
                ? styles.chatStatusOk
                : styles.chatStatusWarn
            }
          >
            {getStatusLabel(health)}
          </span>
        </div>
      </div>

      <div className={styles.chatBubble}>
        <p className={styles.chatBubbleTitle}>{mensajeActual.titulo}</p>
        <p className={styles.chatBubbleBody}>{mensajeActual.detalle}</p>
      </div>

      <div className={styles.chatMetaRow}>
        <span>{serviceInfo?.service || 'AI Query Service'}</span>
        <span>{serviceInfo?.configuration?.model || health?.model || 'gpt-4o-mini'}</span>
        <span>{serviceInfo?.version || 'v1.0.0'}</span>
      </div>

      <form className={styles.chatComposer} onSubmit={enviarConsulta}>
        <input
          type="text"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Escribe tu consulta..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Enviar'}
        </button>
      </form>

      <div className={styles.chatPills}>
        {sugerencias.map((sugerencia) => (
          <button
            key={sugerencia.titulo}
            type="button"
            onClick={() => setConsulta(sugerencia.consulta)}
          >
            {sugerencia.titulo}
          </button>
        ))}
      </div>

      {error ? <p className={styles.chatError}>{error}</p> : null}

      {respuesta ? (
        <div className={styles.chatOutput}>
          <div className={styles.chatOutputHeader}>
            <h4>Respuesta de la IA</h4>
            {queryType ? <span>{queryType}</span> : null}
            {resultado && Array.isArray(resultado) ? (
              <span>{resultado.length} filas devueltas</span>
            ) : null}
          </div>
          <div className={styles.chatMarkdown}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
                code: ({ inline, className, children, ...props }) =>
                  inline ? (
                    <code className={styles.chatInlineCode} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={`${styles.chatCodeBlock} ${className || ''}`} {...props}>
                      {children}
                    </code>
                  ),
                pre: ({ children }) => <pre className={styles.chatPreBlock}>{children}</pre>,
                p: ({ children }) => <p className={styles.chatMarkdownParagraph}>{children}</p>,
                ul: ({ children }) => <ul className={styles.chatMarkdownList}>{children}</ul>,
                ol: ({ children }) => <ol className={styles.chatMarkdownList}>{children}</ol>,
                li: ({ children }) => <li className={styles.chatMarkdownListItem}>{children}</li>,
                table: ({ children }) => (
                  <div className={styles.chatTableWrap}>
                    <table className={styles.chatMarkdownTable}>{children}</table>
                  </div>
                ),
                th: ({ children }) => <th>{children}</th>,
                td: ({ children }) => <td>{children}</td>,
                blockquote: ({ children }) => (
                  <blockquote className={styles.chatMarkdownQuote}>{children}</blockquote>
                ),
                h1: ({ children }) => <h1 className={styles.chatMarkdownHeading}>{children}</h1>,
                h2: ({ children }) => <h2 className={styles.chatMarkdownHeading}>{children}</h2>,
                h3: ({ children }) => <h3 className={styles.chatMarkdownHeading}>{children}</h3>,
              }}
            >
              {respuesta}
            </ReactMarkdown>
          </div>
          {sqlQuery ? (
            <div className={styles.chatSqlBlock}>
              <span>SQL ejecutado</span>
              <pre>{sqlQuery}</pre>
            </div>
          ) : null}
          {resultado ? (
            <details className={styles.chatDataDetails}>
              <summary>Ver datos crudos</summary>
              <pre>{JSON.stringify(resultado, null, 2)}</pre>
            </details>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default BurbujaVozIA
