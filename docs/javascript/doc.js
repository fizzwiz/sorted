// static/javascript/doc.js
(function () {
  'use strict';
  
  // 缓存DOM元素
  const DOM = {
    filterType: document.getElementById('filterType'),
    classFilter: document.getElementById('ClassFilter'),
    classList: document.getElementById('ClassList'),
    clearButton: document.getElementById('clearSearch')
  };

  // 工具函数
  const Utils = {
    /**
     * 获取URL查询参数
     * @param {string} name - 参数名
     * @returns {string|null} 参数值
     */
    getQueryParameter(name) {
      const match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },

    /**
     * 过滤类列表 - 优化版本
     * @param {string} searchTerm - 搜索词
     */
    filterClassList(searchTerm) {
      const value = searchTerm.toLowerCase();
      const items = DOM.classList?.getElementsByTagName('li') || [];
      
      // 使用文档片段来减少重排
      const displayChanges = [];
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemName = (item.getAttribute('data-name') || '').toLowerCase().replace(/\s/g, '');
        const shouldDisplay = itemName.indexOf(value) >= 0;
        displayChanges.push({element: item, display: shouldDisplay ? '' : 'none'});
      }
      
      // 批量应用更改
      displayChanges.forEach(change => {
        change.element.style.display = change.display;
      });
      
      // 根据搜索词是否为空来显示/隐藏清空按钮
      if (DOM.clearButton) {
        DOM.clearButton.style.display = searchTerm ? 'flex' : 'none';
      }
    },

    /**
     * 更新菜单链接
     */
    updateMenuLinks() {
      const links = DOM.classList?.getElementsByTagName('a') || [];
      const searchTerm = DOM.classFilter?.value || '';
      
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const parts = link.href.split('#');
        const baseUrl = parts[0].split('?')[0];
        link.href = baseUrl + 
          (searchTerm === '' ? '' : '?classFilter=' + encodeURIComponent(searchTerm)) + 
          (parts[1] ? '#' + parts[1] : '');
      }
    }
  };

  // 初始化函数
  function init() {
    if (!DOM.classFilter || !DOM.classList) return;
    
    // 设置初始过滤状态
    const show = Utils.getQueryParameter('show');
    if (show && DOM.filterType) {
      DOM.filterType.value = show;
    }

    const searchTerm = Utils.getQueryParameter('classFilter') || '';
    DOM.classFilter.value = searchTerm;
    Utils.filterClassList(searchTerm);

    // 绑定事件
    bindEvents();
    
    // 设置焦点
    DOM.classFilter.focus();
  }

  // 绑定事件处理函数
  function bindEvents() {
    // 搜索框输入事件
    DOM.classFilter?.addEventListener('input', () => {
      Utils.filterClassList(DOM.classFilter.value);
    });

    // 菜单链接点击事件
    const menuLinks = DOM.classList?.getElementsByTagName('a') || [];
    for (let i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener('click', Utils.updateMenuLinks);
    }

    // 快捷键处理
    document.body?.addEventListener('keydown', handleShortcut);

    // 回车键处理
    DOM.classFilter?.addEventListener('keydown', handleEnterKey);

    // 清空按钮点击事件
    DOM.clearButton?.addEventListener('click', clearSearch);
    
    // 搜索框获得焦点时显示清空按钮
    DOM.classFilter?.addEventListener('focus', () => {
      if (DOM.classFilter.value) {
        DOM.clearButton.style.display = 'flex';
      }
    });
    
    // 搜索框失去焦点时隐藏清空按钮（如果搜索框为空）
    DOM.classFilter?.addEventListener('blur', () => {
      setTimeout(() => {
        if (!DOM.classFilter.value && DOM.clearButton) {
          DOM.clearButton.style.display = 'none';
        }
      }, 100);
    });
  }

  // 快捷键处理函数
  function handleShortcut(e) {
    // Ctrl+K 快捷键聚焦搜索框
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      DOM.classFilter?.focus();
      DOM.classFilter?.select();
    }
  }

  // 回车键处理函数
  function handleEnterKey(e) {
    if (e.key === 'Enter') {
      const firstResult = document.querySelector('#ClassList li:not([style="display: none;"]) a');
      if (firstResult) {
        firstResult.click();
      }
    }
  }

  // 清空搜索框
  function clearSearch() {
    if (DOM.classFilter) {
      DOM.classFilter.value = '';
      Utils.filterClassList('');
      DOM.classFilter.focus();
      if (DOM.clearButton) {
        DOM.clearButton.style.display = 'none';
      }
    }
  }

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// 主题切换功能
(function() {
  'use strict';
  
  // 获取主题切换按钮
  const themeToggle = document.getElementById('themeToggle');
  
  // 获取当前主题（优先使用本地存储的设置，否则使用系统偏好）
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // 检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }
  
  // 应用主题
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  // 切换主题
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }
  
  // 初始化主题
  function initTheme() {
    setTheme(getCurrentTheme());
    
    // 监听系统主题变化
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }
  
  // 绑定事件
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();