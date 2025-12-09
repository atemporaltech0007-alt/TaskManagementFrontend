import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStates, deleteState } from './api';
import Modal from './Modal';

export default function States() {
  const [states, setStates] = useState<any[]>([]);
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

  const loadStates = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getStates();
      setStates(data);
    } catch (err) {
      setError('Failed to load states');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Delete State',
      message: 'Delete this state? This may affect existing tasks.',
      onConfirm: async () => {
        try {
          await deleteState(id);
          loadStates();
        } catch (err: any) {
          const errorMsg = err.response?.status === 400 
            ? 'Cannot delete this state. There are tasks using this state.' 
            : err.response?.data?.errorMessage || 'Error deleting state';
          setModal({
            isOpen: true,
            type: 'alert',
            title: 'Error',
            message: errorMsg
          });
        }
      }
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h2>States</h2>
        <Link to="/states/new" className="btn btn-success">+ New State</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : states.length === 0 ? (
        <div className="empty-state">
          <p>No states found</p>
        </div>
      ) : (
        <div className="card-grid">
          {states.map(state => (
            <div key={state.Id || state.id} className="card">
              <h3 className="card-title">{state.Name || state.name}</h3>
              <div className="card-actions">
                <Link to={`/states/edit/${state.Id || state.id}`} className="btn btn-primary">Edit</Link>
                <button onClick={() => handleDelete(state.Id || state.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
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
