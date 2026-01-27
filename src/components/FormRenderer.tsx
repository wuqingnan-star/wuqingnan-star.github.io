import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Radio, Checkbox, Button, message } from 'antd';
import { useParams } from 'react-router-dom';
import { formApi } from '../api';

interface FormField {
  field_key: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
}

interface FormMeta {
  title: string;
  description?: string;
  fields: FormField[];
}

export default function FormRenderer() {
  const { formId } = useParams<{ formId: string }>();
  const [form] = Form.useForm();
  const [meta, setMeta] = useState<FormMeta | null>(null);

  useEffect(() => {
    if (!formId) return;
    formApi.getForm(formId).then((d: any) => {
      setMeta(d);
    });
  }, [formId]);

  if (!meta) return <div>加载中...</div>;

  const onFinish = async (values: Record<string, any>) => {
    if (!formId) return;
    try {
      await formApi.submitForm(formId, values);
      message.success('提交成功');
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.error || err.message || '提交失败');
    }
  };

  return (
    <div>
      <h2>{meta.title}</h2>
      <p>{meta.description}</p>
      <Form form={form} onFinish={onFinish} layout="vertical">
        {meta.fields.map(field => {
          const rules = field.required ? [{ required: true, message: `${field.label} 为必填` }] : [];
          switch(field.type) {
            case 'text':
              return <Form.Item key={field.field_key} name={field.field_key} label={field.label} rules={rules}><Input /></Form.Item>;
            case 'textarea':
              return <Form.Item key={field.field_key} name={field.field_key} label={field.label} rules={rules}><Input.TextArea rows={4} /></Form.Item>;
            case 'select':
              return <Form.Item key={field.field_key} name={field.field_key} label={field.label} rules={rules}>
                <Select options={(field.options||[]).map(o=>({label:o,value:o}))} />
              </Form.Item>;
            case 'radio':
              return <Form.Item key={field.field_key} name={field.field_key} label={field.label} rules={rules}>
                <Radio.Group options={(field.options||[]).map(o=>({label:o,value:o}))} />
              </Form.Item>;
            case 'checkbox':
              return <Form.Item key={field.field_key} name={field.field_key} label={field.label} rules={rules}>
                <Checkbox.Group options={(field.options||[]).map(o=>({label:o,value:o}))} />
              </Form.Item>;
            default:
              return null;
          }
        })}
        <Form.Item>
          <Button type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
