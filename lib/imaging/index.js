import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "deezyblog",
  api_key: 881878832214723,
  api_secret: "KmwqgLP-UmnNux3LvV17Va8sfEU",
  secure: true,
});

module.exports = { cloudinary };
