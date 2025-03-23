export interface Course {
  course: string;
  duration: string;
  price: number;
}

// price Tables headers
export const onlineSpanishOneColumns = [
  { key: "course", header: "Course" },
  { key: "duration", header: "Duration" },
  { key: "price", header: "Price" },
] as const;

export const onlineSpanishTwoColumns = [
  { key: "course", header: "Course" }, // Different header
  { key: "duration", header: "Duration" },
  { key: "price", header: "Price" },
] as const;

export const extraSpanishColumns = [
  { key: "course", header: "Course" }, // Unique header
  { key: "duration", header: "Duration" },
  { key: "price", header: "Price" },
//   { key: "price", header: "Price", render: (value: number) => `$${value.toFixed(2)}` },
] as const;
