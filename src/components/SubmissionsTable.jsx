// SubmissionsTable.jsx (关键片段)
import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { formApi } from '../api';

export default function SubmissionsTable() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [formTitle, setFormTitle] = useState('');

  useEffect(() => {
    async function fetch() {
      const form = await formApi.getForm(formId);
      const subs = await formApi.getFormSubmissions(formId);
      setSubmissions(subs);
      setFormTitle(form.title || '表单');

      // 合并所有 field_key 做列
      const keys = new Set();
      subs.forEach(s => {
        Object.keys(s.values || {}).forEach(k => keys.add(k));
      });

      const cols = [
        { title: '提交时间', dataIndex: 'created_at', key:'created_at' },
        ...Array.from(keys).map(k => {
          // 找到 label（从 form.fields 映射）
          const f = (form.fields || []).find(x => x.field_key === k);
          const title = f ? f.label : k;
          return {
            title, key: k, render: (row) => {
              const v = row.values?.[k];
              if (Array.isArray(v)) return v.join(', ');
              return v ?? '';
            }
          };
        })
      ];
      setColumns(cols);
    }
    fetch();
  }, [formId]);

  return (
    <div>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/forms')}
              style={{ padding: '4px 8px' }}
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
        <div style={{ color: '#666', fontSize: '14px' }}>
          共 {submissions.length} 条提交记录
        </div>
      </Card>
      
      <Card>
        <Table 
          dataSource={submissions} 
          columns={columns} 
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
          }}
        />
      </Card>
    </div>
  );
}
