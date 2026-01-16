"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { courseMap } from "@/app/api/checkout/text";

interface Course {
  title: string;
  bold: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
  teacher?: string;
}

interface GroupLessonLink {
  title: string;
  price: string;
  link: string;
}

interface PrivateLessonLink {
  studentCount: string;
  lessonCount: string;
  price: string;
  link: string;
}

const blobUrl =
  "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const daysTr = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Salı - Perş"];
const weeks = ["Once a week 2.5 hours", "Once a week 2 hours"];
const weeksTr = ["Haftada 1 gün 2,5 saat", "Haftada 1 gün 2 saat", "Haftada 2 gün 1 saat 15 dk", "Haftada 1 gün 1,5 saat"];

// 🔹 English time options — 24 hours, half-hour intervals
const hoursEn = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const suffix = hour < 12 ? "am" : "pm";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${suffix} Spain time`;
});

// 🔹 Turkish time options — only hours 09:00–22:00, half-hour intervals
const hoursTr: string[] = [];
for (let hour = 9; hour <= 22; hour++) {
  hoursTr.push(`${hour.toString().padStart(2, "0")}:00`);
  if (hour !== 22) hoursTr.push(`${hour.toString().padStart(2, "0")}:30`);
}

export default function CourseManagement() {
  const [coursesEn, setCoursesEn] = useState<Course[]>([]);
  const [coursesTr, setCoursesTr] = useState<Course[]>([]);
  const [paymentLinksGroup, setPaymentLinksGroup] = useState<GroupLessonLink[]>([]);
  const [paymentLinksPrivate, setPaymentLinksPrivate] = useState<PrivateLessonLink[]>([]);
  const [showPaymentLinks, setShowPaymentLinks] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "tr">("en");

  // Load links from courseMap (hardcoded)
  useEffect(() => {
    const groupLinks: GroupLessonLink[] = [];
    const privateLinks: PrivateLessonLink[] = [];

    const formatCurrency = (amount: number, currency: string) => {
      // 100'e bölerek asıl değeri bul
      const val = amount / 100;
      // Binlik ayracı ile formatla (İspanya/Türkiye formatı: 1.234,56)
      // Ancak kullanıcı sadece binlik ayracı nokta olsun istiyor: 7.980 TL
      const formattedVal = val.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      
      const currencyLabel = currency.toUpperCase() === "TRY" ? "TL" : currency.toUpperCase();
      return `${formattedVal} ${currencyLabel}`;
    };

    Object.entries(courseMap).forEach(([key, info]) => {
      const price = formatCurrency(info.amount, info.currency);
      const link = `https://estoyonline.es/tr/payment?course=${key}`;

      if (info.name.includes("Özel Ders")) {
        // Regex 1: "Özel Ders (X kişi, Y ders)"
        // Regex 2: "Y derslik özel ders paketi" (1 kişi varsayılan)
        // Regex 3: "Y derslik Z kişilik grup" (veya özel ders)
        
        let studentCount = "1";
        let lessonCount = "0";

        const matchMulti = info.name.match(/(\d+)\s*kişi.*(\d+)\s*ders/i); // "2 kişi, 10 ders"
        const matchLessonFirst = info.name.match(/(\d+)\s*derslik.*(\d+)\s*kişi/i); // "10 derslik 2 kişilik"
        const matchSingle = info.name.match(/(\d+)\s*derslik/i); // "10 derslik..." (kişi yoksa 1)

        if (matchMulti) {
             studentCount = matchMulti[1];
             lessonCount = matchMulti[2];
        } else if (matchLessonFirst) {
             lessonCount = matchLessonFirst[1];
             studentCount = matchLessonFirst[2];
        } else if (matchSingle) {
             studentCount = "1";
             lessonCount = matchSingle[1];
        } else {
             // Fallback
             const matchParen = info.name.match(/\(([^)]+)\)/);
             if (matchParen) {
                 const content = matchParen[1];
                 const pMatch = content.match(/(\d+)\s*kişi/);
                 const lMatch = content.match(/(\d+)\s*ders/);
                 if (pMatch) studentCount = pMatch[1];
                 if (lMatch) lessonCount = lMatch[1];
             }
        }

        privateLinks.push({
            studentCount,
            lessonCount,
            price,
            link
        });
      } else {
        groupLinks.push({
          title: info.name,
          price,
          link
        });
      }
    });

    setPaymentLinksGroup(groupLinks);
    setPaymentLinksPrivate(privateLinks);
  }, []);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Şifre doğrulama
  const adminPassword = process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD;

  // Authentication kontrolü - her zaman çağrılmalı
  useEffect(() => {
    const savedPassword = localStorage.getItem("coursesAdminPassword");
    const savedRememberMe = localStorage.getItem("coursesRememberMe") === "true";
    
    if (savedRememberMe && savedPassword === adminPassword) {
      setIsAuthenticated(true);
    }
  }, [adminPassword]);

  // Kurs verilerini yükle - sadece authenticated ise
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${blobUrl}?_ts=${Date.now()}`, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setCoursesEn(data.cardCoursesEn || []);
        // Payment links are loaded from courseMap, not blob anymore for display
        // setPaymentLinksGroup(data.paymentLinksGroup || []);
        // setPaymentLinksPrivate(data.paymentLinksPrivate || []);
        
        // Türkçe kursları yüklerken week değerlerini time'a göre düzelt
        const fixedCoursesTr = (data.cardCoursesTr || []).map((course: Course) => {
          let fixedWeek = course.week;
          // Time içindeki süre bilgisine göre week değerini düzelt
          if (course.time.includes("2,5 saat")) {
            fixedWeek = "Haftada 1 gün 2,5 saat";
          } else if (course.time.includes("2 saat")) {
            fixedWeek = "Haftada 1 gün 2 saat";
          } else if (course.time.includes("1 saat 15 dk")) {
            fixedWeek = "Haftada 2 gün 1 saat 15 dk";
          } else if (course.time.includes("1,5 saat")) {
            fixedWeek = "Haftada 1 gün 1,5 saat";
          }
          return {
            ...course,
            week: fixedWeek
          };
        });
        setCoursesTr(fixedCoursesTr);
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    fetchCourses();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setLoginError("");
      
      // "Beni hatırla" seçeneği işaretliyse şifreyi localStorage'a kaydet
      if (rememberMe) {
        localStorage.setItem("coursesAdminPassword", password);
        localStorage.setItem("coursesRememberMe", "true");
      } else {
        localStorage.removeItem("coursesAdminPassword");
        localStorage.removeItem("coursesRememberMe");
      }
    } else {
      setLoginError("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem("coursesAdminPassword");
    localStorage.removeItem("coursesRememberMe");
  };

  const saveCoursesWithData = async (
    enData: Course[], 
    trData: Course[],
    // Links are read-only from file, not saved to blob
  ) => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch("/api/courses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardCoursesEn: enData,
          cardCoursesTr: trData,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      
      // Başarılı kayıt mesajı
      setSaveMessage("✅ Cambios guardados correctamente");
      setTimeout(() => setSaveMessage(""), 3000); // 3 saniye sonra mesajı kaldır
    } catch (err) {
      console.error(err);
      setSaveMessage("❌ Error al guardar los cambios");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const saveCourses = async () => {
    await saveCoursesWithData(coursesEn, coursesTr);
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

  const deleteCourse = async (index: number) => {
    if (confirm("⚠️ El curso se eliminará permanentemente. ¿Estás seguro?")) {
      if (activeTab === "en") {
        const newCoursesEn = [...coursesEn];
        newCoursesEn.splice(index, 1);
        setCoursesEn(newCoursesEn);
        
        // Yeni state ile kaydet
        await saveCoursesWithData(newCoursesEn, coursesTr);
      } else {
        const newCoursesTr = [...coursesTr];
        newCoursesTr.splice(index, 1);
        setCoursesTr(newCoursesTr);
        
        // Yeni state ile kaydet
        await saveCoursesWithData(coursesEn, newCoursesTr);
      }
    }
  };

  const addCourse = () => {
    const newCourse: Course = {
      title: "Nuevo Curso",
      bold: activeTab === "en" ? "Monday" : "Pazartesi",
      lesson: activeTab === "en" ? "First class" : "İlk ders",
      time: activeTab === "en" ? "9:00 am Spain time" : "09:00 - 2,5 saat",
      week: activeTab === "en" ? "Once a week 2.5 hours" : "Haftada 1 gün 2,5 saat",
      month: activeTab === "en" ? "Oct 11" : "6 Ekim",
      teacher: "",
    };

    if (activeTab === "en") {
      setCoursesEn([newCourse, ...coursesEn]);
    } else {
      setCoursesTr([newCourse, ...coursesTr]);
    }
  };

  const formatTrMonth = (month: string) => {
    if (!month) return "";
    const match = month.match(/(\d+)\s([^\s]+)(?:\s+(\d{4}))?/);
    if (!match) return "";
    const day = match[1].padStart(2, "0");
    const monthMap: { [key: string]: string } = {
      Ocak: "01", Şubat: "02", Mart: "03", Nisan: "04", Mayıs: "05",
      Haziran: "06", Temmuz: "07", Ağustos: "08", Eylül: "09",
      Ekim: "10", Kasım: "11", Aralık: "12",
    };
    const m = monthMap[match[2]] || "01";
    const year = match[3] || "2025";
    return `${year}-${m}-${day}`;
  };

  const formatEnMonth = (month: string) => {
    if (!month) return "";
    
    // "Oct 11" formatını parse et
    const match = month.match(/([A-Za-z]+)\s+(\d+)(?:\s+(\d{4}))?/);
    if (match) {
      const monthName = match[1];
      const day = match[2].padStart(2, "0");
      
      const monthMap: { [key: string]: string } = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
        January: "01", February: "02", March: "03", April: "04", 
        June: "06", July: "07", August: "08", September: "09", 
        October: "10", November: "11", December: "12"
      };
      
      const m = monthMap[monthName] || "01";
      const year = match[3] || "2025";
      return `${year}-${m}-${day}`;
    }
    
    // Fallback: normal date parsing
    const d = new Date(month);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    
    return "";
  };

  const renderPaymentLinksSection = () => (
    <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Enlaces de Pago</h2>
      
      {/* Group 1: Group Lessons */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-blue-800">1. Clases Grupales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-sm shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left font-semibold">Nombre del curso</th>
                <th className="p-3 text-left font-semibold">Precio</th>
                <th className="p-3 text-left font-semibold">Enlace</th>
              </tr>
            </thead>
            <tbody>
              {paymentLinksGroup.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500 italic">No hay enlaces</td>
                </tr>
              )}
              {paymentLinksGroup.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <span className="block p-2 text-gray-800">{item.title}</span>
                  </td>
                  <td className="p-2">
                    <span className="block p-2 text-gray-800">{item.price}</span>
                  </td>
                  <td className="p-2">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-2 text-blue-600 underline">
                      {item.link}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group 2: Private Lessons */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-blue-800">2. Clases Particulares</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-sm shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left font-semibold">Estudiantes</th>
                <th className="p-3 text-left font-semibold">Clases</th>
                <th className="p-3 text-left font-semibold">Precio</th>
                <th className="p-3 text-left font-semibold">Enlace</th>
              </tr>
            </thead>
            <tbody>
              {paymentLinksPrivate.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500 italic">No hay enlaces</td>
                </tr>
              )}
              {paymentLinksPrivate.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <span className="block p-2 text-gray-800">{item.studentCount}</span>
                  </td>
                  <td className="p-2">
                    <span className="block p-2 text-gray-800">{item.lessonCount}</span>
                  </td>
                  <td className="p-2">
                     <span className="block p-2 text-gray-800">{item.price}</span>
                  </td>
                  <td className="p-2">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-2 text-blue-600 underline">
                      {item.link}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTable = (
    courses: Course[],
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
    isTr: boolean
  ) => (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse border-spacing-0 text-sm md:text-base">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left w-20"></th>
            <th className={`p-2 text-left ${isTr ? "w-[280px]" : "w-[250px]"}`}>Título</th>
            <th className={`p-2 text-left ${isTr ? "w-[130px]" : "w-[100px]"}`}>{isTr ? "Día" : "Day"}</th>
            <th className={`p-2 text-left ${isTr ? "w-[200px]" : "w-[230px]"}`}>Hora</th>
            <th className="p-2 text-left w-[230px]">Semana</th>
            <th className="p-2 text-left w-[100px]">Mes</th>
            <th className="p-2 text-left w-[200px]">Profesor</th>
            <th className="p-2 text-center w-10"></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => {
            // 🔹 Türkçe haftalık seçenek düzeltmesi
            const normalizedWeekValue = isTr
              ? (() => {
                  // Time içindeki süre bilgisine göre week değerini belirle
                  if (c.time.includes("2,5 saat")) {
                    return "Haftada 1 gün 2,5 saat";
                  }
                  if (c.time.includes("2 saat")) {
                    return "Haftada 1 gün 2 saat";
                  }
                  if (c.time.includes("1 saat 15 dk")) {
                    return "Haftada 2 gün 1 saat 15 dk";
                  }
                  if (c.time.includes("1,5 saat")) {
                    return "Haftada 1 gün 1,5 saat";
                  }
                  // Eğer time'da süre bilgisi yoksa, mevcut week değerini kullan
                  return c.week;
                })()
              : c.week;

            return (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-2 py-1 text-center">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <button onClick={() => moveRow(i, "up")} className="text-gray-600 hover:text-black">
                      <ArrowUp size={16} />
                    </button>
                    <button onClick={() => moveRow(i, "down")} className="text-gray-600 hover:text-black">
                      <ArrowDown size={16} />
                    </button>
                  </div>
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
                    {(isTr ? daysTr : days).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1">
                  <select
                    value={isTr ? c.time.split(" - ")[0] : c.time}
                    onChange={(e) => {
                      const list = [...courses];
                      // Time değiştiğinde süre kısmını koru
                      const currentDuration = isTr ? (c.time.split(" - ")[1] || "2,5 saat") : "";
                      const newTime = isTr ? `${e.target.value} - ${currentDuration}` : e.target.value;
                      list[i].time = newTime;
                      
                      // Türkçe tabında time değiştiğinde week'i de güncelle (sadece saat değiştiğinde)
                      if (isTr) {
                        if (currentDuration === "2,5 saat") {
                          list[i].week = "Haftada 1 gün 2,5 saat";
                        } else if (currentDuration === "2 saat") {
                          list[i].week = "Haftada 1 gün 2 saat";
                        } else if (currentDuration === "1 saat 15 dk") {
                          list[i].week = "Haftada 2 gün 1 saat 15 dk";
                        } else if (currentDuration === "1,5 saat") {
                          list[i].week = "Haftada 1 gün 1,5 saat";
                        }
                      }
                      
                      setCourses(list);
                    }}
                    className="border p-1 w-full rounded"
                  >
                    {(isTr ? hoursTr : hoursEn).map((h) => <option key={h}>{h}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1">
                  <select
                    value={normalizedWeekValue}
                    onChange={(e) => {
                      const list = [...courses];
                      list[i].week = e.target.value;
                      
                      // Week değiştiğinde time değerini de güncelle
                      if (isTr) {
                        const currentTimePart = c.time.split(" - ")[0];
                        if (e.target.value === "Haftada 1 gün 2,5 saat") {
                          list[i].time = `${currentTimePart} - 2,5 saat`;
                        } else if (e.target.value === "Haftada 1 gün 2 saat") {
                          list[i].time = `${currentTimePart} - 2 saat`;
                        } else if (e.target.value === "Haftada 2 gün 1 saat 15 dk") {
                          list[i].time = `${currentTimePart} - 1 saat 15 dk`;
                        } else if (e.target.value === "Haftada 1 gün 1,5 saat") {
                          list[i].time = `${currentTimePart} - 1,5 saat`;
                        }
                      }
                      
                      setCourses(list);
                    }}
                    className="border p-1 w-full rounded"
                  >
                    {(isTr ? weeksTr : weeks).map((w) => <option key={w}>{w}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1 text-center">
                  <input
                    type="date"
                    value={isTr ? formatTrMonth(c.month) : formatEnMonth(c.month)}
                    onChange={(e) => {
                      const list = [...courses];
                      const d = new Date(e.target.value);
                      if (isTr) {
                        const monthNamesTr = [
                          "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
                          "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
                        ];
                        list[i].month = `${d.getDate()} ${monthNamesTr[d.getMonth()]} ${d.getFullYear()}`;
                      } else {
                        list[i].month = `${d.toLocaleString("en", { month: "short" })} ${d.getDate()} ${d.getFullYear()}`;
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

  // Login sayfası gösterimi
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Acceso de Administración
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese la contraseña"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            
            {loginError && (
              <div className="text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Ana uygulama
  return (
    <div className="p-4 md:p-8">
      {/* Logout butonu */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("en")}
            className={`px-4 py-2 rounded ${activeTab === "en" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            🇬🇧 Para Extranjeros
          </button>
          <button
            onClick={() => setActiveTab("tr")}
            className={`px-4 py-2 rounded ${activeTab === "tr" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            🇹🇷 Para Turcos
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex gap-3 items-center">
          <button onClick={addCourse} className="px-3 py-2 bg-green-500 text-white rounded text-sm">+ Nuevo curso</button>
          
          <div className="flex flex-col">
            <button
              onClick={saveCourses}
              disabled={saving}
              className="px-3 py-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
            >
              💾 Guardar cambios
            </button>
            {saveMessage && (
              <div className={`mt-1 text-xs ${saveMessage.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </div>
            )}
          </div>
        </div>
        <div>
           <button 
            onClick={() => setShowPaymentLinks(!showPaymentLinks)} 
            className={`px-3 py-2 rounded text-sm text-white ${showPaymentLinks ? "bg-purple-700" : "bg-purple-500"}`}
          >
            {showPaymentLinks ? "Ocultar Enlaces de Pago" : "Enlaces de Pago"}
          </button>
        </div>
      </div>

      {showPaymentLinks && renderPaymentLinksSection()}

      {activeTab === "en"
        ? renderTable(coursesEn, setCoursesEn, false)
        : renderTable(coursesTr, setCoursesTr, true)}
    </div>
  );
}