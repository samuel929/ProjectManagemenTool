module.exports = {
    presets: [['next/babel', {
      'preset-react': {
        runtime: 'automatic',
        importSource: '@emotion/react' // Only if using Emotion
      }
    }]],
    plugins: [
      // Only include essential Babel plugins here
      // '@emotion/babel-plugin' // Uncomment if using Emotion
    ]
  };