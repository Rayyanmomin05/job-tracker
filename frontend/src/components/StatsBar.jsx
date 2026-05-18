import { useEffect, useState } from 'react';
import { getStats } from '../api';

export default function StatsBar() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return null;

  const items = [
    { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
    { label: 'Applied', value: stats.applied, color: 'bg-blue-100 text-blue-700' },
    { label: 'Interviews', value: stats.interviews, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Offers', value: stats.offers, color: 'bg-green-100 text-green-700' },
    { label: 'Rejected', value: stats.rejected, color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {items.map((item) => (
        <div key={item.label} className={`rounded-xl p-4 ${item.color}`}>
          <p className="text-2xl font-bold">{item.value}</p>
          <p className="text-sm font-medium mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}