import { Worker } from "bullmq";
import { config } from "dotenv";

config({
  path: "./.env",
});

export async function mockSendEmail(payload) {
  const { from, to, subject, body } = payload;
  return new Promise((resolve, reject) => {
    console.log(`Sending Email to ${to}....`);
    setTimeout(() => resolve(1), 2 * 1000);
  });
}

const worker = new Worker(
  "email-queue",
  async (job) => {
    const data = job.data;
    console.log(data);

    await mockSendEmail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      body: data.body,
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    },
  }
);

export default worker;
