import { NumericPipe } from './numeric.pipe';

describe('Pipe: Numeric', () => {
  let pipe: NumericPipe;
  const getTestData = (value: any, decimalPlaces: number, isLarge: boolean) => {
    return { value, decimalPlaces, isLarge };
  };

  beforeEach(() => {
    pipe = new NumericPipe();
  });

  it('create a pipe', () => {
    expect(pipe).toBeTruthy();
  });

  // 1 decimal place
  it('small integer with isLarge == false (1 decimal place)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23, 1, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23');
  });

  it('small integer with isLarge == true (1 decimal place)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23, 1, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23');
  });

  it('medium integer with isLarge == false (1 decimal place)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(2345, 1, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('2,345');
  });

  it('medium integer with isLarge == true (1 decimal place)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(2345, 1, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('2.3k');
  });

  it('large integer with isLarge == false (1 decimal place)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23456789, 1, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23,456,789');
  });

  it('large integer with isLarge == true (1 decimal place)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23456789, 1, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23.5m');
  });

  // 2 decimal places
  it('small integer with isLarge == false (2 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23, 2, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23');
  });

  it('small integer with isLarge == true (2 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23, 2, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23');
  });

  it('medium integer with isLarge == false (2 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(2345, 2, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('2,345');
  });

  it('medium integer with isLarge == true (2 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(2345, 2, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('2.35k');
  });

  it('large integer with isLarge == false (2 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23456789, 2, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23,456,789');
  });

  it('large integer with isLarge == true (2 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23456789, 2, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23.5m');
  });

  // 3 decimal places
  it('small integer with isLarge == false (3 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23, 3, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23');
  });

  it('small integer with isLarge == true (3 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23, 3, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23');
  });

  it('medium integer with isLarge == false (3 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(2345, 3, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('2,345');
  });

  it('medium integer with isLarge == true (3 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(2345, 3, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('2.345k');
  });

  it('large integer with isLarge == false (3 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23456789, 3, false);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23,456,789');
  });

  it('large integer with isLarge == true (3 decimal places)', () => {
    const { value, decimalPlaces, isLarge } = getTestData(23456789, 3, true);
    expect(pipe.transform(value, decimalPlaces, isLarge)).toBe('23.5m');
  });
});

