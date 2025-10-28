import nodemailer from "nodemailer";
import { google } from "googleapis";
import { displayCurrency } from "../utils";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT
);
console.log(process.env.GOOGLE_REFRESH);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH });

export const sendMail = async (name, body) => {
  try {
    console.log(
      `client: ${process.env.GOOGLE_CLIENT_ID}, secret: ${process.env.GOOGLE_CLIENT_SECRET} `
    );
    const accessToken = await oauth2Client.getAccessToken();
    console.log(accessToken);
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "stephanduahsenkyire@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH,
        accessToken,
      },
    });
    const mailOption = {
      from: "TrustVault <selinadunna4@gmail.com>",
      to: "stephanduahsenkyire@gmail.com",
      subject: "Welcome to TrustVault",
      text: "Hello gmail email using API",
      html: generateTemplate(name, body),
    };
    const result = await transport.sendMail(mailOption);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const generateTemplate = (name, body) => `
<html lang="en">
     <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #155799;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }
        .content p {
            margin: 0 0 15px;
        }
        .cta {
            text-align: center;
            margin: 20px 0;
        }
        .cta a {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #155799;
            text-decoration: none;
            border-radius: 4px;
        }
        .cta a:hover {
            background-color: #45a049;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px; 
            font-size: 14px;
            color: #777;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to TrustVault</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            ${body}
        </div>
        <div class="footer">
            <p>&copy; 2024 TrustVault. All rights reserved.</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>
`;

export const sendSellerReminder = async (transaction) => {
  const message = `
     
      <p>Please remember: you must ship the products  associated with the transaction ${transaction._id} as soon as possible.</p>
      <p>Thank you for your prompt attention.</p>
    `;
  await sendMail("Kwaku", message);
};

export const sendShipmentMesaageToBuyer = async (transaction) => {
  const message = `
      <p>Hello your product with the transaction ID #${transaction._id}</p>
      <p>Please use this link to confirm delivery when you get the product</p>
      <a className='px-6 py-3 bg-blue-500 text-white' href="/api/confirmDelievery?transacID=${transaction._id}">Link</a>

  `;
  await sendMail("Kwaku", message);
};

export const sendBuyerReminder = async () => {
  const message = `

      <p>A reminder has been sent to the seller to confirm shipment within <b>two days</b>. Otherwise, you will receive a full refund.</p>
      <p>Thank you for your patience.</p>
    `;
  await sendMail("Kwaku", message);
};

export const sendRefundMessageSeller = async (transaction) => {
  try {
    const message = `
        <p>Dear Seller,</p>
        <p>Due to your failure to confirm shipment for <b>transaction #${
          transaction._id
        }</b>, the money ${displayCurrency(
      transaction.totalAmount
    )} has been refunded to the buyer.</p>
        <p>If there was any issue that prevented you from completing the transaction, please let us know.</p>
        <p>Thank you.</p>
      `;
    await sendMail("Kwaku", message);
  } catch (error) {
    console.error("Error sending refund message to seller:", error);
  }
};

export const delayedReleaseMessageBuyer = async () => {
  const message = `
      <p>Dear Buyer,</p>
      <p>Because you were unable to confirm delivery of the shipment in time, the money has been released to the seller.</p>
      <p>If there was any issue preventing you from completing the transaction, please contact us.</p>
      <p>Thank you for your understanding.</p>
    `;
  await sendMail("Kwaku", message);
};
