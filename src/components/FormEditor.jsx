// FormEditor.jsx (核心片段)
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, List, Switch, Select, Radio } from 'antd';
import { formApi } from '../api';
import FieldModal from './FieldModal'; // 字段编辑 Modal（下面给出）

export default function FormEditor({ open, onClose, formData }) {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const isEdit = !!formData?.id;

  useEffect(() => {
    if (open) {
      if (formData) {
        form.setFieldsValue({ title: formData.title, description: formData.description });
        // fetch full form (包含字段)：
        formApi.getForm(formData.id).then(payload => {
          setFields((payload.fields || []).map(f => ({...f})));
        });
      } else {
        form.resetFields();
        setFields([]);
      }
    }
  }, [open]);

  const addField = () => { setEditingField(null); setFieldModalVisible(true); };

  const onFieldSave = (field) => {
    // field: { field_key?, label, type, options[], required }
    if (!field.field_key) {
      // new field: 生成一个临时字段 key（前端可生成，后端也可）
      field.field_key = `f_${Math.random().toString(36).slice(2,9)}`;
    }
    setFields(prev => {
      // 如果有相同 field_key 则替换
      const exist = prev.findIndex(p => p.field_key === field.field_key);
      if (exist >= 0) {
        const copy = [...prev]; copy[exist] = { ...copy[exist], ...field }; return copy;
      }
      return [...prev, { ...field, order: prev.length + 1 }];
    });
    setFieldModalVisible(false);
  };

  const moveField = (idx, dir) => {
    const copy = [...fields];
    const swap = idx + dir;
    if (swap < 0 || swap >= copy.length) return;
    [copy[idx], copy[swap]] = [copy[swap], copy[idx]];
    // 更新 order
    copy.forEach((f,i) => f.order = i+1);
    setFields(copy);
  };

  const removeField = (idx) => {
    Modal.confirm({
      title: '删除字段？',
      onOk() {
        const copy = [...fields]; copy.splice(idx,1); copy.forEach((f,i) => f.order = i+1); setFields(copy);
      }
    });
  };

  const onSaveForm = async () => {
    const values = await form.validateFields();
    const payload = {
      title: values.title,
      description: values.description || '',
      fields: fields.map(f => ({
        id: f.id, field_key: f.field_key, label: f.label, type: f.type, options: f.options || [], required: !!f.required, order: f.order || 0
      }))
    };
    try {
      if (isEdit) {
        await formApi.updateForm(formData.id, payload);
      } else {
        await formApi.createForm(payload);
      }
      onClose();
    } catch (err) {
      Modal.error({ title: '保存失败', content: err.message || err.toString() });
    }
  };

  return (
    <Modal open={open} title={isEdit ? '编辑表单' : '新建表单'} onCancel={onClose} width={900} footer={[
      <Button key="cancel" onClick={onClose}>取消</Button>,
      <Button key="save" type="primary" onClick={onSaveForm}>保存</Button>
    ]}>
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={2}/>
        </Form.Item>
      </Form>

      <div style={{marginTop:12}}>
        <div style={{display:'flex', marginBottom:12, justifyContent:'space-between', alignItems:'center'}}>
          <h4>字段</h4>
          <div>
            <Button onClick={addField}>添加字段</Button>
          </div>
        </div>

        <List
          bordered
          dataSource={fields}
          renderItem={(item, idx) => (
            <List.Item actions={[
              <a key="edit" onClick={() => { setEditingField(item); setFieldModalVisible(true); }}>编辑</a>,
              <a key="up" onClick={()=>moveField(idx,-1)}>↑</a>,
              <a key="down" onClick={()=>moveField(idx,1)}>↓</a>,
              <a key="del" onClick={()=>removeField(idx)}>删除</a>
            ]}>
              <List.Item.Meta
                title={`${item.label} (${item.type}) ${item.required ? '[必填]' : ''}`}
                description={item.options?.length ? `选项: ${item.options.join(', ')}` : ''}
              />
            </List.Item>
          )}
        />
      </div>

      <FieldModal
        open={fieldModalVisible}
        initialValues={editingField}
        onCancel={()=>setFieldModalVisible(false)}
        onSave={onFieldSave}
      />
    </Modal>
  );
}
