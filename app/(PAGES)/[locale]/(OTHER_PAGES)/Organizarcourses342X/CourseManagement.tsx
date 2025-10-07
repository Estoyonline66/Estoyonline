"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Course {
  title: string;
  bold: string; // Dia
  lesson: string;
  time: string; // Hora
  week: string; // Semana
  month: string; // Mes (dd MMMM)
  teacher?: string;
}

const trDays = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
const weekOptions = ["Haftada 1 gün 2 saat","Haftada 2 gün 2,5 saat"];

const generateHours = () => {
  const hours: string[] = [];
  for(let h=9; h<=21; h++){
    hours.push(`${h.toString().padStart(2,'0')}:00`);
    hours.push(`${h.toString().padStart(2,'0')}:30`);
  }
  return hours;
}
const hourOptions = generateHours();

// TR ay isimleri
const trMonths = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

// TR month string → Date objesi
const parseTRMonth = (monthStr: string): Date => {
  const [dayStr, monthName] = monthStr.split(" ");
  const day = parseInt(dayStr,10);
  const month = trMonths.indexOf(monthName);
  const year = new Date().getFullYear();
  return new Date(year, month, day);
}

// Date objesi → TR month string
const formatTRMonth = (date: Date) => {
  const day = date.getDate();
  const monthName = trMonths[date.getMonth()];
  return `${day} ${monthName}`;
}

export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState<"en"|"tr">("en");
  const [coursesEn, setCoursesEn] = useState<Course[]>([]);
  const [coursesTr, setCoursesTr] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Burada blob’dan veri çek
    const fetchCourses = async () => {
      try {
        const res = await fetch(`https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json?_ts=${Date.now()}`, {cache:"no-cache"});
        const data = await res.json();
        setCoursesEn(data.en || []);
        setCoursesTr(data.tr || []);
      } catch(err) {
        console.error("Fetch error:", err);
      }
    }
    fetchCourses();
  }, []);

  const moveRow = (index: number, direction: "up"|"down") => {
    const list = activeTab==="en"?[...coursesEn]:[...coursesTr];
    const newIndex = direction==="up"?index-1:index+1;
    if(newIndex<0 || newIndex>=list.length) return;
    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    activeTab==="en"?setCoursesEn(list):setCoursesTr(list);
  }

  const deleteCourse = (index:number) => {
    if(!confirm("⚠️ El curso se eliminará permanentemente. ¿Estás seguro?")) return;
    const list = activeTab==="en"?[...coursesEn]:[...coursesTr];
    list.splice(index,1);
    activeTab==="en"?setCoursesEn(list):setCoursesTr(list);
  }

  const addCourse = () => {
    const newCourse: Course = {
      title:"Nuevo Curso",
      bold: activeTab==="tr"?"Pazartesi":"Monday",
      lesson:"First class",
      time: activeTab==="tr"?"09:00":"5:00 pm Spain time",
      week: activeTab==="tr"?weekOptions[0]:"Once a week 2.5 hours",
      month: formatTRMonth(new Date()),
      teacher:""
    }
    activeTab==="en"?setCoursesEn([newCourse,...coursesEn]):setCoursesTr([newCourse,...coursesTr]);
  }

  const saveCourses = async () => {
    setSaving(true);
    try{
      const res = await fetch(`/api/courses/save?locale=${activeTab}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ cardCourses: activeTab==="en"?coursesEn:coursesTr })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||"Save failed");
      alert("✅ Cursos guardados correctamente");
    }catch(err){
      console.error(err);
      alert("❌ Error al guardar");
    }finally{
      setSaving(false);
    }
  }

  const renderTable = (courses:Course[], setCourses:React.Dispatch<React.SetStateAction<Course[]>>) => (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm md:text-base border-collapse border-spacing-0">
        <thead>
          <tr>
            <th></th>
            <th className="w-[250px]">Title</th>
            <th className="w-[80px]">Dia</th>
            <th className="w-[130px]">Hora</th>
            <th className="w-[150px]">Semana</th>
            <th className="w-[120px]">Mes</th>
            <th className="w-[150px]">Profesor</th>
            <th className="w-[80px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c,i)=>(
            <tr key={i}>
              <td className="flex flex-col gap-1">
                <button onClick={()=>moveRow(i,"up")} className="text-blue-600">↑</button>
                <button onClick={()=>moveRow(i,"down")} className="text-blue-600">↓</button>
              </td>
              <td>
                <input value={c.title} onChange={e=>{const newCourses=[...courses]; newCourses[i].title=e.target.value; setCourses(newCourses)}} className="border p-1 w-full"/>
              </td>
              <td>
                <select value={c.bold} onChange={e=>{const newCourses=[...courses]; newCourses[i].bold=e.target.value; setCourses(newCourses)}} className="border p-1 w-full">
                  {(activeTab==="tr"?trDays:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]).map(day=>(
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </td>
              <td>
                <select value={c.time} onChange={e=>{const newCourses=[...courses]; newCourses[i].time=e.target.value; setCourses(newCourses)}} className="border p-1 w-full">
                  {(activeTab==="tr"?hourOptions:["5:00 pm Spain time","5:30 pm Spain time"]).map(hour=>(
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </td>
              <td>
                <select value={c.week} onChange={e=>{const newCourses=[...courses]; newCourses[i].week=e.target.value; setCourses(newCourses)}} className="border p-1 w-full">
                  {(activeTab==="tr"?weekOptions:["Once a week 2.5 hours","Once a week 2 hours"]).map(opt=>(
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </td>
              <td>
                {activeTab==="tr"?
                  <DatePicker
                    selected={parseTRMonth(c.month)}
                    onChange={(date:Date)=>{const newCourses=[...courses]; newCourses[i].month=formatTRMonth(date); setCourses(newCourses)}}
                    dateFormat="dd/MM/yyyy"
                    className="border p-1 w-full"
                  />
                  :
                  <input value={c.month} onChange={e=>{const newCourses=[...courses]; newCourses[i].month=e.target.value; setCourses(newCourses)}} className="border p-1 w-full"/>
                }
              </td>
              <td>
                <input value={c.teacher||""} onChange={e=>{const newCourses=[...courses]; newCourses[i].teacher=e.target.value; setCourses(newCourses)}} className="border p-1 w-full"/>
              </td>
              <td>
                <button onClick={()=>deleteCourse(i)} className="bg-red-600 text-white px-3 py-1 rounded">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="p-10 flex flex-col gap-5">
      <div className="flex gap-3">
        <button onClick={()=>setActiveTab("en")} className={`px-4 py-2 rounded ${activeTab==="en"?"bg-blue-600 text-white":"bg-gray-200"}`}>EN</button>
        <button onClick={()=>setActiveTab("tr")} className={`px-4 py-2 rounded ${activeTab==="tr"?"bg-blue-600 text-white":"bg-gray-200"}`}>TR</button>
      </div>
      <button onClick={addCourse} className="bg-green-600 text-white px-4 py-2 rounded w-fit">+ Yeni Kurs</button>
      {activeTab==="en"?renderTable(coursesEn,setCoursesEn):renderTable(coursesTr,setCoursesTr)}
      <button onClick={saveCourses} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded w-fit mt-3">
        {saving?"Saving...":"Guardar Cambios"}
      </button>
    </div>
  )
}
