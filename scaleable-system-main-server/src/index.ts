import { Queue } from "bullmq";
import express from "express";
import { addUserToCourseQuery } from "./utils/course.js";
import { mockSendEmail } from "./utils/email.js";
import { config } from "dotenv";

config({
  path: "./.env",
});

const app = express();
const PORT = process.env.PORT ?? 8000;

const emailQueue = new Queue("email-queue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
});

app.get("/", (req, res) => {
  return res.json({ status: "success", message: "Hello from Express Server" });
});

app.post("/add-user-to-course", async (req, res) => {
  console.log("Adding user to course");
  // Critical
  await addUserToCourseQuery();

  // Non Critical
  emailQueue.add(`${Date.now()}`, {
    from: "piyushgarg.dev@gmail.com",
    to: "student@gmail.com",
    subject: "Congrats on enrolling in Twitter Course",
    body: "Dear Student, You have been enrolled to Twitter Clone Course.",
  });

  // await mockSendEmail({
  //   from: "piyushgarg.dev@gmail.com",
  //   to: "student@gmail.com",
  //   subject: "Congrats on enrolling in Twitter Course",
  //   body: "Dear Student, You have been enrolled to Twitter Clone Course.",
  // });

  return res.json({ status: "success", data: { message: "Enrolled Success" } });
});

app.listen(PORT, () => console.log(`Express Server Started on PORT:${PORT}`));
