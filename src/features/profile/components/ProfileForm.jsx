import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { RefreshCw, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { profileSchema } from '../validation/profileSchema';
import { profileService } from '../services/profileService';
import DatePicker from './DatePicker';
import GenderSelect from './GenderSelect';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * ProfileForm handles the user details edit form.
 * Uses custom Zod validation resolver and Axios patch updates.
 */
export const ProfileForm = ({ user, onCancel, onSaveSuccess }) => {
  const { showToast } = useAuth();
  const { t } = useTranslation(['profile', 'auth', 'common']);
  const profile = user?.profile || {};

  const resolver = async (values) => {
    const result = profileSchema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const errors = {};
    result.error.issues.forEach((err) => {
      errors[err.path[0]] = {
        type: 'validation',
        message: err.message,
      };
    });
    return { values: {}, errors };
  };

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: profile.fullName || '',
      gender: profile.gender || '',
      dateOfBirth: profile.dateOfBirth || '',
    },
    resolver,
    mode: 'onTouched',
  });

  const { mutate: performUpdate, isPending } = useMutation({
    mutationFn: async (formData) => {
      return profileService.updateProfile(formData);
    },
    onSuccess: (updatedUser) => {
      showToast(t('profile:profile_updated_successfully', 'Profile updated successfully!'), 'success');
      if (onSaveSuccess) {
        onSaveSuccess(updatedUser);
      }
    },
    onError: (err) => {
      const errMsg =
        err.response?.data?.message ||
        t('profile:profile_update_failed', 'Failed to save profile changes. Please try again.');
      showToast(errMsg, 'error');
    },
  });

  const onSubmit = (data) => {
    performUpdate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-chess-surface border border-chess-border rounded-lg p-6 shadow-md text-left space-y-5 select-none"
    >
      <h3 className="font-playfair text-xl font-bold text-chess-text border-b border-chess-border pb-3 mb-2">
        {t('profile:edit_player_profile', 'Edit Player Profile')}
      </h3>

      {/* Readonly Username & Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-inter text-xs font-semibold uppercase tracking-widest text-chess-muted">
            {t('auth:username', 'Username')}
          </label>
          <input
            type="text"
            disabled
            value={user?.username || ''}
            className="w-full bg-chess-dark/60 text-chess-muted font-inter px-4 py-3 rounded-md border border-chess-border/60 text-sm outline-none cursor-not-allowed mt-1.5"
          />
        </div>
        <div>
          <label className="font-inter text-xs font-semibold uppercase tracking-widest text-chess-muted">
            {t('profile:account_role', 'Account Role')}
          </label>
          <input
            type="text"
            disabled
            value={user?.role || 'USER'}
            className="w-full bg-chess-dark/60 text-chess-muted font-inter px-4 py-3 rounded-md border border-chess-border/60 text-sm outline-none cursor-not-allowed mt-1.5 uppercase"
          />
        </div>
      </div>

      {/* Readonly Email */}
      <div>
        <label className="font-inter text-xs font-semibold uppercase tracking-widest text-chess-muted">
          {t('auth:email', 'Email Address')}
        </label>
        <input
          type="email"
          disabled
          value={user?.email || ''}
          className="w-full bg-chess-dark/60 text-chess-muted font-inter px-4 py-3 rounded-md border border-chess-border/60 text-sm outline-none cursor-not-allowed mt-1.5"
        />
      </div>

      {/* Editable Full Name */}
      <div className="flex flex-col items-start gap-1.5">
        <label
          htmlFor="fullName"
          className="font-inter text-xs font-semibold uppercase tracking-widest text-chess-muted"
        >
          {t('auth:full_name', 'Full Name')}
        </label>
        <input
          id="fullName"
          type="text"
          aria-invalid={errors.fullName ? 'true' : 'false'}
          className={`w-full bg-chess-dark text-chess-text font-inter px-4 py-3 rounded-md border text-sm transition-colors outline-none focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold ${
            errors.fullName
              ? 'border-red-500/60 focus:border-red-500'
              : 'border-chess-border focus:border-chess-gold'
          }`}
          {...register('fullName')}
        />
        {errors.fullName && (
          <span className="text-xs text-red-500 font-medium mt-0.5 animate-fade-in">
            {errors.fullName.message}
          </span>
        )}
      </div>

      {/* Editable Gender Select */}
      <Controller
        control={control}
        name="gender"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <GenderSelect
            id="gender"
            label={t('profile:gender_selection', 'Gender Selection')}
            value={value}
            onChange={onChange}
            error={error}
          />
        )}
      />

      {/* Editable Date Picker */}
      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <DatePicker
            id="dateOfBirth"
            label={t('profile:date_of_birth', 'Date of Birth')}
            value={value}
            onChange={onChange}
            error={error}
          />
        )}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-chess-border pt-5 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-chess-border bg-transparent hover:border-chess-gold hover:text-chess-gold text-sm font-inter font-semibold text-chess-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-chess-gold"
        >
          <X className="w-4 h-4" />
          <span>{t('common:cancel', 'CANCEL')}</span>
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-chess-gold text-chess-dark font-inter font-bold rounded-lg hover:bg-chess-gold-hover transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-chess-gold focus:ring-offset-2 focus:ring-offset-chess-dark"
        >
          {isPending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{t('profile:save_changes', 'SAVE CHANGES')}</span>
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
