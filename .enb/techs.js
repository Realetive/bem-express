module.exports = {
  fileProvider: require('enb/techs/file-provider'),
  fileMerge: require('enb/techs/file-merge'),
  fileCopy: require('enb/techs/file-copy'),
  borschik: require('enb-borschik/techs/borschik'),
  postcss: require('enb-postcss/techs/enb-postcss'),
  postcssPlugins: [
    require('postcss-import')(),
    require('postcss-each'),
    require('postcss-for'),
    require('postcss-simple-vars')(),
    require('postcss-nested'),
    require('pobem'),
    require('postcss-url')({ url: 'inline', optimizeSvgEncode: true }),
    require('postcss-cssnext')(),
    require('postcss-reporter')()
  ],
  browserJs: require('enb-js/techs/browser-js'),
  bemtree: require('enb-bemxjst/techs/bemtree'),
  bemhtml: require('enb-bemxjst/techs/bemhtml'),
  bem: require('enb-bem-techs')
}
