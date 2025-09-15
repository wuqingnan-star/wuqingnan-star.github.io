// FormsList.jsx (关键片段)
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formApi } from '../api';
import FormEditor from './FormEditor'; // 下面会给出

export default function FormsList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [editorVisible, setEditorVisible] = useState(false);

  async function fetchForms() {
    setLoading(true);
    try {
      const data = await formApi.getForms();
      setData(data);
    } catch (err) {
      message.error(err.message || '加载失败');
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchForms(); }, []);

  const columns = [
    { title: '标题', dataIndex: 'title' },
    { title: '描述', dataIndex: 'description' },
    { title: '创建时间', dataIndex: 'created_at' },
    {
      title: '操作',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => { setEditingForm(record); setEditorVisible(true); }}>编辑</Button>
          <Button size="small" onClick={() => navigate(`/form/${record.id}`)}>打开</Button>
          <Button size="small" onClick={() => navigate(`/admin/forms/${record.id}/submissions`)}>提交记录</Button>
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
      )
    }
  ];

  return <>
    <div style={{marginBottom:16}}>
      <Button type="primary" onClick={()=>{ setEditingForm(null); setEditorVisible(true); }}>新建表单</Button>
    </div>
    <Table rowKey="id" dataSource={data} columns={columns} loading={loading} />
    <FormEditor
      open={editorVisible}
      onClose={() => { setEditorVisible(false); fetchForms(); }}
      formData={editingForm}
    />
  </>;
}
