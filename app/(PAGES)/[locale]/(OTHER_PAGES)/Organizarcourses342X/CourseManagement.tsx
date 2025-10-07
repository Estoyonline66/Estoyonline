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

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysTr = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const weeks = ["Once a week 2.5 hours", "Once a week 2 hours"];
const weeksTr = ["Haftada 1 gün 2 saat", "Haftada 2 gün 2,5 saat"];

// 🔹 English time options — 24 hours, half-hour intervals
const hoursEn = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const suffix = hour < 12 ? "am" : "pm";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${suffix} Spain time`;
});

// 🔹 Turkish time options — from 09:00 to 22:00, half-hour intervals
const hoursTr: string[] = [];
for (let hour = 9; hour <= 22; hour++) {
  hoursTr.push(`${hour.toString().padStart(2, "0")}:00`);
  if (hour !== 22) hoursTr.push(`${hour.toString().padStart(2, "0")}:30`);
}

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
    if (activeTab === "en") setCoursesEn(list);
    else setCoursesTr(list);
  };

  const deleteCourse = (index: number) => {
    if (confirm("⚠️ El curso se eliminará permanentemente. ¿Estás seguro?")) {
      const list = activeTab === "en" ? [...coursesEn] : [...coursesTr];
      list.splice(index, 1);
      if (activeTab === "en") setCoursesEn(list);
      else setCoursesTr(list);
    }
  };

  const addCourse = () => {
    const newCourse: Course = {
      title: "Nuevo Curso",
      bold: activeTab === "en" ? "Monday" : "Pazartesi",
      lesson: activeTab === "en" ? "First class" : "İlk ders",
      time: activeTab === "en" ? "9:00 am Spain time" : "09:00",
      week: activeTab === "en" ? "Once a week 2.5 hours" : "Haftada 1 gün 2 saat",
      month: new Date().toISOString().split("T")[0],
      teacher: "",
    };
    if (activeTab === "en") setCoursesEn([newCourse, ...coursesEn]);
    else setCoursesTr([newCourse, ...coursesTr]);
  };

  const renderTable = (
    courses: Course[],
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
    isTr: boolean
  ) => (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse border-spacing-0 text-sm md:text-base">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left w-10"></th>
            <th className="p-2 text-left w-[250px]">Título</th>
            <th className="p-2 text-left w-[130px]">{isTr ? "Día" : "Day"}</th> {/* +30px */}
            <th className="p-2 text-left w-[200px]">Hora</th> {/* -30px */}
            <th className="p-2 text-left w-[230px]">Semana</th>
            <th className="p-2 text-left w-[100px]">Mes</th>
            <th className="p-2 text-left w-[200px]">Profesor</th>
            <th className="p-2 text-center w-10"></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => {
            // Turkish tab: time sadece saat kısmını al
            const timeOptions = isTr
              ? hoursTr
              : hoursEn;

            let selectedTime = c.time;
            if (isTr && c.time.includes("-")) {
              selectedTime = c.time.split("-")[0].trim();
            }

            // Turkish tab: hafta seçimi blob data ile uyumlu
            let selectedWeek = c.week;
            if (isTr && c.time.includes("-")) {
              const durationMatch = c.time.split("-")[1]?.trim();
              if (durationMatch) selectedWeek = `${c.week} ${durationMatch}`;
            }

            // English tab: mes value doğru göster
            let dateValue = "";
            if (isTr) {
              // Türkçe gg.aa.yyyy
              const [day, monthName] = c.month.split(" ");
              const monthIndex = [
                "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
                "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"
              ].indexOf(monthName);
              if (monthIndex >= 0) {
                const mm = (monthIndex + 1).toString().padStart(2, "0");
                const dd = day.padStart(2, "0");
                dateValue = `2025-${mm}-${dd}`;
              }
            } else {
              // İngilizce: yyyy-mm-dd
              const date = new Date(c.month + " 2025");
              const mm = (date.getMonth() + 1).toString().padStart(2, "0");
              const dd = date.getDate().toString().padStart(2, "0");
              dateValue = `2025-${mm}-${dd}`;
            }

            return (
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
                    {(isTr ? daysTr : days).map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1">
                  <select
                    value={selectedTime}
                    onChange={(e) => {
                      const list = [...courses];
                      if (isTr) {
                        const durationMatch = c.time.includes("-") ? c.time.split("-")[1].trim() : "2 saat";
                        list[i].time = `${e.target.value} - ${durationMatch}`;
                      } else list[i].time = e.target.value;
                      setCourses(list);
                    }}
                    className="border p-1 w-full rounded"
                  >
                    {timeOptions.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1">
                  <select
                    value={selectedWeek}
                    onChange={(e) => {
                      const list = [...courses];
                      list[i].week = e.target.value;
                      setCourses(list);
                    }}
                    className="border p-1 w-full rounded"
                  >
                    {(isTr ? weeksTr : weeks).map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1 text-center">
                  <input
                    type="date"
                    value={dateValue}
                    onChange={(e) => {
                      const val = e.target.value; // yyyy-mm-dd
                      const list = [...courses];
                      const [_, mm, dd] = val.split("-");
                      if (isTr) {
                        const monthNamesTr = [
                          "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
                          "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"
                        ];
                        list[i].month = `${parseInt(dd, 10)} ${monthNamesTr[parseInt(mm, 10) - 1]}`;
                      } else {
                        const monthNamesEn = [
                          "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
                        ];
                        list[i].month = `${monthNamesEn[parseInt(mm, 10) - 1]} ${parseInt(dd, 10)}`;
                      }
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
            );
          })}
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
            className={`px-4 py-2 rounded ${activeTab === "en" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            🇬🇧 English Courses
          </button>
          <button
            onClick={() => setActiveTab("tr")}
            className={`px-4 py-2 rounded ${activeTab === "tr" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
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

      {activeTab === "en"
        ? renderTable(coursesEn, setCoursesEn, false)
        : renderTable(coursesTr, setCoursesTr, true)}
    </div>
  );
}
