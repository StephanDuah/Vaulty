import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const apiUser = async (apiKey) => {
  const referenceId = uuidv4();

  try {
    await axios.post(
      `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser`,
      {
        providerCallbackHost: "string",
      },
      {
        headers: {
          "X-Reference-Id": referenceId,
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      }
    );

    return referenceId;
  } catch (error) {
    console.log(error.response);
  }
};

const apiKey = async (OcpKey) => {
  try {
    const userRefrenceId = await apiUser(OcpKey);
    const apk = await axios.post(
      `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${userRefrenceId}/apikey`,
      {
        providerCallbackHost: "string",
      },
      {
        headers: {
          "X-Reference-Id": userRefrenceId,
          "Ocp-Apim-Subscription-Key": OcpKey,
        },
      }
    );

    return {
      referenceId: userRefrenceId,
      api_key: apk.data.apiKey,
    };
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

const createAccessToken = async (ocpKey) => {
  try {
    const OcpKey = ocpKey;
    const { referenceId, api_key } = await apiKey(OcpKey);
    const token = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/token/",
      {
        providerCallbackHost: "string",
      },
      {
        auth: {
          username: referenceId,
          password: api_key,
        },
        headers: {
          "Ocp-Apim-Subscription-Key": OcpKey,
        },
      }
    );

    return token.data.access_token;
  } catch (error) {
    console.log(error.response);
  }
};

const createAccessTokenDisbursement = async (ocp) => {
  try {
    const OcpKey = ocp;
    const { referenceId, api_key } = await apiKey(OcpKey);
    const token = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/disbursement/token/",
      {
        providerCallbackHost: "string",
      },
      {
        auth: {
          username: referenceId,
          password: api_key,
        },
        headers: {
          "Ocp-Apim-Subscription-Key": OcpKey,
        },
      }
    );

    return token.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

export const requestToPay = async ({ amount, phoneNumber }) => {
  try {
    const referenceId = uuidv4();
    const ocp = process.env.MOMO_API_KEY_REQUEST;
    const token = await createAccessToken(ocp);
    console.log(token);
    const config = {
      headers: {
        "X-Reference-Id": referenceId,
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": ocp,
        Authorization: `Bearer ${token}`,
      },
    };

    const body = {
      amount,
      currency: "EUR",
      externalId: "432125",
      payer: {
        partyIdType: "MSISDN",
        partyId: phoneNumber,
      },
      payerMessage: "Please Agree to the transaction by paying the said amount",
      payeeNote: "blablabla",
    };

    const response = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
      body,
      config
    );

    if (response.status === 202) {
      const data = await getPaymentStatus(config, referenceId);

      return { ...data, message: "payment approved" };
    }

    console.log(response);
    return "Something went wrong";
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

const getPaymentStatus = async (config, referenceId) => {
  try {
    const response = await axios.get(
      `https://sandbox.momodeveloper.mtn.com/collection/v2_0/payment/${referenceId}`,
      config
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getDepositStatus = async (config, referenceId) => {
  try {
    const response = await axios.get(
      `https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/deposit/${referenceId}`,
      config
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const releaseMoney = async ({ amount, phoneNumber }) => {
  try {
    const referenceId = uuidv4();
    const ocp = process.env.MOMO_API_KEY_RECIEVE;
    console.log(ocp);
    const token = await createAccessTokenDisbursement(ocp);
    console.log(token);
    const config = {
      headers: {
        "X-Reference-Id": referenceId,
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": ocp,
        Authorization: `Bearer ${token}`,
      },
    };

    const body = {
      amount,
      currency: "EUR",
      externalId: "432125",
      payee: {
        partyIdType: "MSISDN",
        partyId: phoneNumber,
      },
      payerMessage: "Please Agree to the transaction by paying the said amount",
      payeeNote: "blablabla",
    };
    const response = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/disbursement/v2_0/deposit",
      body,
      config
    );

    if (response.status === 202) {
      const data = await getDepositStatus(config, referenceId);
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
