module.exports = {
  ignorePatterns: ['**/*.ignore.js', '**/*.ignore/*'],
  extends: 'airbnb-base',
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    camelcase: ['warn', { ignoreGlobals: true }],
    // Allow this behavior, but want to be aware of any possible issues
    'consistent-return': 'warn',
    'lines-between-class-members': ['error', 'always', {
      exceptAfterSingleLine: true,
    }],
    // Allow modification of properties
    'no-param-reassign': ['warn', { props: false }],
    // Allow short circuits: test && action
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    // Allow function arguments to be unused
    'no-unused-vars': ['error', { args: 'none' }],
    // Allow functions to be defined after references (functions are top-level)
    'no-use-before-define': ['error', 'nofunc'],
    // Deconstruction not required when assigning to object properties (declared_var = object.key)
    'prefer-destructuring': ['error', {
      AssignmentExpression: { array: true, object: false },
    }],
    // Allow for loops to use unary (++/--)
    'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'no-useless-return': 'warn',
    'class-methods-use-this': 'off',
    'no-restricted-globals': ['error', ''],
    'no-bitwise': 'off',
    'no-mixed-operators': 'off',
    'import/no-mutable-exports': 'warn',
    'no-continue': 'off',
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'operator-linebreak': ['error', 'after'],
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'no-extra-boolean-cast': 'warn',
    'import/extensions': ['error', 'ignorePackages'],
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      tabWidth: 2,
    }],
  },
};
