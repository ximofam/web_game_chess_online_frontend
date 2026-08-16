import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, RefreshCw } from 'lucide-react';
import { profileService } from '../services/profileService';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * AvatarUploader manages select, validation, upload progress, and API hooks
 * to replace the player profile image.
 */
export const AvatarUploader = ({ currentAvatarUrl, username, onUploadSuccess }) => {
  const { t } = useTranslation(['profile', 'common']);
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
      showToast(t('profile:invalid_image_type'), 'error');
      return;
    }

    // Validation 2: File size < 2MB
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      showToast(t('profile:image_too_large'), 'error');
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
      
      showToast(t('profile:avatar_updated'), 'success');
      if (onUploadSuccess) {
        onUploadSuccess(response.avatarUrl);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || t('profile:avatar_upload_failed');
      showToast(errMsg, 'error');
      setPreviewUrl(null); // Revert preview on failure
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      // Revoke preview URL to clear memory leaks
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {
          // Ignore revocation errors
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Circle Photo Container */}
      <div
        onClick={handleAvatarClick}
        className={`w-28 h-28 rounded-md border-2 border-chess-gold flex items-center justify-center bg-chess-dark text-chess-gold relative group ${
          isUploading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:border-chess-gold-hover'
        } overflow-hidden shadow-md transition-colors`}
        aria-label="Upload profile avatar"
        role="button"
        tabIndex={0}
      >
        {previewUrl || currentAvatarUrl ? (
          <img
            src={previewUrl || currentAvatarUrl}
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="font-playfair text-4xl font-bold tracking-wider">{initial}</span>
        )}

        {/* Hover Camera Overlay */}
        {!isUploading && (
          <div className="absolute inset-0 bg-chess-dark/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300">
            <Camera className="w-5 h-5 text-chess-gold animate-pulse" />
            <span className="font-inter text-[10px] text-chess-text font-bold uppercase tracking-widest">
              {t('profile:change_photo')}
            </span>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-chess-dark/80 flex flex-col items-center justify-center gap-1.5">
            <RefreshCw className="w-5 h-5 text-chess-gold animate-spin" />
            <span className="font-inter text-[9px] text-chess-gold font-bold uppercase tracking-widest">
              {uploadProgress !== null ? `${uploadProgress}%` : t('profile:uploading')}
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
        <div className="w-32 bg-chess-border h-1.5 rounded-full overflow-hidden border border-chess-border">
          <div
            className="bg-chess-gold h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <p className="font-inter text-[10px] text-chess-muted uppercase tracking-widest font-semibold">
        {t('profile:supported_formats')}
      </p>
    </div>
  );
};

export default AvatarUploader;
