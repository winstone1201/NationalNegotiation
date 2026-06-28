/**
 * 知识测验题库
 * 用于前测（谈判前）和后测（谈判后），验证政策理解度提升
 */
export const quizQuestions = [
  {
    id: 'q1',
    question: '国家医保谈判（"国谈"）的主要目标是什么？',
    options: [
      { id: 'a', text: '让所有药品都免费使用' },
      { id: 'b', text: '以合理价格将临床必需的药品纳入医保目录，提高患者可及性' },
      { id: 'c', text: '完全取消进口药品' },
      { id: 'd', text: '最大化医保基金结余' }
    ],
    correct: 'b',
    explanation: '国谈的核心目标是在医保基金可承受范围内，通过谈判降低药品价格，使更多临床必需的药品纳入医保目录，提高患者的用药可及性。'
  },
  {
    id: 'q2',
    question: '"信封底价"在国谈中是什么意思？',
    options: [
      { id: 'a', text: '药企写在信封上的第一次报价' },
      { id: 'b', text: '谈判代表的工资单' },
      { id: 'c', text: '医保局内部测算的最高可接受价格，谈判现场才开封' },
      { id: 'd', text: '患者众筹的目标金额' }
    ],
    correct: 'c',
    explanation: '信封底价是医保局基于药物经济学模型、基金承受能力等因素测算出的最高支付标准。谈判代表在现场揭开信封，作为谈判的底线参考。'
  },
  {
    id: 'q3',
    question: '根据规则，谈判终止的条件是什么？',
    options: [
      { id: 'a', text: '药企代表中途离场' },
      { id: 'b', text: '两次报价后企业报价仍高于底价的1.15倍' },
      { id: 'c', text: '谈判时间超过30分钟' },
      { id: 'd', text: '患者代表表示反对' }
    ],
    correct: 'b',
    explanation: '国家医保局规定：药企有两次报价机会。如果两次报价均未达到医保方底价的1.15倍（即115%）以内，谈判即告终止，该药品暂不纳入本年度目录。'
  },
  {
    id: 'q4',
    question: 'QALY（质量调整生命年）是衡量什么的指标？',
    options: [
      { id: 'a', text: '药企的年度利润' },
      { id: 'b', text: '药物经济性——每获得一年高质量生命所需花费的成本' },
      { id: 'c', text: '医生的年度接诊量' },
      { id: 'd', text: '医保基金的年度结余率' }
    ],
    correct: 'b',
    explanation: 'QALY是国际通用的药物经济学指标，综合考虑药物延长生命的时间和生活质量改善程度，是医保谈判中判断"这药值不值这个价"的关键依据。'
  },
  {
    id: 'q5',
    question: '关于药品续约谈判，以下哪项描述是正确的？',
    options: [
      { id: 'a', text: '只要药品曾经纳入过目录，就可以永久留存' },
      { id: 'b', text: '协议期满后，独家药品可以转入常规目录，无需再谈判' },
      { id: 'c', text: '协议期满8年的独家药品可转入常规目录，但需根据销量等情况评估是否再次降价' },
      { id: 'd', text: '续约时药企可以随意涨价' }
    ],
    correct: 'c',
    explanation: '2025年起实施的新规明确：协议期满8年的独家药品可申请转入常规目录（"乙类"），但如果实际销量远超预期，医保方仍有权要求进一步降价。'
  },
  {
    id: 'q6',
    question: '医保谈判中，"保基本"原则意味着什么？',
    options: [
      { id: 'a', text: '只保障最便宜的药，贵的都不用' },
      { id: 'b', text: '在基金可承受范围内，优先保障临床必需、疗效确切、价格合理的药品' },
      { id: 'c', text: '所有疾病用药一视同仁' },
      { id: 'd', text: '只保障常见病，罕见病不在保障范围' }
    ],
    correct: 'b',
    explanation: '"保基本"是医保的核心原则，意为在基金支付能力内，优先满足大多数人最基本、最迫切的医疗需求。但并非意味着罕见病就不保障——恰恰是国谈最难平衡的地方。'
  },
  {
    id: 'q7',
    question: '2026年国谈制度的一个重要变化是什么？',
    options: [
      { id: 'a', text: '取消所有谈判，改为企业自主定价' },
      { id: 'b', text: '预申报机制首次正式落地' },
      { id: 'c', text: '只允许国产药品参与谈判' },
      { id: 'd', text: '谈判改为线上进行' }
    ],
    correct: 'b',
    explanation: '2026年，预申报机制首次正式落地。药企需在正式谈判前预先提交药品信息和价格预期，这改变了谈判的博弈节奏，是制度设计的核心变量。'
  },
  {
    id: 'q8',
    question: '以下哪个不是医保谈判代表的真实考量因素？',
    options: [
      { id: 'a', text: '药品的临床疗效和安全性' },
      { id: 'b', text: '医保基金的年度预算约束' },
      { id: 'c', text: '药企的股票价格' },
      { id: 'd', text: '国际参考价格（其他国家的定价）' }
    ],
    correct: 'c',
    explanation: '谈判代表关注的是临床价值、基金承受能力和国际价格参考。药企股价不是谈判考量因素——虽然谈判结果会间接影响资本市场。'
  }
]

/**
 * 获取随机题目子集
 * @param {number} count - 题目数量
 * @returns {Array} 打乱后的题目数组
 */
export function getRandomQuestions(count = 5) {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * 计算得分
 * @param {Object} answers - { questionId: selectedOptionId }
 * @returns {number} 0-100的分数
 */
export function calculateScore(answers) {
  const questions = quizQuestions
  let correct = 0
  let total = 0

  for (const q of questions) {
    if (answers[q.id]) {
      total++
      if (answers[q.id] === q.correct) correct++
    }
  }

  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}
