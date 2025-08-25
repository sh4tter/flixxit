import React, { useState, useRef, useCallback } from 'react';
import { CloudUpload, Image, VideoFile, Description } from '@mui/icons-material';
import './DragDropUpload.scss';

const DragDropUpload = ({ 
  field, 
  label, 
  accept, 
  onUpload, 
  currentValue, 
  type = 'image',
  description = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getIcon = () => {
    switch (type) {
      case 'video':
        return <VideoFile className="upload-icon" />;
      case 'image':
        return <Image className="upload-icon" />;
      default:
        return <CloudUpload className="upload-icon" />;
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = accept.split(',').map(type => type.trim());
    const isValidType = validTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return file.type.match(new RegExp(type.replace('*', '.*')));
    });

    if (!isValidType) {
      alert(`Please select a valid file type: ${accept}`);
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file, field);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="drag-drop-upload">
      <label className="upload-label">{label}</label>
      {description && <p className="upload-description">{description}</p>}
      
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''} ${currentValue ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {currentValue ? (
          <div className="file-preview">
            {type === 'image' ? (
              <img src={currentValue} alt="Preview" className="preview-image" />
            ) : (
              <div className="video-preview">
                <VideoFile className="video-icon" />
                <span>Video uploaded</span>
              </div>
            )}
            <div className="file-overlay">
              <CloudUpload className="overlay-icon" />
              <span>Click or drag to replace</span>
            </div>
          </div>
        ) : (
          <div className="upload-content">
            {getIcon()}
            <div className="upload-text">
              <h4>Drop your file here</h4>
              <p>or click to browse</p>
              <span className="file-types">Accepted: {accept}</span>
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="upload-loading">
            <div className="loading-spinner"></div>
            <span>Uploading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropUpload;
