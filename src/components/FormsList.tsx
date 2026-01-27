import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formApi } from '../api';
import { toShanghaiTime, canAccessFormManagement } from '../utils';
import FormEditor from './FormEditor';

interface FormItem {
  id: string | number;
  title: string;
  description?: string;
  created_at: string;
}

export default function FormsList() {
  const navigate = useNavigate();
  const [data, setData] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingForm, setEditingForm] = useState<FormItem | null>(null);
  const [editorVisible, setEditorVisible] = useState(false);
  
  // 检查是否允许访问表单管理功能
  const canManage = canAccessFormManagement();

  async function fetchForms() {
    setLoading(true);
    try {
      const data = await formApi.getForms();
      setData(data);
    } catch (err: any) {
      message.error(err.message || '加载失败');
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchForms(); }, []);

  const columns = [
    { 
      title: '标题', 
      dataIndex: 'title',
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: '#1e293b' }}>{text}</span>
      )
    },
    { 
      title: '描述', 
      dataIndex: 'description',
      render: (text: string) => (
        <span style={{ color: '#64748b' }}>
          {text || <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>暂无描述</span>}
        </span>
      )
    },
    { 
      title: '创建时间', 
      dataIndex: 'created_at',
      render: (time: string) => (
        <div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
            {toShanghaiTime(time, 'YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      ),
      sorter: (a: FormItem, b: FormItem) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: 'descend' as const
    },
    {
      title: '操作',
      render: (_: any, record: FormItem) => (
        <div className='flex gap-1'>
          {canManage && (
            <>
              <Button size="small" onClick={() => { setEditingForm(record); setEditorVisible(true); }}>编辑</Button>
              <Button size="small" onClick={() => navigate(`/form/${record.id}`)}>打开</Button>
              <Button size="small" danger onClick={() => {
                 Modal.confirm({
                    title: '确认删除？',
                    onOk: async () => {
                      await formApi.deleteForm(record.id);
                      message.success('已删除');
                      fetchForms();
                    }
                 });
              }}>删除</Button>
            </>
          )}
          <Button size="small" onClick={() => navigate(`/admin/forms/${record.id}/submissions`)}>提交记录</Button>
        </div>
      )
    }
  ];

  return <>
    {canManage && (
      <div style={{marginBottom:16}}>
        <Button type="primary" onClick={()=>{ setEditingForm(null); setEditorVisible(true); }}>新建表单</Button>
      </div>
    )}
    <Table rowKey="id" dataSource={data} columns={columns} loading={loading} />
    {canManage && (
      <FormEditor
        open={editorVisible}
        onClose={() => { setEditorVisible(false); fetchForms(); }}
        formData={editingForm}
      />
    )}
  </>;
}
