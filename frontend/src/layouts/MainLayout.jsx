import { NavLink, Outlet, useLocation } from 'react-router-dom'
import styles from '../styles/MainLayout.module.css'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/articulos', label: 'Articulos' },
  { to: '/fabricas', label: 'Fabricas' },
  { to: '/direcciones', label: 'Direcciones' },
  { to: '/pedidos', label: 'Pedidos' },
  { to: '/ia', label: 'IA' },
]

const titulosPorRuta = {
  '/': 'Dashboard inteligente',
  '/dashboard': 'Dashboard inteligente',
  '/clientes': 'Gestion de clientes',
  '/articulos': 'Gestion de articulos',
  '/fabricas': 'Gestion de fabricas',
  '/direcciones': 'Gestion de direcciones',
  '/pedidos': 'Gestion de pedidos',
  '/ia': 'Inteligencia artificial',
}

function MainLayout() {
  const { pathname } = useLocation()
  const titulo = titulosPorRuta[pathname] ?? 'Sistema de gestion'

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h1 className={styles.logo}>Inventario Pro</h1>
        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h2>{titulo}</h2>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
