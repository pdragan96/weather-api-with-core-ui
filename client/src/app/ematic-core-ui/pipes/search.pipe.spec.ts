import { SearchPipe } from './search.pipe';

describe('Pipe: Search', () => {
  let pipe: SearchPipe;

  beforeEach(() => {
    pipe = new SearchPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should find search term', () => {
    const values = [{name: 'test'}, {name: 'bugz'}];
    const args = 'te';
    const key = 'name';
    expect(pipe.transform(values, args, key)).toEqual([{name: 'test'}]);
  });

  it('should not find search term', () => {
    const values = [{name: 'test'}, {name: 'bugz'}];
    const args = 'wrong';
    const key = 'name';
    expect(pipe.transform(values, args, key)).toEqual([]);
  });

  it('should return whole array', () => {
    const values = [{name: 'test'}, {name: 'bugz'}];
    const args = '';
    const key = 'name';
    expect(pipe.transform(values, args, key)).toEqual([{name: 'test'}, {name: 'bugz'}]);
  });
});
