import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MarkerMetadataForm = ({ marker, onUpdate, onDelete, onCancel }) => {
  const [name, setName] = useState(marker.name || '');
  const [type, setType] = useState(marker.type || '');
  const [description, setDescription] = useState(marker.description || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(marker.image || null);
  const [errors, setErrors] = useState({ name: '', type: '' });

  // Update state when marker prop changes
  useEffect(() => {
    setName(marker.name || '');
    setType(marker.type || '');
    setDescription(marker.description || '');
    setImagePreview(marker.image || null);
    setImageFile(null);
    setErrors({ name: '', type: '' });
  }, [marker]);

  // Create preview when a new image file is selected
  useEffect(() => {
    if (imageFile) {
      const previewUrl = URL.createObjectURL(imageFile);
      setImagePreview(previewUrl);
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  }, [imageFile]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', type: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!type.trim()) {
      newErrors.type = 'Type is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const updatedMarker = {
      ...marker,
      name: name,
      type: type,
      description: description,
      image: imagePreview
    };
    if (imageFile) {
      updatedMarker.imageFile = imageFile;
    }
    onUpdate(updatedMarker);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this marker?`)) {
      onDelete(marker);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="marker-metadata-form">
      <h3>Edit Marker Metadata</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="marker-name">Name:</label><br/>
          <input
            id="marker-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>

        <div>
          <label htmlFor="marker-type">Type:</label><br/>
          <select
            id="marker-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">-- Select Type --</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Park">Park</option>
            <option value="Museum">Museum</option>
            <option value="Other">Other</option>
          </select>
          {errors.type && <div style={{ color: 'red' }}>{errors.type}</div>}
        </div>

        <div>
          <label htmlFor="marker-description">Description:</label><br/>
          <textarea
            id="marker-description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="marker-image">Image:</label><br/>
          <input
            id="marker-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
        </div>

        {imagePreview && (
          <div>
            <label>Preview:</label><br/>
            <img
              src={imagePreview}
              alt="Image preview"
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
          </div>
        )}

        <div style={{ marginTop: '10px' }}>
          <button type="submit">Update</button>
          <button type="button" onClick={handleDelete} style={{ marginLeft: '5px' }}>Delete</button>
          <button type="button" onClick={handleCancel} style={{ marginLeft: '5px' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

MarkerMetadataForm.propTypes = {
  marker: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default MarkerMetadataForm;
