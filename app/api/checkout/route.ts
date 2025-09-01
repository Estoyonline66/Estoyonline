// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Tip uyumlu API sürümü
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { studentName, courseKey } = await req.json();

    // Kurs bilgileri
    const courseMap: Record<string, { name: string; amount: number; currency: string }> = {
      "A1.1_başlangıç_kursu_Türkiye_ab1X": { name: "A1.1 Başlangıç (Türkiye)", amount: 50000, currency: "try" },
      "Complementary_course_120_EUR_v7Qe": { name: "Complementary Course", amount: 12000, currency: "eur" },
      // ... diğer kurslar
    };

    const course = courseMap[courseKey];
    if (!course) {
      return NextResponse.json({ error: "Invalid course" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://your-vercel-url.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: course.currency,
            product_data: { name: course.name },
            unit_amount: course.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      custom_fields: [
        {
          key: "student_name",
          label: { type: "custom", custom: "Öğrenci Adı" },
          type: "text",
          optional: false,
        },
      ],
      metadata: { studentName, courseKey },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // TypeScript ve ESLint uyumlu
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
