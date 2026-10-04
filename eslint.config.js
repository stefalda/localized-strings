import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['lib/**', 'example/**'],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
