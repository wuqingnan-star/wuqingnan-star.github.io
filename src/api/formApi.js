import apiClient from './config.js';

// 表单API基础URL
const FORM_BASE_URL = 'https://shopify.runmefitserver.com/api/form';


// 表单相关API接口
export const formApi = {
  // 获取所有表单列表
  getForms: async () => {
    const response = await apiClient.get(`${FORM_BASE_URL}/get-forms`);
    return response.data;
  },

  // 获取单个表单详情（包含字段）
  getForm: async (formId) => {
    const response = await apiClient.get(`${FORM_BASE_URL}/get-form-fields`, {
      params: { form_id: formId }
    });
    return response.data;
  },

  // 创建新表单
  createForm: async (formData) => {
    const response = await apiClient.post(`${FORM_BASE_URL}/create-form`, {
      form_data: formData
    });
    return response.data;
  },

  // 更新表单
  updateForm: async (formId, formData) => {
    const response = await apiClient.post(`${FORM_BASE_URL}/update-form`, {
      form_id: formId,
      form_data: formData
    });
    return response.data;
  },

  // 删除表单
  deleteForm: async (formId) => {
    const response = await apiClient.post(`${FORM_BASE_URL}/delete-form`, {
      form_id: formId
    });
    return response.data;
  },

  // 提交表单数据
  submitForm: async (formId, formData) => {
    const response = await apiClient.post(`${FORM_BASE_URL}/submit-form`, {
      form_id: formId,
      form_data: formData
    });
    return response.data;
  },

  // 获取表单提交记录
  getFormSubmissions: async (formId, page = 1, limit = 10) => {
    const response = await apiClient.get(`${FORM_BASE_URL}/get-form-submissions`, {
      params: { 
        form_id: formId,
        page: page,
        limit: limit
      }
    });
    return response.data;
  },

  // 获取表单统计数据
  getFormStats: async (formUuid) => {
    const response = await apiClient.get(`${FORM_BASE_URL}/get-form-stats`, {
      params: { form_uuid: formUuid }
    });
    return response.data;
  }
};
