// components/student/ProfilePicture.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfilePicture = ({ currentImageUrl, studentCode, onUploadSuccess }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  

  // رابط افتراضي (صورة رمزية من UI Avatars)
  const defaultImage = `https://ui-avatars.com/api/?background=2563eb&color=fff&size=120&name=${studentCode || 'User'}`;

  useEffect(() => {
    if (currentImageUrl && currentImageUrl !== '') {
      setImageUrl(currentImageUrl);
    } else {
      setImageUrl(defaultImage);
    }
  }, [currentImageUrl, studentCode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    } else {
      toast.error('يرجى اختيار ملف صورة صالح');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePic', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:9000/upload/profile-picture', formData, {
  headers: { 'Content-Type': 'multipart/form-data', 'Authorization': token }
});
      if (response.data.success) {
        setImageUrl(response.data.imageUrl);
        setSelectedFile(null);
        toast.success('تم تحديث الصورة بنجاح');
        onUploadSuccess?.(response.data.imageUrl);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast.error(response.data.message || 'فشل الرفع');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-avatar">
        <img src={imageUrl} alt="Profile" />
        <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
          <span>📷</span>
        </button>
      </div>
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      {selectedFile && (
        <div className="upload-actions">
          <button onClick={handleUpload} disabled={isUploading} className="btn-save">
            {isUploading ? 'saving...' : 'save'}
          </button>
          <button onClick={() => {
            setSelectedFile(null);
            setImageUrl(currentImageUrl || defaultImage);
            fileInputRef.current.value = '';
          }} className="btn-cancel">
            cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;