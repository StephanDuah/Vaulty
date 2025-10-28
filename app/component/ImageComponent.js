"use client";
import Image from "next/image";
import React from "react";
import { useRef, useState } from "react";

const ImageComponent = ({ name, label }) => {
  const imageRef = useRef(null);
  const [image, setImage] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-10">
      <div className="py-5">
        {image ? (
          <Image src={image} alt="image" width={500} height={100} />
        ) : (
          <p> No Image </p>
        )}
      </div>
      <input
        type="file"
        id={name}
        name={name}
        accept="image/*"
        ref={imageRef}
        onChange={handleImageChange}
        hidden
      />
      <button
        className="bg-black text-white px-6 py-3 rounded-xl"
        onClick={() => imageRef.current.click()}
      >
        {label}
      </button>
    </div>
  );
};

export default ImageComponent;
