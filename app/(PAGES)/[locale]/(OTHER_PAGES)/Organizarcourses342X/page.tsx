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

  // İlk yüklemede mevcut kursları al ve kayıtlı şifreyi kontrol et
  useEffect(() => {
    if (data?.cardCourses) {
      setCourses(data.cardCourses);
    }

    // Kayıtlı şifreyi kontrol et
    const savedPassword = localStorage.getItem('courses_admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
      // Otomatik giriş yap
      const correctPassword = process.env.NEXT_PUBLIC_COURSES_ADMIN_PASSWORD;
      if (savedPassword === correctPassword) {
        setIsAuthenticated(true);
      }
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

  // ... diğer fonksiyonlar aynı kalacak