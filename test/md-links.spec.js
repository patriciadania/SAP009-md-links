const mdLinks = require('../index.js');
const fs = require('fs');


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


