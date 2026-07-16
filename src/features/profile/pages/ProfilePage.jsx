import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import Navbar from '../../home/components/Navbar';
import ProfileCard from '../components/ProfileCard';
import ProfileForm from '../components/ProfileForm';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

/**
 * ProfilePage is the main view controller for the "/profile" route.
 * Toggles edit/view modes based on query params.
 */
export const ProfilePage = () => {
  const { currentUser, isLoading, updateCurrentUser, refreshToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
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
    } catch (e) {
      setFetchError('Failed to synchronize player credentials. Check network status.');
    }
  };

  // If user becomes unauthenticated, ProtectedLayout handles redirects.
  // In case user details are empty but authentication passes:
  if (!isLoading && !currentUser) {
    return (
      <div className="w-full min-h-screen bg-[#0d0e12] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <ErrorState
            message="No authenticated player profile found."
            onRetry={handleRetry}
          />
        </main>
        <footer className="border-t border-[#2d323f] bg-[#13161c] px-6 py-4 text-center text-xs text-[#9ca3af]">
          <span>© 2026 CHESS ARENA. ALL RIGHTS RESERVED.</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0d0e12] flex flex-col justify-between select-none">
      {/* NAVBAR */}
      <Navbar />

      {/* BODY */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
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

      {/* FOOTER */}
      <footer className="border-t border-[#2d323f] bg-[#13161c] px-6 py-4 text-center text-xs text-[#9ca3af]">
        <span>© 2026 CHESS ARENA. ALL RIGHTS RESERVED. ACCESSIBILITY READY.</span>
      </footer>
    </div>
  );
};

export default ProfilePage;
