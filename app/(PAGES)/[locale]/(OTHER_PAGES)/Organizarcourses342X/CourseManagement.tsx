"use client";

import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD;

  // 📥 Fetch courses from blob
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
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 🔑 Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
    } else {
      alert("❌ Şifre yanlış!");
    }
  };

  // 📤 Save courses to blob
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

  // 🔄 Drag & Drop
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = courses.findIndex((c) => c.title === active.id);
      const newIndex = courses.findIndex((c) => c.title === over.id);
      setCourses(arrayMove(courses, oldIndex, newIndex));
    }
  };

  // ✅ Sortable item component
  function SortableItem({ course }: { course: CourseCard }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: course.title });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <td className="border px-2 py-1">{course.title}</td>
        <td className="border px-2 py-1">{course.bold}</td>
        <td className="border px-2 py-1">{course.lesson}</td>
        <td className="border px-2 py-1">{course.time}</td>
        <td className="border px-2 py-1">{course.week}</td>
        <td className="border px-2 py-1">{course.month}</td>
        <td className="border px-2 py-1">
          <input
            value={course.teacher || ""}
            onChange={(e) => {
              const newCourses = [...courses];
              newCourses[courses.indexOf(course)].teacher = e.target.value;
              setCourses(newCourses);
            }}
            className="border p-1 w-full"
          />
        </td>
        <td className="border px-2 py-1">
          <button
            onClick={() => {
              setCourses(courses.filter((c) => c !== course));
            }}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }

  if (!loggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <form
          onSubmit={handleLogin}
          className="border p-10 rounded shadow-lg w-full max-w-sm"
        >
          <h2 className="text-xl font-bold mb-5 text-center">
            Admin Login
          </h2>
          <input
            type="password"
            placeholder="Şifre"
            className="border p-2 w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 w-full rounded"
          >
            Giriş
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-5">Lista de Cursos</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={courses.map((c) => c.title)}
            strategy={verticalListSortingStrategy}
          >
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
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <SortableItem key={c.title} course={c} />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      )}

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
