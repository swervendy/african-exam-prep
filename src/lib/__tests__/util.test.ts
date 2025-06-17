import { shuffleArray } from '../util';

describe('shuffleArray', () => {
  it('should return an array with the same length', () => {
    const originalArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffleArray(originalArray);
    
    expect(shuffledArray).toHaveLength(originalArray.length);
  });

  it('should return an array with the same elements', () => {
    const originalArray = ['a', 'b', 'c', 'd'];
    const shuffledArray = shuffleArray(originalArray);
    
    expect(shuffledArray.sort()).toEqual(originalArray.sort());
  });

  it('should not modify the original array', () => {
    const originalArray = [1, 2, 3, 4, 5];
    const originalCopy = [...originalArray];
    
    shuffleArray(originalArray);
    
    expect(originalArray).toEqual(originalCopy);
  });

  it('should handle empty arrays', () => {
    const originalArray: number[] = [];
    const shuffledArray = shuffleArray(originalArray);
    
    expect(shuffledArray).toEqual([]);
  });

  it('should handle arrays with one element', () => {
    const originalArray = [42];
    const shuffledArray = shuffleArray(originalArray);
    
    expect(shuffledArray).toEqual([42]);
  });

  it('should handle arrays with duplicate elements', () => {
    const originalArray = [1, 1, 2, 2, 3];
    const shuffledArray = shuffleArray(originalArray);
    
    expect(shuffledArray.sort()).toEqual(originalArray.sort());
  });
}); 