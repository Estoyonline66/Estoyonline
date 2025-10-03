// app/(PAGES)/[locale]/(OTHER_PAGES)/Organizarcourses342X/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// Sortable item component
function SortableItem({ course, index, onEdit, onDelete }: {
  course: CourseCard;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: index.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-4 mb-3 bg-gray-50 rounded border cursor-move hover:bg-gray-100 transition-colors"
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
          onClick={(e) => {
            e.stopPropagation();
            onEdit(index);
          }}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
        >
          Düzenle
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Sil
        </button>
      </div>
    </div>
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // İlk yüklemede mevcut kursları al
  useEffect(() => {
    if (data?.cardCourses) {
      setCourses(data.cardCourses);
    }
  }, [data]);

  // Sürükle-bırak işlemini yönet
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCourses((items) => {
        const oldIndex = items.findIndex((_, index) => index.toString() === active.id);
        const newIndex = items.findIndex((_, index) => index.toString() === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
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
      alert('Kurs başarıyla eklendi!');
    } else {
      alert('Lütfen tüm alanları doldurun!');
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
      alert('Kurs başarıyla güncellendi!');
    } else {
      alert('Lütfen tüm alanları doldurun!');
    }
  };

  // Kurs sil
  const handleDeleteCourse = (index: number) => {
    if (confirm('Bu kursu silmek istediğinizden emin misiniz?')) {
      const updatedCourses = courses.filter((_, i) => i !== index);
      setCourses(updatedCourses);
      alert('Kurs başarıyla silindi!');
    }
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

  // Verileri kaydet
  const handleSaveChanges = () => {
    console.log("Güncellenmiş kurslar:", courses);
    // Burada verileri API'ye gönderebilirsiniz
    alert("Değişiklikler konsola kaydedildi! Gerçek uygulamada bu verileri API'ye göndermeniz gerekir.");
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-800">Kurs Bilgileri Yönetimi</h1>
          <p className="text-gray-600 mt-2">Kurs programlarını düzenleyin, sıralayın ve yönetin</p>
        </div>
        
        {/* Ekleme/Düzenleme Formu */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {isAdding ? 'Yeni Kurs Ekle' : editingIndex !== null ? 'Kursu Düzenle' : 'Kurs İşlemleri'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Kurs Başlığı *</label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: A1.1 Beginner"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Gün *</label>
              <input
                type="text"
                value={newCourse.bold}
                onChange={(e) => setNewCourse({...newCourse, bold: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: Monday"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Saat *</label>
              <input
                type="text"
                value={newCourse.time}
                onChange={(e) => setNewCourse({...newCourse, time: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: 6:00 pm Spain time"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Haftalık Program *</label>
              <input
                type="text"
                value={newCourse.week}
                onChange={(e) => setNewCourse({...newCourse, week: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: Once a week 2.5 hours"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Başlangıç Tarihi *</label>
              <input
                type="text"
                value={newCourse.month}
                onChange={(e) => setNewCourse({...newCourse, month: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: Oct 11"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            {isAdding ? (
              <>
                <button 
                  onClick={handleAddCourse}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ✓ Kurs Ekle
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  ✗ İptal
                </button>
              </>
            ) : editingIndex !== null ? (
              <>
                <button 
                  onClick={handleUpdateCourse}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ✓ Güncelle
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  ✗ İptal
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Yeni Kurs Ekle
              </button>
            )}
          </div>
        </div>
        
        {/* Kurs Listesi - Sürükle Bırak ile */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Kurs Listesi</h2>
              <p className="text-gray-600 text-sm mt-1">
                Kursları sürükleyip bırakarak sıralayabilirsiniz
              </p>
            </div>
            <button 
              onClick={handleSaveChanges}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              💾 Değişiklikleri Kaydet
            </button>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={courses.map((_, index) => index.toString())} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {courses.map((course, index) => (
                  <SortableItem
                    key={index}
                    course={course}
                    index={index}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          {courses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">Henüz hiç kurs eklenmemiş</p>
              <p className="text-gray-400 text-sm mt-2">Yukarıdaki "Yeni Kurs Ekle" butonuna tıklayarak kurs eklemeye başlayın</p>
            </div>
          )}
          
          {courses.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Toplam {courses.length} kurs</strong> - Kursları sürükleyerek sıralayabilir, düzenleyebilir veya silebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}