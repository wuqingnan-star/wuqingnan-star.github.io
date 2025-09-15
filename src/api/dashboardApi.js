import apiClient from './config.js';

// Dashboard数据API基础URL
const DASHBOARD_BASE_URL = 'https://collect-vital-data.onrender.com/api';

/**
 * Dashboard数据API接口
 */
export const dashboardApi = {
  // 获取点击统计数据
  getClickCounts: () => {
    return apiClient.get(`${DASHBOARD_BASE_URL}/click-counts`);
  },

  // 获取日统计数据
  getDailyClicks: () => {
    return apiClient.get(`${DASHBOARD_BASE_URL}/daily-clicks`);
  },

  // 获取周统计数据
  getWeeklyClicks: () => {
    return apiClient.get(`${DASHBOARD_BASE_URL}/weekly-clicks`);
  },

  // 获取月统计数据
  getMonthlyClicks: () => {
    return apiClient.get(`${DASHBOARD_BASE_URL}/monthly-clicks`);
  },

  // 获取时间段统计数据
  getDurationClicks: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = params.toString() 
      ? `${DASHBOARD_BASE_URL}/duration-clicks?${params.toString()}`
      : `${DASHBOARD_BASE_URL}/duration-clicks`;
    
    return apiClient.get(url);
  },

  // 获取当前计数
  getCurrentCount: () => {
    return apiClient.get(`${DASHBOARD_BASE_URL}/current-count`);
  },

  // 获取原始计数
  getOriginCount: () => {
    return apiClient.get(`${DASHBOARD_BASE_URL}/origin-count`);
  },

  // 重置计数器
  resetCounter: (newValue) => {
    return apiClient.post(`${DASHBOARD_BASE_URL}/reset-counter`, {
      newValue: newValue
    });
  },
};

export default dashboardApi;
