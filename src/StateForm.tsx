import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createState, updateState, getState } from './api';

export default function StateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) loadState();
  }, [id]);

  const loadState = async () => {
    try {
      const { data } = await getState(Number(id));
      setName(data.name);
    } catch (err) {
      setError('Failed to load state');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await updateState(Number(id), { name });
      } else {
        await createState({ name });
      }
      navigate('/states');
    } catch (err: any) {
      setError(err.response?.data?.errorMessage || 'Failed to save state');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm">
      <h2 className="card-title" style={{ marginBottom: 30 }}>{isEdit ? 'Edit State' : 'New State'}</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
              placeholder="Enter state name"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : isEdit ? 'Update State' : 'Create State'}
            </button>
            <button type="button" onClick={() => navigate('/states')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
