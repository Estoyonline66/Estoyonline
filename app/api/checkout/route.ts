import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { courseMap, CourseInfo } from "./text";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { studentNames, courseKey }: { studentNames: string[]; courseKey: string } = await req.json();

    const course: CourseInfo | undefined = courseMap[courseKey];
    if (!course) return NextResponse.json({ error: "Invalid course" }, { status: 400 });

    const origin = req.headers.get("origin") || "https://estoyonline.es";

    // Metadata olarak öğrenci isimlerini JSON string halinde gönderiyoruz
    const metadata = {
      courseKey,
      studentNames: JSON.stringify(studentNames),
    };

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
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
