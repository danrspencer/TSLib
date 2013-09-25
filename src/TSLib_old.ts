///<reference path='../node.d.ts' />

class TSLib {

  constructor(private _fs) {}

  public compile(sourcePath: string, namespace: string, callback: (generatedModule: string) => void) {
    this._compilePath(sourcePath, (moduleContent) => {
      var moduleParts = [
        'module ' + namespace + ' {',
        moduleContent,
        '}',
        'export = ' + namespace + ';'
      ];

      callback(moduleParts.join('\n'));
    });
  }

  private _compilePath(path: string, callback: (moduleContent: string) => void) {
    this._fs.readdir(path, (error, pathContent) => {

      this._processPathContent(path, pathContent, callback);
    });
  }

  private _processPathContent(path: string, pathContent: string[], callback: (moduleContent: string) => void) {

    if (pathContent.length === 0) {
      callback('');
    }

    var processedCount = 0;
    var moduleParts: string[] = [];

    pathContent.forEach((file) => {
      this._processPathItem(path + '/' + file, (modulePart) => {

        processedCount++;

        if (modulePart !== '') {
          moduleParts.push(modulePart);
        }

        if (processedCount === pathContent.length) {
          var moduleContent = moduleParts.join('\n');

          callback(moduleContent);
        }
      });
    });
  }

  private _processPathItem(path, callback: (modulePart: string) => void) {
    this._fs.stat(path, (error, fileStats) => {
      if (fileStats.isDirectory()) {
        this._processPath(path, callback);
      }

      if (fileStats.isFile()) {
        this._processFile(path, callback);
      }
    });
  }

  private _processFile(path, callback: (modulePart: string) => void) {

    var pathParts = path.split('/');
    var file = pathParts.pop();
    var fileParts = file.split('.');
    var extension = fileParts.pop();
    var filename = fileParts.join('.');

    if (extension !== 'ts') {
      callback('');
      return;
    }

    this._fs.readFile(path, (error, data) => {
      this._processClassFile(filename, data.toString(), callback);
    });
  }

  private _processPath(path, callback: (modulePart: string) => void) {
    this._compilePath(path, (childModule) => {

      var pathParts = path.split('/');
      var moduleName = pathParts.pop();

      var moduleParts = [
        'export module ' + moduleName + ' {',
        childModule,
        '}'
      ];

      callback(moduleParts.join('\n'));
    });
  }

  private _processClassFile(filename: string, content: string, callback: (modulePart: string) => void) {

    var classDefinition = 'class ' + filename; // TODO: Change to a regex to avoid false positives
    var interfaceDefinition = 'interface ' + filename; // TODO: Change to a regex to avoid false positives
    var indexOfClass = content.indexOf(classDefinition);
    var indexOfInterface = content.indexOf(interfaceDefinition);

    if (indexOfClass !== -1) {

      content = content.replace(classDefinition, 'export ' + classDefinition);
      content = content.replace('export = ' + filename + ';', '');

      callback(content);
      return;
    }

    if (indexOfInterface !== -1) {

      content = content.replace(interfaceDefinition, 'export ' + interfaceDefinition);
      content = content.replace('export = ' + filename + ';', '');

      callback(content);
      return;
    }

    throw 'Could not find class/interface definition. Expected: "' + classDefinition + '" or "' + interfaceDefinition + '"';
  }

  private _updateImportStatements(content: string) {
    var importRegex = /(import .*\s?=\s?)(require\(')(.*)('\);)/g;
    var requireRegEx = /require\('.*'\);/g;

    var importStatements = content.match(importRegex);

    importStatements.forEach((importStatement) => {
      console.log(importStatement);
    });
  }
}

var args = process.argv;

if (args.length !== 4) {
  throw 'Expected 2 arguments in format "source" "output module name".';
}

var filesystem: fs = require('fs');

var tsLib = new TSLib(filesystem);
tsLib.compile(args[2], args[3], (mod) => {
  console.log(mod);
});