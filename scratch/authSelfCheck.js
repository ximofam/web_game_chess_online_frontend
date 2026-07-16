/**
 * Auth Self Check Script
 * Running: node scratch/authSelfCheck.js
 * Verification script checking Zod schemas and validation rules.
 */
import { loginSchema, registerSchema } from '../src/features/auth/validation/authSchemas.js';

const runChecks = () => {
  console.log('Running Auth Module Validation Self-Checks...\n');

  // Test Case 1: Login validation
  const validLogin = loginSchema.safeParse({
    usernameOrEmail: 'grandmaster',
    password: 'Password123!',
  });
  if (!validLogin.success) {
    console.error('FAIL: Valid login was rejected', validLogin.error);
    process.exit(1);
  }
  console.log('✔ Valid login schema accepted.');

  const invalidLogin = loginSchema.safeParse({
    usernameOrEmail: '',
    password: '',
  });
  if (invalidLogin.success) {
    console.error('FAIL: Empty credentials were accepted');
    process.exit(1);
  }
  console.log('✔ Invalid empty login credentials correctly rejected.');

  // Test Case 2: Registration validation
  const validRegister = registerSchema.safeParse({
    username: 'Magnus_Carlsen',
    email: 'magnus@chess.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  });
  if (!validRegister.success) {
    console.error('FAIL: Valid registration was rejected', validRegister.error);
    process.exit(1);
  }
  console.log('✔ Valid registration schema accepted.');

  // Test Case 3: Short username
  const shortUsername = registerSchema.safeParse({
    username: 'gm',
    email: 'gm@chess.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  });
  if (shortUsername.success) {
    console.error('FAIL: Short username (2 chars) was accepted');
    process.exit(1);
  }
  console.log('✔ Short username correctly blocked.');

  // Test Case 4: Mismatched password confirmation
  const mismatchedPass = registerSchema.safeParse({
    username: 'grandmaster',
    email: 'gm@chess.com',
    password: 'Password123!',
    confirmPassword: 'PasswordXYZ!',
  });
  if (mismatchedPass.success) {
    console.error('FAIL: Mismatched passwords were accepted');
    process.exit(1);
  }
  console.log('✔ Mismatched password confirm correctly blocked.');

  // Test Case 5: Password strength requirements
  const weakPassword = registerSchema.safeParse({
    username: 'grandmaster',
    email: 'gm@chess.com',
    password: 'simplepassword',
    confirmPassword: 'simplepassword',
  });
  if (weakPassword.success) {
    console.error('FAIL: Weak password lacking capitals/numbers/specials was accepted');
    process.exit(1);
  }
  console.log('✔ Weak password policy correctly enforced.');

  console.log('\nSUCCESS: All auth validation rules and schemas are correct!');
  process.exit(0);
};

runChecks();
