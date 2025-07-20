"use client";
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/save-form-data');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result = await response.json();
        if (result.data) {
          // Başlık satırını atla ve verileri işle
          const formattedData = result.data.slice(1).map(row => {
            const [no, date, name, email, whatsapp, level] = row.split('|');
            return { no, date, name, email, whatsapp, level };
          });
          setData(formattedData);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Form Submissions</h1>
      
      {data.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">No.</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">WhatsApp</th>
                <th className="p-2 border">Level</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.no} className="hover:bg-gray-50">
                  <td className="p-2 border">{row.no}</td>
                  <td className="p-2 border">{row.date}</td>
                  <td className="p-2 border">{row.name}</td>
                  <td className="p-2 border">{row.email}</td>
                  <td className="p-2 border">{row.whatsapp}</td>
                  <td className="p-2 border">{row.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}