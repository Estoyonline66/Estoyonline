"use client";
import { useEffect, useState } from 'react';

// Tip tanımları
type FormSubmission = {
  no: string;
  date: string;
  name: string;
  email: string;
  whatsapp: string;
  level: string;
};

export default function ResultsPage() {
  const [data, setData] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/save-form-data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          const formattedData = result.data.slice(1) // Başlık satırını atla
            .map((row: string) => {
              const [no, date, name, email, whatsapp, level] = row.split('|');
              return { no, date, name, email, whatsapp, level } as FormSubmission;
            })
            .filter((item: FormSubmission) => item.no); // Boş satırları filtrele
            
          setData(formattedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

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
              {data.map((row: FormSubmission) => (
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