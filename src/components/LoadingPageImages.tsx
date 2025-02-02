import { useEffect, useState } from "react";

export function LoadingPageImages() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/images/loading/1.png",
    "/images/loading/2.png",
    "/images/loading/3.png",
    "/images/loading/4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 150); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative size-20">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className={`absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 transition-opacity ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
