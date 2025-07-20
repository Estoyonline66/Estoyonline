"use client";
import { useEffect, useState } from 'react';

type Submission = {
  no: string;
  date: string;
  name: string;
  email: string;
  whatsapp: string;
  level: string;
};

export default function CampAWad342Results() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/campAWad342_res.txt');
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        const text = await response.text();
        const rows = text.split('\n').filter(line => line.trim() !== '');
        
        const parsedData = rows.slice(1).map((row, index) => {
          const [no, date, name, email, whatsapp, level] = row.split('|');
          return { no, date, name, email, whatsapp, level };
        });
        
        setData(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Discount Campaign Submissions</h1>
      
      {data.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">No.</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">WhatsApp</th>
                <th className="py-2 px-4 border">Level</th>
              </tr>
            </thead>
    <tbody>
  {data.map((row) => (
    <tr key={row.no} className={parseInt(row.no) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="py-2 px-4 border">{row.no}</td>
      <td className="py-2 px-4 border">{row.date}</td>
      <td className="py-2 px-4 border">{row.name}</td>
      <td className="py-2 px-4 border">{row.email}</td>
      <td className="py-2 px-4 border">{row.whatsapp}</td>
      <td className="py-2 px-4 border">{row.level}</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
}