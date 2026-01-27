import { useEffect, useState, useRef } from "react";
import { hmcApi, Range } from "../api/hmcApi";
import { Card, Radio, Spin } from "antd";
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface ConversionStatsData {
  step_number: number;
  conversion_rate?: number;
  [key: string]: any;
}

export default function HmcConversionStats() {
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('day');
  const [data, setData] = useState<ConversionStatsData[]>([]);
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

  const getConversionStatsData = async () => {
    setLoading(true);
    try {
      const range = getRangeByTimeFilter(timeFilter);
      const res = await hmcApi.getHmcConversionStats(range);
      // 假设 API 返回的数据在 res.data 中
      const responseData = res.data?.data || res.data || [];
      setData(responseData);
    } catch (error) {
      console.error('获取转化统计数据失败:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeFilterChange = (value: 'day' | 'week' | 'month') => {
    setTimeFilter(value);
  };

  useEffect(() => {
    getConversionStatsData();
  }, [timeFilter]);

  // 获取图表配置
  const getChartOption = (): EChartsOption => {
    // 按 step_number 排序
    const sortedData = [...data].sort((a, b) => a.click_count - b.click_count);


    const numericFields = data.length > 0
      ? Object.keys(data[0]).filter(key => key !== 'product_name' && typeof data[0][key] === 'number')
      : [];

    // 如果没有数据，返回空配置
    if (numericFields.length === 0) {
      return {
        title: {
          text: 'HMC 转化统计',
          left: 'center',
        },
      };
    }

    // 生成系列数据
    const series = numericFields.map((field, index) => {
      const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];
      return {
        name: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: 'bar' as const,
        data: sortedData.map(item => item.click_count),
        barCategoryGap: '50%',
        barWidth: '40%',
        itemStyle: {
          color: colors[index % colors.length],
        },
        label: {
          show: true,
          position: 'right' as const,
          formatter: (params: any) => {
            const value = params.value;
            // 如果是百分比类型的数据，显示百分比
            if (field.includes('rate') || field.includes('percent')) {
              return `${(value * 100).toFixed(2)}%`;
            }
            return value;
          },
        },
      };
    });

    return {
      title: {
        text: 'HMC 转化统计',
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
            const value = param.value;
            let displayValue = value;
            // 如果是百分比类型的数据，显示百分比
            if (param.seriesName.toLowerCase().includes('rate') ||
              param.seriesName.toLowerCase().includes('percent')) {
              displayValue = `${(value * 100).toFixed(2)}%`;
            }
            result += `${param.seriesName}: ${displayValue}<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: numericFields.map(field =>
          field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        ),
        top: 40,
      },
      dataZoom: {
        type: 'slider',
        yAxisIndex: 100,
        start: 100,
        end: 50
      },
      grid: {
        left: '15%',
        right: '10%',
        top: '15%',
        bottom: '15%',
      },
      xAxis: {
        type: 'value',
        name: '跳转次数',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value: number) => {
            return Number.isInteger(value) ? value.toString() : '';
          } ,
        },
      },
      yAxis: {
        type: 'category',
        data: sortedData.map(item => item.product_name),
        axisLabel: {
          fontSize: 12,
        },
      },
      series,
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
              style={{ height: '650px', width: '100%' }}
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