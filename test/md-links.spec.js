const mdLinks = require('../index.js');
const fs = require('fs');
const cli = require('../cli.js');

describe('mdLinks', () => {
  test('should return a promise', () => {
    const result = mdLinks('README.md');
    expect(result instanceof Promise).toBe(true);
  });

  test('should reject promise if file does not exist or is empty', () => {
    const fileExistsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const fileSizeSpy = jest.spyOn(fs, 'statSync').mockReturnValue({ size: 0 });

    return mdLinks('README.md').catch((error) => {
      expect(error).toBeTruthy();
      fileExistsSpy.mockRestore();
      fileSizeSpy.mockRestore();
    });
  });

  test('should resolve promise with an array of objects with href, text and file properties', () => {
    const fileContent = '[Google](https://www.google.com)';
    const fileExistsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const fileSizeSpy = jest.spyOn(fs, 'statSync').mockReturnValue({ size: fileContent.length });
    const readFileSpy = jest.spyOn(fs, 'readFile').mockImplementation((path, options, callback) => {
      callback(null, fileContent);
    });

    const expectedOutput = [
      {
        href: 'https://www.google.com',
        text: 'Google',
        file: 'README.md',
      },
    ];

    return mdLinks('README.md').then((result) => {
      expect(result).toEqual(expectedOutput);
      fileExistsSpy.mockRestore();
      fileSizeSpy.mockRestore();
      readFileSpy.mockRestore();
    });
  });
});


describe('cli function', () => {
  test('should return invalid command message', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    process.argv = ['node', 'cli.js', 'invalid-command'];
    cli();
    expect(consoleSpy).toHaveBeenCalledWith('Comando inválido.');
  });

  // test('should return stats', () => {
  //   const consoleSpy = jest.spyOn(console, 'log');
  //   process.argv = ['node', 'cli.js', './arquivos/texto.md', '--stats'];
  //   const result = cli();

  //   expect(result).not.toBeUndefined();
  //   expect(consoleSpy).toHaveBeenCalledWith('Total:', expect.any(Number));
  //   expect(consoleSpy).toHaveBeenCalledWith('Unique:', expect.any(Number));
  // });

  // test('should return stats and validate', () => {
  //   const consoleSpy = jest.spyOn(console, 'log');
  //   process.argv = ['node', 'cli.js', 'path/to/file.md', '--stats', '--validate'];
  //   cli();
  //   expect(consoleSpy).toHaveBeenCalledWith('Total:', expect.any(Number));
  //   expect(consoleSpy).toHaveBeenCalledWith('Unique:', expect.any(Number));
  //   expect(consoleSpy).toHaveBeenCalledWith('Broken:', expect.any(Number));
  // });

  test('should return validated links', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    process.argv = ['node', 'cli.js', 'path/to/file.md', '--validate'];
    cli();
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String));
  });
});
