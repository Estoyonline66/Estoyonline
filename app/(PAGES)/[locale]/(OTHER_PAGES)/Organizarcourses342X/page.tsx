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
      className="flex items-center justify-between p-4 mb-3 bg-gray-50 rounded border hover:bg-gray-100 transition-colors"
    >
      <div className="flex-1">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="font-semibold">Título:</span> {course.title}
          </div>
          <div>
            <span className="font-semibold">Día:</span> {course.bold}
          </div>
          <div>
            <span className="font-semibold">Hora:</span> {course.time}
          </div>
          <div>
            <span className="font-semibold">Programa:</span> {course.week}
          </div>
          <div>
            <span className="font-semibold">Comienzo:</span> {course.month}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(index);
          }}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Eliminar
        </button>

        {/* Drag handle */}
        <span
          {...listeners}
          className="ml-3 cursor-grab text-gray-400 hover:text-gray-600 select-none"
        >
          ⠿
        </span>
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  // Şifre kontrolü
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD;
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

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
      alert('¡Curso agregado con éxito!');
    } else {
      alert('¡Por favor complete todos los campos!');
    }
  };

  // Kurs düzenle
  const handleEditCourse = (index: number) => {
    setEditingIndex(index);
    setNewCourse({ ...courses[index] });
    setIsAdding(false);
	 window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Kurs güncelle
  const handleUpdateCourse = () => {
    if (editingIndex !== null) {
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
      alert('¡Curso actualizado con éxito!');
    }
  };

  // Kurs sil
  const handleDeleteCourse = (index: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      const updatedCourses = courses.filter((_, i) => i !== index);
      setCourses(updatedCourses);
      alert('¡Curso eliminado con éxito!');
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

const handleSaveChanges = async () => {
  try {
    const coursesData = {
      scheduleTitle: data?.scheduleTitle || "Programa de Cursos",
      title: data?.title || "Niveles de Español",
      levels: data?.levels || [],
      cardCourses: courses
    };

    console.log('📤 Saving courses to blob...');

    const response = await fetch('/api/courses/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coursesData),
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ ¡Cursos guardados exitosamente! Los cambios se verán reflejados automáticamente.');
      console.log('✅ Courses saved to:', result.url);
    } else {
      console.error('❌ Save error:', result);
      alert('❌ Error: ' + (result.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ Error saving:', error);
    alert('❌ Error al guardar los cambios');
  }
};



// Şifre giriş ekranı
if (!isAuthenticated) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Acceso Administrativo</h1>
          <p className="text-gray-600 mt-2">Ingrese la contraseña para acceder</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Ingrese la contraseña"
                required
              />
              <button
                type="button"
                onClick={() => {
                  const passwordInput = document.getElementById('password') as HTMLInputElement;
                  if (passwordInput) {
                    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                  }
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                👁️
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberPassword"
              onChange={(e) => {
                if (e.target.checked && password) {
                  localStorage.setItem('courses_admin_password', password);
                } else {
                  localStorage.removeItem('courses_admin_password');
                }
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberPassword" className="ml-2 block text-sm text-gray-700">
              Recordar contraseña
            </label>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}


  // Ana içerik
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Cursos</h1>
            <p className="text-gray-600 mt-2">Organice, ordene y administre los programas de cursos</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
        
        {/* Ekleme/Düzenleme Formu */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {isAdding ? 'Agregar Nuevo Curso' : editingIndex !== null ? 'Editar Curso' : 'Operaciones de Curso'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Título del Curso *</label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: A1.1 Principiante"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Día *</label>
              <input
                type="text"
                value={newCourse.bold}
                onChange={(e) => setNewCourse({...newCourse, bold: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Lunes"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Hora *</label>
              <input
                type="text"
                value={newCourse.time}
                onChange={(e) => setNewCourse({...newCourse, time: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 6:00 pm hora de España"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Programa Semanal *</label>
              <input
                type="text"
                value={newCourse.week}
                onChange={(e) => setNewCourse({...newCourse, week: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Una vez por semana 2.5 horas"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Fecha de Inicio *</label>
              <input
                type="text"
                value={newCourse.month}
                onChange={(e) => setNewCourse({...newCourse, month: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 11 Oct"
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
                  ✓ Agregar Curso
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  ✗ Cancelar
                </button>
              </>
            ) : editingIndex !== null ? (
              <>
                <button 
                  onClick={handleUpdateCourse}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ✓ Actualizar
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  ✗ Cancelar
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Nuevo Curso
              </button>
            )}
          </div>
        </div>
        
        {/* Kurs Listesi - Sürükle Bırak ile */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Lista de Cursos</h2>
              <p className="text-gray-600 text-sm mt-1">
                Arrastre y suelte para ordenar los cursos
              </p>
            </div>
            <button 
              onClick={handleSaveChanges}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              💾 Guardar Cambios
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
              <p className="text-gray-500 text-lg">Todavía no se han agregado cursos</p>
              <p className="text-gray-400 text-sm mt-2">Haga clic en el botón Nuevo Curso para comenzar</p>
            </div>
          )}
          
          {courses.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Total {courses.length} cursos</strong> - Arrastre para ordenar, edite o elimine cursos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
