import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  try {
    const { studentName, courseKey } = req.body;

    // Burada kurs bilgilerini mapping ile bulabilirsin
    const courseMap: Record<string, { name: string; amount: number; currency: string }> = {
      "A1.1_başlangıç_kursu_Türkiye_ab1X": { name: "A1.1 Başlangıç (Türkiye)", amount: 50000, currency: "try" },
      "Complementary_course_120_EUR_v7Qe": { name: "Complementary Course", amount: 12000, currency: "eur" },
      // ... diğer kurslar
    };

    const course = courseMap[courseKey];
    if (!course) {
      return res.status(400).json({ error: "Invalid course" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: course.currency,
            product_data: { name: course.name },
            unit_amount: course.amount, // kuruş/cent cinsinden
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      custom_fields: [
        {
          key: "student_name",
          label: { type: "custom", custom: "Öğrenci Adı" },
          type: "text",
          optional: false, // zorunlu alan
        },
      ],
      metadata: {
        courseKey,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
