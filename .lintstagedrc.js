module.exports = {
  '*.{ts,js}': (filenames) => {
    // Filter out config files that should not be linted
    const filtered = filenames.filter(
      (file) =>
        !file.includes('commitlint.config.js') &&
        !file.includes('.lintstagedrc.js')
    );
    
    if (filtered.length === 0) {
      return [];
    }
    
    return [
      `eslint --fix --max-warnings=0 ${filtered.join(' ')}`,
      `prettier --write ${filtered.join(' ')}`,
    ];
  },
};
