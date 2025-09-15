import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Space, Spin, Radio, DatePicker, InputNumber, Button, Typography } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, RiseOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { dashboardApi } from '../api';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const Dashboard = ({ chartType = 'dashboard' }) => {
  const [clickCounts, setClickCounts] = useState([]);
  const [productClickCounts, setProductClickCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('daily'); // 时间筛选状态，默认为日
  const [productDateRange, setProductDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]); // 产品饼图的日期范围筛选，默认本月
  
  // 计数器相关状态
  const [currentCount, setCurrentCount] = useState(0);
  const [originCount, setOriginCount] = useState(0);
  const [inputValue, setInputValue] = useState(null);
  const [counterLoading, setCounterLoading] = useState(false);
  const [originLoading, setOriginLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  // 根据时间筛选获取对应的API方法
  const getApiMethodByTimeFilter = (filter) => {
    switch (filter) {
      case 'daily':
        return dashboardApi.getDailyClicks;
      case 'weekly':
        return dashboardApi.getWeeklyClicks;
      case 'monthly':
        return dashboardApi.getMonthlyClicks;
      default:
        return dashboardApi.getDailyClicks;
    }
  };

  // 获取时间筛选的显示文本
  const getTimeFilterText = (filter) => {
    switch (filter) {
      case 'daily':
        return '日';
      case 'weekly':
        return '周';
      case 'monthly':
        return '月';
      default:
        return '日';
    }
  };


  // 处理时间筛选变化
  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
  };

  // 处理产品饼图日期范围变化
  const handleProductDateRangeChange = (dates) => {
    setProductDateRange(dates);
  };

  // 获取当前数字
  const fetchCurrentCount = async () => {
    setCounterLoading(true);
    try {
      const count = await dashboardApi.getCurrentCount();
      setCurrentCount(count);
    } catch (error) {
      console.error('Error fetching current count:', error);
    } finally {
      setCounterLoading(false);
    }
  };

  // 获取原始数字
  const fetchOriginCount = async () => {
    setOriginLoading(true);
    try {
      const data = await dashboardApi.getOriginCount();
      setOriginCount(data[0].count_start);
    } catch (error) {
      console.error('Error fetching origin count:', error);
    } finally {
      setOriginLoading(false);
    }
  };

  // 重置数字
  const handleResetCounter = async () => {
    if (inputValue === null || inputValue === undefined) {
      return;
    }
    
    setResetLoading(true);
    try {
      await dashboardApi.resetCounter(inputValue);
      // 重置成功后更新当前数字
      setCurrentCount(inputValue);
      setInputValue(null);
    } catch (error) {
      console.error('Error resetting counter:', error);
    } finally {
      setResetLoading(false);
    }
  };

  // 获取产品点击数据
  const fetchProductClickData = async () => {
    setProductLoading(true);
    try {
      let startDate = null;
      let endDate = null;
      
      if (productDateRange && productDateRange.length === 2) {
        startDate = productDateRange[0].format('YYYY-MM-DD');
        endDate = productDateRange[1].format('YYYY-MM-DD');
      }
      
      const data = await dashboardApi.getDurationClicks(startDate, endDate);
      
      // 处理产品点击数据
      const productClicks = Object.entries(data).map(([product, count]) => ({
        name: product,
        value: count
      }));
      setProductClickCounts(productClicks);
    } catch (error) {
      console.error('Error fetching product click data:', error);
      // 使用模拟数据
      setProductClickCounts([
        { name: '产品A', value: 45 },
        { name: '产品B', value: 32 },
        { name: '产品C', value: 28 },
        { name: '产品D', value: 19 },
        { name: '产品E', value: 15 }
      ]);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const apiMethod = getApiMethodByTimeFilter(timeFilter);
    
    apiMethod()
      .then(data => {
        // 处理新的数据格式 {"add-to-cart":2,"buy-now":1}
        const clickCounts = Object.entries(data).map(([button, count]) => ({
          name: button,
          value: count
        }));
        setClickCounts(clickCounts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, [timeFilter]); // 依赖项改为timeFilter，当时间筛选变化时重新获取数据

  // 当产品日期范围变化时，获取产品点击数据
  useEffect(() => {
    fetchProductClickData();
  }, [productDateRange]);

  // 组件加载时获取当前数字和原始数字
  useEffect(() => {
    fetchCurrentCount();
    fetchOriginCount();
  }, []);

  // 统计数据
  const statistics = [
    {
      title: '总用户数',
      value: 11280,
      prefix: <UserOutlined />,
      valueStyle: { color: '#3b82f6' },
    },
    {
      title: '总订单数',
      value: 8846,
      prefix: <ShoppingCartOutlined />,
      valueStyle: { color: '#10b981' },
    },
    {
      title: '总收入',
      value: 112893,
      prefix: <DollarOutlined />,
      valueStyle: { color: '#f59e0b' },
    },
    {
      title: '增长率',
      value: 12.3,
      prefix: <RiseOutlined />,
      suffix: '%',
      valueStyle: { color: '#ef4444' },
    },
  ];

  // 柱状图配置
  const getBarChartOption = () => ({
    title: {
      text: '月度销售数据',
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: '600'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      textStyle: {
        color: '#1e293b'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisLabel: {
        color: '#64748b'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisLabel: {
        color: '#64748b'
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9'
        }
      }
    },
    series: [
      {
        name: '销售额',
        type: 'bar',
        barWidth: '60%',
        data: [120, 200, 150, 80, 70, 110, 130, 180, 160, 140, 190, 220],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#1d4ed8' }
          ]),
          borderRadius: [6, 6, 0, 0]
        },
      },
    ],
  });

  // 饼图配置
  const getPieChartOption = () => ({
    title: {
      text: `点击数据 (${getTimeFilterText(timeFilter)})`,
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: '600'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      textStyle: {
        color: '#1e293b'
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#64748b'
      }
    },
    series: [
      {
        name: '按钮类别',
        type: 'pie',
        radius: '50%',
        data: clickCounts,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
          fontSize: 14,
          color: '#ffffff',
          fontWeight: '600'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      },
    ],
  });

  // 折线图配置
  const getLineChartOption = () => ({
    title: {
      text: '用户增长趋势',
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: '600'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      textStyle: {
        color: '#1e293b'
      }
    },
    legend: {
      data: ['新增用户', '活跃用户'],
      top: '10%',
      textStyle: {
        color: '#64748b'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#7f8c8d'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#7f8c8d'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ])
        }
      },
      {
        name: '活跃用户',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310, 201, 154, 190, 330, 410],
        smooth: true,
        lineStyle: {
          color: '#10b981',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.2)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ])
        }
      },
    ],
  });

  // 仪表盘配置
  const getGaugeChartOption = () => ({
    title: {
      text: '系统性能指标',
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: '600'
      }
    },
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 18,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#1d4ed8' }
            ])
          }
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, '#e2e8f0']]
          },
        },
        axisTick: {
          show: false,
        },
                 splitLine: {
           length: 15,
           lineStyle: {
             width: 2,
             color: '#3b82f6',
           },
         },
                 axisLabel: {
           distance: 25,
           color: '#64748b',
           fontSize: 12,
         },
        anchor: {
          show: true,
          showAbove: true,
          size: 25,
          itemStyle: {
            borderWidth: 10,
            borderColor: '#667eea'
          },
        },
        title: {
          show: false,
        },
                 detail: {
           valueAnimation: true,
           fontSize: 30,
           offsetCenter: [0, '70%'],
           color: '#1e293b',
           formatter: '{value}%'
         },
        data: [
          {
            value: 70,
            name: 'CPU使用率',
          },
        ],
      },
    ],
  });

  // 产品点击饼图配置
  const getProductPieChartOption = () => ({
    title: {
      text: `产品点击数据 (${productDateRange[0].format('MM-DD')} 至 ${productDateRange[1].format('MM-DD')})`,
      left: 'center',
      textStyle: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: '600'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      textStyle: {
        color: '#1e293b'
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#64748b'
      }
    },
    series: [
      {
        name: '产品类别',
        type: 'pie',
        radius: '50%',
        data: productClickCounts,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
          fontSize: 14,
          color: '#ffffff',
          fontWeight: '600'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        color: ['#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899']
      },
    ],
  });

  const renderChart = () => {
    switch (chartType) {
      case 'bar-chart':
        return <ReactECharts option={getBarChartOption()} style={{ height: '400px' }} />;
      case 'pie-chart':
        return (
          <div>
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
                <Radio.Button value="daily">日</Radio.Button>
                <Radio.Button value="weekly">周</Radio.Button>
                <Radio.Button value="monthly">月</Radio.Button>
              </Radio.Group>
            </div>
            <Spin spinning={loading} tip="loading...">
              <ReactECharts option={getPieChartOption()} style={{ height: '400px' }} />
            </Spin>
          </div>
        );
      case 'line-chart':
        return <ReactECharts option={getLineChartOption()} style={{ height: '400px' }} />;
      default:
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic {...statistics[0]} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic {...statistics[1]} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic {...statistics[2]} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic {...statistics[3]} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="数字计数器控制" className="counter-control-card">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <Text strong style={{ fontSize: '16px', color: '#1e293b' }}>
                        当前数字值：
                      </Text>
                      <div style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: '#3b82f6',
                        marginTop: '8px',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {counterLoading ? <Spin size="small" /> : currentCount}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <Text strong style={{ fontSize: '16px', color: '#1e293b' }}>
                        原始数字值：
                      </Text>
                      <div style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: '#10b981',
                        marginTop: '8px',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {originLoading ? <Spin size="small" /> : originCount}
                      </div>
                    </div>
                  </div>
                  <Space.Compact style={{ width: '100%' }}>
                    <InputNumber
                      style={{ flex: 1 }}
                      placeholder="输入新的数字值"
                      value={inputValue}
                      onChange={setInputValue}
                      min={0}
                      precision={0}
                      size="large"
                    />
                    <Button
                      type="primary"
                      size="large"
                      loading={resetLoading}
                      onClick={handleResetCounter}
                      disabled={inputValue === null || inputValue === undefined}
                      icon={<ReloadOutlined />}
                    >
                      确认重置
                    </Button>
                  </Space.Compact>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="default"
                      size="small"
                      onClick={() => {
                        fetchCurrentCount();
                        fetchOriginCount();
                      }}
                      loading={counterLoading || originLoading}
                      icon={<ReloadOutlined />}
                    >
                      刷新所有值
                    </Button>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>产品详情按钮点击数据</span>
                    <Radio.Group 
                      value={timeFilter} 
                      onChange={(e) => handleTimeFilterChange(e.target.value)}
                      optionType="button"
                      buttonStyle="solid"
                      size="small"
                    >
                      <Radio.Button value="daily">日</Radio.Button>
                      <Radio.Button value="weekly">周</Radio.Button>
                      <Radio.Button value="monthly">月</Radio.Button>
                    </Radio.Group>
                  </div>
                } 
                className="chart-container"
              >
                <Spin spinning={loading} tip="loading...">
                  <ReactECharts option={getPieChartOption()} style={{ height: '300px' }} />
                </Spin>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>产品点击数据</span>
                    <RangePicker 
                      onChange={handleProductDateRangeChange}
                      value={productDateRange}
                      placeholder={['开始日期', '结束日期']}
                      allowClear={false}
                      format="YYYY-MM-DD"
                      size="small"
                      style={{ width: 250 }}
                    />
                  </div>
                } 
                className="chart-container"
              >
                <Spin spinning={productLoading} tip="loading...">
                  <ReactECharts option={getProductPieChartOption()} style={{ height: '300px' }} />
                </Spin>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="月度销售数据" className="chart-container">
                <ReactECharts option={getBarChartOption()} style={{ height: '300px' }} />
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="用户增长趋势" className="chart-container">
                <ReactECharts option={getLineChartOption()} style={{ height: '300px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="系统性能指标" className="chart-container">
                <ReactECharts option={getGaugeChartOption()} style={{ height: '300px' }} />
              </Card>
            </Col>
          </Row>
        );
    }
  };

  return (
    <div>
      {chartType === 'dashboard' && (
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            marginBottom: '16px', 
            color: '#1e293b',
            letterSpacing: '1px'
          }}>
            数据概览
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
            欢迎使用数据后台管理系统，这里展示了关键的业务指标和数据分析图表。
          </p>
        </div>
      )}
      {renderChart()}
    </div>
  );
};

export default Dashboard;
