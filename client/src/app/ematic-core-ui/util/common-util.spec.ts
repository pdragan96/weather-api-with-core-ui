import { CommonUtil } from './common-util';
import { IEspData } from '../../models/esp';

describe('CommonUtil', () => {

  it('Should get phantom record.', () => {
    expect(CommonUtil.getPhantomRecord().phantom).toBeTruthy();
  });

  it('Should format timezone.', () => {
    const timezoneArray = CommonUtil.formatTimezone('Europe/Sarajevo').split(' ');
    expect(timezoneArray.length).toBe(2);
  });

  it('Should return client timezone.', () => {
    const clientTimezone = CommonUtil.getClientTimezone('Europe/Sarajevo');
    expect(clientTimezone.text).toBeTruthy();
  });

  it('Should allow only numbers.', () => {
    expect(CommonUtil.allowOnlyNumbers(<KeyboardEvent>{ keyCode: 50 })).toBeTruthy();
  });

  it('Should return correct number separators.', () => {
    expect(CommonUtil.getNumberSeparators().thousandSeparator).toMatch(',');
  });

  it('Should return formatted number.', () => {
    expect(CommonUtil.formatNumber(123456, 2)).toMatch('123,456');
  });

  it('Should format axis number.', () => {
    expect(CommonUtil.formatAxis(1234567)).toMatch('1.23m');
  });

  it('Should format percentage.', () => {
    expect(CommonUtil.formatPercentage(0.3333)).toMatch('33.33%');
  });

  it('Should return positive percentage.', () => {
    expect(CommonUtil.getPercentage(0.1, 0.04)).toMatch('150.00%');
  });

  it('Should return negative percentage.', () => {
    expect(CommonUtil.getNegativePercentage(0.04, 0.1)).toMatch('60.00%');
  });

  it('Should return pagination data.', () => {
    const data = [1, 2, 3, 4, 5, 6];
    const filter = { page: 2, pageSize: 3 };
    expect(CommonUtil.getPaginationData(data, filter).records.length).toBe(3);
  });

  it('Should replace all matches in string.', () => {
    expect(CommonUtil.replaceAll('ababab', 'a', 'c')).toMatch('cbcbcb');
  });

  it('Should capitalize word.', () => {
    expect(CommonUtil.capitalize('test')).toMatch('Test');
  });

  describe('calculateUniqueESPIdentifier', () => {
    const calculateUniqueESPIdentifier = CommonUtil.calculateUniqueESPIdentifier;
    let espData: IEspData;

    beforeEach(() => {
      espData = <IEspData>{
        type: 'mailjet',
        fields: [
          { key: 'key', text: 'Key', value: '34cb0b0d831f2158dcbb943af896e73e', required: true },
          { key: 'secret', text: 'Secret Key', value: 'fbbe2bb2b6839bce68add4a44acf2f0', required: true },
          { key: 'listId', text: 'List ID', value: '12930', required: true },
          { key: 'sftpApiKey', text: 'SFTP API Key', value: 'mailjet_sea', required: true }
        ]
      };
    });

    it('should not modify original array values', () => {
      calculateUniqueESPIdentifier(espData); // ignore result

      expect(espData.fields).toEqual([
        { key: 'key', text: 'Key', value: '34cb0b0d831f2158dcbb943af896e73e', required: true },
        { key: 'secret', text: 'Secret Key', value: 'fbbe2bb2b6839bce68add4a44acf2f0', required: true },
        { key: 'listId', text: 'List ID', value: '12930', required: true },
        { key: 'sftpApiKey', text: 'SFTP API Key', value: 'mailjet_sea', required: true }
      ]);
    });

    it('should calculate unique ESP identifier', () => {
      const result = calculateUniqueESPIdentifier(espData);
      const expected = 'mailjet|34cb0b0d831f2158dcbb943af896e73e|12930|fbbe2bb2b6839bce68add4a44acf2f0|mailjet_sea';

      expect(result).toBe(expected);
    });
  });

  describe('validateUrl', () => {
    const validateUrl = CommonUtil.validateUrl;
    const errorObject = { urlValidation: 'URL is invalid.' };

    it('should mark https://www.example.com as a valid URL', () => {
      const url = 'https://www.example.com';
      const result = validateUrl(url);

      expect(result).toBeNull();
    });

    it('should mark https://example.com as a valid URL', () => {
      const url = 'https://example.com';
      const result = validateUrl(url);

      expect(result).toBeNull();
    });

    it('should mark http://www.example.com as a valid URL', () => {
      const url = 'http://www.example.com';
      const result = validateUrl(url);

      expect(result).toBeNull();
    });

    it('should mark http://example.com as a valid URL', () => {
      const url = 'http://example.com';
      const result = validateUrl(url);

      expect(result).toBeNull();
    });

    it('should mark www.example.com as a valid URL', () => {
      const url = 'www.example.com';
      const result = validateUrl(url);

      expect(result).toBeNull();
    });

    it('should mark example.com as a valid URL', () => {
      const url = 'example.com';
      const result = validateUrl(url);

      expect(result).toBeNull();
    });

    it('should mark url-example.com as a valid URL', () => {
      const url = 'url-example.com';
      const result = validateUrl(url);

      expect(result).toBeNull();
    });

    it('should mark https: //www.example.com as an invalid URL', () => {
      const url = 'https: //www.example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark https: //example.com as an invalid URL', () => {
      const url = 'https: //example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark https:www.example.com as an invalid URL', () => {
      const url = 'https:www.example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark https:example.com as an invalid URL', () => {
      const url = 'https:example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark https:/www.example.com as an invalid URL', () => {
      const url = 'https:/www.example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark https:/example.com as an invalid URL', () => {
      const url = 'https:/example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark ://example.com as an invalid URL', () => {
      const url = '://example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark //example.com as an invalid URL', () => {
      const url = '//example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark /example.com as an invalid URL', () => {
      const url = '/example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark :/example.com as an invalid URL', () => {
      const url = ':/example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });

    it('should mark :example.com as an invalid URL', () => {
      const url = ':example.com';
      const result = validateUrl(url);

      expect(result).toEqual(errorObject);
    });
  });
});
