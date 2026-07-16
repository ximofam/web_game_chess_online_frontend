import React, { useState, useRef } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { profileService } from '../services/profileService';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * AvatarUploader manages select, validation, upload progress, and API hooks
 * to replace the player profile image.
 */
export const AvatarUploader = ({ currentAvatarUrl, username, onUploadSuccess }) => {
  const { showToast } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const initial = username ? username.charAt(0).toUpperCase() : 'P';

  const handleAvatarClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation 1: Allowed formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid image. Supported formats are JPG, JPEG, PNG, and WEBP.', 'error');
      return;
    }

    // Validation 2: File size < 2MB
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      showToast('Image is too large. Limit file size to under 2MB.', 'error');
      return;
    }

    // Client-side preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await profileService.uploadAvatar(file, (percent) => {
        setUploadProgress(percent);
      });
      
      showToast('Avatar updated successfully!', 'success');
      if (onUploadSuccess) {
        onUploadSuccess(response.avatarUrl);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Avatar upload failed. Please try again.';
      showToast(errMsg, 'error');
      setPreviewUrl(null); // Revert preview on failure
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      // Revoke preview URL to clear memory leaks
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch (e) {}
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Circle Photo Container */}
      <div
        onClick={handleAvatarClick}
        className={`w-28 h-28 rounded-full border-2 border-[#d4af37] flex items-center justify-center bg-[#0d0e12] text-[#d4af37] relative group ${
          isUploading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:border-[#f3cd57]'
        } overflow-hidden shadow-lg transition-all duration-300`}
        aria-label="Upload profile avatar"
        role="button"
      >
        {previewUrl || currentAvatarUrl ? (
          <img
            src={previewUrl || currentAvatarUrl}
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-3xl font-bold tracking-wider">{initial}</span>
        )}

        {/* Hover Camera Overlay */}
        {!isUploading && (
          <div className="absolute inset-0 bg-[#0d0e12]/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-300">
            <Camera className="w-5 h-5 text-[#d4af37] animate-pulse" />
            <span className="text-[10px] text-[#f3f4f6] font-semibold tracking-wider">CHANGE PHOTO</span>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-[#0d0e12]/80 flex flex-col items-center justify-center gap-1.5">
            <RefreshCw className="w-5 h-5 text-[#d4af37] animate-spin" />
            <span className="text-[9px] text-[#d4af37] font-semibold tracking-wider">
              {uploadProgress !== null ? `${uploadProgress}%` : 'UPLOADING...'}
            </span>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        disabled={isUploading}
      />

      {/* Progress Bar (Visible outside if uploading) */}
      {isUploading && uploadProgress !== null && (
        <div className="w-32 bg-[#2d323f] h-1.5 rounded-full overflow-hidden border border-[#2d323f]">
          <div
            className="bg-[#d4af37] h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <p className="text-[10px] text-[#9ca3af] uppercase tracking-wider">
        Supports JPG, PNG, WEBP (Max 2MB)
      </p>
    </div>
  );
};

export default AvatarUploader;
