import React from "react";

interface IllustrateImageComponentProps {
  images: string[];
}

const IllustrateImageComponent: React.FC<IllustrateImageComponentProps> = ({ images }) => {
  return (
    <div className="relative w-full">
      {/* Full-width background container */}
      <div className="absolute inset-0 bg-green-600"></div>

      {/* Content container to keep images constrained */}
      <div className="relative max-w-7xl mx-auto py-10 flex flex-wrap justify-center gap-6">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Illustration ${index + 1}`} className="max-w-sm w-full object-cover" />
        ))}
      </div>
    </div>
  );
};

export default IllustrateImageComponent;
