var fs = require('fs'),
    path = require('path'),
    techs = require('./techs'),
    SETS = {
      'desktop': ['common', 'desktop'],
      'touch': ['common', 'touch']
    };

var isProd = process.env.YENV === 'production';

module.exports = function(config) {
  var platforms = Object.keys(SETS);

  platforms.forEach(function(platform) {
    pathToStatic = path.resolve( 'static', platform );
    fs.existsSync(pathToStatic) || fs.mkdirSync(pathToStatic);

    var levels = getSourceLevels(platform);
    isProd || levels.push({ path: path.join('components', 'development.blocks'), check: true });

    config.nodes('bundles/' + platform + '.bundles/*', function(nodeConfig) {
      nodeConfig.addTechs([
        // essential
        [techs.bem.levels, { levels: levels }],
        [techs.fileProvider, { target: '?.bemdecl.js' }],
        [techs.bem.deps],
        [techs.bem.files],

        // css
        [techs.postcss, {
          target: '?.css',
          oneOfSourceSuffixes: ['post.css', 'css'],
          plugins: techs.postcssPlugins
        }],

        // bemtree
        [techs.bemtree, { sourceSuffixes: ['bemtree', 'bemtree.js'] }],

        // templates
        [techs.bemhtml, {
          sourceSuffixes: ['bemhtml', 'bemhtml.js'],
          forceBaseTemplates: true,
          engineOptions: { elemJsInstances: true }
        }],

        // client templates
        [techs.bem.depsByTechToBemdecl, {
          target: '?.tmpl.bemdecl.js',
          sourceTech: 'js',
          destTech: 'bemhtml'
        }],
        [techs.bem.deps, {
          target: '?.tmpl.deps.js',
          bemdeclFile: '?.tmpl.bemdecl.js'
        }],
        [techs.bem.files, {
          depsFile: '?.tmpl.deps.js',
          filesTarget: '?.tmpl.files',
          dirsTarget: '?.tmpl.dirs'
        }],
        [techs.bemhtml, {
          target: '?.browser.bemhtml.js',
          filesTarget: '?.tmpl.files',
          sourceSuffixes: ['bemhtml', 'bemhtml.js'],
          engineOptions: { elemJsInstances: true }
        }],

        // js
        [techs.browserJs, { includeYM: true }],
        [techs.fileMerge, {
          target: '?.js',
          sources: ['?.browser.js', '?.browser.bemhtml.js']
        }],

        // borschik
        [techs.borschik, { source: '?.js', target: '?.min.js', minify: isProd }],
        [techs.borschik, { source: '?.css', target: '?.min.css', minify: isProd }],

        [techs.fileCopy, { source: '?.min.js', target: '../../../static/' + platform + '/?.min.js' }],
        [techs.fileCopy, { source: '?.min.css', target: '../../../static/' + platform + '/?.min.css' }]
      ]);

      nodeConfig.addTargets([
        '?.bemtree.js',
        '?.bemhtml.js',
        '../../../static/' + platform + '/?.min.js',
        '../../../static/' + platform + '/?.min.css'
      ]);
    });
  });
};

function getSourceLevels(platform) {
  var platformNames = SETS[platform],
      levels = [];

  platformNames.forEach(function(name) {
    levels.push({ path: path.join('node_modules', 'bem-core', name + '.blocks'), check: false });
  });

  platformNames.forEach(function(name) {
    levels.push({ path: path.join('node_modules', 'bem-components', name + '.blocks'), check: false });
  });

  platformNames.forEach(function(name) {
    levels.push({ path: path.join('node_modules', 'bem-components', 'design', name + '.blocks'), check: false });
  });

  platformNames.forEach(function(name) {
    levels.push({ path: path.join('components', name + '.blocks'), check: true });
  });

  platformNames.forEach(function(name) {
    levels.push({ path: path.join('design', name + '.blocks'), check: true });
  });

  return levels.filter(function(level) {
    return fs.existsSync(level.path);
  });
}
