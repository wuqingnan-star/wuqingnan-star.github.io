import apiClient from './config';

const HMC_BASE_URL = 'https://shopify.runmefitserver.com/api/hmc';
// const HMC_BASE_URL = 'http://localhost:3000/api/hmc';

export enum Range {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}
export const hmcApi = {
  getHmcOptionsStats: (step: number, range: Range) => {
    return apiClient.get(`${HMC_BASE_URL}/get-option-stats`, {
      params: {
        step,
        range,
      },
    });
  },
  getHmcStepDwell: (range: Range) => {
    return apiClient.get(`${HMC_BASE_URL}/get-step-dwell-metrics`, {
      params: {
        range,
      },
    });
  },
  getHmcDropoffReport: (range: Range) => {
    return apiClient.get(`${HMC_BASE_URL}/get-dropoff-report`, {
      params: {
        range,
      },
    });
  },
  getHmcConversionStats: (range: Range) => {
    return apiClient.get(`${HMC_BASE_URL}/get-conversion-stats`, {
      params: {
        range,
      },
    });
  },
};