import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setImage(image);
  };

  return (
    <div className="container">
      <h2>Image Vectorization</h2>
      <div>
        <label htmlFor="image" className="file-label">
          Select Image
        </label>
        <input
          type="file"
          name="image"
          id="image"
          className="file-input"
          onChange={handleImageChange}
        />
        <button onClick={handleSubmit} className="btn">Vectorize</button>
      </div>

      {/* Display the uploaded image */}
      {image &&
        <img
          id="preview"
          src={image}
          style={{ marginTop: '20px', width: '500px', height: '500px', objectFit: 'cover' }}
        />
      }
    </div>
  );
}

export default App;
