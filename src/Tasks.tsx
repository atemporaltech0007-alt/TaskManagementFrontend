import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask, getStates } from './api';
import Modal from './Modal';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ stateId: '', title: '', dueDateFrom: '', dueDateTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ isOpen: boolean; type: 'alert' | 'confirm'; title: string; message: string; onConfirm?: () => void }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: ''
  });

  useEffect(() => {
    loadStates();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [page, filters]);

  const loadStates = async () => {
    try {
      const { data } = await getStates();
      setStates(data);
    } catch (error) {
      
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      if (filters.title?.trim()) params.title = filters.title;
      if (filters.stateId) params.stateId = filters.stateId;
      if (filters.dueDateFrom) params.dueDateFrom = filters.dueDateFrom;
      if (filters.dueDateTo) params.dueDateTo = filters.dueDateTo;
      
      const { data } = await getTasks(page, 10, params);
      setTasks(data.Items || data.items || []);
      setTotalPages(data.TotalPages || data.totalPages || 0);
    } catch (error: any) {
      setError(error.response?.data?.errorMessage || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Delete Task',
      message: 'Delete this task?',
      onConfirm: async () => {
        try {
          await deleteTask(id);
          await loadTasks();
        } catch (error: any) {
          const errorMsg = error.response?.status === 404 
            ? 'Task not found. It may have been already deleted.' 
            : 'Error deleting task';
          setModal({
            isOpen: true,
            type: 'alert',
            title: 'Error',
            message: errorMsg
          });
          await loadTasks();
        }
      }
    });
  };

  const clearFilters = () => {
    setFilters({ stateId: '', title: '', dueDateFrom: '', dueDateTo: '' });
    setPage(1);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Search Tasks</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '600', color: '#34495e' }}>Filter Tasks</h3>
        <div className="filter-grid">
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              placeholder="Search by title"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">State</label>
            <select
              value={filters.stateId}
              onChange={(e) => setFilters({ ...filters, stateId: e.target.value })}
              className="form-control"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state.Id || state.id} value={state.Id || state.id}>{state.Name || state.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Due Date From</label>
            <input
              type="date"
              value={filters.dueDateFrom}
              onChange={(e) => setFilters({ ...filters, dueDateFrom: e.target.value })}
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Due Date To</label>
            <input
              type="date"
              value={filters.dueDateTo}
              onChange={(e) => setFilters({ ...filters, dueDateTo: e.target.value })}
              className="form-control"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button onClick={() => loadTasks()} className="btn btn-primary">Search</button>
          <button onClick={clearFilters} className="btn btn-secondary">Clear Filters</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found</p>
        </div>
      ) : (
        <>
          <div className="card-grid">
            {tasks.map(task => (
              <div key={task.id || task.Id} className="card">
                <h3 className="card-title">{task.Title || task.title}</h3>
                {(task.Description || task.description) && <p className="card-text">{task.Description || task.description}</p>}
                <div style={{ marginBottom: 10 }}>
                  <span className="badge">{task.StateName || task.stateName}</span>
                </div>
                {(task.DueDate || task.dueDate) && (
                  <p className="card-text">
                    Due: {new Date(task.DueDate || task.dueDate).toLocaleDateString()}
                  </p>
                )}
                <div className="card-actions">
                  <Link to={`/tasks/edit/${task.Id || task.id}`} className="btn btn-primary">Edit</Link>
                  <button onClick={() => handleDelete(task.Id || task.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`pagination-btn ${p === page ? 'active' : ''}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}
