const sendMessage = async (message, to) => {
  const MESSAGING_URL = process.env.MESSAGING_URL;
  const MESSAGING_API = process.env.MESSAGING_API;
  const recipient = to || "233257851163";

  console.log(MESSAGING_API);
  console.log(MESSAGING_URL);

  const headers = {
    Authorization: `Bearer ${MESSAGING_API}`,
    "Content-Type": "application/json",
  };
  const data = {
    messaging_product: "whatsapp",
    to: recipient,
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true, status: response.status };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

export const sendTemplate = async (to) => {
  const url = "https://graph.facebook.com/v21.0/570426866147286/messages";
  const token = process.env.META_MESSAGING_API;
  const recipient = to || "233257851163";

  const data = {
    messaging_product: "whatsapp",
    to: recipient,
    type: "template",
    template: {
      name: "confirm_shipment",
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
    return { success: true, status: response.status };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

export const sendSellerReminder = async (to) => {
  const message = "Please you must ship the product with transaction";
  return await sendMessage(message, to);
};

export const sendBuyerReminder = async (to) => {
  const message =
    "Hi Mr stephan a reminder has been sent to the seller to confirm shipment within two days or you will get your refund";
  return await sendMessage(message, to);
};

export const sendRefundMessageSeller = async (to, transactionId = "2000") => {
  try {
    const message = `Due to your inability to confirm shipment of transaction ${transactionId} the money has been refunded to the buyer. Please let us know if there was any problem as to why you could not complete the transaction`;
    return await sendMessage(message, to);
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

export const sendHello = async (to) => {
  const url = "https://graph.facebook.com/v21.0/570426866147286/messages";
  const token = process.env.MESSAGING_API;
  const recipient = to || "233257851163";

  const data = {
    messaging_product: "whatsapp",
    to: recipient,
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
    return { success: true, status: response.status };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

export const sendMessages = async (type, personel, info, to) => {
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
        message = `Shipment for product code ${info?.product} has been confirmed`;
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

    return await sendMessage(message, to);
  } catch (error) {
    console.error("Error: " + error.message);
    return { success: false, error: error.message };
  }
};
