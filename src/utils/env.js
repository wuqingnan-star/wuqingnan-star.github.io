// 环境配置工具

/**
 * 检查当前环境是否为开发环境
 * @returns {boolean} 是否为开发环境
 */
export const isDevelopment = () => {
  return (
    import.meta.env.DEV || // Vite 开发环境
    import.meta.env.MODE === 'development' || // 开发模式
    window.location.hostname === 'localhost' || // 本地主机
    window.location.hostname === '127.0.0.1' || // 本地IP
    window.location.hostname.includes('dev') || // 包含dev的域名
    window.location.hostname.includes('develop') || // 包含develop的域名
    window.location.hostname.includes('test') // 包含test的域名
  );
};

/**
 * 检查当前环境是否为生产环境
 * @returns {boolean} 是否为生产环境
 */
export const isProduction = () => {
  return (
    import.meta.env.PROD || // Vite 生产环境
    import.meta.env.MODE === 'production' || // 生产模式
    window.location.hostname.includes('prod') || // 包含prod的域名
    window.location.hostname.includes('production') // 包含production的域名
  );
};

/**
 * 获取当前环境名称
 * @returns {string} 环境名称
 */
export const getEnvironment = () => {
  if (isDevelopment()) return 'development';
  if (isProduction()) return 'production';
  return 'unknown';
};

/**
 * 检查是否允许访问表单管理功能
 * @returns {boolean} 是否允许访问
 */
export const canAccessFormManagement = () => {
  return isDevelopment();
};
