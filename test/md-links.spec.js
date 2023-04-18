const mdLinks = require('../index.js');
const fs = require('fs');
const fetch = require('node-fetch');
const chalk = require('chalk');
const  fetchLink = require('../cli.js'); 
const fetchMock = require('fetch-mock');



jest.mock('chalk');
jest.mock('node-fetch');


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



describe('fetchLink', () => {
  // Mock da função fetch para simular a chamada de API
  global.fetch = jest.fn().mockImplementation(url => {
    const response = {
      status: 200,
      statusText: 'OK',
    };
    return Promise.resolve(response);
  });

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    global.fetch.mockClear();
  });

  test('deve atualizar o status e statusText corretamente com uma resposta válida', () => {
    const element = {
      href: 'https://www.example.com',
    };

    return fetchLink(element).then(result => {
      expect(result).toEqual(expect.objectContaining({
        status: 200,
        statusText: 'OK',
      }));
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('https://www.example.com');
    });
  });

  test('deve atualizar o status e statusText corretamente com uma resposta de erro', () => {
    const element = {
      href: 'https://www.example.com',
    };

    // Simular uma resposta de erro na chamada de API
    global.fetch.mockImplementationOnce(url => {
      const response = {
        status: 404,
        statusText: 'Not Found',
      };
      return Promise.resolve(response);
    });

    return fetchLink(element).then(result => {
      expect(result).toEqual(expect.objectContaining({
        status: 404,
        statusText: 'Not Found',
      }));
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('https://www.example.com');
    });
  });

  test('deve rejeitar a promise com erro ao passar um elemento inválido ou sem URL', () => {
    const element = null;

    return expect(fetchLink(element)).rejects.toThrow('Elemento inválido ou sem URL');
  });
});

