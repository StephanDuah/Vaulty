const sendMessage = async (message) => {
  const MESSAGING_URL = process.env.MESSAGING_URL;
  const MESSAGING_API = process.env.MESSAGING_API;
  console.log(MESSAGING_API);
  console.log(MESSAGING_URL);
  const headers = {
    Authorization: `Bearer ${MESSAGING_API}`,
    "Content-Type": "application/json",
  };
  const data = {
    messaging_product: "whatsapp",
    to: "233257851163",
    type: "text",
    text: {
      body: message,
    },
  };

  try {
    const response = await fetch(MESSAGING_URL, {
      body: JSON.stringify(data),
      headers,
      method: "post",
    });
    console.log(response);
    console.log(response.ok);
  } catch (error) {
    console.log(error);
  }
};

export const sendTemplate = async () => {
  const url = "https://graph.facebook.com/v21.0/570426866147286/messages";
  const token = process.env.META_MESSAGING_API;
  const data = {
    messaging_product: "whatsapp",
    to: "233257851163",
    type: "template",
    template: {
      name: "confirm_shipement",
      language: {
        code: "en",
      },
    },
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      body: JSON.stringify(data),
      headers,
      method: "post",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Response status: " + response.status);
  } catch (error) {
    console.log(error);
  }
};

export const sendSellerReminder = async () => {
  const message = "Please you must ship the product with transaction";
  sendMessage(message);
};

export const sendBuyerReminder = async () => {
  const message =
    "Hi Mr stephan a reminder has been sent to the seller to confirm shipment within two days or you will get your refund";
  sendMessage(message);
};

export const sendRefundMessageSeller = async () => {
  try {
    const message =
      "Due to your inability to confirm shipment of transaction 2000 the money has been refunded to the buyer.Please there was any problem as to why you could not complete the ";
  } catch (error) {
    console.log(error);
  }
};

export const sendHello = async () => {
  const url = "https://graph.facebook.com/v21.0/570426866147286/messages";
  const token = process.env.MESSAGING_API;

  const data = {
    messaging_product: "whatsapp",
    to: "233257851163",
    type: "text",
    text: {
      body: "Hello",
    },
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      body: JSON.stringify(data),
      headers,
      method: "post",
    });
    console.log(response.status);
  } catch (error) {
    console.log(error);
  }
};

export const sendMessages = async (type, personel, info) => {
  try {
    let message = "";

    switch (type) {
      case "trac_successful":
        console.log(personel);
        switch (personel) {
          case "seller":
            message = `To Seller\nPayment of amount Ghc ${info?.amount} has been paid to you for the product code ${info?.product}`;
            break;
          case "buyer":
            message = `To Buyer\nPayment of amount Ghc ${info?.amount} has been paid for the product code ${info?.product}`;
            break;
          default:
            message = "Unknown personnel type.";
            break;
        }
        break;
      case "Shippment Confirmed":
        message = `Shippment for product code ${info?.product} has been confirmed`;
        break;
      case "Release of funds":
        message = `An amount of ghc ${info?.amount} has sent to your mobile money account for the Purchase of products with product code ${info?.product}`;
        break;
      case "Transaction Failed":
        message = "Transaction failed. Try again later.";
        break;
      default:
        message = "Unknown transaction type.";
        break;
    }

    await sendMessage(message);
  } catch (error) {
    console.error("Error: " + error.message);
  }
};
