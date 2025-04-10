import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const gmailClient = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


export const sender = {
	email: process.env.GMAIL_USER,
	name: "Samuel",
  };