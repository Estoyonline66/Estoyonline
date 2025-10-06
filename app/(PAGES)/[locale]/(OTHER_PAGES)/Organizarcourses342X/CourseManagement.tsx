"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, Save } from "lucide-react";

interface CourseCard {
  title: string;
  bold: string; // artık Día olacak (haftanın günü)
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
        setCourses(data.cardCourses || []);
      } catch (err) {
        console.error("Error al obtener los cursos:", err);
      }
    };
    fetchCourses();
  }, []);

  const saveCourses = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/save?locale=en`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardCourses: courses.map((c) => ({
            ...c,
            lesson: c.lesson || "First class",
          })),
        }),
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

  const moveCourse = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= courses.length) return;
    const newCourses = [...courses];
    const temp = newCourses[index];
    newCourses[index] = newCourses[newIndex];
    newCourses[newIndex] = temp;
    setCourses(newCourses);
  };

  const addCourse = () => {
    const newCourse: CourseCard = {
      title: "Nuevo Curso",
      bold: "Monday",
      lesson: "First class",
      time: "",
      week: "Once a week 2.5 hours",
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

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const weekOptions = [
    "Once a week 2.5 hours",
    "Once a week 2 hours",
  ];

  if (!loggedIn) {
    return (
      <div className="p-10 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-5">Acceso de Administrador</h2>
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

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-3">
        <h2 className="text-2xl font-bold text-center md:text-left">Lista de Cursos</h2>
        <button
          onClick={addCourse}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          <Plus size={18} /> Nuevo Curso
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 w-[80px]">Mover</th>
