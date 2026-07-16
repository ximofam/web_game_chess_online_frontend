import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { RefreshCw, Save, X } from 'lucide-react';
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
      showToast('Profile updated successfully!', 'success');
      if (onSaveSuccess) {
        onSaveSuccess(updatedUser);
      }
    },
    onError: (err) => {
      const errMsg =
        err.response?.data?.message ||
        'Failed to save profile changes. Please try again.';
      showToast(errMsg, 'error');
    },
  });

  const onSubmit = (data) => {
    performUpdate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#1a1d24] border border-[#2d323f] rounded-xl p-6 shadow-lg text-left space-y-5 select-none"
    >
      <h3 className="font-playfair text-xl font-bold text-[#f3f4f6] border-b border-[#2d323f] pb-3 mb-2">
        Edit Player Profile
      </h3>

      {/* Readonly Username & Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
            Username
          </label>
          <input
            type="text"
            disabled
            value={user?.username || ''}
            className="w-full bg-[#0d0e12]/60 text-[#9ca3af] font-inter px-4 py-3 rounded border border-[#2d323f]/60 text-sm outline-none cursor-not-allowed mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
            Account Role
          </label>
          <input
            type="text"
            disabled
            value={user?.role || 'USER'}
            className="w-full bg-[#0d0e12]/60 text-[#9ca3af] font-inter px-4 py-3 rounded border border-[#2d323f]/60 text-sm outline-none cursor-not-allowed mt-1 uppercase"
          />
        </div>
      </div>

      {/* Readonly Email */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
          Email Address
        </label>
        <input
          type="email"
          disabled
          value={user?.email || ''}
          className="w-full bg-[#0d0e12]/60 text-[#9ca3af] font-inter px-4 py-3 rounded border border-[#2d323f]/60 text-sm outline-none cursor-not-allowed mt-1"
        />
      </div>

      {/* Editable Full Name */}
      <div className="flex flex-col items-start gap-1">
        <label
          htmlFor="fullName"
          className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          aria-invalid={errors.fullName ? 'true' : 'false'}
          className={`w-full bg-[#0d0e12] text-[#f3f4f6] font-inter px-4 py-3 rounded border text-sm transition-all duration-200 outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
            errors.fullName
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
              : 'border-[#2d323f] hover:border-[#9ca3af]'
          }`}
          {...register('fullName')}
        />
        {errors.fullName && (
          <span className="text-xs text-red-400 font-medium mt-0.5 animate-fade-in">
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
            label="Gender Selection"
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
            label="Date of Birth"
            value={value}
            onChange={onChange}
            error={error}
          />
        )}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-[#2d323f] pt-5 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#2d323f] hover:bg-[#2d323f]/40 hover:text-white text-sm font-semibold text-[#f3f4f6] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
          <span>CANCEL</span>
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#d4af37] text-[#0d0e12] font-bold rounded-lg hover:bg-[#f3cd57] hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>SAVE CHANGES</span>
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
