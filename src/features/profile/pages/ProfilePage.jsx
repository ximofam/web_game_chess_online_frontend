import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import ProfileForm from '../components/ProfileForm';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

/**
 * ProfilePage is the main view controller for the "/profile" route.
 * Toggles edit/view modes based on query params.
 * Header and Footer are provided by ProtectedLayout.
 */
export const ProfilePage = () => {
  const { currentUser, isLoading, updateCurrentUser, refreshToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const isEditing = searchParams.get('edit') === 'true';
  const [fetchError, setFetchError] = useState(null);

  // Set page edit mode triggers
  const handleEditClick = () => {
    setSearchParams({ edit: 'true' });
  };

  const handleCancelClick = () => {
    setSearchParams({});
  };

  const handleSaveSuccess = (updatedUser) => {
    updateCurrentUser(updatedUser);
    setSearchParams({});
  };

  const handleAvatarSuccess = (newAvatarUrl) => {
    if (currentUser) {
      updateCurrentUser({
        ...currentUser,
        avatarUrl: newAvatarUrl,
      });
    }
  };

  const handleRetry = async () => {
    setFetchError(null);
    try {
      await refreshToken();
    } catch {
      setFetchError('Failed to synchronize player credentials. Check network status.');
    }
  };

  if (!isLoading && !currentUser) {
    return (
      <main className="w-full flex-1 flex items-center justify-center p-6">
        <ErrorState
          message="No authenticated player profile found."
          onRetry={handleRetry}
        />
      </main>
    );
  }

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-4xl flex items-center justify-center">
        {isLoading ? (
          <LoadingSkeleton />
        ) : fetchError ? (
          <ErrorState message={fetchError} onRetry={handleRetry} />
        ) : isEditing ? (
          <div className="w-full max-w-2xl animate-fade-in">
            <ProfileForm
              user={currentUser}
              onCancel={handleCancelClick}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
        ) : (
          <div className="w-full max-w-md animate-fade-in">
            <ProfileCard
              user={currentUser}
              onAvatarSuccess={handleAvatarSuccess}
              onEditClick={handleEditClick}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
