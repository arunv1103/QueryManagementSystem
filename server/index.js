import express from "express";
import imaps from "imap-simple";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import { simpleParser } from "mailparser";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const otpStore = {};

app.post("/send-otp", async (req, res) => {
  try {
    const { email, validOtp } = req.body;

    if (!email || !validOtp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }
    otpStore[email] = { validOtp };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "thanka0raja@gmail.com",
        pass: "etlq kqck qhfz jnht",
      },
    });
    await transporter.sendMail({
      from: '"QMS" <thanka0raja@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${validOtp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/send-tickets", async (req, res) => {
  try {
    const { email, subject } = req.body;

    if (!email || !subject) {
      return res.status(400).json({ error: "Email and subject are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "thanka0raja@gmail.com",
        pass: "etlq kqck qhfz jnht",
      },
    });
    await transporter.sendMail({
      from: '"QMS" <thanka0raja@gmail.com>',
      to: email,
      subject: "Self assigned ticket",
      text: subject,
    });

    res.json({ success: true, message: "Self assigned successfully" });
  } catch (err) {
    console.error("Ticket assigning Error:", err);
    res.status(500).json({ error: "Failed to assign the ticket" });
  }
});


const config = {
  imap: {
    user: "rajazoi6379@gmail.com",
    password: "prmr gdxa pfzc pewu",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 30000,
    connTimeout: 30000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

app.post("/emails", async (req, res) => {
  const clientEmail = req.body.clientEmail || "akshayaarul1310@gmail.com";
  try {
    const emails = await readEmails(clientEmail);
    res.json({ status:"S", message: "Success", data:emails });
  } catch (err) {
    console.error("Emails API Error:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});


async function readEmails(clientEmail) {
  const connection = await imaps.connect({ imap: config.imap });
  await connection.openBox("INBOX");

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 3);

  //reading last three days tickets
  const imapDate = sinceDate
    .toUTCString()
    .split(" ")
    .slice(1, 4)
    .join("-");

  const searchCriteria = ["UNSEEN", ["SINCE", imapDate]];
  const fetchOptions = { bodies: [""], markSeen: true };

  const results = await connection.search(searchCriteria, fetchOptions);
  const emails = await Promise.all(
    results.map(async (res) => {
      const all = res.parts.find((part) => part.which === "")?.body;
      if (!all) return null;

      const parsed = await simpleParser(all);

      const subject = parsed.subject || "(No Subject)";
      const from = parsed.from?.text || "(Unknown Sender)";
      const date = parsed.date?.toString() || "(No Date)";
      const body = parsed.text?.trim() || parsed.html?.replace(/<\/?[^>]+(>|$)/g, "").trim() || "(No Content)";
      return { subject, from, date, body };
    })
  );
  return emails.filter(
    (email) =>
      email &&
      email.from.includes(clientEmail || "akshayaarul1310@gmail.com")
  );
}



app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
