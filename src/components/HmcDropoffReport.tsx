import { useEffect, useState, useRef } from "react";
import { hmcApi, Range } from "../api/hmcApi";
import { Card, Radio, Spin } from "antd";
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface DropoffData {
  step_num: number;
  drop_count: number;
}

export default function HmcDropoffReport() {
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('day');
  const [data, setData] = useState<DropoffData[]>([]);
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
        return Range.WEEK;
    }
  };

  const getDropoffReportData = async () => {
    setLoading(true);
    try {
      const range = getRangeByTimeFilter(timeFilter);
      const res = await hmcApi.getHmcDropoffReport(range);
      // 假设 API 返回的数据在 res.data 中
      const responseData = res.data?.data || res.data || [];
      setData(responseData);
    } catch (error) {
      console.error('获取流失报告数据失败:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeFilterChange = (value: 'day' | 'week' | 'month') => {
    setTimeFilter(value);
  };

  useEffect(() => {
    getDropoffReportData();
  }, [timeFilter]);

  // 获取步骤名称
  const getStepName = (stepNum: number): string => {
    const stepNames = ['第一步', '第二步', '第三步', '第四步', '第五步', '第六步', '第七步', '第八步'];
    return stepNames[stepNum - 1] || `步骤 ${stepNum}`;
  };

  // 获取漏斗图配置
  const getChartOption = (): EChartsOption => {
    if (!data || data.length === 0) {
      return {
        title: {
          text: '',
          left: 'center',
        },
      };
    }

    // 准备原始数据
    const rawData = data.map((item) => {
      return {
        value: item.drop_count,
        name: getStepName(item.step_num),
        step_num: item.step_num,
      };
    });

    // 获取图例数据
    const legendData = rawData.map(item => item.name);

    return {
      title: {
        text: '流失报告',
        left: 'center',
        top: '0%'
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: legendData,
        top: '5%',
      },
      dataset: [
        {
          source: rawData,
        },
        {
          transform: {
            type: 'sort',
            config: {
              dimension: 'step_num',
              order: 'asc',
            },
          },
        },
      ],
      series: [
        {
          name: '流失人数',
          type: 'funnel',
          datasetIndex: 1,
          left: '10%',
          top: '15%',
          width: '80%',
          labelLine: {
            show: false,
          },
          label: {
            position: 'inside',
          },
          encode: {
            itemName: 'name',
            value: 'value',
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