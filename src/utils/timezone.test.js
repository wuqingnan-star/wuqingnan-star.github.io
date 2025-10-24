// 时区转换测试文件
import { toShanghaiTime, getSmartTimeDisplay, getRelativeTime } from './timezone';

// 测试数据
const testTimes = [
  new Date().toISOString(), // 当前时间
  new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 昨天
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 一周前
  '2024-01-01T00:00:00Z', // 固定时间
];

console.log('=== 时区转换测试 ===');
testTimes.forEach((time, index) => {
  console.log(`\n测试 ${index + 1}:`);
  console.log(`原始时间: ${time}`);
  console.log(`上海时间: ${toShanghaiTime(time)}`);
  console.log(`智能显示: ${getSmartTimeDisplay(time)}`);
  console.log(`相对时间: ${getRelativeTime(time)}`);
});
