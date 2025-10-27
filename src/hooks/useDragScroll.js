import { useRef, useCallback } from 'react';

/**
 * 自定义Hook：实现鼠标拖拽横向滚动功能
 * @param {Object} options - 配置选项
 * @param {boolean} options.enabled - 是否启用拖拽滚动
 * @param {number} options.sensitivity - 拖拽敏感度，默认1
 * @param {boolean} options.preventDefault - 是否阻止默认行为
 * @param {string} options.scrollContainerSelector - 滚动容器的CSS选择器，默认为'.ant-table-body'
 * @returns {Object} 返回ref和样式对象
 */
export const useDragScroll = (options = {}) => {
  const {
    enabled = true,
    sensitivity = 1,
    preventDefault = true,
    scrollContainerSelector = '.ant-table-body'
  } = options;

  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = useCallback((e) => {
    if (!enabled || !containerRef.current) return;
    
    // 只允许鼠标左键拖拽
    if (e.button !== 0) return;
    
    // 查找实际的滚动容器
    const scrollContainer = containerRef.current.querySelector(scrollContainerSelector);
    if (!scrollContainer) return;
    
    scrollContainerRef.current = scrollContainer;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainer.offsetLeft;
    scrollLeftRef.current = scrollContainer.scrollLeft;
    
    // 添加样式
    scrollContainer.style.cursor = 'grabbing';
    scrollContainer.style.userSelect = 'none';
    
    if (preventDefault) {
      e.preventDefault();
    }
  }, [enabled, preventDefault, scrollContainerSelector]);

  const handleMouseMove = useCallback((e) => {
    if (!enabled || !isDraggingRef.current || !scrollContainerRef.current) return;
    
    e.preventDefault();
    
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * sensitivity;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, [enabled, sensitivity]);

  const handleMouseUp = useCallback(() => {
    if (!enabled || !scrollContainerRef.current) return;
    
    isDraggingRef.current = false;
    
    // 恢复样式
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = '';
  }, [enabled]);

  const handleMouseLeave = useCallback(() => {
    if (!enabled || !scrollContainerRef.current) return;
    
    isDraggingRef.current = false;
    
    // 恢复样式
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = '';
  }, [enabled]);

  // 绑定事件监听器
  const bindEvents = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // 等待表格渲染完成后再绑定事件
    const waitForTableBody = () => {
      const tableBody = container.querySelector(scrollContainerSelector);
      if (tableBody) {
        // 设置表格body的初始样式
        tableBody.style.cursor = 'grab';
        tableBody.style.userSelect = 'none';
        
        container.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mouseleave', handleMouseLeave);
        
        return true;
      }
      return false;
    };

    // 如果表格已经渲染，直接绑定
    if (!waitForTableBody()) {
      // 如果表格还没渲染，使用MutationObserver等待
      const observer = new MutationObserver(() => {
        if (waitForTableBody()) {
          observer.disconnect();
        }
      });
      
      observer.observe(container, {
        childList: true,
        subtree: true
      });
      
      // 设置超时，避免无限等待
      setTimeout(() => {
        observer.disconnect();
      }, 5000);
    }
    
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, scrollContainerSelector]);

  return {
    containerRef,
    bindEvents
  };
};
