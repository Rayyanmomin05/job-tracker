import { Link } from 'react-router-dom';
import { deleteApplication } from '../api';

const statusColors = {
  Applied: 'bg-blue-100 text-blue-700',
  Interview: 'bg-yellow-100 text-yellow-700',
  Offer: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Withdrawn: 'bg-gray-100 text-gray-600',
};

export default function ApplicationCard({ application, onDelete }) {
  const handleDelete = async () => {
    if (!window.confirm('Delete this application?')) return;
    await deleteApplication(application.id);
    onDelete(application.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{application.company}</h3>
          <p className="text-sm text-gray-600 truncate">{application.role}</p>
          {application.location && (
            <p className="text-xs text-gray-400 mt-1">{application.location}</p>
          )}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusColors[application.status]}`}>
          {application.status}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-400">
          {application.appliedDate
            ? new Date(application.appliedDate).toLocaleDateString()
            : 'No date'}
        </p>
        <div className="flex gap-2">
          <Link
            to={`/application/${application.id}`}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View
          </Link>
          <Link
            to={`/edit/${application.id}`}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}