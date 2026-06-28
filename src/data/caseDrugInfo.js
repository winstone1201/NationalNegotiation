/**
 * 各案例药品基础信息
 * （完整谈判数据和对话树见 case1/2/3 文件）
 */
export const caseDrugInfoMap = {
  'rare-disease-1': {
    genericName: '诺西那生钠注射液',
    brandName: 'Spinraza',
    indication: '脊髓性肌萎缩症(SMA)，一种罕见的遗传性神经肌肉疾病，导致婴幼儿进行性肌无力和呼吸衰竭。若不治疗，大多数患儿在2岁前死亡。',
    indicationPlain: '一种让孩子慢慢失去力气、无法呼吸的罕见病',
    initialPrice: 120000,
    qalyScore: 0.65,
    qalyExplain: '每获得一个QALY的成本约85万元，高于常规阈值',
    referencePrice: 55000,
    budgetImpact: '预计年影响医保基金支出约3.2亿元',
    beneficiaryCount: 1200
  },
  'tumor-drug-2': {
    genericName: '卡瑞利珠单抗注射液',
    brandName: '艾瑞卡 (AiRuiKa)',
    indication: 'PD-1抑制剂，用于非小细胞肺癌、食管癌等实体瘤的二线治疗，可显著延长患者无进展生存期。',
    indicationPlain: '一种帮助晚期癌症患者延长生命的新型免疫治疗药物',
    initialPrice: 98000,
    qalyScore: 0.72,
    qalyExplain: '每获得一个QALY的成本约62万元，处于争议区间',
    referencePrice: 48000,
    budgetImpact: '预计年影响医保基金支出约8.5亿元（高患者基数）',
    beneficiaryCount: 85000
  },
  'chronic-renewal-3': {
    genericName: '阿托伐他汀钙片（续约）',
    brandName: '立普妥 (Lipitor)',
    indication: '用于治疗高胆固醇血症和混合型高脂血症，预防心血管事件。中国有超过2亿血脂异常患者。',
    indicationPlain: '让2亿高血脂患者控制胆固醇、预防心梗脑梗的日常用药',
    initialPrice: 5.6,
    qalyScore: 0.88,
    qalyExplain: '每获得一个QALY的成本约0.5万元，性价比极高',
    referencePrice: 3.2,
    budgetImpact: '因销量远超预期，预计年度支出超预算120%',
    beneficiaryCount: 200000000
  }
}

/**
 * 基金预算数据（各案例不同）
 */
export const budgetDataMap = {
  'rare-disease-1': {
    totalBudget: 450,
    usedBudget: 380,
    remainingBudget: 70
  },
  'tumor-drug-2': {
    totalBudget: 450,
    usedBudget: 320,
    remainingBudget: 130
  },
  'chronic-renewal-3': {
    totalBudget: 450,
    usedBudget: 400,
    remainingBudget: 50
  }
}
