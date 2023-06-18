module.exports = {
  configureWebpack: {
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  },

  devServer: {
    disableHostCheck: true,
    port: 3000,
    proxy: 'https://my.ilmonline.uz/'
  },

  pluginOptions: {
    svgSprite: {
      /*
       * The directory containing your SVG files.
       */
      dir: 'src/assets/icons',
      /*
       * The reqex that will be used for the Webpack rule.
       */
      test: /\.(svg)(\?.*)?$/,
      /*
       * @see https://github.com/kisenka/svg-sprite-loader#configuration
       */
      loaderOptions: {
        extract: true,
        spriteFilename: 'img/icons.[hash:8].svg', // or 'img/icons.svg' if filenameHashing == false
      },
      /*
       * @see https://github.com/kisenka/svg-sprite-loader#configuration
       */
      pluginOptions: {
        plainSprite: true,
      },
    },
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/styles/mixins/_media.sass"',
      },
    },
  },

  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    config.module.rule('svg-sprite').use('svgo-loader').loader('svgo-loader');
  },
};
