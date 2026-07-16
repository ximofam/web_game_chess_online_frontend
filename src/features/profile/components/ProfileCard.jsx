import React from 'react';
import { User, Mail, Shield, Calendar, UserCheck, Trophy } from 'lucide-react';
import AvatarUploader from './AvatarUploader';

/**
 * ProfileCard renders user details in a beautiful read-only layout,
 * including the interactive AvatarUploader.
 */
export const ProfileCard = ({ user, onAvatarSuccess, onEditClick }) => {
  const profile = user?.profile || {};
  const formattedGender =
    {
      MALE: 'Male',
      FEMALE: 'Female',
      OTHER: 'Other',
    }[profile.gender] || 'Not specified';

  return (
    <div className="bg-[#1a1d24] border border-[#2d323f] rounded-xl p-6 flex flex-col justify-between shadow-lg text-left h-full select-none">
      {/* Upper Section */}
      <div>
        {/* Avatar Uploader integration */}
        <div className="flex flex-col items-center mb-6">
          <AvatarUploader
            currentAvatarUrl={user?.avatarUrl}
            username={user?.username}
            onUploadSuccess={onAvatarSuccess}
          />
          <h2 className="font-playfair text-2xl font-bold text-[#f3f4f6] mt-4 mb-1">
            {user?.username}
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37]">
            <Trophy className="w-3.5 h-3.5" />
            Grandmaster Rated
          </span>
        </div>

        {/* Detailed List */}
        <div className="border-t border-[#2d323f] pt-5 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#d4af37]" />
            <div className="min-w-0">
              <span className="block text-[10px] text-[#9ca3af] uppercase tracking-wider">
                Email Address
              </span>
              <span className="text-sm font-medium text-[#f3f4f6] truncate block">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-[#d4af37]" />
            <div>
              <span className="block text-[10px] text-[#9ca3af] uppercase tracking-wider">
                Full Name
              </span>
              <span className="text-sm font-medium text-[#f3f4f6]">
                {profile.fullName || 'No name specified'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-[#d4af37]" />
            <div>
              <span className="block text-[10px] text-[#9ca3af] uppercase tracking-wider">
                Gender Selection
              </span>
              <span className="text-sm font-medium text-[#f3f4f6]">
                {formattedGender}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <div>
              <span className="block text-[10px] text-[#9ca3af] uppercase tracking-wider">
                Date of Birth
              </span>
              <span className="text-sm font-medium text-[#f3f4f6]">
                {profile.dateOfBirth || 'No date specified'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-[#d4af37]" />
            <div>
              <span className="block text-[10px] text-[#9ca3af] uppercase tracking-wider">
                Account Role
              </span>
              <span className="text-sm font-medium text-[#f3f4f6] uppercase">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <button
        onClick={onEditClick}
        className="w-full bg-[#d4af37] text-[#0d0e12] font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-[#f3cd57] hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer mt-6"
      >
        <span>EDIT PROFILE DETAILS</span>
      </button>
    </div>
  );
};

export default ProfileCard;
