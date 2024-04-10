import React, { useState } from 'react';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading
  const [vectorizedData, setVectorizedData] = useState(null); // State to hold vectorized data
  const [maxColors, setMaxColors] = useState(0); // New state for max colors
  const [antiAliasing, setAntiAliasing] = useState('anti_aliased'); // Default value set to 'anti_aliased'
  const [drawStyle, setDrawStyle] = useState('fill_shapes'); // Default value set to 'stroke_shapes'
  const [useOverrideColor, setUseOverrideColor] = useState('false'); // Default value set to 'stroke_shapes'

  const handleImageChange = (event) => {
    console.log('file upload');
    setVectorizedData(null);
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleMaxColorsChange = (event) => {
    const value = parseInt(event.target.value);
    if (value >= 0 && value <= 256) {
      setMaxColors(value);
    }
  };

  const handleDrawStyleChange = (event) => {
    setDrawStyle(event.target.value);
  };

  const handleAntiAliasingChange = (event) => {
    setAntiAliasing(event.target.value);
  };

  const handleUserOverriedColorChange = (event) => {
    setUseOverrideColor(event.target.value);
  }

  const handleSubmit = () => {
    if (imageFile) {
      setVectorizedData(null);
      setLoading(true); // Set loading to true while request is being processed
      const formData = new FormData();
      formData.append('imageData', imageFile);
      formData.append('processingMax_colors', maxColors);
      formData.append('outputBitmapAnti_aliasing_mode', antiAliasing)
      formData.append('outputDraw_style', drawStyle);
      formData.append('outputStokesUse_override_color', useOverrideColor);

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
      {/* Display max colors value */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="maxColors">
          Max Colors:&nbsp;
        </label>
        <input
          type="number"
          name="maxColors"
          id="maxColors"
          className="number-input"
          min="0"
          max="256"
          value={maxColors}
          onChange={handleMaxColorsChange}
        />
      </div>
      {/* Add comboBox for antiAliasing */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="antiAliasing">Anti-Aliasing:&nbsp;</label>
        <select
          id="antiAliasing"
          name="antiAliasing"
          value={antiAliasing}
          onChange={handleAntiAliasingChange}
        >
          <option value="anti_aliased">Anti-Aliased</option>
          <option value="aliased">Aliased</option>
        </select>
      </div>
      {/* Add comboBox for drawStyle */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">Draw-Style:&nbsp;</label>
        <select
          id="drawStyle"
          name="drawStyle"
          value={drawStyle}
          onChange={handleDrawStyleChange}
        >
          <option value="fill_shapes">fill_shapes</option>
          <option value="stroke_shapes">stroke_shapes</option>
          <option value="stroke_edges">stroke_edges</option>
        </select>
      </div>
      {/* Add comboBox for overriedColor */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">Override-Color:&nbsp;</label>
        <select
          id="overrideColor"
          name="overrideColor"
          value={useOverrideColor}
          onChange={handleUserOverriedColorChange}
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
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
