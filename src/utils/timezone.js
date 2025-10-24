import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 扩展dayjs插件
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 将时间转换为Asia/Shanghai时区
 * @param {string|Date|dayjs.Dayjs} time - 要转换的时间
 * @param {string} format - 输出格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 转换后的时间字符串
 */
export const toShanghaiTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return '-';
  
  try {
    return dayjs(time).tz('Asia/Shanghai').format(format);
  } catch (error) {
    console.error('时间转换错误:', error);
    return '-';
  }
};

/**
 * 获取相对时间（如：2小时前）
 * @param {string|Date|dayjs.Dayjs} time - 要转换的时间
 * @returns {string} 相对时间字符串
 */
export const getRelativeTime = (time) => {
  if (!time) return '-';
  
  try {
    return dayjs(time).tz('Asia/Shanghai').fromNow();
  } catch (error) {
    console.error('相对时间转换错误:', error);
    return '-';
  }
};

/**
 * 格式化时间显示（包含相对时间）
 * @param {string|Date|dayjs.Dayjs} time - 要转换的时间
 * @param {string} format - 输出格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {object} 包含格式化时间和相对时间的对象
 */
export const formatTimeDisplay = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return { formatted: '-', relative: '-' };
  
  try {
    const shanghaiTime = dayjs(time).tz('Asia/Shanghai');
    return {
      formatted: shanghaiTime.format(format),
      relative: shanghaiTime.fromNow()
    };
  } catch (error) {
    console.error('时间格式化错误:', error);
    return { formatted: '-', relative: '-' };
  }
};

/**
 * 检查时间是否为今天
 * @param {string|Date|dayjs.Dayjs} time - 要检查的时间
 * @returns {boolean} 是否为今天
 */
export const isToday = (time) => {
  if (!time) return false;
  
  try {
    const shanghaiTime = dayjs(time).tz('Asia/Shanghai');
    const today = dayjs().tz('Asia/Shanghai');
    return shanghaiTime.isSame(today, 'day');
  } catch (error) {
    console.error('时间比较错误:', error);
    return false;
  }
};

/**
 * 检查时间是否为昨天
 * @param {string|Date|dayjs.Dayjs} time - 要检查的时间
 * @returns {boolean} 是否为昨天
 */
export const isYesterday = (time) => {
  if (!time) return false;
  
  try {
    const shanghaiTime = dayjs(time).tz('Asia/Shanghai');
    const yesterday = dayjs().tz('Asia/Shanghai').subtract(1, 'day');
    return shanghaiTime.isSame(yesterday, 'day');
  } catch (error) {
    console.error('时间比较错误:', error);
    return false;
  }
};

/**
 * 智能时间显示（今天显示时间，昨天显示"昨天"，其他显示日期）
 * @param {string|Date|dayjs.Dayjs} time - 要转换的时间
 * @returns {string} 智能格式化的时间字符串
 */
export const getSmartTimeDisplay = (time) => {
  if (!time) return '-';
  
  try {
    const shanghaiTime = dayjs(time).tz('Asia/Shanghai');
    const now = dayjs().tz('Asia/Shanghai');
    
    if (shanghaiTime.isSame(now, 'day')) {
      // 今天：显示时间
      return `今天 ${shanghaiTime.format('HH:mm')}`;
    } else if (shanghaiTime.isSame(now.subtract(1, 'day'), 'day')) {
      // 昨天：显示昨天
      return `昨天 ${shanghaiTime.format('HH:mm')}`;
    } else if (shanghaiTime.isSame(now, 'year')) {
      // 今年：显示月日
      return shanghaiTime.format('MM-DD HH:mm');
    } else {
      // 其他：显示完整日期
      return shanghaiTime.format('YYYY-MM-DD HH:mm');
    }
  } catch (error) {
    console.error('智能时间显示错误:', error);
    return '-';
  }
};
