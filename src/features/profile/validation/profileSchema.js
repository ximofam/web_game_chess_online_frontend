import { z } from 'zod';

/**
 * Zod schema for profile details validation.
 * Matches:
 * - fullName: required, non-empty.
 * - gender: must be MALE, FEMALE, or OTHER.
 * - dateOfBirth: must be in dd/MM/yyyy format.
 */
export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full Name is required'),
  gender: z
    .enum(['MALE', 'FEMALE', 'OTHER'], {
      errorMap: () => ({ message: 'Gender is required' }),
    }),
  dateOfBirth: z
    .string()
    .min(1, 'Date of Birth is required')
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      'Date must be in DD/MM/YYYY format (e.g. 16/07/2000)'
    )
});

export default profileSchema;
