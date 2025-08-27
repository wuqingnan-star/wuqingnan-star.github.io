import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: 'charts',
      icon: <BarChartOutlined />,
      label: '图表分析',
      children: [
        {
          key: 'bar-chart',
          icon: <BarChartOutlined />,
          label: '柱状图',
        },
        {
          key: 'pie-chart',
          icon: <PieChartOutlined />,
          label: '饼图',
        },
        {
          key: 'line-chart',
          icon: <LineChartOutlined />,
          label: '折线图',
        },
      ],
    },
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
      case 'bar-chart':
      case 'pie-chart':
      case 'line-chart':
        return <Dashboard chartType={selectedKey} />;
      default:
        return <Dashboard chartType="dashboard" />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
      >
        <div className="logo">
          {collapsed ? '数据' : '数据后台'}
        </div>
                 <Menu
           theme="light"
           mode="inline"
           selectedKeys={[selectedKey]}
           items={menuItems}
           onClick={handleMenuClick}
         />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1e293b',
            letterSpacing: '1px'
          }}>
            数据后台管理系统
          </span>
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
            minHeight: 280,
            background: 'transparent',
            borderRadius: borderRadiusLG,
            overflow: 'hidden',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
