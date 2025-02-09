import React from "react";

interface IllustrateImageComponentProps {
  images: string[];
}

const IllustrateImageComponent: React.FC<IllustrateImageComponentProps> = ({ images }) => {
  return (
    <div className="w-full py-10">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Illustration ${index + 1}`}
            className={`object-cover ${
              index === 1 ? "max-w-[100px] w-auto transition-all self-start" : "max-w-sm w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default IllustrateImageComponent;
