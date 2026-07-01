/**
 * 案例摘要数据（用于首页卡片展示）
 * 按难度排序：简单 → 中等 → 困难
 */
export const caseSummaries = [
  {
    id: 'chronic-renewal-3',
    name: '案例一：慢性病用药续约',
    subtitle: '这是一个"老药换新约"的故事。药太好卖了，价格要不要再降一降？2亿高血脂患者的日常用药，续约在即。',
    difficulty: 'easy',
    estimatedTime: '4分钟',
    thumbnail: null,
    tags: ['续约机制', '慢性病', '规则博弈'],
    visualTheme: {
      gradient: 'linear-gradient(135deg, #e8f5e9, #e3f2fd)',
      accentColor: '#2e7d32',
      barColor: 'linear-gradient(90deg, #43a047, #1e88e5)',
      icon: '💊',
      label: '日常用药 · 规则博弈'
    }
  },
  {
    id: 'rare-disease-1',
    name: '案例二：罕见病救命药',
    subtitle: '全球最贵的儿童罕见病药。1200个家庭在等一个希望。当价格等于生命，你能砍到多少？',
    difficulty: 'medium',
    estimatedTime: '5分钟',
    thumbnail: null,
    tags: ['罕见病', '保基本', '情感博弈'],
    visualTheme: {
      gradient: 'linear-gradient(135deg, #fff8e1, #fff3e0)',
      accentColor: '#e65100',
      barColor: 'linear-gradient(90deg, #ff9800, #f44336)',
      icon: '👶',
      label: '"孤儿药" · 情感博弈'
    }
  },
  {
    id: 'tumor-drug-2',
    name: '案例三：肿瘤靶向药',
    subtitle: '跨国药企的定价模型 vs 14亿人的市场规模。用中国的体量，为8.5万肿瘤患者争取一个全球最公平的价格。',
    difficulty: 'hard',
    estimatedTime: '6分钟',
    thumbnail: null,
    tags: ['肿瘤药', '跨国谈判', '定价机制'],
    visualTheme: {
      gradient: 'linear-gradient(135deg, #fce4ec, #ede7f6)',
      accentColor: '#880e4f',
      barColor: 'linear-gradient(90deg, #e91e63, #7c3aed)',
      icon: '🎯',
      label: '高价药 · 战略博弈'
    }
  }
]
