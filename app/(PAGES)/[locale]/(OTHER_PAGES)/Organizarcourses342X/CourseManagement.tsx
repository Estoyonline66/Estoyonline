"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 📥 Blob’dan kursları çek
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json"
        );
        if (!res.ok) throw new Error("Blob fetch failed");
        const data = await res.json();
        setCourses(data.cardCourses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // 🧩 Drag & Drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newCourses = Array.from(courses);
    const [moved] = newCourses.splice(result.source.index, 1);
    newCourses.splice(result.destination.index, 0, moved);
    setCourses(newCourses);
  };

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

  // ➕ Add kurs
  const addCourse = () => {
    setCourses([
      ...courses,
      {
        title: "Yeni Kurs",
        bold: "",
        lesson: "",
        time: "",
        week: "",
        month: "",
        teacher: "",
      },
    ]);
  };

  // ❌ Delete kurs
  const deleteCourse = (index: number) => {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
  };

  // 🔒 Login kontrolü
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Yanlış kullanıcı adı veya parola");
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
          />
          <button className="bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-5">Lista de Cursos</h2>
      <button
        onClick={addCourse}
        className="mb-3 bg-green-600 text-white px-3 py-1 rounded"
      >
        ➕ Add Course
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="courses">
          {(provided) => (
            <table
              className="w-full border-collapse border border-gray-300 text-sm"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
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
                  <Draggable key={i} draggableId={`course-${i}`} index={i}>
                    {(provided) => (
                      <tr
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="text-center"
                      >
                        <td className="border px-2 py-1">
                          <input
                            value={c.title}
                            onChange={(e) => {
                              const newCourses = [...courses];
                              newCourses[i].title = e.target.value;
                              setCourses(newCourses);
                            }}
                            className="border p-1 w-full text-sm"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            value={c.bold}
                            onChange={(e) => {
                              const newCourses = [...courses];
                              newCourses[i].bold = e.target.value;
                              setCourses(newCourses);
                            }}
                            className="border p-1 w-full text-sm"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            value={c.lesson}
                            onChange={(e) => {
                              const newCourses = [...courses];
                              newCourses[i].lesson = e.target.value;
                              setCourses(newCourses);
                            }}
                            className="border p-1 w-full text-sm"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            value={c.time}
                            onChange={(e) => {
                              const newCourses = [...courses];
                              newCourses[i].time = e.target.value;
                              setCourses(newCourses);
                            }}
                            className="border p-1 w-full text-sm"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            value={c.week}
                            onChange={(e) => {
                              const newCourses = [...courses];
                              newCourses[i].week = e.target.value;
                              setCourses(newCourses);
                            }}
                            className="border p-1 w-full text-sm"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            value={c.month}
                            onChange={(e) => {
                              const newCourses = [...courses];
                              newCourses[i].month = e.target.value;
                              setCourses(newCourses);
                            }}
                            className="border p-1 w-full text-sm"
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
                            className="border p-1 w-full text-sm"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <button
                            onClick={() => deleteCourse(i)}
                            className="bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

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
