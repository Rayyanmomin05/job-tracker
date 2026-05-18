import { useEffect, useState } from 'react';
import { getApplications } from '../api';
import ApplicationCard from '../components/ApplicationCard';
import StatsBar from '../components/StatsBar';

const statusOptions = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (status !== 'All') params.status = status;
    const res = await getApplications(params);
    setApplications(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [search, status]);

  const handleDelete = (id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div>
      <StatsBar />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                status === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Applications list */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-12">Loading...</p>
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No applications found.</p>
          <p className="text-gray-300 text-xs mt-1">Add your first application using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}