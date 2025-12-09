import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, updateTask, getTask, getStates } from './api';
import Modal from './Modal';

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ title: '', description: '', dueDate: '', stateId: '', rowVersion: '' });
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
    if (isEdit && id) loadTask();
  }, [id]);

  const loadStates = async () => {
    try {
      const { data } = await getStates();
      setStates(data);
    } catch (err) {
      setError('Failed to load states');
    }
  };

  const loadTask = async () => {
    try {
      const { data } = await getTask(Number(id));
      setForm({
        title: data.Title || data.title,
        description: (data.Description || data.description) || '',
        dueDate: (data.DueDate || data.dueDate) ? new Date(data.DueDate || data.dueDate).toISOString().split('T')[0] : '',
        stateId: (data.StateId || data.stateId).toString(),
        rowVersion: data.RowVersion || data.rowVersion
      });
    } catch (err) {
      setError('Failed to load task');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.stateId || Number(form.stateId) === 0) {
      setError('Please select a state');
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await updateTask(Number(id), {
          title: form.title,
          description: form.description || undefined,
          dueDate: form.dueDate || undefined,
          stateId: Number(form.stateId),
          rowVersion: form.rowVersion
        });
      } else {
        await createTask({
          title: form.title,
          description: form.description || undefined,
          dueDate: form.dueDate || undefined,
          stateId: Number(form.stateId)
        });
      }
      navigate('/tasks');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setModal({
          isOpen: true,
          type: 'alert',
          title: 'Task Modified',
          message: 'Another user modified this task. The page will reload with the latest data.',
          onConfirm: () => {
            window.location.reload();
          }
        });
      } else {
        setError(err.response?.data?.errorMessage || err.response?.data?.message || 'Failed to save task');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm">
      <h2 className="card-title" style={{ marginBottom: 30 }}>{isEdit ? 'Edit Task' : 'New Task'}</h2>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="form-control"
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="form-control"
              placeholder="Enter task description"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              State <span className="required">*</span>
            </label>
            <select
              value={form.stateId}
              onChange={(e) => setForm({ ...form, stateId: e.target.value })}
              required
              className="form-control"
            >
              <option value="">Select a state</option>
              {states.map(state => (
                <option key={state.Id || state.id} value={state.Id || state.id}>{state.Name || state.name}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
            </button>
            <button type="button" onClick={() => navigate('/tasks')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>

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

export default TaskForm;
