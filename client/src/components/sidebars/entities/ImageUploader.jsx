//components/sidebars/entities/ImageUploader.jsx
export default function ImageUploader({ images, onUpload, onDelete }) {
  return (
    <div className="image-uploader">
      <label>Hình ảnh</label>
      <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} />
      <div className="image-preview-list">
        {images.map((url) => (
          <div key={url} className="image-item">
            <img src={url} alt="entity" />
            <button onClick={() => onDelete(url)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}
