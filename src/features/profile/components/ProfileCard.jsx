import { useTranslation } from 'react-i18next';
import { User, Mail, Shield, Calendar, UserCheck, Trophy } from 'lucide-react';
import AvatarUploader from './AvatarUploader';

/**
 * ProfileCard renders user details in a beautiful read-only layout,
 * including the interactive AvatarUploader.
 */
export const ProfileCard = ({ user, onAvatarSuccess, onEditClick }) => {
  const { t } = useTranslation(['profile', 'auth', 'common']);
  const profile = user?.profile || {};
  const formattedGender =
    {
      MALE: t('profile:gender_male'),
      FEMALE: t('profile:gender_female'),
      OTHER: t('profile:gender_other'),
    }[profile.gender] || t('profile:not_specified');

  return (
    <div className="bg-chess-surface border border-chess-border rounded-lg p-6 flex flex-col justify-between shadow-md text-left h-full select-none">
      {/* Upper Section */}
      <div>
        {/* Avatar Uploader integration */}
        <div className="flex flex-col items-center mb-6">
          <AvatarUploader
            currentAvatarUrl={user?.avatarUrl}
            username={user?.username}
            onUploadSuccess={onAvatarSuccess}
          />
          <h2 className="font-playfair text-2xl font-bold text-chess-text mt-4 mb-1">
            {user?.username}
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-inter font-bold uppercase tracking-widest bg-chess-gold/10 border border-chess-gold/30 text-chess-gold">
            <Trophy className="w-3.5 h-3.5" />
            {t('profile:grandmaster_rated')}
          </span>
        </div>

        {/* Detailed List */}
        <div className="border-t border-chess-border pt-5 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-chess-gold" />
            <div className="min-w-0">
              <span className="block font-inter text-[10px] font-semibold text-chess-muted uppercase tracking-widest">
                {t('auth:email')}
              </span>
              <span className="font-inter text-sm font-bold text-chess-text truncate block mt-0.5">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-chess-gold" />
            <div>
              <span className="block font-inter text-[10px] font-semibold text-chess-muted uppercase tracking-widest">
                {t('auth:full_name')}
              </span>
              <span className="font-inter text-sm font-bold text-chess-text mt-0.5 block">
                {profile.fullName || t('profile:no_name_specified')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-chess-gold" />
            <div>
              <span className="block font-inter text-[10px] font-semibold text-chess-muted uppercase tracking-widest">
                {t('profile:gender')}
              </span>
              <span className="font-inter text-sm font-bold text-chess-text mt-0.5 block">
                {formattedGender}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-chess-gold" />
            <div>
              <span className="block font-inter text-[10px] font-semibold text-chess-muted uppercase tracking-widest">
                {t('profile:birth_date')}
              </span>
              <span className="font-inter text-sm font-bold text-chess-text mt-0.5 block">
                {profile.dateOfBirth || t('profile:no_date_specified')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-chess-gold" />
            <div>
              <span className="block font-inter text-[10px] font-semibold text-chess-muted uppercase tracking-widest">
                {t('profile:role')}
              </span>
              <span className="font-inter text-sm font-bold text-chess-text uppercase mt-0.5 block">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <button
        onClick={onEditClick}
        className="w-full bg-chess-gold text-chess-dark font-inter font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-chess-gold-hover transition-colors cursor-pointer mt-6 focus:outline-none focus:ring-2 focus:ring-chess-gold focus:ring-offset-2 focus:ring-offset-chess-dark"
      >
        <span>{t('profile:edit_profile_details')}</span>
      </button>
    </div>
  );
};

export default ProfileCard;
