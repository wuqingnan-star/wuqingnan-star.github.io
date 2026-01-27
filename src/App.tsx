import { useState } from "react";
import { Layout, Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  FormOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  useNavigate,
  useLocation,
  HashRouter,
  useRoutes,
} from "react-router-dom";
import { routes } from "./routes";

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
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "首页",
    },
    {
      key: "charts",
      icon: <BarChartOutlined />,
      label: "图表分析",
      children: [
        {
          key: "wheel-click-data",
          icon: <ThunderboltOutlined />,
          label: "转盘数据",
        },
      ],
    },
    {
      key: "hmc",
      icon: <BarChartOutlined />,
      label: "HMC模块",
      children: [
        {
          key: "hmc-options-stats",
          icon: <ThunderboltOutlined />,
          label: "HMC选项统计",
        },
        {
          key: "hmc-step-dwell",
          icon: <ThunderboltOutlined />,
          label: "HMC停留时长",
        },
        {
          key: "hmc-dropoff-report",
          icon: <ThunderboltOutlined />,
          label: "HMC流失报告",
        },
        {
          key: "hmc-conversion-stats",
          icon: <ThunderboltOutlined />,
          label: "HMC转化统计",
        },
      ],
    },
    ...[
      {
        key: "forms",
        icon: <FormOutlined />,
        label: "表单管理",
        children: [
          {
            key: "forms-list",
            icon: <FileTextOutlined />,
            label: "表单列表",
          },
        ],
      },
    ],
  ];

  // 菜单项到路由路径的映射
  const menuKeyToPath: Record<string, string> = {
    dashboard: "/",
    "wheel-click-data": "/wheel-click-data",
    "forms-list": "/forms",
    "hmc-options-stats": "/hmc-options-stats",
    "hmc-step-dwell": "/hmc-step-dwell",
    "hmc-dropoff-report": "/hmc-dropoff-report",
    "hmc-conversion-stats": "/hmc-conversion-stats",
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const path = menuKeyToPath[key];
    if (path) {
      navigate(path);
    }
  };

  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path === "/wheel-click-data") return "wheel-click-data";
    if (path === "/forms") return "forms-list";
    if (path.startsWith("/form/")) return "forms-list";
    if (path.startsWith("/admin/forms/")) return "forms-list";
    if (path === "/hmc-options-stats") return "hmc-options-stats";
    if (path === "/hmc-step-dwell") return "hmc-step-dwell";
    if (path === "/hmc-dropoff-report") return "hmc-dropoff-report";
    if (path === "/hmc-conversion-stats") return "hmc-conversion-stats";
    return "dashboard";
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
        <div className="logo">{collapsed ? "数据" : "数据后台"}</div>
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
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "16px",
            padding: 12,
            minHeight: 280,
            background: "transparent",
            borderRadius: borderRadiusLG,
            overflow: "hidden",
          }}
        >
          {useRoutes(routes)}
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
