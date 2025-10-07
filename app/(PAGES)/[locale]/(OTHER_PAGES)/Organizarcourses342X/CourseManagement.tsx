"use client";
import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

interface Course {
  title: string;
  bold: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
  teacher?: string;
}

const blobUrl =
  "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json";

const daysEn = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysTr = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

const weeksEn = ["Once a week 2.5 hours", "Once a week 2 hours"];
const weeksTr = ["Haftada 1 gün 2 saat", "Haftada 2 gün 2,5 saat"];

const hoursEn = Array.from({ length: 48 }, (_, i) => {
  const hour24 = 5 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const suffix = hour24 >= 12 ? "pm" : "am";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${minute} ${suffix} Spain time`;
});

const hoursTr = Array.from({ length: 26 }, (_, i) => {
  const hour = 9 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

export default function CourseManagement() {
  const [coursesEn, setCoursesEn] = useState<Course[]>([]);
  const [coursesTr, setCoursesTr] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"en" | "tr">("en");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${blobUrl}?_ts=${Date.now()}`, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setCoursesEn(data.cardCoursesEn || []);
        setCoursesTr(data.cardCoursesTr || []);
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const saveCourses = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/courses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardCoursesEn: coursesEn,
          cardCoursesTr: coursesTr,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("✅ Cursos guardados correctamente.");
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar los cursos.");
    } finally {
      setSaving(false);
    }
  };

  const moveRow = (index: number, direction: "up" | "down") => {
    const list = activeTab === "en" ? [...coursesEn] : [...coursesTr];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;

    [list[index], list[newIndex]] = [list[newIndex], list[index]];

    if (activeTab === "en") {
      setCoursesEn(list);
    } else {
      setCoursesTr(list);
    }
  };

  const deleteCourse = (index: number) => {
    if (confirm("⚠️ El curso se eliminará permanentemente. ¿Estás seguro?")) {
      const list = activeTab === "en" ? [...coursesEn] : [...coursesTr];
      list.splice(index, 1);

      if (activeTab === "en") {
        setCoursesEn(list);
      } else {
        setCoursesTr(list);
      }
    }
  };

  const addCourse = () => {
    const newCourse: Course = {
      title: "Nuevo Curso",
      bold: activeTab === "en" ? "Monday" : "Pazartesi",
      lesson: "First class",
      time: activeTab === "en" ? "5:00 pm Spain time" : "9:00",
      week: activeTab === "en" ? "Once a week 2.5 hours" : "Haftada 1 gün 2 saat",
      month: new Date().toISOString().split("T")[0],
      teacher: "",
    };

    if (activeTab === "en") {
      setCoursesEn([newCourse, ...coursesEn]);
    } else {
      setCoursesTr([newCourse, ...coursesTr]);
    }
  };

  const renderTable = (courses: Course[], setCourses: React.Dispatch<React.SetStateAction<Course[]>>) => (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse border-spacing-0 text-sm md:text-base">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left w-10"></th>
            <th className="p-2 text-left w-[250px]">Título</th>
            <th className="p-2 text-left w-[100px]">Día</th>
            <th className="p-2 text-left w-[180px]">Hora</th>
            <th className="p-2 text-left w-[180px]">Semana</th>
            <th className="p-2 text-left w-[100px]">Mes</th>
            <th className="p-2 text-left w-[200px]">Profesor</th>
            <th className="p-2 text-center w-10"></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-2 py-1 text-center flex flex-col items-center gap-1">
                <button onClick={() => moveRow(i, "up")} className="text-gray-600 hover:text-black">
                  <ArrowUp size={16} />
                </button>
                <button onClick={() => moveRow(i, "down")} className="text-gray-600 hover:text-black">
                  <ArrowDown size={16} />
                </button>
              </td>
              <td className="px-2 py-1">
                <input
                  value={c.title}
                  onChange={(e) => {
                    const list = [...courses];
                    list[i].title = e.target.value;
                    setCourses(list);
                  }}
                  className="border p-1 w-full rounded"
                />
              </td>
              <td className="px-2 py-1">
                <select
                  value={c.bold}
                  onChange={(e) => {
                    const list = [...courses];
                    list[i].bold = e.target.value;
                    setCourses(list);
                  }}
                  className="border p-1 w-full rounded"
                >
                  {(activeTab === "en" ? daysEn : daysTr).map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-1">
                <select
                  value={c.time}
                  onChange={(e) => {
                    const list = [...courses];
                    list[i].time = e.target.value;
                    setCourses(list);
                  }}
                  className="border p-1 w-full rounded"
                >
                  {(activeTab === "en" ? hoursEn : hoursTr).map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-1">
                <select
                  value={c.week}
                  onChange={(e) => {
                    const list = [...courses];
                    list[i].week = e.target.value;
                    setCourses(list);
                  }}
                  className="border p-1 w-full rounded"
                >
                  {(activeTab === "en" ? weeksEn : weeksTr).map((w) => (
                    <option key={w}>{w}</option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-1 text-center">
                <input
                  type="text"
                  value={c.month}
                  onChange={(e) => {
                    const list = [...courses];
                    list[i].month = e.target.value;
                    setCourses(list);
                  }}
                  className="border p-1 w-full rounded text-center"
                />
              </td>
              <td className="px-2 py-1">
                <input
                  value={c.teacher || ""}
                  onChange={(e) => {
                    const list = [...courses];
                    list[i].teacher = e.target.value;
                    setCourses(list);
                  }}
                  className="border p-1 w-full rounded"
                />
              </td>
              <td className="px-2 py-1 text-center">
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
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("en")}
            className={`px-4 py-2 rounded ${
              activeTab === "en" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            🇬🇧 English Courses
          </button>
          <button
            onClick={() => setActiveTab("tr")}
            className={`px-4 py-2 rounded ${
              activeTab === "tr" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            🇹🇷 Turkish Courses
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={addCourse} className="px-3 py-2 bg-green-500 text-white rounded text-sm">
            + Nuevo curso
          </button>
          <button
            onClick={saveCourses}
            disabled={saving}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
          >
            💾 Guardar cambios
          </button>
        </div>
      </div>

      {activeTab === "en" ? renderTable(coursesEn, setCoursesEn) : renderTable(coursesTr, setCoursesTr)}
    </div>
  );
}
