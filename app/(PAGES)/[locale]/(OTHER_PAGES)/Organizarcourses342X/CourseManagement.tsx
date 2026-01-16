"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, Save, Link as LinkIcon, LogOut, Lock } from "lucide-react";
import { CourseInfo } from "@/app/api/checkout/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const PRICES_BLOB_URL = "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/checkout/prices.json";

const COURSE_NAMES = [
  "A1.1 Başlangıç (Türkiye)",
  "A1.1 Başlangıç (Yurtdışı)",
  "A1.1 Sabah (Türkiye)",
  "Üst Seviyeler (Türkiye)",
  "Üst Seviyeler İndirimli (Türkiye)",
  "Üst Seviyeler (Yurtdışı)",
  "Tamamlayıcı Kurs (Türkiye)",
  "Tamamlayıcı Kurs (Yurtdışı)",
  "Complementary Course",
  "Upper level courses",
  "Examen",
  "Özel Ders (1 kişi, 10 ders)",
  "Özel Ders (1 kişi, 5 ders)",
  "Özel Ders (2 kişi, 10 ders)",
  "Özel Ders (2 kişi, 5 ders)",
  "Özel Ders (3 kişi, 10 ders)",
  "Özel Ders (3 kişi, 5 ders)",
  "Özel Ders (4 kişi, 10 ders)",
  "Özel Ders (4 kişi, 5 ders)",
  "Özel Ders (5 kişi, 10 ders)",
  "Özel Ders (5 kişi, 5 ders)"
];

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export default function CourseManagement() {
  const [coursesEn, setCoursesEn] = useState<Course[]>([]);
  const [coursesTr, setCoursesTr] = useState<Course[]>([]);
  const [showPaymentLinks, setShowPaymentLinks] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "tr">("en");
  
  const [prices, setPrices] = useState<Record<string, CourseInfo>>({});
  
  const defaultPrices: Record<string, CourseInfo> = {
      "New_Course_Default": { name: "Örnek Kurs (Düzenle)", amount: 10000, currency: "try" }
  };
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  const adminPassword = process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD;

  useEffect(() => {
    const savedPassword = localStorage.getItem("coursesAdminPassword");
    const savedRememberMe = localStorage.getItem("coursesRememberMe") === "true";
    
    if (savedRememberMe && savedPassword === adminPassword) {
      setIsAuthenticated(true);
    }
  }, [adminPassword]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${blobUrl}?_ts=${Date.now()}`, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setCoursesEn(data.cardCoursesEn || []);

        const fixedCoursesTr = (data.cardCoursesTr || []).map((course: Course) => {
          let fixedWeek = course.week;
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

    const fetchPrices = async () => {
        try {
            setLoadingPrices(true);
            setPriceError("");
            
            const res = await fetch(`${PRICES_BLOB_URL}?_ts=${Date.now()}`);
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Fiyatlar yüklenemedi. Status: ${res.status}, Message: ${errorText}`);
            }
            
            const pricesData = await res.json();
            console.log("✅ Fiyatlar başarıyla yüklendi:", pricesData);
            
            if (pricesData && typeof pricesData === 'object') {
                 setPrices(pricesData);
            } else {
                 throw new Error("Gelen veri geçerli bir fiyat listesi değil.");
            }

        } catch (err: unknown) {
            console.error("❌ Fiyat yükleme hatası (Detaylı):", err);
            
            let errorMessage = "Bilinmeyen bir hata oluştu.";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setPriceError(`Hata: ${errorMessage} - Varsayılan liste yüklendi.`);
            setPrices(defaultPrices);
        } finally {
            setLoadingPrices(false);
        }
    };

    fetchCourses();
    fetchPrices();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setLoginError("");
      
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
      
      setSaveMessage("✅ Cambios guardados correctamente");
      setTimeout(() => setSaveMessage(""), 3000);
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
        await saveCoursesWithData(newCoursesEn, coursesTr);
      } else {
        const newCoursesTr = [...coursesTr];
        newCoursesTr.splice(index, 1);
        setCoursesTr(newCoursesTr);
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
    
    const d = new Date(month);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    
    return "";
  };

  const [priceSaveMessage, setPriceSaveMessage] = useState("");

  const savePricesOnly = async () => {
    setSaving(true);
    setPriceSaveMessage("");
    try {
      const res = await fetch("/api/courses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prices: prices,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      
      setPriceSaveMessage("✅ Precios guardados correctamente");
      
      // Kayıttan sonra verileri tekrar çekerek ekranı güncelle
      await fetchPrices();
      
      setTimeout(() => setPriceSaveMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setPriceSaveMessage("❌ Error al guardar precios");
      setTimeout(() => setPriceSaveMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const addPrice = () => {
     const randomId = Math.random().toString(36).substring(2, 6);
     const newKey = `precio_temp_${randomId}`;
     setPrices({
        [newKey]: { name: COURSE_NAMES[0], amount: 1000, currency: "eur" },
        ...prices
     });
  };

  const deletePrice = (key: string) => {
    if(!confirm("⚠️ ¿Estás seguro de eliminar este precio?")) return;
    const newPrices = { ...prices };
    delete newPrices[key];
    setPrices(newPrices);
  };

  const updatePrice = (key: string, field: keyof CourseInfo, value: string | number) => {
      setPrices(prev => ({
          ...prev,
          [key]: { ...prev[key], [field]: value }
      }));
  };

  const renderPaymentLinksSection = () => (
    <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <LinkIcon size={20} />
            Gestión de Precios y Enlaces
        </h2>
        <div className="flex gap-2 items-center">
            <Button 
                onClick={addPrice}
                className="bg-black hover:bg-gray-800 text-white"
                size="sm"
            >
                <Plus size={16} /> Nuevo Precio
            </Button>
            <div className="flex flex-col items-end">
                <Button 
                    onClick={savePricesOnly}
                    disabled={saving}
                    size="sm"
                    className="bg-black hover:bg-gray-800 text-white"
                >
                    <Save size={16} /> Guardar Precios
                </Button>
                {priceSaveMessage && (
                  <span className="text-xs text-green-600 mt-1 absolute -bottom-5 right-0 whitespace-nowrap">{priceSaveMessage}</span>
                )}
            </div>
        </div>
      </div>
      
      {loadingPrices && <p className="text-gray-500 text-sm p-4">Cargando precios...</p>}
      {priceError && <p className="text-destructive text-sm p-4">{priceError}</p>}
      
      {!loadingPrices && !priceError && (
      <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-sm shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b">
                <th className="p-3 text-left font-semibold">ID (Key)</th>
                <th className="p-3 text-left font-semibold">Nombre del Curso</th>
                <th className="p-3 text-left font-semibold">Monto (TL/EUR)</th>
                <th className="p-3 text-left font-semibold">Moneda</th>
                <th className="p-3 text-left font-semibold">Enlace Generado</th>
                <th className="p-3 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className={saving ? "opacity-50 pointer-events-none" : ""}>
              {Object.entries(prices).map(([key, info]) => (
                <tr key={key} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-2 text-gray-500 text-xs font-mono">{key}</td>
                  <td className="p-2">
                      <select
                          value={info.name}
                          onChange={(e) => updatePrice(key, "name", e.target.value)}
                          className={selectClass}
                          disabled={saving}
                      >
                        {COURSE_NAMES.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                        {!COURSE_NAMES.includes(info.name) && (
                            <option value={info.name}>{info.name}</option>
                        )}
                    </select>
                </td>
                  <td className="p-2">
                      <div className="flex items-center gap-2">
                          <Input 
                              type="number"
                              value={info.amount}
                              onChange={(e) => updatePrice(key, "amount", Number(e.target.value))}
                              className="w-24 h-9"
                              disabled={saving}
                          />
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                              {(info.amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {info.currency.toUpperCase()}
                          </div>
                      </div>
                  </td>
                  <td className="p-2">
                      <select
                          value={info.currency}
                          onChange={(e) => updatePrice(key, "currency", e.target.value)}
                          className={`${selectClass} w-24`}
                          disabled={saving}
                      >
                          <option value="eur">EUR</option>
                          <option value="try">TRY</option>
                          <option value="usd">USD</option>
                      </select>
                  </td>
                <td className="p-2">
                  <a 
                    href={`https://estoyonline.es/tr/payment?course=${key}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline text-xs flex items-center gap-1"
                  >
                    <LinkIcon size={12} /> Ver Enlace
                  </a>
                </td>
                <td className="p-2 text-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePrice(key)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 size={16} />
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );

  const renderTable = (
    courses: Course[],
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
    isTr: boolean
  ) => (
    <div className="overflow-x-auto w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="w-full border-collapse border-spacing-0 text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-3 text-left w-14"></th>
            <th className={`p-3 text-left font-medium text-gray-600 ${isTr ? "w-[280px]" : "w-[250px]"}`}>Título</th>
            <th className={`p-3 text-left font-medium text-gray-600 ${isTr ? "w-[130px]" : "w-[100px]"}`}>{isTr ? "Día" : "Day"}</th>
            <th className={`p-3 text-left font-medium text-gray-600 ${isTr ? "w-[200px]" : "w-[230px]"}`}>Hora</th>
            <th className="p-3 text-left font-medium text-gray-600 w-[230px]">Semana</th>
            <th className="p-3 text-left font-medium text-gray-600 w-[100px]">Mes</th>
            <th className="p-3 text-left font-medium text-gray-600 w-[200px]">Profesor</th>
            <th className="p-3 text-center w-10"></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => {
            const normalizedWeekValue = isTr
              ? (() => {
                  if (c.time.includes("2,5 saat")) return "Haftada 1 gün 2,5 saat";
                  if (c.time.includes("2 saat")) return "Haftada 1 gün 2 saat";
                  if (c.time.includes("1 saat 15 dk")) return "Haftada 2 gün 1 saat 15 dk";
                  if (c.time.includes("1,5 saat")) return "Haftada 1 gün 1,5 saat";
                  return c.week;
                })()
              : c.week;

            return (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors border-b last:border-b-0">
                <td className="px-2 py-2 text-center">
                  <div className="flex flex-col gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => moveRow(i, "up")}
                    >
                      <ArrowUp size={14} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => moveRow(i, "down")}
                    >
                      <ArrowDown size={14} />
                    </Button>
                  </div>
                </td>
                <td className="px-2 py-2">
                  <Input
                    value={c.title}
                    onChange={(e) => {
                      const list = [...courses];
                      list[i].title = e.target.value;
                      setCourses(list);
                    }}
                    className="h-9"
                  />
                </td>
                <td className="px-2 py-2">
                  <select
                    value={c.bold}
                    onChange={(e) => {
                      const list = [...courses];
                      list[i].bold = e.target.value;
                      setCourses(list);
                    }}
                    className={selectClass}
                  >
                    {(isTr ? daysTr : days).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select
                    value={isTr ? c.time.split(" - ")[0] : c.time}
                    onChange={(e) => {
                      const list = [...courses];
                      const currentDuration = isTr ? (c.time.split(" - ")[1] || "2,5 saat") : "";
                      const newTime = isTr ? `${e.target.value} - ${currentDuration}` : e.target.value;
                      list[i].time = newTime;
                      
                      if (isTr) {
                        if (currentDuration === "2,5 saat") list[i].week = "Haftada 1 gün 2,5 saat";
                        else if (currentDuration === "2 saat") list[i].week = "Haftada 1 gün 2 saat";
                        else if (currentDuration === "1 saat 15 dk") list[i].week = "Haftada 2 gün 1 saat 15 dk";
                        else if (currentDuration === "1,5 saat") list[i].week = "Haftada 1 gün 1,5 saat";
                      }
                      
                      setCourses(list);
                    }}
                    className={selectClass}
                  >
                    {(isTr ? hoursTr : hoursEn).map((h) => <option key={h}>{h}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <select
                    value={normalizedWeekValue}
                    onChange={(e) => {
                      const list = [...courses];
                      list[i].week = e.target.value;
                      
                      if (isTr) {
                        const currentTimePart = c.time.split(" - ")[0];
                        if (e.target.value === "Haftada 1 gün 2,5 saat") list[i].time = `${currentTimePart} - 2,5 saat`;
                        else if (e.target.value === "Haftada 1 gün 2 saat") list[i].time = `${currentTimePart} - 2 saat`;
                        else if (e.target.value === "Haftada 2 gün 1 saat 15 dk") list[i].time = `${currentTimePart} - 1 saat 15 dk`;
                        else if (e.target.value === "Haftada 1 gün 1,5 saat") list[i].time = `${currentTimePart} - 1,5 saat`;
                      }
                      
                      setCourses(list);
                    }}
                    className={selectClass}
                  >
                    {(isTr ? weeksTr : weeks).map((w) => <option key={w}>{w}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2 text-center">
                  <Input
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
                    className="text-center h-9"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    value={c.teacher || ""}
                    onChange={(e) => {
                      const list = [...courses];
                      list[i].teacher = e.target.value;
                      setCourses(list);
                    }}
                    className="h-9"
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCourse(i)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Lock size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
            Acceso de Administración
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">Ingrese su contraseña para continuar</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <div className="text-destructive text-sm text-center font-medium bg-destructive/10 p-2 rounded">
                {loginError}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
            >
              Acceder
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("en")}
            variant={activeTab === "en" ? "default" : "outline"}
            className={activeTab === "en" ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black border-black hover:bg-gray-100"}
          >
            🇬🇧 Para Extranjeros
          </Button>
          <Button
            onClick={() => setActiveTab("tr")}
            variant={activeTab === "tr" ? "default" : "outline"}
            className={activeTab === "tr" ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black border-black hover:bg-gray-100"}
          >
            🇹🇷 Para Turcos
          </Button>
        </div>
        <Button
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="ml-auto bg-black text-white hover:bg-gray-800"
        >
          <LogOut size={16} /> Cerrar Sesión
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex gap-2 items-center">
          <Button onClick={addCourse} className="bg-black text-white hover:bg-gray-800">
            <Plus size={16} /> Nuevo curso
          </Button>
          
          <div className="relative">
            <Button
              onClick={saveCourses}
              disabled={saving}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Save size={16} /> Guardar cambios
            </Button>
            {saveMessage && (
              <div className={`absolute -bottom-6 left-0 text-xs whitespace-nowrap ${saveMessage.includes("✅") ? "text-green-600" : "text-destructive"}`}>
                {saveMessage}
              </div>
            )}
          </div>
        </div>
        <div>
           <Button 
            onClick={() => setShowPaymentLinks(!showPaymentLinks)} 
            variant="outline"
            className={showPaymentLinks ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black border-black hover:bg-gray-100"}
          >
            {showPaymentLinks ? "Ocultar Enlaces de Pago" : "Enlaces de Pago"}
          </Button>
        </div>
      </div>

      {showPaymentLinks && renderPaymentLinksSection()}

      {activeTab === "en"
        ? renderTable(coursesEn, setCoursesEn, false)
        : renderTable(coursesTr, setCoursesTr, true)}
    </div>
  );
}
