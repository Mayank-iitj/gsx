import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-backgrounds',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: '../next.config.js',
    },
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  staticDirs: ['../public', '../assets'],
  webpackFinal: async (config, { configType }) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@/components': path.resolve(__dirname, '../src/components'),
        '@/lib': path.resolve(__dirname, '../src/lib'),
        '@/hooks': path.resolve(__dirname, '../src/hooks'),
        '@/utils': path.resolve(__dirname, '../src/utils'),
        '@/types': path.resolve(__dirname, '../src/types'),
        '@/styles': path.resolve(__dirname, '../src/styles'),
      };
    }

    // Handle CSS modules
    const cssRule = config.module?.rules?.find(
      (rule) => rule && typeof rule === 'object' && rule.test && rule.test.toString().includes('.css')
    );
    
    if (cssRule && typeof cssRule === 'object' && cssRule.use) {
      cssRule.use = [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
        },
        'postcss-loader',
      ];
    }

    return config;
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  features: {
    experimentalRSC: false,
    buildStoriesJson: true,
  },
  core: {
    disableTelemetry: true,
  },
  env: (config) => ({
    ...config,
    NODE_ENV: 'development',
  }),
};

export default config;