"use client";

import React, { useEffect, useState } from "react";

interface CourseCard {
  title: string;
  bold: string; // "bold" artık "Día" anlamına gelecek
  lesson: string;
  time: string;
  week: string;
  month: string;
  teacher?: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD) {
      setLoggedIn(true);
    } else {
      alert("❌ Yanlış şifre");
    }
  };

  // 📥 Kursları blob'dan fetch et (cache-busting)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json?_ts=${Date.now()}`,
          { cache: "no-cache" }
        );
        const data = await res.json();
        setCourses(data.cardCourses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // 📤 Kaydet
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
      alert("✅ Cursos guardados correctamente");
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // 📦 Ekle / Sil
  const addCourse = () => {
    const newCourse: CourseCard = {
      title: "Nuevo Curso",
      bold: "",
      lesson: "",
      time: "",
      week: "",
      month: "",
      teacher: "",
    };
    setCourses([...courses, newCourse]);
  };

  const deleteCourse = (index: number) => {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
  };

  // 🔼🔽 Oklarla sırayı değiştirme
  const moveCourse = (index: number, direction: "up" | "down") => {
    const newCourses = [...courses];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCourses.length) return;
    const temp = newCourses[index];
    newCourses[index] = newCourses[targetIndex];
    newCourses[targetIndex] = temp;
    setCourses(newCourses);
  };

  if (!loggedIn) {
    return (
      <div className="p-10 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-5">Admin Login</h2>
        <input
          type="password"
          placeholder="Şifre"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-5 py-2 rounded w-full"
        >
          Giriş
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-10 overflow-x-auto">
      <h2 className="text-xl font-bold mb-5">Lista de Cursos</h2>
      <button
        onClick={addCourse}
        className="mb-3 bg-green-600 text-white px-5 py-2 rounded"
      >
        + Nuevo Curso
      </button>

      {/* 🔹 Tablo */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] sm:min-w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 w-[30px]">#</th>
              <th className="border px-2 py-1">Título</th>
              <th className="border px-2 py-1 w-20">Día</th>
              <th className="border px-2 py-1">Lección</th>
              <th className="border px-2 py-1">Hora</th>
              <th className="border px-2 py-1">Semana</th>
              <th className="border px-2 py-1">Mes</th>
              <th className="border px-2 py-1">Profesor</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i} className="text-center">
                <td className="border px-2 py-1">{i + 1}</td>
                <td className="border px-2 py-1">
                  <input
                    value={c.title}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].title = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-2 py-1 w-20">
                  <input
                    value={c.bold || ""}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].bold = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={c.lesson || ""}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].lesson = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={c.time || ""}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].time = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={c.week || ""}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].week = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={c.month || ""}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].month = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full"
                  />
                </td>
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
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => moveCourse(i, "up")}
                    className="bg-gray-300 text-black px-2 py-1 rounded"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveCourse(i, "down")}
                    className="bg-gray-300 text-black px-2 py-1 rounded"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteCourse(i)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={saveCourses}
        disabled={saving}
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded"
      >
        {saving ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
