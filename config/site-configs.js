// 网站配置文件 - 支持两个版本的联系信息
export const siteConfigs = {
  // 默认版本（原来的联系方式）
  default: {
    contact: {
      phone: '+86 132 4287 7076',
      email: 'Peter.choy.wong@outlook.com',
      address: {
        en: 'No. 106 Fengze East Road, Nansha District, Guangzhou, China',
        zh: '中国广州市南沙区丰泽东路106号',
        ru: 'ул. Фэнцзэ Восточная, 106, район Наньша, Гуанчжоу, Китай'
      }
    },
    branding: {
      companyName: 'HTerMalOil',
      domain: 'htermaloil.com'
    }
  },

  // 版本2 - 刘先生的联系方式
  version2: {
    contact: {
      phone: '13570176268',
      email: 'liu_jun_jia@foxmail.com',
      address: {
        en: 'No. 106 Fengze East Road, Nansha District, Guangzhou, China',
        zh: '中国广州市南沙区丰泽东路106号',
        ru: 'ул. Фэнцзэ Восточная, 106, район Наньша, Гуанчжоу, Китай'
      }
    },
    branding: {
      companyName: 'HTerMalOil',
      domain: 'htermaloil.com'
    }
  }
};

// 获取当前配置的函数
export function getCurrentConfig() {
  // 从URL参数或环境变量获取版本信息
  const urlParams = new URLSearchParams(window.location.search);
  const version = urlParams.get('version') || 
                  window.location.hostname.split('.')[0] || 
                  'default';
  
  return siteConfigs[version] || siteConfigs.default;
}

// 应用配置到页面的函数
export function applyConfig(config) {
  // 更新联系信息
  const phoneElements = document.querySelectorAll('[data-contact="phone"]');
  phoneElements.forEach(el => el.textContent = config.contact.phone);
  
  const emailElements = document.querySelectorAll('[data-contact="email"]');
  emailElements.forEach(el => el.textContent = config.contact.email);
  
  // 更新地址（根据当前语言）
  const currentLang = document.documentElement.lang || 'en';
  const addressElements = document.querySelectorAll('[data-contact="address"]');
  addressElements.forEach(el => {
    el.textContent = config.contact.address[currentLang] || config.contact.address.en;
  });
  
  // 更新公司名称
  const companyElements = document.querySelectorAll('[data-branding="company"]');
  companyElements.forEach(el => el.textContent = config.branding.companyName);
  
  // 更新表单邮件地址
  updateFormEmailTarget(config.contact.email);
}

// 更新表单提交的邮件地址
function updateFormEmailTarget(email) {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.setAttribute('data-email-target', email);
  });
}
