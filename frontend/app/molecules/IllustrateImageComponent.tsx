import React from "react";

interface IllustrateImageComponentProps {
  images: string[]; // Array of image URLs
}

const IllustrateImageComponent: React.FC<IllustrateImageComponentProps> = ({ images }) => {
  return (
    <div className="w-full bg-[#fafaeb] py-10">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Illustration ${index + 1}`} className="max-w-sm w-full object-cover" />
        ))}
      </div>
    </div>
  );
};

export default IllustrateImageComponent;
