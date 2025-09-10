import type { Request, Response } from "express";
import nodemailer from "nodemailer";

export async function handleContact(req: Request, res: Response) {
  try {
    const { name, email, phone, message } = req.body ?? {};

    if (!email || !message) {
      return res.status(400).json({ ok: false, error: "Missing required fields: email, message" });
    }

    const to = process.env.CONTACT_TO || "ongul357@gmail.com";
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return res.status(500).json({ ok: false, error: "SMTP configuration is missing on the server" });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    });

    const subject = `Yeni İletişim Mesajı${name ? ` - ${name}` : ""}`;

    const html = `
      <h2>Yeni İletişim Mesajı</h2>
      <p><strong>Ad Soyad:</strong> ${name || "-"}</p>
      <p><strong>E-posta:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || "-"}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${(message || "").toString().replace(/\n/g, "<br/>")}</p>
      <hr/>
      <small>Bu e-posta web sitesindeki iletişim formundan gönderildi.</small>
    `;

    await transporter.sendMail({
      from: `Web Formu <${user}>`,
      to,
      replyTo: email,
      subject,
      html,
    });

    return res.json({ ok: true });
  } catch (err: any) {
    console.error("/api/contact error", err);
    return res.status(500).json({ ok: false, error: "Failed to send email" });
  }
}
