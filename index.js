const tls = require("tls");
const { Buffer } = require("buffer");
const TO_EMAILS = Array(1).fill("bepaxav408@stikezz.com");
const CONNECTIONS = 1;
const startTime = process.hrtime();
const USERNAME = "";
const PASSWORD = "";

function createConnection(emailQueue) {
  return new Promise((resolve, reject) => {
    const client = tls.connect(465, "smtp.gmail.com", () => {
      client.write(
        "EHLO localhost\r\n" +
          `AUTH PLAIN ${Buffer.from(`\0${USERNAME}\0${PASSWORD}`).toString(
            "base64"
          )}\r\n`
      );
    });

    client.on("data", async(data) => {
      const response = data.toString();
      if (response.includes("235")) {
        client.write(
          `MAIL FROM:<${USERNAME}>\r\nRCPT TO:<${emailQueue[0]}>\r\nDATA\r\n`
        );
      } else if (response.includes("354")) {
        client.write(
          [
            `From: courseplacement55@gmail.com`,
            `To: ${emailQueue.shift()}`,
            `Subject: SMTP test from smtp.gmail.com`,
            "",
            "Test message",
            ".",
          ].join("\r\n") + "\r\n"
        );
      } else if (response.includes("250 2.0.0 OK")) {
        if (emailQueue.length > 0) {
          client.write(
            `MAIL FROM:<${USERNAME}>\r\nRCPT TO:<${emailQueue[0]}>\r\nDATA\r\n`
          );
        } else {
          client.end();
        }
      }
    });
    client.on("end", () => {
      resolve();
    });

    client.on("error", (err) => {
      reject(err);
    });
  });
}

async function sendEmails() {
  const emailQueues = Array.from({ length: CONNECTIONS }, (_, i) =>
    TO_EMAILS.filter((_, j) => j % CONNECTIONS === i)
  );
  const connectionPromises = emailQueues.map((queue) => createConnection(queue));

  try {
    await Promise.all(connectionPromises);
    const endTime = process.hrtime(startTime); // End timer
    const duration = endTime[0] + endTime[1] / 1e9; // Calculate duration in seconds
    console.log(`All emails sent in ${duration.toFixed(3)} seconds`);
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}

sendEmails();
