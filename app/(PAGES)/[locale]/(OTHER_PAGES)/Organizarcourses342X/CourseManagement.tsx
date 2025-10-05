"use client";
import React, { useEffect, useState } from "react";


interface CourseCard {
  id?: string;
  title: string;
  bold: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
  teacher?: string;
}

export default function CourseManagement() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [saving, setSaving] = useState(false);

  const adminPassword = process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD;

  // Login kontrolü
  const handleLogin = () => {
    if (passwordInput === adminPassword) {
      setLoggedIn(true);
      setPasswordInput("");
    } else {
      alert("❌ Şifre hatalı!");
    }
  };

  // Blob'dan kursları çek
  useEffect(() => {
    if (!loggedIn) return;

    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json"
        );
        if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`);

        const data = await res.json();
        // course'lara id ekle
        const coursesWithId: CourseCard[] = (data.cardCourses || []).map(
          (c: CourseCard, idx: number) => ({
            ...c,
            id: c.id || `course-${idx}`,
          })
        );
        setCourses(coursesWithId);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, [loggedIn]);

  // Kursları kaydet
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

  if (!loggedIn) {
    return (
      <div className="p-10 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-5">Admin Login</h2>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Şifre"
          className="border p-2 w-full mb-3"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white px-5 py-2 rounded"
        >
          Giriş Yap
        </button>
      </div>
    );
  }

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
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <tr key={c.id || i} className="text-center">
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
              <td className="border px-2 py-1 flex gap-1 justify-center">
                <button
                  className="bg-green-500 text-white px-2 rounded"
                  onClick={() => {
                    const newCourses = [...courses];
                    newCourses.splice(i, 0, { ...c, id: `course-${Date.now()}` });
                    setCourses(newCourses);
                  }}
                >
                  Add
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 rounded"
                  onClick={() => {
                    const newCourses = [...courses];
                    newCourses[i] = { ...c, title: c.title + " (Edited)" };
                    setCourses(newCourses);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 rounded"
                  onClick={() => {
                    const newCourses = courses.filter((_, idx) => idx !== i);
                    setCourses(newCourses);
                  }}
                >
                  Delete
                </button>
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
