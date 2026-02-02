import { useState, useEffect, useRef } from 'react';
import { Card, Spin, Radio } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { hmcApi, Range } from '../api/hmcApi';

interface StepDwellData {
  step_number: number;
  median_dwell: number;
  max_dwell: number;
}

export default function HmcStepDwell() {
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('day');
  const [data, setData] = useState<StepDwellData[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<ReactECharts>(null);

  // 根据时间筛选获取对应的 Range
  const getRangeByTimeFilter = (filter: 'day' | 'week' | 'month'): Range => {
    switch (filter) {
      case 'day':
        return Range.DAY;
      case 'week':
        return Range.WEEK;
      case 'month':
        return Range.MONTH;
      default:
        return Range.DAY;
    }
  };

  const getStepDwellData = async () => {
    setLoading(true);
    try {
      const range = getRangeByTimeFilter(timeFilter);
      const res = await hmcApi.getHmcStepDwell(range);
      // 假设 API 返回的数据在 res.data 中
      const responseData = res.data?.data || res.data || [];
      setData(responseData);
    } catch (error) {
      console.error('获取步骤停留时长数据失败:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStepDwellData();
  }, [timeFilter]);

  // 处理时间筛选器变化
  const handleTimeFilterChange = (value: 'day' | 'week' | 'month') => {
    setTimeFilter(value);
  };

  // 获取图表配置
  const getChartOption = (): EChartsOption => {
    // 按 step_number 排序
    const sortedData = [...data].sort((a, b) => b.step_number - a.step_number);
    
    const stepNumbers = sortedData.map(item => `步骤 ${item.step_number}`);
    const medianDwells = sortedData.map(item => item.median_dwell);
    const maxDwells = sortedData.map(item => Math.min(item.max_dwell, 99999));

    return {
      title: {
        text: 'HMC 步骤停留时长',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          let result = `${params[0].name}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value} ms<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: ['中位数停留时长', '最大停留时长'],
        top: 40,
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '10%',
      },
      xAxis: {
        type: 'value',
        name: '停留时长 (ms)',
        nameLocation: 'middle',
        nameGap: 30,
      },
      yAxis: {
        type: 'category',
        data: stepNumbers,
        axisLabel: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: '中位数停留时长',
          type: 'bar',
          data: medianDwells,
          barCategoryGap: '50%',
          itemStyle: {
            color: '#5470c6',
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c} ms',
          },
        },
        {
          name: '最大停留时长',
          type: 'bar',
          data: maxDwells,
          barCategoryGap: '50%',
          itemStyle: {
            color: '#91cc75',
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c} ms',
          },
        },
      ],
    };
  };

  return (
    <div>
      <Card>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <Radio.Group 
            value={timeFilter} 
            onChange={(e) => handleTimeFilterChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="middle"
          >
            <Radio.Button value="day">日</Radio.Button>
            <Radio.Button value="week">周</Radio.Button>
            <Radio.Button value="month">月</Radio.Button>
          </Radio.Group>
        </div>
        <Spin spinning={loading} tip="加载中...">
          {data.length > 0 ? (
            <ReactECharts
              ref={chartRef}
              option={getChartOption()}
              style={{ height: '500px', width: '100%' }}
              onChartReady={(chart) => {
                setTimeout(() => {
                  chart.resize();
                }, 100);
              }}
            />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#999' 
            }}>
              {loading ? '加载中...' : '暂无数据'}
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
}