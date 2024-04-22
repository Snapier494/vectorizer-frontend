import React, { useState } from 'react';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading
  const [vectorizedData, setVectorizedData] = useState(null); // State to hold vectorized data
  const [mode, setMode] = useState('test'); // New state for view mode
  const [maxColors, setMaxColors] = useState(0); // New state for max colors
  const [antiAliasing, setAntiAliasing] = useState('anti_aliased'); // Default value set to 'anti_aliased'
  const [drawStyle, setDrawStyle] = useState('fill_shapes'); // Default value set to 'fill_shapes'
  const [useOverrideColor, setUseOverrideColor] = useState('false'); // Default value set to 'false'
  const [adobeCompatibilityMode, setAdobeCompatibilityMode] = useState('false') // Default value set to 'false'
  const [groupBy, setGroupBy] = useState('none'); // Default value set to 'none'
  const [shapeStacking, setShapeStaking] = useState('cutouts'); //Default value set to 'cutouts;
  const [compatibility_level, setCompatibility_level] = useState('lines_and_arcs'); //Default value set to 'lines_and_arcs;
  const [parameterized_shapes_flatten, setParameterized_shapes_flatten] = useState('false');
  const [curves_allowed_quadratic_bezier, setCurves_allowed_quadratic_bezier] = useState('true');
  const [curves_allowed_cubic_bezier, setCurves_allowed_cubic_bezier] = useState('true');
  const [curves_allowed_circular_arc, setCurves_allowed_circular_arc] = useState('true');
  const [curves_allowed_elliptical_arc, setCurves_allowed_elliptical_arc] = useState('true');
  const [gap_fillter_enabled, setGap_fillter_enabled] = useState('true');

  const handleUrlChange = async(event) => {
    const url = event.target.value;
    setImageUrl(url);
  
    // Load image preview
    setImagePreviewUrl(url);
  

    console.log('url == ', url);
    
    fetch(`http://localhost:8000/fetch-image?imageUrl=${encodeURIComponent(url)}`, {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      return response.blob();
    })
    .then(blob => {
      const file = new File([blob], 'image'); // Create a file from the blob
      console.log('file = ', file);
      setImageFile(file); // Set the imageFile state
    })
    .catch(error => {
      console.error('Error fetching image:', error);
    });
    
  };

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

  const handleAdobeCompatibilityModeChange = (event) => {
    setAdobeCompatibilityMode(event.target.value);
  }

  const handleGroupByChange = (event) => {
    setGroupBy(event.target.value);
  }

  const handleSubmit = () => {
    if (imageFile) {
      console.log('imageFile = ', imageFile);
      setVectorizedData(null);
      setLoading(true); // Set loading to true while request is being processed
      const formData = new FormData();
      formData.append('imageData', imageFile);
      formData.append('viewMode', mode);
      formData.append('processingMax_colors', maxColors);
      formData.append('outputBitmapAnti_aliasing_mode', antiAliasing)
      formData.append('outputDraw_style', drawStyle);
      formData.append('outputStokesUse_override_color', useOverrideColor);
      formData.append('outputSvgAdobe_compatibility_mode', adobeCompatibilityMode);
      formData.append('outputGroup_by', groupBy);
      formData.append('outputShape_stacking', shapeStacking);
      formData.append('outputDxfCompatibility_level', compatibility_level);
      formData.append('outputParameterized_shapes_flatten', parameterized_shapes_flatten);
      formData.append('outputCurves_allowed_quadratic_bezier', curves_allowed_quadratic_bezier);
      formData.append('outputCurves_allowed_cubic_bezier', curves_allowed_cubic_bezier);
      formData.append('outputCurves_allowed_circular_arc', curves_allowed_cubic_bezier);
      formData.append('outputCurves_allowed_elliptical_arc', curves_allowed_cubic_bezier);
      formData.append('outputGap_filler_enabled', gap_fillter_enabled);

      // fetch('https://vectorizer-424c.onrender.com/vectorize', {
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

  const handleDownload = () => {
    if (vectorizedData) {
      const downloadLink = document.createElement('a');
      downloadLink.href = 'data:image/svg+xml;base64,' + btoa(vectorizedData);
      downloadLink.download = 'vectorized_image.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.warn('No vectorized image available to download.');
    }
  };

  // Function to render image preview
  // const renderImagePreview = () => {
  //   if (imagePreviewUrl) {
  //     return (
  //       <div>
  //         <h3>Image Preview</h3>
  //         <img
  //           src={imagePreviewUrl}
  //           style={{ width: '400px', height: '400px', objectFit: 'cover' }}
  //           alt="Image Preview"
  //         />
  //       </div>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  return (
    <div className="container">
      <h2>Image Vectorization</h2>
      <div>
        {/* <label htmlFor="image" className="file-label">
          Select Image
        </label>
        <input
          type="file"
          name="image"
          id="image"
          className="file-input"
          onChange={handleImageChange}
        /> */}
        <label htmlFor="imageUrl">Image URL:</label>
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={handleUrlChange}
        /><br/>
        {/* Button with loading state */}
        <button onClick={handleSubmit} className="btn" disabled={loading}>
          {loading ? 'Loading...' : 'Vectorize'}
        </button>
      </div>
      {/* Add comboBox for View Mode */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="antiAliasing">View Mode:&nbsp;</label>
        <select
          id="mode"
          name="mode"
          value={mode}
          onChange={(e) => {setMode(e.target.value)}}
        >
          <option value="test">test</option>
          <option value="preview">preview</option>
        </select>
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
      {/* Add comboBox for compatibility_level */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="antiAliasing">Compatibility-Level:&nbsp;</label>
        <select
          id="compatibility_level"
          name="compatibility_level"
          value={compatibility_level}
          onChange={(e) => {setCompatibility_level(e.target.value)}}
        >
          <option value="lines_only">lines_only</option>
          <option value="lines_and_arcs">lines_and_arcs</option>
          <option value="lines_arcs_and_splines">lines_arcs_and_splines</option>
        </select>
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
      {/* Add comboBox for adobeCompatibilityMode */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">Adbove-Compatibility-Mode:&nbsp;</label>
        <select
          id="adobeCompatibilityMode"
          name="adobeCompatibilityMode"
          value={adobeCompatibilityMode}
          onChange={handleAdobeCompatibilityModeChange}
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </div>
      {/* Add comboBox for GroupBy */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">Group-By:&nbsp;</label>
        <select
          id="groupBy"
          name="groupBy"
          value={groupBy}
          onChange={handleGroupByChange}
        >
          <option value="none">none</option>
          <option value="color">color</option>
          <option value="parent">parent</option>
          <option value="layer">layer</option>
        </select>
      </div>
      {/* Add comboBox for Parameterized-Shaped-Flatten */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">Parameterized-Shaped-Flatten:&nbsp;</label>
        <select
          id="parameterized_Shaped_Flatten"
          name="parameterized_Shaped_Flatten"
          value={parameterized_shapes_flatten}
          onChange={(e) => {setParameterized_shapes_flatten(e.target.value)}}
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </div>
      {/* Add comboBox for ShapeStacking */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">Shape-Staking:&nbsp;</label>
        <select
          id="shapeStaking"
          name="shapeStaking"
          value={shapeStacking}
          onChange={(e) => {setShapeStaking(e.target.value)}}
        >
          <option value="cutouts">cutouts</option>
          <option value="stacked">stacked</option>
        </select>
      </div>
      {/* Add comboBox for Quadaic_bezier */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">output.curves.allowed.quadratic_bezier:&nbsp;</label>
        <select
          id="curves_allowed_quadratic_bezier"
          name="curves_allowed_quadratic_bezier"
          value={curves_allowed_quadratic_bezier}
          onChange={(e) => {setCurves_allowed_quadratic_bezier(e.target.value)}}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      {/* Add comboBox for cubic_bezier */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">output.curves.allowed.cubic_bezier:&nbsp;</label>
        <select
          id="curves_allowed_cubic_bezier"
          name="curves_allowed_cubic_bezier"
          value={curves_allowed_cubic_bezier}
          onChange={(e) => {setCurves_allowed_cubic_bezier(e.target.value)}}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      {/* Add comboBox for circular_arc */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">output.curves.allowed.circular_arc:&nbsp;</label>
        <select
          id="curves_allowed_circular_arc"
          name="curves_allowed_circular_arc"
          value={curves_allowed_circular_arc}
          onChange={(e) => {setCurves_allowed_circular_arc(e.target.value)}}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      {/* Add comboBox for elliptical_arc */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">output.curves.allowed.elliptical_arc:&nbsp;</label>
        <select
          id="curves_allowed_elliptical_arc"
          name="curves_allowed_elliptical_arc"
          value={curves_allowed_elliptical_arc}
          onChange={(e) => {setCurves_allowed_elliptical_arc(e.target.value)}}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      {/* Add comboBox for gap_filler_enabled */}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="drawStyle">output.gap_filler.enabled:&nbsp;</label>
        <select
          id="gap_fillter_enabled"
          name="gap_fillter_enabled"
          value={gap_fillter_enabled}
          onChange={(e) => {setGap_fillter_enabled(e.target.value)}}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      
      {/* Display the uploaded image */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      {imageFile &&
        <>
          <div style={{ marginRight: '20px' }}>
            <h3>Original Image</h3>
            <img
              src={URL.createObjectURL(imageFile)}
              style={{ width: '400px', height: '400px', objectFit: 'cover' }}
              alt="Original Preview"
            />
          </div>
        </>
      }
      {/* {renderImagePreview()} */}
      {vectorizedData &&
        <>
          <div>
            <h3>Vectorized Image</h3>
            <img
              src={'data:image/svg+xml;base64,' + btoa(vectorizedData)}
              style={{ width: '400px', height: '400px', objectFit: 'cover' }}
              alt="Vectorized Preview"
            />
          </div>
        </>
      }
    </div>
    
    <div style={{ marginTop: '20px' }}>
        <button onClick={handleDownload} className="btn" disabled={!vectorizedData}>
          Download Vectorized Image
        </button>
      </div>
    </div>
  );
}

export default App;
