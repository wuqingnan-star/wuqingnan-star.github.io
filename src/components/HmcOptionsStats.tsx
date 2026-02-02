import { useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Card,
  Spin,
  Radio,
} from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { hmcApi } from '../api/hmcApi';
import { Range } from '../api/hmcApi';

interface ClickCountItem {
  name: string;
  value: number;
  itemStyle?: {
    color: string;
  };
}

const HmcOptionsStats = () => {
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('day');
  const [statsData, setStatsData] = useState<{
    step1: ClickCountItem[];
    step2: ClickCountItem[];
    step3: ClickCountItem[];
    step4: ClickCountItem[];
  }>({
    step1: [],
    step2: [],
    step3: [],
    step4: [],
  });
  const [loading, setLoading] = useState(true);
  
  // 图表实例引用
  const chartRef1 = useRef<ReactECharts>(null);
  const chartRef2 = useRef<ReactECharts>(null);
  const chartRef3 = useRef<ReactECharts>(null);
  const chartRef4 = useRef<ReactECharts>(null);

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
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return 'First, who is this Runmefit device for?';
      case 2:
        return 'What is the main reason for buying this watch?';
      case 3:
        return 'Which style do you prefer on the wrist?';
      case 4:
        return 'Which of these matters most to you right now?';
      default:
        return '';
    }
  }

  // 获取时间筛选的显示文本
  const getTimeFilterText = (filter: 'day' | 'week' | 'month'): string => {
    switch (filter) {
      case 'day':
        return '日';
      case 'week':
        return '周';
      case 'month':
        return '月';
      default:
        return '日';
    }
  };

  // 处理时间筛选变化
  const handleTimeFilterChange = (value: 'day' | 'week' | 'month') => {
    setTimeFilter(value);
  };

  // 颜色映射函数
  const getColorForOption = (index: number): string => {
    const colors = [
      '#3b82f6', // 蓝色
      '#10b981', // 绿色
      '#fa4d0a', // 橙色
      '#8b5cf6', // 紫色
      '#ef4444', // 红色
      '#f59e0b', // 黄色
      '#06b6d4', // 青色
      '#ec4899', // 粉色
    ];
    return colors[index % colors.length];
  };

  // 为数据项添加颜色
  const addColorsToData = (data: ClickCountItem[]): ClickCountItem[] => {
    return data.map((item, index) => ({
      ...item,
      itemStyle: {
        color: getColorForOption(index),
      },
    }));
  };

  // 获取所有统计数据
  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const range = getRangeByTimeFilter(timeFilter);
      const promises = [
        hmcApi.getHmcOptionsStats(1, range),
        hmcApi.getHmcOptionsStats(2, range),
        hmcApi.getHmcOptionsStats(3, range),
        hmcApi.getHmcOptionsStats(4, range),
      ];

      const results = await Promise.all(promises);
      
      const processData = (data: any): ClickCountItem[] => {
        if (!data) {
          return [];
        }
        // 处理响应数据，可能是 { data: [...] } 或直接是数组
        const dataArray = Array.isArray(data) ? data : (data?.data || []);
        
        if (!Array.isArray(dataArray)) {
          return [];
        }
        
        // 处理格式: [{ option_name: "...", selection_count: ... }]
        return dataArray.map((item: any) => ({
          name: item.option_name || item.name || '未知选项',
          value: item.selection_count || item.value || 0,
        }));
      };

      setStatsData({
        step1: processData(results[0]),
        step2: processData(results[1]),
        step3: processData(results[2]),
        step4: processData(results[3]),
      });
    } catch (error) {
      console.error('Error fetching HMC options stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // 当时间筛选变化时，重新获取数据
  useEffect(() => {
    fetchAllStats();
  }, [timeFilter]);

  // 强制重新渲染图表
  const resizeCharts = () => {
    setTimeout(() => {
      [chartRef1, chartRef2, chartRef3, chartRef4].forEach((ref) => {
        if (ref.current) {
          ref.current.getEchartsInstance().resize();
        }
      });
    }, 100);
  };

  // 当数据加载完成后，重新调整图表尺寸
  useEffect(() => {
    if (!loading) {
      resizeCharts();
    }
  }, [loading]);

  // 饼图配置
  const getPieChartOption = (data: ClickCountItem[], title: string): EChartsOption => ({
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      textStyle: {
        color: '#1e293b',
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      top: '10%',
      left: 'left',
      textStyle: {
        color: '#64748b',
      },
    },
    series: [
      {
        name: 'total counts',
        type: 'pie',
        radius: '50%',
        data: addColorsToData(data),
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
          fontSize: 14,
          color: '#ffffff',
          fontWeight: 600,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
    ],
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#1e293b',
            letterSpacing: '1px',
          }}
        >
          HMC 选项统计
        </h1>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600 }}>时间筛选</span>
              <Radio.Group
                value={timeFilter}
                onChange={(e) => handleTimeFilterChange(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="day">日</Radio.Button>
                <Radio.Button value="week">周</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
              </Radio.Group>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={`${getStepTitle(1)}`}
            className="chart-container"
          >
            <Spin spinning={loading} tip="loading...">
              <ReactECharts
                ref={chartRef1}
                option={getPieChartOption(statsData.step1, ``)}
                style={{ height: '400px', width: '100%' }}
                onChartReady={(chart) => {
                  setTimeout(() => {
                    chart.resize();
                  }, 100);
                }}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={`${getStepTitle(2)}`}
            className="chart-container"
          >
            <Spin spinning={loading} tip="loading...">
              <ReactECharts
                ref={chartRef2}
                option={getPieChartOption(statsData.step2, '')}
                style={{ height: '400px', width: '100%' }}
                onChartReady={(chart) => {
                  setTimeout(() => {
                    chart.resize();
                  }, 100);
                }}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={`${getStepTitle(3)}`}
            className="chart-container"
          >
            <Spin spinning={loading} tip="loading...">
              <ReactECharts
                ref={chartRef3}
                option={getPieChartOption(statsData.step3, ``)}
                style={{ height: '400px', width: '100%' }}
                onChartReady={(chart) => {
                  setTimeout(() => {
                    chart.resize();
                  }, 100);
                }}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={`${getStepTitle(4)}`}
            className="chart-container"
          >
            <Spin spinning={loading} tip="loading...">
              <ReactECharts
                ref={chartRef4}
                option={getPieChartOption(statsData.step4, '')}
                style={{ height: '400px', width: '100%' }}
                onChartReady={(chart) => {
                  setTimeout(() => {
                    chart.resize();
                  }, 100);
                }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HmcOptionsStats;