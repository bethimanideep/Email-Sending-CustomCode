const tls = require("tls");
const { Buffer } = require("buffer");
const TO_EMAILS = Array(10).fill("bepaxav408@stikezz.com");
const CONNECTIONS = 1;
const startTime = process.hrtime();
const USERNAME = "bethimanideep@gmail.com";
const PASSWORD = "vhgrppebffryujcj";

function createConnection(emailQueue, i) {
  return new Promise((resolve, reject) => {
    const client = tls.connect(465, "smtp.gmail.com", () => {
      client.write(
        "EHLO localhost\r\n" +
          `AUTH PLAIN ${Buffer.from(`\0${USERNAME}\0${PASSWORD}`).toString(
            "base64"
          )}\r\n`
      );
    });

    client.on("data", (data) => {
      const response = data.toString();
      if (response.startsWith("235")) {
        send1(client, emailQueue[0]);
      } else if (response.startsWith("354  Go ahead")) {
        send2(client, emailQueue.shift());
      } else if (response.startsWith("250 2.0.0 OK")) {
        if (emailQueue.length > 0) {
          send1(client, emailQueue[0]);
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

    function send1(client, email) {
      client.write(
        `MAIL FROM:<courseplacement55@gmail.com>\r\nRCPT TO:<${email}>\r\nDATA\r\n`
      );
    }

    function send2(client, email) {
      client.write(
        [
          `From: courseplacement55@gmail.com`,
          `To: ${email}`,
          `Subject: SMTP test from smtp.gmail.com`,
          "",
          "Test message",
          ".",
        ].join("\r\n") + "\r\n"
      );
    }
  });
}
async function sendEmails() {
  const emailQueues = Array.from({ length: CONNECTIONS }, (_, i) =>
    TO_EMAILS.filter((_, j) => j % CONNECTIONS === i)
  );
  const connectionPromises = emailQueues.map((queue, i) => {
    createConnection(queue, i);
  });

  try {
    await Promise.all(connectionPromises)
      .then((data) => {
        console.log({ data });
        const endTime = process.hrtime(startTime); // End timer
        const duration = endTime[0] + endTime[1] / 1e9; // Calculate duration in seconds
        console.log(`All emails sent in ${duration.toFixed(3)} seconds`);
      })
      .catch((e) => console.log(e));
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}
sendEmails();
