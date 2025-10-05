"use client";

import React, { useEffect, useState } from "react";


interface CourseCard {
  title: string;
  bold: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
}

interface CourseManagementProps {
  locale: string;
}

export default function CourseManagement({ locale }: CourseManagementProps) {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const blobUrl =
    "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json";

  // ✅ Kurs listesini blob'dan çek
  const fetchCourses = async () => {
    try {
      const res = await fetch(blobUrl);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setCourses(data.cardCourses || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Kurs verileri yüklenemedi.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Kaydetme işlemi
  const saveCourses = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/courses/save?locale=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardCourses: courses }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Kayıt hatası");
      setMessage("✅ Kurslar başarıyla kaydedildi!");
    } catch (error) {
      console.error("Save error:", error);
      setMessage("❌ Kaydetme başarısız oldu!");
    } finally {
      setSaving(false);
    }
  };

  // 🔴 SILINECEK KISIM BAŞLANGICI — sadece 1 kere JSON'u yüklemek için
  useEffect(() => {
    const uploadInitialDataOnce = async () => {
      try {
        const alreadyUploaded = localStorage.getItem("initialCoursesUploaded");
        if (alreadyUploaded) return;

        const initialData = {
          scheduleTitle: "2025 Course Schedule",
          title: "ALL LEVELS PROGRAM",
          levels: [
            {
              title: "Beginner Level A1",
              items: [
                { level: "A1.1", duration: "40 hours - Book:", book: "Aula 1" },
                { level: "A1.2", duration: "30 hours - Book:", book: "Aula 1" },
              ],
            },
          ],
          cardCourses: [
            {
              title: "Sample Course 1",
              bold: "Morning",
              lesson: "First class",
              time: "10:00 - 12:00",
              week: "Monday & Wednesday",
              month: "January",
            },
            {
              title: "Sample Course 2",
              bold: "Evening",
              lesson: "First class",
              time: "18:00 - 20:00",
              week: "Tuesday & Thursday",
              month: "February",
            },
          ],
        };

        console.log("⏫ Uploading initial course data to blob...");
        const response = await fetch(`/api/courses/save?locale=en`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initialData),
        });

        if (response.ok) {
          console.log("✅ Initial data uploaded.");
          localStorage.setItem("initialCoursesUploaded", "true");
        } else {
          console.error("❌ Upload failed:", await response.text());
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    };

    uploadInitialDataOnce();
  }, []);
  // 🔴 SILINECEK KISIM SONU

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Course Management ({locale})</h1>

      {message && (
        <div className="mb-4 text-center font-semibold text-blue-600">
          {message}
        </div>
      )}

      <ul className="space-y-4 mb-6">
        {courses.map((c, i) => (
          <li key={i} className="border p-4 rounded-lg">
            <input
              type="text"
              value={c.title}
              onChange={(e) => {
                const updated = [...courses];
                updated[i].title = e.target.value;
                setCourses(updated);
              }}
              className="w-full border-b p-1 mb-2"
            />
            <input
              type="text"
              value={c.bold}
              onChange={(e) => {
                const updated = [...courses];
                updated[i].bold = e.target.value;
                setCourses(updated);
              }}
              className="w-full border-b p-1 mb-2"
            />
            <input
              type="text"
              value={c.lesson}
              onChange={(e) => {
                const updated = [...courses];
                updated[i].lesson = e.target.value;
                setCourses(updated);
              }}
              className="w-full border-b p-1 mb-2"
            />
            <input
              type="text"
              value={c.time}
              onChange={(e) => {
                const updated = [...courses];
                updated[i].time = e.target.value;
                setCourses(updated);
              }}
              className="w-full border-b p-1 mb-2"
            />
            <input
              type="text"
              value={c.week}
              onChange={(e) => {
                const updated = [...courses];
                updated[i].week = e.target.value;
                setCourses(updated);
              }}
              className="w-full border-b p-1 mb-2"
            />
            <input
              type="text"
              value={c.month}
              onChange={(e) => {
                const updated = [...courses];
                updated[i].month = e.target.value;
                setCourses(updated);
              }}
              className="w-full border-b p-1"
            />
          </li>
        ))}
      </ul>

      <div className="flex gap-4">
        <button
          onClick={saveCourses}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Courses"}
        </button>

        <button
          onClick={() =>
            setCourses([
              ...courses,
              {
                title: "",
                bold: "",
                lesson: "",
                time: "",
                week: "",
                month: "",
              },
            ])
          }
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Course
        </button>
      </div>
    </div>
  );
}
