"use client";
import React, { useEffect, useState } from "react";

interface CourseCard {
  title: string;
  bold: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
  teacher?: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [saving, setSaving] = useState(false);

  // 📥 İlk yükleme
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json"
        );
        const data = await res.json();
        setCourses(data.cardCourses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // 📤 Kaydetme fonksiyonu
  const saveCourses = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/save?locale=en`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardCourses: courses }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      alert("✅ Kurslar başarıyla kaydedildi!");
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Kaydetme hatası");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-5">Lista de Cursos</h2>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Bold</th>
            <th className="border px-2 py-1">Lesson</th>
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">Week</th>
            <th className="border px-2 py-1">Month</th>
            <th className="border px-2 py-1">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <tr key={i} className="text-center">
              <td className="border px-2 py-1">{c.title}</td>
              <td className="border px-2 py-1">{c.bold}</td>
              <td className="border px-2 py-1">{c.lesson}</td>
              <td className="border px-2 py-1">{c.time}</td>
              <td className="border px-2 py-1">{c.week}</td>
              <td className="border px-2 py-1">{c.month}</td>
              <td className="border px-2 py-1">
                <input
                  value={c.teacher || ""}
                  onChange={(e) => {
                    const newCourses = [...courses];
                    newCourses[i].teacher = e.target.value;
                    setCourses(newCourses);
                  }}
                  className="border p-1 w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={saveCourses}
        disabled={saving}
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded"
      >
        {saving ? "Saving..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
