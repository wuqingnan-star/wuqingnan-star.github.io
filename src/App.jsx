import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  FormOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, HashRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WheelClickData from './components/WheelClickData';
import FormsList from './components/FormsList';
import FormRenderer from './components/FormRenderer';
import SubmissionsTable from './components/SubmissionsTable';
import PermissionGuard from './components/PermissionGuard';
import { canAccessFormManagement } from './utils/env';

const { Header, Sider, Content } = Layout;

function AppContent() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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
        {
          key: 'wheel-click-data',
          icon: <ThunderboltOutlined />,
          label: '转盘数据',
        },
      ],
    },
    // 只在开发环境显示表单管理
    ...(canAccessFormManagement() ? [{
      key: 'forms',
      icon: <FormOutlined />,
      label: '表单管理',
      children: [
        {
          key: 'forms-list',
          icon: <FileTextOutlined />,
          label: '表单列表',
        },
      ],
    }] : []),
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'dashboard') {
      navigate('/');
    } else if (key === 'bar-chart') {
      navigate('/bar-chart');
    } else if (key === 'pie-chart') {
      navigate('/pie-chart');
    } else if (key === 'line-chart') {
      navigate('/line-chart');
    } else if (key === 'wheel-click-data') {
      navigate('/wheel-click-data');
    } else if (key === 'forms-list') {
      navigate('/forms');
    }
  };

  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path === '/bar-chart') return 'bar-chart';
    if (path === '/pie-chart') return 'pie-chart';
    if (path === '/line-chart') return 'line-chart';
    if (path === '/wheel-click-data') return 'wheel-click-data';
    if (path === '/forms') return 'forms-list';
    if (path.startsWith('/form/')) return 'forms-list';
    if (path.startsWith('/admin/forms/')) return 'forms-list';
    return 'dashboard';
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
           selectedKeys={[getSelectedKey()]}
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
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 12,
            minHeight: 280,
            background: 'transparent',
            borderRadius: borderRadiusLG,
            overflow: 'hidden',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard chartType="dashboard" />} />
            <Route path="/bar-chart" element={<Dashboard chartType="bar-chart" />} />
            <Route path="/pie-chart" element={<Dashboard chartType="pie-chart" />} />
            <Route path="/line-chart" element={<Dashboard chartType="line-chart" />} />
            <Route path="/wheel-click-data" element={<WheelClickData />} />
            <Route path="/forms" element={
              <PermissionGuard>
                <FormsList />
              </PermissionGuard>
            } />
            <Route path="/form/:formId" element={
              <PermissionGuard>
                <FormRenderer />
              </PermissionGuard>
            } />
            <Route path="/admin/forms/:formId/submissions" element={
              <PermissionGuard>
                <SubmissionsTable />
              </PermissionGuard>
            } />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
