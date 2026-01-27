import apiClient from './config';

// 表单API基础URL
const FORM_BASE_URL = 'https://shopify.runmefitserver.com/api/form';

interface FormData {
  title: string;
  description?: string;
  fields?: FormField[];
}

interface FormField {
  id?: number;
  field_key: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
  order?: number;
}

interface FormResponse {
  data?: any;
  fields?: FormField[];
  title?: string;
  description?: string;
}

interface SubmissionsResponse {
  items: any[];
  total?: number;
}

// 表单相关API接口
export const formApi = {
  // 获取所有表单列表
  getForms: async (): Promise<any[]> => {
    const response: any = await apiClient.get(`${FORM_BASE_URL}/get-forms`);
    return response.data || response;
  },

  // 获取单个表单详情（包含字段）
  getForm: async (formId: string | number): Promise<FormResponse> => {
    const response: any = await apiClient.get(`${FORM_BASE_URL}/get-form-fields`, {
      params: { form_id: formId }
    });
    return response.data || response;
  },

  // 创建新表单
  createForm: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post(`${FORM_BASE_URL}/create-form`, {
      form_data: formData
    });
    return response.data;
  },

  // 更新表单
  updateForm: async (formId: string | number, formData: FormData): Promise<any> => {
    const response = await apiClient.post(`${FORM_BASE_URL}/update-form`, {
      form_id: formId,
      form_data: formData
    });
    return response.data;
  },

  // 删除表单
  deleteForm: async (formId: string | number): Promise<any> => {
    const response = await apiClient.post(`${FORM_BASE_URL}/delete-form`, {
      form_id: formId
    });
    return response.data;
  },

  // 提交表单数据
  submitForm: async (formId: string | number, formData: Record<string, any>): Promise<any> => {
    const response = await apiClient.post(`${FORM_BASE_URL}/submit-form`, {
      form_id: formId,
      form_data: formData
    });
    return response.data;
  },

  // 获取表单提交记录
  getFormSubmissions: async (formId: string | number, page: number = 1, limit: number = 10): Promise<SubmissionsResponse> => {
    const response: any = await apiClient.get(`${FORM_BASE_URL}/get-form-submissions`, {
      params: { 
        form_id: formId,
        page: page,
        limit: limit
      }
    });
    return response.data || response;
  },

  // 获取表单统计数据
  getFormStats: async (formUuid: string | number): Promise<any[]> => {
    const response = await apiClient.get(`${FORM_BASE_URL}/get-form-stats`, {
      params: { form_uuid: formUuid }
    });
    return response.data;
  }
};
