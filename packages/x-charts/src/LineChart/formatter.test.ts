import { expect } from 'chai';
import { FormatterParams } from '@mui/x-charts/models/seriesType/config';
import lineFormatter from '@mui/x-charts/LineChart/formatter';

const seriesOrder = ['id1'];
const seriesDataset: FormatterParams<'line'>['series'] = {
  id1: {
    // useless info
    type: 'line',
    id: 'id1',
    color: 'red',
    // usefull info
    dataKey: 'k',
  },
};
const seriesData: FormatterParams<'line'>['series'] = {
  id1: {
    // useless info
    type: 'line',
    id: 'id1',
    color: 'red',
    // usefull info
    data: [1, 2, 3],
  },
};

const dataSet = [{ k: 1 }, { k: 2 }, { k: 3 }];

describe.only('LineChart - formatter', () => {
  describe('data from dataset', () => {
    it('shoudld get data from the dataset', () => {
      const results = lineFormatter({ seriesOrder, series: seriesDataset }, dataSet);
      console.log(results);
    });
  });
});
