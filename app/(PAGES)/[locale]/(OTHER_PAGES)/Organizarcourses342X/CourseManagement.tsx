"use client";

import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

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
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD) {
      setLoggedIn(true);
    } else {
      alert("❌ Yanlış şifre");
    }
  };

  // 📥 Kursları blob'dan fetch et (cache-busting ile)
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = courses.findIndex((c) => c.title === active.id);
      const newIndex = courses.findIndex((c) => c.title === over.id);
      setCourses(arrayMove(courses, oldIndex, newIndex));
    }
  };

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

  const addCourse = () => {
    const newCourse: CourseCard = {
      title: "Yeni Kurs",
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
    <div className="p-10">
      <h2 className="text-xl font-bold mb-5">Lista de Cursos</h2>
      <button
        onClick={addCourse}
        className="mb-3 bg-green-600 text-white px-5 py-2 rounded"
      >
        + Yeni Kurs Ekle
      </button>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={courses.map((c) => c.title)} strategy={verticalListSortingStrategy}>
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
                <SortableItem key={c.title} id={c.title}>
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
                  <td className="border px-2 py-1">
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
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => deleteCourse(i)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Sil
                    </button>
                  </td>
                </SortableItem>
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>

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
