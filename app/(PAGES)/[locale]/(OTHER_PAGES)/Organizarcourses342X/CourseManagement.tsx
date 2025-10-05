"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CourseCard {
  id: string;
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
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const PASSWORD = process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD || "";

  // Fetch courses from blob
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json"
        );
        const data = await res.json();
        // Ensure each course has an id
        const coursesWithId = (data.cardCourses || []).map((c: any, idx: number) => ({
          ...c,
          id: c.id || `course-${idx}`,
        }));
        setCourses(coursesWithId);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Login handler
  const handleLogin = () => {
    if (password === PASSWORD) {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Şifre yanlış!");
    }
  };

  // DnD setup
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = courses.findIndex((c) => c.id === active.id);
      const newIndex = courses.findIndex((c) => c.id === over.id);
      setCourses(arrayMove(courses, oldIndex, newIndex));
    }
  };

  // Save courses to blob
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

  // Add new course
  const addCourse = () => {
    const newCourse: CourseCard = {
      id: `course-${Date.now()}`,
      title: "New Course",
      bold: "",
      lesson: "",
      time: "",
      week: "",
      month: "",
      teacher: "",
    };
    setCourses([...courses, newCourse]);
  };

  // Delete course
  const deleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Editable course field
  const updateCourseField = (id: string, field: keyof CourseCard, value: string) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  if (!loggedIn) {
    return (
      <div className="p-10 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-5">Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          className="border p-2 w-full mb-3"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-5 py-2 rounded w-full"
        >
          Giriş
        </button>
        {loginError && <p className="text-red-600 mt-2">{loginError}</p>}
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-5">Lista de Cursos</h2>

      <button
        onClick={addCourse}
        className="mb-3 bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Course
      </button>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={courses.map((c) => c.id)} strategy={verticalListSortingStrategy}>
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
              {courses.map((c) => (
                <SortableRow
                  key={c.id}
                  course={c}
                  updateCourseField={updateCourseField}
                  deleteCourse={deleteCourse}
                />
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

interface SortableRowProps {
  course: CourseCard;
  updateCourseField: (id: string, field: keyof CourseCard, value: string) => void;
  deleteCourse: (id: string) => void;
}

function SortableRow({ course, updateCourseField, deleteCourse }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: course.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className="text-center">
      <td className="border px-2 py-1">
        <input
          value={course.title}
          onChange={(e) => updateCourseField(course.id, "title", e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          value={course.bold}
          onChange={(e) => updateCourseField(course.id, "bold", e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          value={course.lesson}
          onChange={(e) => updateCourseField(course.id, "lesson", e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          value={course.time}
          onChange={(e) => updateCourseField(course.id, "time", e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          value={course.week}
          onChange={(e) => updateCourseField(course.id, "week", e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          value={course.month}
          onChange={(e) => updateCourseField(course.id, "month", e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </td>
      <td className="border px-2 py-1">
        <input
          value={course.teacher || ""}
          onChange={(e) => updateCourseField(course.id, "teacher", e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </td>
      <td className="border px-2 py-1">
        <button
          onClick={() => deleteCourse(course.id)}
          className="bg-red-600 text-white px-2 py-1 rounded text-xs"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
