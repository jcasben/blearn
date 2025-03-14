import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {BrowserStorageService} from './browser-storage.service';

describe('BrowserStorageService', () => {
  let service: BrowserStorageService;
  beforeEach(() => {
    let store: { [key: string]: string } = {};

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return store[key] || null;
    });

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      store[key] = value;
    });

    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete store[key];
    });

    jest.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      store = {};
    });

    service = new BrowserStorageService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
      expect(service).toBeTruthy();
  });

  it('should save data to localStorage', () => {
    // given
    const testData = { id: 1, name: 'Test Activity' };

    // when
    service.saveData('test', testData);

    // then
    const savedData = JSON.parse(localStorage.getItem('test') || 'null');
    expect(savedData).toEqual(testData);
  });

  it('should get data from localstorage', () => {
    // given
    const testData = { id: 1, name: 'Test Activity' };
    localStorage.setItem('test', JSON.stringify(testData))

    // when
    const retrievedData = service.loadData('test');

    // then
    expect(retrievedData).toEqual(testData);
  });

  it('should remove data from localstorage', () => {
    // given
    const testData = { id: 1, name: 'Test Activity' };
    localStorage.setItem('test', JSON.stringify(testData))

    // when
    service.removeData('test');

    // then
    expect(localStorage.getItem('test')).toBeNull();
    expect(localStorage.length).toBe(0);
  });
});
