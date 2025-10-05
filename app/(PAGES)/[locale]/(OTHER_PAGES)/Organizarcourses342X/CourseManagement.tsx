"use client";
import React, { useEffect, useState } from "react";

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

  // 📥 Blob'dan mevcut verileri çek
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
      }
    };
    fetchCourses();
  }, []);

  // 🚨 SİLİNECEK BLOK BAŞI - sadece 1 KERE blob’a başlangıç datasını yükler
  useEffect(() => {
    const uploadInitialData = async () => {
      const initialData = {
        cardCourses: [
          {
            "title": "A1.1 Beginner",
            "bold": "Saturday",
            "lesson": "First class",
            "time": "5:00 pm Spain time",
            "week": "Once a week 2.5 hours",
            "month": "Oct 11"
          },
          {
            "title": "A1.2",
            "bold": "Monday",
            "lesson": "First class",
            "time": "6:00 pm Spain time",
            "week": "Once a week 2.5 hours",
            "month": "Nov 3"
          },
          {
            "title": "A2.1",
            "bold": "Monday",
            "lesson": "First class",
            "time": "6:00 pm Spain time",
            "week": "Once a week 2.5 hours",
            "month": "Oct 6"
          },
          {
            "title": "A2.1",
            "bold": "Friday",
            "lesson": "First class",
            "time": "6:00 pm Spain time",
            "week": "Once a week 2.5 hours",
            "month": "Sep 26"
          },
          {
            "title": "A2.2",
            "bold": "Monday",
            "lesson": "First class",
            "time": "5:30 pm Spain time",
            "week": "Once a week 2.5 hours",
            "month": "Sep 1"
          },
          {
            "title": "A2.2",
            "bold": "Wednesday",
            "lesson": "First class",
            "time": "5:30 pm Spain time",
            "week": "Once a week 2.5 hours",
            "month": "Sep 3"
          },
          {
            "title": "A2.3",
            "bold": "Tuesday",
            "lesson": "First class",
            "time": "6:00 pm Spain time",
            "week": "Once a week 2.5 hours",
            "month": "Sep 9"
          },
          {
            "title": "B1.2",
            "bold": "Friday",
            "lesson": "First class",
            "time": "5:30 pm Spain time",
            "week": "Once a week 2.5 hours",
            "month": "Sep 5"
          },
          {
            "title": "Speaking Course Beginner A1",
            "bold": "Wednesday",
            "lesson": "First class",
            "time": "6:30 pm Spain time",
            "week": "Once a week 2 hours",
            "month": "Oct 1"
          },
          {
            "title": "Speaking Course Intermediate A2",
            "bold": "Wednesday",
            "lesson": "First class",
            "time": "6:30 pm Spain time",
            "week": "Once a week 2 hours",
            "month": "Sep 17"
          },
          {
            "title": "Speaking Course Advanced B1-B2",
            "bold": "Saturday",
            "lesson": "First class",
            "time": "9:00 am Spain time",
            "week": "Once a week 2 hours",
            "month": "Oct 11"
          }
        ]
      };

      await fetch(`/api/courses/save?locale=en`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialData),
      });

      console.log("✅ Initial data uploaded to blob. Bu bloğu artık silebilirsin.");
    };

    uploadInitialData();
  }, []);
  // 🚨 SİLİNECEK BLOK SONU

  // 📤 Değişiklikleri kaydet
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

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-5">Lista de Cursos</h2>

      {/* Küçük fontlu tablo */}
      <table className="w-full border-collapse border border-gray-300 text-xs md:text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Bold</th>
            <th className="border px-2 py-1">Lesson</th>
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">Week</th>
            <th className="border px-2 py-1">Month</th>
            <th className="border px-2 py-1">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <tr key={i} className="text-center">
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
                  placeholder="Teacher"
                />
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
