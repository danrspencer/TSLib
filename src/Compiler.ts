
class Compiler {

  public run(namespace: string, path: string) {
    var libParts: string[] = [
      'module ' + namespace + ' {',
      '',
      '}',
      '',
      'export = ' + namespace + ';'
    ];

    return libParts.join('\n');
  }
}

export = Compiler;

