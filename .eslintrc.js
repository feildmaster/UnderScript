module.exports = {
    "extends": "airbnb-base",
    'env': {
        'es6': true,
        'browser': true,
        'jquery': true,
        'greasemonkey': true,
        'node': false,
    },
    'globals': {
        'debug': 'readonly',
        'eventManager': 'readonly',
        'fn': 'readonly',
        'global': 'readonly',
        'globalSet': 'readonly',
        'ProfileButton': 'readonly',
        'profile': 'readonly',
        'settings': 'readonly',
        'setVersion': 'readonly',
        'style': 'readonly',
        'VarStore': 'readonly',
        'wrap': 'readonly',
    },
    "parserOptions": {
        'sourceType': 'script',
        'ecmaFeatures': {
            'globalReturn': true,
        }
    },
    'rules': {
        // Minimizes diffs when adding new lines
        // 'comma-dangle': ['error', 'always-multiline'],
        // Warn, we allow this behavior, but want to be aware of any possible issues
        'consistent-return': 'warn',
        // We allow modification of properties
        'no-param-reassign': ['warn', { 'props': false }],
        // Allow short circuits: test && action
        'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
        // Allow function arguments to be unused
        'no-unused-vars': ['error', { 'args': 'none' }],
        // Allow functions to be defined after references (functions are top-level)
        'no-use-before-define': ['error', 'nofunc'],
        // Deconstruction not required when assigning to object properties (declared_var = object.key)
        'prefer-destructuring': ['error', {
          'AssignmentExpression': { 'array': true, 'object': false },
        }],
        // Allow for loops to use unary (++/--)
        'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
        'prefer-arrow-callback': ['error', { 'allowNamedFunctions': true } ],
        'no-useless-return': 'warn',
        'class-methods-use-this': 'off',
        'no-restricted-globals': ['error'],
        'no-bitwise': 'off',
        'no-mixed-operators': 'off',
        'consistent-return': 'off',
        'no-continue': 'off',
        'object-curly-newline': ['error', { 'multiline': true, consistent: true }],
      },
};
