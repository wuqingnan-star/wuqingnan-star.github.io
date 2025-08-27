import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Space, Spin } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const Dashboard = ({ chartType = 'dashboard' }) => {
  const [clickCounts, setClickCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const GET_CLICK_COUNTS_ENDPOINT = "http://localhost:3000/api/click-counts"

  useEffect(() => {
    setLoading(true);
    fetch(GET_CLICK_COUNTS_ENDPOINT)
      .then(response => response.json())
      .then(data => {
        const clickCounts = data.map(item => ({
          name: item.button,
          value: item.count
        }));
        setClickCounts(clickCounts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, []); // 空依赖数组，只在组件挂载时执行一次
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
      text: '',
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
      }
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

  const renderChart = () => {
    switch (chartType) {
      case 'bar-chart':
        return <ReactECharts option={getBarChartOption()} style={{ height: '400px' }} />;
      case 'pie-chart':
        return (
          <Spin spinning={loading} tip="loading...">
            <ReactECharts option={getPieChartOption()} style={{ height: '400px' }} />
          </Spin>
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
              <Card title="产品详情按钮点击数据" className="chart-container">
                <Spin spinning={loading} tip="loading...">
                  <ReactECharts option={getPieChartOption()} style={{ height: '300px' }} />
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
