import React, { useState } from 'react';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading
  const [vectorizedData, setVectorizedData] = useState(null); // State to hold vectorized data

  const handleImageChange = (event) => {
    console.log('file upload');
    setVectorizedData(null);
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = () => {
    if (imageFile) {
      setLoading(true); // Set loading to true while request is being processed
      const formData = new FormData();
      formData.append('imageData', imageFile);

      fetch('http://localhost:8000/vectorize', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          setLoading(false); // Set loading to false after response
          if (response.ok) {
            console.log('Vectorization request sent successfully.');
            return response.json();
          } else {
            console.error('Failed to send vectorization request.');
          }
        })
        .then(data => {
          console.log('Vectorization request sent successfully.');
          // setImageFile(null);
          setVectorizedData(data.vectorizedData); // Save vectorized data in state
        })
        .catch(error => {
          setLoading(false); // Set loading to false on error
          console.error('Error while sending vectorization request:', error);
        });
    } else {
      console.warn('No image selected.');
    }
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
        {/* Button with loading state */}
        <button onClick={handleSubmit} className="btn" disabled={loading}>
          {loading ? 'Loading...' : 'Vectorize'}
        </button>
      </div>      
      {/* Display the uploaded image */}
      {imageFile &&
        <>
          <h3>Original Image</h3>
          <img
            src={URL.createObjectURL(imageFile)}
            style={{ marginTop: '20px', width: '400px', height: '400px', objectFit: 'cover' }}
            alt="Original Preview"
          />
        </>
      }
      {/* Display the vectorized image */}
      {vectorizedData &&
        <>
          <h3>Vectorized Image</h3>
          <img
            src={'data:image/svg+xml;base64,' + btoa(vectorizedData)}
            style={{ marginTop: '20px', width: '400px', height: '400px', objectFit: 'cover' }}
            alt="Vectorized Preview"
          />
        </>
      }
    </div>
  );
}

export default App;
