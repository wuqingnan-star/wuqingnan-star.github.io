// FieldModal.jsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox } from 'antd';

export default function FieldModal({ open, onCancel, onSave, initialValues }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        label: initialValues?.label || '',
        type: initialValues?.type || 'text',
        options: (initialValues?.options || []).join('\n'),
        required: !!initialValues?.required,
        field_key: initialValues?.field_key
      });
    }
  }, [open]);

  const onOk = async () => {
    const v = await form.validateFields();
    const options = v.options ? v.options.split('\n').map(s => s.trim()).filter(Boolean) : [];
    onSave({
      field_key: v.field_key,
      label: v.label,
      type: v.type,
      options,
      required: !!v.required
    });
  };

  return (
    <Modal open={open} onCancel={onCancel} onOk={onOk} title="字段配置">
      <Form form={form} layout="vertical">
        <Form.Item name="label" label="字段标签" rules={[{required:true}]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="类型">
          <Select>
            <Select.Option value="text">单行文本</Select.Option>
            <Select.Option value="textarea">多行文本</Select.Option>
            <Select.Option value="select">下拉选择</Select.Option>
            <Select.Option value="radio">单选</Select.Option>
            <Select.Option value="checkbox">多选</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="options" label="选项（下拉/单选/多选时按行输入）">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="required" valuePropName="checked">
          <Checkbox>必填</Checkbox>
        </Form.Item>
        <Form.Item name="field_key" label="字段 key（可选，留空会自动生成）">
          <Input placeholder="例如：name / gender" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
