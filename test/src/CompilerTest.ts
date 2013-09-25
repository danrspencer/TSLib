///<reference path='../jasmine.d.ts' />
///<reference path='../jasmine_sss.ts' />

///<reference path='../../node.d.ts' />

import Compiler = require('src/Compiler');

describe('Compiler', () => {

  var compiler: Compiler;
  var fsMock: fs;

  beforeEach(() => {
    fsMock = jasmine.createSpyObj<fs>(
      'fsMock',
      []
    )
  });

  describe('run()', () => {

    it('generates an export module with the specified name', () => {
      compiler = new Compiler();

      var result = compiler.run('TestProject', 'path/to/project');

      // TODO: Should check newlines are correct too - needs better regex
      var expectedModule = /module TestProject {[\s\S]*}[\s\S]*export = TestProject;/g;

      expect(result).toMatch(expectedModule);
    });

    it('generates nested modules for each folder', () => {
      compiler = new Compiler();
    });
  });
});