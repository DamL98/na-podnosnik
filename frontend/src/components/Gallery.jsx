const images = [
  "/gallery/photo0.jpg",
  "/gallery/photo1.jpg",
  "/gallery/photo2.jpg",
  "/gallery/photo3.jpg",
  "/gallery/photo4.jpg",
  "/gallery/photo5.jpg",
  "/gallery/photo6.jpg",
  "/gallery/photo7.jpg",
  // "/gallery/photo8.jpg",
];

export default function Gallery() {
  return (
    <section  id="gallery" className="section">
      <h2>Galeria warsztatu</h2>

      <div className="gallery">
        {images.map((src, index) => (
          <img key={index} src={src} alt="Warsztat" />
        ))}
      </div>
    </section>
  );
}
