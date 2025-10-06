"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Save, Plus, Trash2 } from "lucide-react";

interface CourseCard {
  title: string;
  bold: string; // Día
  time: string;
  week: string;
  month: string; // Örn: "Oct 11"
  teacher?: string;
  lesson?: string;
}

// Helper: "Oct 11" => "2025-10-11"
const parseBlobMonthToDate = (monthStr: string): string => {
  try {
    const date = new Date(`${monthStr} 2025`);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return "";
  }
};

// Helper: "2025-10-11" => "Oct 11"
const formatDateToBlobMonth = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
};

export default function CourseManagement() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD) {
      setLoggedIn(true);
    } else {
      alert("❌ Contraseña incorrecta");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json?_ts=${Date.now()}`,
          { cache: "no-cache" }
        );
        const data = await res.json();

        // Blob'dan gelen month değerlerini yyyy-MM-dd formatına çevir
        const formatted = (data.cardCourses || []).map((c: CourseCard) => ({
          ...c,
          month: parseBlobMonthToDate(c.month),
        }));
        setCourses(formatted);
      } catch (err) {
        console.error("Error al cargar cursos:", err);
      }
    };
    fetchCourses();
  }, []);

  const moveCourse = (index: number, direction: "up" | "down") => {
    const newCourses = [...courses];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newCourses.length) return;
    const [moved] = newCourses.splice(index, 1);
    newCourses.splice(newIndex, 0, moved);
    setCourses(newCourses);
  };

  const saveCourses = async () => {
    setSaving(true);
    try {
      // Kaydetmeden önce month değerlerini blob formatına çevir
      const payload = courses.map((c) => ({
        ...c,
        month: formatDateToBlobMonth(c.month),
      }));

      const res = await fetch(`/api/courses/save?locale=en`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardCourses: payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      alert("✅ Cursos guardados correctamente");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Error al guardar los cursos");
    } finally {
      setSaving(false);
    }
  };

  const addCourse = () => {
    const newCourse: CourseCard = {
      title: "Nuevo Curso",
      bold: "Monday",
      time: "6:00 pm Spain time",
      week: "Once a week 2.5 hours",
      month: "2025-10-06",
      teacher: "",
      lesson: "First class",
    };
    setCourses([...courses, newCourse]);
  };

  const deleteCourse = (index: number) => {
    if (!confirm("⚠️ ¿Estás seguro? Este curso será eliminado.")) return;
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
  };

  if (!loggedIn) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-5">Inicio de sesión del administrador</h2>
        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded w-full"
        >
          Entrar
        </button>
      </div>
    );
  }

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const weeks = ["Once a week 2.5 hours","Once a week 2 hours"];

  const hours: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "am" : "pm";
    hours.push(`${hour12}:00 ${ampm} Spain time`);
    hours.push(`${hour12}:30 ${ampm} Spain time`);
  }

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-between mb-5 gap-3">
        <h2 className="text-2xl font-bold text-center">Lista de Cursos</h2>
        <button
          onClick={addCourse}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
        >
          <Plus size={18} /> Añadir Curso
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] text-sm border-collapse border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="border px-2 py-2 w-[80px]">Acciones</th>
              <th className="border px-2 py-2 w-[250px]">Título</th>
              <th className="border px-2 py-2 w-[120px]">Día</th>
              <th className="border px-2 py-2 w-[200px]">Hora</th>
              <th className="border px-2 py-2 w-[200px]">Semana</th>
              <th className="border px-2 py-2 w-[120px]">Mes</th>
              <th className="border px-2 py-2 w-[150px]">Profesor</th>
              <th className="border px-2 py-2 w-[80px]">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {/* Oklar solda */}
                <td className="border px-2 py-1 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => moveCourse(i, "up")}
                      disabled={i === 0}
                      className="p-1 disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveCourse(i, "down")}
                      disabled={i === courses.length - 1}
                      className="p-1 disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </td>

                <td className="border px-2 py-1">
                  <input
                    value={c.title}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].title = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full rounded"
                  />
                </td>

                <td className="border px-2 py-1">
                  <select
                    value={c.bold}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].bold = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full rounded"
                  >
                    {days.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </td>

                <td className="border px-2 py-1">
                  <select
                    value={c.time}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].time = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full rounded"
                  >
                    {hours.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </td>

                <td className="border px-2 py-1">
                  <select
                    value={c.week}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].week = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full rounded"
                  >
                    {weeks.map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </td>

                <td className="border px-2 py-1 text-center">
                  <input
                    type="date"
                    value={c.month}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[i].month = e.target.value;
                      setCourses(newCourses);
                    }}
                    className="border p-1 w-full rounded text-center"
                  />
                </td>

                {/* Çöp kutusu sağda */}
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => deleteCourse(i)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
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
        className="mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded w-full"
      >
        <Save size={18} />
        {saving ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
