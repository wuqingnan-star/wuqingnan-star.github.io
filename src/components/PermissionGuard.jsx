import React from 'react';
import { Result, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { canAccessFormManagement } from '../utils/env';

export default function PermissionGuard({ children, fallbackPath = '/' }) {
  const navigate = useNavigate();

  if (!canAccessFormManagement()) {
    return (
      <Result
        icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
        title="权限不足"
        subTitle="❌❌❌"
        extra={[
          <Button type="primary" key="back" onClick={() => navigate(fallbackPath)}>
            返回首页
          </Button>,
        ]}
        style={{
          marginTop: '50px',
        }}
      />
    );
  }

  return children;
}
