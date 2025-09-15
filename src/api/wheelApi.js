import apiClient from './config.js';

// 转盘数据API基础URL
const WHEEL_BASE_URL = 'https://shopify.runmefitserver.com/api/collect';

/**
 * 转盘数据API接口
 */
export const wheelApi = {
  // 获取日统计数据
  getDailyStats: () => {
    return apiClient.get(`${WHEEL_BASE_URL}/wheel-daily-stats`);
  },

  // 获取周统计数据
  getWeeklyStats: () => {
    return apiClient.get(`${WHEEL_BASE_URL}/wheel-weekly-stats`);
  },

  // 获取月统计数据
  getMonthlyStats: () => {
    return apiClient.get(`${WHEEL_BASE_URL}/wheel-monthly-stats`);
  },

  // 获取时间段统计数据
  getDurationStats: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = params.toString() 
      ? `${WHEEL_BASE_URL}/wheel-duration-stats?${params.toString()}`
      : `${WHEEL_BASE_URL}/wheel-duration-stats`;
    
    return apiClient.get(url);
  },

  // 获取统计数据（新增的API）
  getStatistics: (type = 'day') => {
    return apiClient.get(`${WHEEL_BASE_URL}/wheel-statistics?type=${type}`);
  },
};

export default wheelApi;
