import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div>
      <nav style={{ backgroundColor: '#2c3e50', padding: '15px 0', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Task Management System</h1>
          <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
            <Link 
              to="/tasks" 
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: 15, 
                fontWeight: 500,
                paddingBottom: 5,
                borderBottom: location.pathname === '/tasks' ? '3px solid #3498db' : '3px solid transparent',
                transition: 'border-color 0.2s'
              }}
            >
              Search Tasks
            </Link>
            <Link 
              to="/tasks/new" 
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: 15, 
                fontWeight: 500,
                paddingBottom: 5,
                borderBottom: location.pathname === '/tasks/new' ? '3px solid #3498db' : '3px solid transparent',
                transition: 'border-color 0.2s'
              }}
            >
              Add Task
            </Link>
            <Link 
              to="/states" 
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: 15, 
                fontWeight: 500,
                paddingBottom: 5,
                borderBottom: location.pathname === '/states' ? '3px solid #3498db' : '3px solid transparent',
                transition: 'border-color 0.2s'
              }}
            >
              States
            </Link>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: 14 }}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
