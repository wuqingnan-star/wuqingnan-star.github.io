// SubmissionsTable.jsx (关键片段)
import React, { useEffect, useState } from "react";
import { Table, Button, Card, Typography, Radio, Row, Col, Spin, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { formApi } from "../api";
import { toShanghaiTime } from "../utils";
import ReactECharts from 'echarts-for-react';

export default function SubmissionsTable() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 根据标题估算列宽，控制最小/最大宽度，确保省略号效果
  const calcColumnWidth = (text) => {
    const str = String(text || "");
    // 中文字符按16px计算，英文按8px计算，加上padding
    const chineseChars = (str.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = str.length - chineseChars;
    const estimated = chineseChars * 16 + otherChars * 6 + 58;
    // const value = Math.max(120, Math.min(estimated, 380));
    const value = estimated
    return value;
  };
  
  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
    responsive: true,
    simple: false,
  });

  const [typeFilter, setTypeFilter] = useState("table");

  // 获取图表数据
  const fetchChartData = async () => {
    if (!formId) return;
    
    setChartLoading(true);
    try {
      const data = await formApi.getFormStats(formId);
      setChartData(data || []);
    } catch (error) {
      console.error('获取图表数据失败:', error);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  // 生成饼图配置
  const generatePieChartOption = (fieldData) => {
    const data = fieldData.map(item => ({
      name: item.option_value,
      value: item.count
    }));

    return {
      title: {
        text: fieldData[0]?.field_label || '字段统计',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '统计',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#fff'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold',
              color: '#fff'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };
  };

  // 按字段分组数据
  const groupedChartData = chartData.reduce((acc, item) => {
    const key = item.field_label;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 监听视图切换，切换到图表时获取数据
  useEffect(() => {
    if (typeFilter === 'chart') {
      fetchChartData();
    }
  }, [typeFilter, formId]);

  // 获取表单提交数据（支持分页）
  const fetchSubmissions = async (page = 1, pageSize = 10) => {
    if (!formId) return;
    
    setLoading(true);
    try {
      const [form, subsData] = await Promise.all([
        formApi.getForm(formId),
        formApi.getFormSubmissions(formId, page, pageSize)
      ]);
      
      const submissions = subsData.items
      const total = subsData.total || submissions.length;
      
      setSubmissions(submissions);
      setFormTitle(form.title || "表单");
      
      // 更新分页信息
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: total,
        simple: isMobile,
      }));

      // 合并所有 field_key 做列，并按order排序
      const keys = new Set();
      submissions.forEach((s) => {
        Object.keys(s.values || {}).forEach((k) => keys.add(k));
      });

      // 获取所有字段并按order排序
      const sortedFields = (form.fields || [])
        .filter((f) => keys.has(f.field_key))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const cols = [
        {
          title: "提交时间",
          dataIndex: "created_at",
          key: "created_at",
          width: 150,
          fixed: "left", // 固定在最左侧
          render: (time) => {
            const timeStr = toShanghaiTime(time, "YYYY-MM-DD HH:mm:ss");
            return (
                <span>{timeStr}</span>
            );
          },
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          defaultSortOrder: "descend",
        },
        ...sortedFields.map((f, index) => {
          const columnWidth = calcColumnWidth(f.label || f.field_key);
          return {
            title: f.label || f.field_key,
            key: f.field_key,
            width: columnWidth,
            render: (row) => {
              const v = row.values?.[f.field_key];
              const displayValue = Array.isArray(v) ? v.join(", ") : (v ?? "");
              return (
                <Tooltip title={displayValue} placement="topLeft">
                  <div 
                    style={{ 
                      maxWidth: columnWidth, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}
                  >
                    {displayValue}
                  </div>
                </Tooltip>
              );
            },
          };
        }),
      ];
      setColumns(cols);
    } catch (error) {
      console.error('获取表单提交数据失败:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理分页变化
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    fetchSubmissions(current, pageSize);
  };

  useEffect(() => {
    fetchSubmissions(1, 10);
  }, [formId]);

  return (
    <div>
      <Card
        styles={{ body: { display: 'none'}}}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/forms")}
              style={{ padding: "4px 8px" }}
            >
              返回列表
            </Button>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {formTitle} - 提交记录
            </Typography.Title>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
      </Card>
      <Radio.Group
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        size="middle"
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="table">表格</Radio.Button>
        <Radio.Button value="chart">图表</Radio.Button>
      </Radio.Group>

      <Card>
        {typeFilter === 'table' ? (
          <Table
            dataSource={submissions}
            columns={columns}
            rowKey="id"
            loading={loading}
            scroll={{
              x: "max-content", // 水平滚动
              y: 500, // 垂直滚动，固定高度
            }}
            tableLayout="fixed"
            size="middle"
            onChange={handleTableChange}
            pagination={pagination}
          />
        ) : (
          <Spin spinning={chartLoading}>
            {Object.keys(groupedChartData).length > 0 ? (
              <Row gutter={[16, 16]}>
                {Object.entries(groupedChartData).map(([fieldLabel, fieldData]) => (
                  <Col 
                    key={fieldLabel}
                    xs={24} 
                    sm={24} 
                    md={12} 
                    lg={12}
                  >
                    <Card 
                      size="small"
                      style={{ height: '450px' }}
                      bodyStyle={{ padding: '16px' }}
                    >
                      <ReactECharts
                        option={generatePieChartOption(fieldData)}
                        style={{ height: '400px', width: '100%' }}
                        opts={{ renderer: 'canvas' }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#999' 
              }}>
                暂无图表数据
              </div>
            )}
          </Spin>
        )}
      </Card>
    </div>
  );
}
