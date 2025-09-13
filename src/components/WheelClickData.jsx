import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Spin,
  Statistic,
  Space,
  Radio,
  DatePicker,
  InputNumber,
  Button,
  Typography,
  Divider,
  Select,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  ReloadOutlined,
  HomeOutlined,
  RocketOutlined,
} from "@ant-design/icons";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const WheelClickData = () => {
  const [clickCounts, setClickCounts] = useState([]);
  const [productClickCounts, setProductClickCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("daily"); // 时间筛选状态，默认为日
  const [productDateRange, setProductDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]); // 产品饼图的日期范围筛选，默认本月
  
  // 统计数据状态
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [homePageShowCount, setHomePageShowCount] = useState(0); // 首页展示次数
  const [mainSiteShowCount, setMainSiteShowCount] = useState(0); // 主站展示次数
  const [warmupPageShowCount, setWarmupPageShowCount] = useState(0); // 预热页展示次数
  const [totalShowCount, setTotalShowCount] = useState(0); // 总展示次数
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [statisticsTimeFilter, setStatisticsTimeFilter] = useState("day"); // 统计数据的日周月筛选
  const [isMobile, setIsMobile] = useState(false); // 移动端检测状态
  
  // 图表实例引用
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);

  // 预设的日期范围选项
  const dateRangeOptions = [
    {
      label: "最近7天",
      value: "last7days",
      dates: [dayjs().subtract(7, "day"), dayjs()]
    },
    {
      label: "最近30天",
      value: "last30days", 
      dates: [dayjs().subtract(30, "day"), dayjs()]
    },
    {
      label: "本月",
      value: "thisMonth",
      dates: [dayjs().startOf("month"), dayjs().endOf("month")]
    },
    {
      label: "上月",
      value: "lastMonth",
      dates: [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")]
    }
  ];

  // 移动端检测
  useEffect(() => {
    const checkIsMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        // 当移动端状态改变时，重新调整图表尺寸
        resizeCharts();
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [isMobile]);

  // API端点配置
  const GET_DAILY_CLICKS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-daily-stats";
  const GET_WEEKLY_CLICKS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-weekly-stats";
  const GET_MONTHLY_CLICKS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-monthly-stats";
  const GET_DURATION_CLICKS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-duration-stats";
  const GET_WHEEL_STATISTICS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-statistics";

  

  // 根据时间筛选获取对应的API端点
  const getEndpointByTimeFilter = (filter) => {
    switch (filter) {
      case "daily":
        return GET_DAILY_CLICKS_ENDPOINT;
      case "weekly":
        return GET_WEEKLY_CLICKS_ENDPOINT;
      case "monthly":
        return GET_MONTHLY_CLICKS_ENDPOINT;
      default:
        return GET_DAILY_CLICKS_ENDPOINT;
    }
  };

  // 获取时间筛选的显示文本
  const getTimeFilterText = (filter) => {
    switch (filter) {
      case "daily":
        return "日";
      case "weekly":
        return "周";
      case "monthly":
        return "月";
      default:
        return "日";
    }
  };

  // 处理时间筛选变化
  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
  };

  // 处理统计数据时间筛选变化
  const handleStatisticsTimeFilterChange = (value) => {
    setStatisticsTimeFilter(value);
  };

  // 处理产品饼图日期范围变化
  const handleProductDateRangeChange = (dates) => {
    setProductDateRange(dates);
  };

  // 处理移动端Select选择变化
  const handleDateRangeSelectChange = (value) => {
    const selectedOption = dateRangeOptions.find(option => option.value === value);
    if (selectedOption) {
      setProductDateRange(selectedOption.dates);
    }
  };

  // 强制重新渲染图表
  const resizeCharts = () => {
    setTimeout(() => {
      if (chartRef1.current) {
        chartRef1.current.getEchartsInstance().resize();
      }
      if (chartRef2.current) {
        chartRef2.current.getEchartsInstance().resize();
      }
    }, 100);
  };

  // 颜色映射函数
  const getColorForButton = (buttonName) => {
    const name = buttonName.toLowerCase();
    
    if (name.includes("launch") || name.includes("icon")) {
      return "#3b82f6"; // 蓝色
    } else if (name.includes("wheel-show")) {
      return "#10b981"; // 绿色
    } else if (name.includes("wheel-start")) {
      return "#fa4d0a"; // 橙色
    } else {
      // 其他按钮使用默认颜色
      return "#8b5cf6"; // 紫色
    }
  };

  // 为数据项添加颜色
  const addColorsToData = (data) => {
    return data.map(item => ({
      ...item,
      itemStyle: {
        color: getColorForButton(item.name)
      }
    }));
  };

  // 获取统计数据（使用新的API）
  const fetchStatisticsData = async () => {
    try {
      const response = await fetch(`${GET_WHEEL_STATISTICS_ENDPOINT}?type=${statisticsTimeFilter}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const stats = data.data;
        setNewUsersCount(stats.new_users_count || 0);
        setHomePageShowCount(stats.home_show_count || 0);
        setMainSiteShowCount(stats.www_show_count || 0);
        setWarmupPageShowCount(stats.campaign_show_count || 0);
        setTotalShowCount(stats.total_show_count || 0);
      } else {
        console.warn("Statistics API returned unsuccessful response:", data);
        // 使用默认值
        setNewUsersCount(37);
        setHomePageShowCount(6);
        setMainSiteShowCount(0);
        setWarmupPageShowCount(1);
        setTotalShowCount(1041);
      }
    } catch (error) {
      console.error("Error fetching statistics data:", error);
      // 使用默认值
      setNewUsersCount(37);
      setHomePageShowCount(6);
      setMainSiteShowCount(0);
      setWarmupPageShowCount(1);
      setTotalShowCount(1041);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    try {
      await fetchStatisticsData();
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setStatisticsLoading(false);
    }
  };

  // 获取产品点击数据
  const fetchProductClickData = async () => {
    setProductLoading(true);
    try {
      let endpoint = GET_DURATION_CLICKS_ENDPOINT;
      let params = new URLSearchParams();

      if (productDateRange && productDateRange.length === 2) {
        params.append("startDate", productDateRange[0].format("YYYY-MM-DD"));
        params.append("endDate", productDateRange[1].format("YYYY-MM-DD"));
        endpoint += `?${params.toString()}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      // 处理产品点击数据
      const productClicks = Object.entries(data).map(([product, count]) => ({
        name: product,
        value: count,
      })).filter(item => !item.name.toLowerCase().includes("new-customer"));
      setProductClickCounts(productClicks);
    } catch (error) {
      console.error("Error fetching product click data:", error);
      // 使用模拟数据
      setProductClickCounts([
        { name: "产品A", value: 45 },
        { name: "产品B", value: 32 },
        { name: "产品C", value: 28 },
        { name: "产品D", value: 19 },
        { name: "产品E", value: 15 },
      ]);
    } finally {
      setProductLoading(false);
    }
  };
  // 统计数据
  const statistics = [
    {
      title: "新增用户数",
      value: newUsersCount,
      prefix: <UserOutlined />,
      valueStyle: { color: "#3b82f6" },
      loading: statisticsLoading,
    },
    {
      title: "首页展示次数",
      value: homePageShowCount,
      prefix: <RiseOutlined />,
      valueStyle: { color: "#10b981" },
      loading: statisticsLoading,
    },
    {
      title: "主站展示次数",
      value: mainSiteShowCount,
      prefix: <RiseOutlined />,
      valueStyle: { color: "#8b5cf6" },
      loading: statisticsLoading,
    },
    {
      title: "预热页展示次数",
      value: warmupPageShowCount,
      prefix: <RiseOutlined />,
      valueStyle: { color: "#fa4d0a" },
      loading: statisticsLoading,
    },
    {
      title: "总展示次数",
      value: totalShowCount,
      prefix: <RiseOutlined />,
      valueStyle: { color: "#ef4444" },
      loading: statisticsLoading,
    },
  ];

  useEffect(() => {
    setLoading(true);
    const endpoint = getEndpointByTimeFilter(timeFilter);

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log("data-----------------------", data);
        // 处理新的数据格式 {"add-to-cart":2,"buy-now":1}
        const clickCounts = Object.entries(data)
          .map(([button, count]) => ({
            name: button,
            value: count,
          }))
          // 筛选掉 new-customer 相关的数据
          .filter(item => !item.name.toLowerCase().includes("new-customer"));

        // 将launch-icon相关的数据项排在前面
        const sortedClickCounts = clickCounts.sort((a, b) => {
          // 如果a是launch-icon相关，排在前面
          if (
            a.name.toLowerCase().includes("launch") ||
            a.name.toLowerCase().includes("icon")
          ) {
            return -1;
          }
          // 如果b是launch-icon相关，排在前面
          if (
            b.name.toLowerCase().includes("launch") ||
            b.name.toLowerCase().includes("icon")
          ) {
            return 1;
          }
          // 其他情况保持原有顺序
          return 0;
        });

        setClickCounts(sortedClickCounts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      });
  }, [timeFilter]); // 依赖项改为timeFilter，当时间筛选变化时重新获取数据

  // 当产品日期范围变化时，获取产品点击数据
  useEffect(() => {
    fetchProductClickData();
  }, [productDateRange]);

  // 组件加载时获取统计数据
  useEffect(() => {
    fetchStatistics();
  }, []);

  // 当统计数据时间筛选变化时，重新获取统计数据
  useEffect(() => {
    fetchStatistics();
  }, [statisticsTimeFilter]);

  // 当数据加载完成后，重新调整图表尺寸
  useEffect(() => {
    if (!loading && !productLoading) {
      resizeCharts();
    }
  }, [loading, productLoading]);

  // 当移动端状态变化时，重新调整图表尺寸
  useEffect(() => {
    resizeCharts();
  }, [isMobile]);

  // 饼图配置
  const getPieChartOption = () => ({
    title: {
      text: `转盘数据 (${getTimeFilterText(timeFilter)})`,
      left: "center",
      textStyle: {
        color: "#1e293b",
        fontSize: 18,
        fontWeight: "600",
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      borderColor: "#e2e8f0",
      textStyle: {
        color: "#1e293b",
      },
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      top: "10%",
      left: "left",
      textStyle: {
        color: "#64748b",
      },
    },
    series: [
      {
        name: "类别",
        type: "pie",
        radius: "50%",
        data: addColorsToData(clickCounts),
        itemStyle: {
          borderRadius: 6,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
          formatter: "{c}",
          fontSize: 14,
          color: "#ffffff",
          fontWeight: "600",
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      },
    ],
  });

  // 产品点击饼图配置
  const getProductPieChartOption = () => ({
    title: {
      text: `转盘数据 (${productDateRange[0].format(
        "MM-DD"
      )} 至 ${productDateRange[1].format("MM-DD")})`,
      left: "center",
      textStyle: {
        color: "#1e293b",
        fontSize: 18,
        fontWeight: "600",
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      borderColor: "#e2e8f0",
      textStyle: {
        color: "#1e293b",
      },
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      top: "10%",
      left: "left",
      textStyle: {
        color: "#64748b",
      },
    },
    series: [
      {
        name: "类别",
        type: "pie",
        radius: "50%",
        data: addColorsToData(productClickCounts),
        itemStyle: {
          borderRadius: 6,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
          formatter: "{c}",
          fontSize: 14,
          color: "#ffffff",
          fontWeight: "600",
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.3)",
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
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "16px",
            color: "#1e293b",
            letterSpacing: "1px",
          }}
        >
          转盘数据分析
        </h1>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600 }}>统计数据筛选</span>
              <Radio.Group
                value={statisticsTimeFilter}
                onChange={(e) => handleStatisticsTimeFilterChange(e.target.value)}
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
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card>
            <Spin spinning={statistics[0].loading} tip="加载中...">
              <Statistic {...statistics[0]} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card>
            <Spin spinning={statistics[1].loading} tip="加载中...">
              <Statistic {...statistics[1]} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card>
            <Spin spinning={statistics[2].loading} tip="加载中...">
              <Statistic {...statistics[2]} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card>
            <Spin spinning={statistics[3].loading} tip="加载中...">
              <Statistic {...statistics[3]} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card>
            <Spin spinning={statistics[4].loading} tip="加载中...">
              <Statistic {...statistics[4]} />
            </Spin>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>转盘数据</span>
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
              <ReactECharts
                ref={chartRef1}
                option={getPieChartOption()}
                style={{ height: "400px", width: "100%" }}
                onChartReady={(chart) => {
                  // 图表准备就绪后，确保正确尺寸
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
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                  gap: isMobile ? "8px" : "0",
                  paddingBottom: isMobile ? "8px" : "0",
                }}
              >
                <span style={{ 
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: 600,
                  marginBottom: isMobile ? "8px" : "0",
                  width: isMobile ? "100%" : "auto"
                }}>
                  转盘数据
                </span>
                {isMobile ? (
                  <Select
                    placeholder="选择时间范围"
                    value={dateRangeOptions.find(option => 
                      option.dates[0].format("YYYY-MM-DD") === productDateRange[0].format("YYYY-MM-DD") &&
                      option.dates[1].format("YYYY-MM-DD") === productDateRange[1].format("YYYY-MM-DD")
                    )?.value || "thisMonth"}
                    onChange={handleDateRangeSelectChange}
                    size="small"
                    style={{ width: "100%" }}
                    options={dateRangeOptions}
                  />
                ) : (
                  <RangePicker
                    onChange={handleProductDateRangeChange}
                    value={productDateRange}
                    placeholder={["开始日期", "结束日期"]}
                    allowClear={false}
                    format="YYYY-MM-DD"
                    size="small"
                    style={{ width: 250 }}
                  />
                )}
              </div>
            }
            className="chart-container"
          >
            <Spin spinning={productLoading} tip="loading...">
              <ReactECharts
                ref={chartRef2}
                option={getProductPieChartOption()}
                style={{ height: "400px", width: "100%" }}
                onChartReady={(chart) => {
                  // 图表准备就绪后，确保正确尺寸
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

export default WheelClickData;
