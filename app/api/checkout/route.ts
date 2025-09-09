import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { courseMap } from "./text";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { studentNames, courseKey, locale } = await req.json();

    console.log("📩 Received courseKey:", courseKey);
    const course = courseMap[courseKey];
    console.log("📦 Resolved course:", course);
    console.log("🌐 Locale:", locale);

    if (!course) {
      return NextResponse.json({ error: "Invalid course" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://estoyonline.es";
    const pathPrefix = locale === "tr" ? "/tr" : "/en";
    console.log("🌍 Origin:", origin, "Path prefix:", pathPrefix);

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
      success_url: `${origin}${pathPrefix}/payment?course=${encodeURIComponent(courseKey)}&status=success`,
      cancel_url: `${origin}${pathPrefix}/payment?course=${encodeURIComponent(courseKey)}&status=cancel`,
      metadata: { studentNames: JSON.stringify(studentNames), courseKey, locale },
    });

    console.log("✅ Stripe session created:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
