"use client";
import React, { use, useRef, useState } from "react";
import Image from "next/image";

const ImagePicker = () => {
  const ImageInput = useRef();
  const [selectedImage, setSelectedImage] = useState("");
  const [error, setError] = useState("");
  const onClick = () => {
    ImageInput.current.click();
  };

  const handleOnChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (file && file.size > maxSize) {
      setError("File too large. Max size is 5MB.");

      event.target.value = "";
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log(fileReader.result);
      setSelectedImage(fileReader.result);
    };

    fileReader.readAsDataURL(file);
    setError("");
  };

  const handleDelete = () => {
    setSelectedImage("");
  };

  return (
    <div className="flex flex-col space-y-3">
      <label>Upload your Id</label>
      {error && <label className="text-lg text-red-500">{error}</label>}
      <div className="w-[250px] h-[200px] rounded-md border-2 border-gray-100 relative">
        {" "}
        {!selectedImage && (
          <div className="flex items-center justify-center w-full h-full">
            <span>No image picked yet.</span>
          </div>
        )}
        {selectedImage && (
          <>
            <Image
              src={selectedImage}
              alt="The image selected by"
              width={1000}
              height={1000}
              className="object-cover w-full h-full rounded-md z-50 "
            />
            <button
              onClick={handleDelete}
              className="w-[20px] h-[20px] absolute top-2 right-2 bg-red-500 text-white rounded-full text-sm shadow-2xl"
            >
              X
            </button>
          </>
        )}
      </div>

      <input
        ref={ImageInput}
        type="file"
        id="file"
        name="file"
        multiple={true}
        onChange={handleOnChange}
        hidden
      />
      <div>
        <button
          className="px-6 py-2 bg-red-500 rounded-full border-white border-2 text-white hover:bg-red-600 "
          onClick={onClick}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
