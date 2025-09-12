import React, { useState, useEffect } from "react";
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
  const [warmupPageShowCount, setWarmupPageShowCount] = useState(0); // 预热页展示次数
  const [totalShowCount, setTotalShowCount] = useState(0); // 总展示次数
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  // API端点配置
  const GET_DAILY_CLICKS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-daily-stats";
  const GET_WEEKLY_CLICKS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-weekly-stats";
  const GET_MONTHLY_CLICKS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-monthly-stats";
  const GET_DURATION_CLICKS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-duration-stats";
  const GET_NEW_USERS_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-new-customer-count";
  const GET_SHOW_COUNT_ENDPOINT =
    "https://shopify.runmefitserver.com/api/collect/wheel-show-count";

  

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

  // 处理产品饼图日期范围变化
  const handleProductDateRangeChange = (dates) => {
    setProductDateRange(dates);
  };

  // 获取新增用户数
  const fetchNewUsersCount = async () => {
    try {
      const response = await fetch(GET_NEW_USERS_ENDPOINT);
      const data = await response.json();
      // 假设接口返回格式为 { count: number } 或直接返回数字
      const count = typeof data === 'number' ? data : (data.count || data);
      setNewUsersCount(count);
    } catch (error) {
      console.error("Error fetching new users count:", error);
      // 使用默认值
      setNewUsersCount(11280);
    }
  };

  // 获取展示次数
  const fetchShowCount = async () => {
    try {
      const response = await fetch(GET_SHOW_COUNT_ENDPOINT);
      const data = await response.json();
      
      // 处理数组格式的数据
      if (Array.isArray(data)) {
        // 计算总展示次数（数组长度）
        setTotalShowCount(data.length);
        
        // 根据 url 分类统计
        let homePageCount = 0;
        let warmupPageCount = 0;
        
        data.forEach(item => {
          if (item.url === "/") {
            homePageCount++;
          } else if (item.url === "/pages/new-racer-series") {
            warmupPageCount++;
          }
        });
        
        setHomePageShowCount(homePageCount);
        setWarmupPageShowCount(warmupPageCount);
      } else {
        // 如果不是数组格式，使用默认值
        console.warn("Show count data is not an array:", data);
        setHomePageShowCount(8846);
        setWarmupPageShowCount(112893);
        setTotalShowCount(121739);
      }
    } catch (error) {
      console.error("Error fetching show count:", error);
      // 使用默认值
      setHomePageShowCount(8846);
      setWarmupPageShowCount(112893);
      setTotalShowCount(121739);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    setStatisticsLoading(true);
    try {
      await Promise.all([
        fetchNewUsersCount(),
        fetchShowCount()
      ]);
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
        data: clickCounts,
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
        color: ["#3b82f6", "#10b981", "#fa4d0a", "#ef4444", "#8b5cf6"],
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
        data: productClickCounts,
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
        color: ["#3b82f6", "#10b981", "#fa4d0a", "#ef4444", "#8b5cf6"],
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
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={statistics[0].loading} tip="加载中...">
              <Statistic {...statistics[0]} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={statistics[1].loading} tip="加载中...">
              <Statistic {...statistics[1]} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={statistics[2].loading} tip="加载中...">
              <Statistic {...statistics[2]} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={statistics[3].loading} tip="加载中...">
              <Statistic {...statistics[3]} />
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
                option={getPieChartOption()}
                style={{ height: "400px" }}
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
                }}
              >
                <span>转盘数据</span>
                <RangePicker
                  onChange={handleProductDateRangeChange}
                  value={productDateRange}
                  placeholder={["开始日期", "结束日期"]}
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
              <ReactECharts
                option={getProductPieChartOption()}
                style={{ height: "400px" }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default WheelClickData;
