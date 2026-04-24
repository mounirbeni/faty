"use server";

import { Resend } from "resend";
import { questionsData } from "@/data/questions";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitGameAction(answers: Record<number, string>, reversed: number[]) {
  try {
    const toEmail = process.env.MY_EMAIL_ADDRESS;
    if (!toEmail) {
      throw new Error("Missing destination email address. Please configure MY_EMAIL_ADDRESS.");
    }

    const reversedSet = new Set(reversed);

    let htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #e11d48; text-align: center;">Faty's Answers 💌</h1>
        <p style="text-align: center; color: #666;">She has finished the game! Here are her locked answers.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
    `;

    // Group by category
    let currentCategory = 0;

    questionsData.forEach((q) => {
      if (q.category !== currentCategory) {
        htmlContent += `<h2 style="color: #be123c; margin-top: 30px;">Chapter ${q.category}: ${q.categoryName}</h2>`;
        currentCategory = q.category;
      }

      const isSkipped = reversedSet.has(q.id);
      const answer = answers[q.id];

      htmlContent += `
        <div style="margin-bottom: 24px; padding: 16px; background: #fff1f2; border-radius: 12px;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #4c0519; font-size: 15px;">
            Q${q.id}: ${q.question}
          </p>
          <div style="margin: 0; padding: 12px; background: #fff; border-radius: 8px; border-left: 4px solid ${isSkipped ? '#fbbf24' : '#e11d48'};">
      `;

      if (isSkipped) {
        htmlContent += `<span style="color: #d97706; font-style: italic;">🔄 Skipped (Reverse Card Played - You answer this one!)</span>`;
      } else if (!answer) {
        htmlContent += `<span style="color: #9ca3af; font-style: italic;">No answer provided.</span>`;
      } else {
        // Safely encode basic HTML to prevent any injection and preserve line breaks
        const safeAnswer = answer.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        htmlContent += `<span style="color: #1f2937; white-space: pre-wrap;">${safeAnswer}</span>`;
      }

      htmlContent += `
          </div>
        </div>
      `;
    });

    htmlContent += `
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">Sent securely from Faty's PWA.</p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Faty's Game <onboarding@resend.dev>",
      to: [toEmail],
      subject: "💖 Faty has locked her answers!",
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (err) {
    console.error("Submission error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to send answers." };
  }
}
