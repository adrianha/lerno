const PATH = require('path');
const FS = require('fs');
const blacklist = require('metro-config/src/defaults/blacklist');

function resolvePath(...parts) {
  const thisPath = PATH.resolve(...parts);
  if (!FS.existsSync(thisPath)) return;

  return FS.realpathSync(thisPath);
}

function isExternalModule(modulePath) {
  return modulePath.substring(0, __dirname.length) !== __dirname;
}

function listDirectories(rootPath, cb) {
  FS.readdirSync(rootPath).forEach((fileName) => {
    if (fileName.charAt(0) === '.') return;

    let fullFileName = PATH.join(rootPath, fileName),
      stats = FS.lstatSync(fullFileName),
      symbolic = false;

    if (stats.isSymbolicLink()) {
      fullFileName = resolvePath(fullFileName);
      if (!fullFileName) return;

      stats = FS.lstatSync(fullFileName);

      symbolic = true;
    }

    if (!stats.isDirectory()) return;

    const external = isExternalModule(fullFileName);
    cb({rootPath, symbolic, external, fullFileName, fileName});
  });
}

function buildFullModuleMap(
  moduleRoot,
  mainModuleMap,
  externalModuleMap,
  _alreadyVisited,
  _prefix,
) {
  if (!moduleRoot) return;

  const alreadyVisited = _alreadyVisited || {},
    prefix = _prefix;

  if (alreadyVisited && alreadyVisited.hasOwnProperty(moduleRoot)) return;

  listDirectories(
    moduleRoot,
    ({fileName, fullFileName, symbolic, external}) => {
      if (symbolic) {
        return buildFullModuleMap(
          resolvePath(fullFileName, 'node_modules'),
          mainModuleMap,
          externalModuleMap,
          alreadyVisited,
        );
      }

      const moduleMap = external ? externalModuleMap : mainModuleMap,
        moduleName = prefix ? PATH.join(prefix, fileName) : fileName;

      if (fileName.charAt(0) !== '@') moduleMap[moduleName] = fullFileName;
      else
        return buildFullModuleMap(
          fullFileName,
          mainModuleMap,
          externalModuleMap,
          alreadyVisited,
          fileName,
        );
    },
  );
}

function buildModuleResolutionMap() {
  const moduleMap = {},
    externalModuleMap = {};

  buildFullModuleMap(baseModulePath, moduleMap, externalModuleMap);

  // Root project modules take precedence over external modules
  return Object.assign({}, externalModuleMap, moduleMap);
}

const baseModulePath = resolvePath(__dirname, 'node_modules'),
  extraNodeModules = buildModuleResolutionMap();

// console.log({extraNodeModules});

const blacklistModules = ['react', 'react-native'];
const sharedPath = resolvePath(__dirname, 'shared');
const blacklistRE = [];
[sharedPath].forEach((modulePath) => {
  blacklistModules.forEach((blacklistModule) => {
    blacklistRE.push(
      new RegExp(
        PATH.join(modulePath, 'node_modules', blacklistModule).replace(
          /[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g,
          '\\$&',
        ) + '/.*',
      ),
    );
  });
});
// console.log({sharedPath, blacklistRE});

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    blacklistRE: blacklist(blacklistRE),
    extraNodeModules,
    useWatchman: true,
  },
};
