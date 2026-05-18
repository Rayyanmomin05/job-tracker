import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getApplicationById, addNote, deleteNote, getAISuggestions, deleteApplication } from '../api';

const statusColors = {
  Applied: 'bg-blue-100 text-blue-700',
  Interview: 'bg-yellow-100 text-yellow-700',
  Offer: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Withdrawn: 'bg-gray-100 text-gray-600',
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [note, setNote] = useState('');
  const [tips, setTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const [tipsError, setTipsError] = useState('');

  useEffect(() => {
    getApplicationById(id).then((res) => setApp(res.data));
  }, [id]);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    const res = await addNote(id, note.trim());
    setApp((prev) => ({ ...prev, Notes: [...(prev.Notes || []), res.data] }));
    setNote('');
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(id, noteId);
    setApp((prev) => ({ ...prev, Notes: prev.Notes.filter((n) => n.id !== noteId) }));
  };

  const handleGetTips = async () => {
    if (!app.description) {
      setTipsError('No job description found. Edit the application and add one first.');
      return;
    }
    setLoadingTips(true);
    setTipsError('');
    try {
      const res = await getAISuggestions(app.description);
      setTips(res.data.tips);
    } catch (err) {
      setTipsError('Failed to get AI tips. Check your OpenAI API key.');
    } finally {
      setLoadingTips(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this application?')) return;
    await deleteApplication(id);
    navigate('/');
  };

  if (!app) return <p className="text-sm text-gray-400 text-center py-12">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{app.company}</h2>
            <p className="text-gray-600 mt-1">{app.role}</p>
            {app.location && <p className="text-sm text-gray-400 mt-1">{app.location}</p>}
            {app.salary && <p className="text-sm text-gray-400">{app.salary}</p>}
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${statusColors[app.status]}`}>
            {app.status}
          </span>
        </div>

        <div className="flex gap-4 mt-4 text-sm text-gray-400">
          {app.appliedDate && <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>}
          {app.jobUrl && (
            <a href={app.jobUrl} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">
              View Job Post
            </a>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <Link
            to={`/edit/${app.id}`}
            className="text-sm text-indigo-600 border border-indigo-200 px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm text-red-500 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* AI Tips */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">✨ AI Smart Tips</h3>
          <button
            onClick={handleGetTips}
            disabled={loadingTips}
            className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loadingTips ? 'Thinking...' : 'Get Tips'}
          </button>
        </div>

        {tipsError && <p className="text-sm text-red-500">{tipsError}</p>}

        {tips.length > 0 && (
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        )}

        {tips.length === 0 && !tipsError && (
          <p className="text-sm text-gray-400">Click "Get Tips" to get AI suggestions based on the job description.</p>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            placeholder="Add a note... (Enter to save)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={handleAddNote}
            className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>

        {app.Notes && app.Notes.length > 0 ? (
          <ul className="space-y-2">
            {app.Notes.map((n) => (
              <li key={n.id} className="flex items-start justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-sm text-gray-700">{n.content}</p>
                <button
                  onClick={() => handleDeleteNote(n.id)}
                  className="text-xs text-red-400 hover:text-red-600 shrink-0"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No notes yet.</p>
        )}
      </div>

    </div>
  );
}