// app/(PAGES)/[locale]/(OTHER_PAGES)/Organizarcourses342X/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTranslation } from '@/contexts/TranslationProvider';
import { PriceData } from '@/types/PropTypes';

interface CourseCard {
  title: string;
  bold: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
}

export default function CourseManagementPage() {
  const { t } = useTranslation();
  const data: PriceData = t("courses");
  
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCourse, setNewCourse] = useState<CourseCard>({
    title: '',
    bold: '',
    lesson: 'First class',
    time: '',
    week: '',
    month: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  // İlk yüklemede mevcut kursları al
  useEffect(() => {
    if (data?.cardCourses) {
      setCourses(data.cardCourses);
    }
  }, [data]);

  // Sürükle-bırak işlemini yönet
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(courses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCourses(items);
  };

  // Yeni kurs ekle
  const handleAddCourse = () => {
    if (newCourse.title && newCourse.bold && newCourse.time && newCourse.week && newCourse.month) {
      setCourses([...courses, { ...newCourse }]);
      setNewCourse({
        title: '',
        bold: '',
        lesson: 'First class',
        time: '',
        week: '',
        month: ''
      });
      setIsAdding(false);
    }
  };

  // Kurs düzenle
  const handleEditCourse = (index: number) => {
    setEditingIndex(index);
    setNewCourse(courses[index]);
  };

  // Kurs güncelle
  const handleUpdateCourse = () => {
    if (editingIndex !== null && newCourse.title && newCourse.bold && newCourse.time && newCourse.week && newCourse.month) {
      const updatedCourses = [...courses];
      updatedCourses[editingIndex] = { ...newCourse };
      setCourses(updatedCourses);
      setEditingIndex(null);
      setNewCourse({
        title: '',
        bold: '',
        lesson: 'First class',
        time: '',
        week: '',
        month: ''
      });
    }
  };

  // Kurs sil
  const handleDeleteCourse = (index: number) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  // İptal
  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setNewCourse({
      title: '',
      bold: '',
      lesson: 'First class',
      time: '',
      week: '',
      month: ''
    });
  };

  // Verileri kaydet (gerçek uygulamada API'ye gönderilecek)
  const handleSaveChanges = () => {
    // Burada verileri backend'e kaydedebilirsiniz
    console.log("Güncellenmiş kurslar:", courses);
    alert("Değişiklikler kaydedildi! (Konsola bakın)");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Kurs Bilgileri Yönetimi</h1>
      
      {/* Ekleme/Düzenleme Formu */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isAdding ? 'Yeni Kurs Ekle' : editingIndex !== null ? 'Kursu Düzenle' : 'Kurs İşlemleri'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kurs Başlığı</label>
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Örn: A1.1 Beginner"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Gün</label>
            <input
              type="text"
              value={newCourse.bold}
              onChange={(e) => setNewCourse({...newCourse, bold: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Örn: Monday"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Saat</label>
            <input
              type="text"
              value={newCourse.time}
              onChange={(e) => setNewCourse({...newCourse, time: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Örn: 6:00 pm Spain time"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Haftalık Program</label>
            <input
              type="text"
              value={newCourse.week}
              onChange={(e) => setNewCourse({...newCourse, week: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Örn: Once a week 2.5 hours"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Başlangıç Tarihi</label>
            <input
              type="text"
              value={newCourse.month}
              onChange={(e) => setNewCourse({...newCourse, month: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Örn: Oct 11"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {isAdding ? (
            <>
              <button 
                onClick={handleAddCourse}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Ekle
              </button>
              <button 
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                İptal
              </button>
            </>
          ) : editingIndex !== null ? (
            <>
              <button 
                onClick={handleUpdateCourse}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Güncelle
              </button>
              <button 
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                İptal
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Yeni Kurs Ekle
            </button>
          )}
        </div>
      </div>
      
      {/* Kurs Listesi - Sürükle Bırak ile */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Kurs Listesi</h2>
          <button 
            onClick={handleSaveChanges}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="courses">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {courses.map((course, index) => (
                  <Draggable key={index} draggableId={index.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between p-4 mb-3 bg-gray-50 rounded border"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-4">
                            <div>
                              <span className="font-semibold">Başlık:</span> {course.title}
                            </div>
                            <div>
                              <span className="font-semibold">Gün:</span> {course.bold}
                            </div>
                            <div>
                              <span className="font-semibold">Saat:</span> {course.time}
                            </div>
                            <div>
                              <span className="font-semibold">Program:</span> {course.week}
                            </div>
                            <div>
                              <span className="font-semibold">Başlangıç:</span> {course.month}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditCourse(index)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                          >
                            Düzenle
                          </button>
                          <button 
                            onClick={() => handleDeleteCourse(index)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {courses.length === 0 && (
          <p className="text-center text-gray-500 py-4">Henüz hiç kurs eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}