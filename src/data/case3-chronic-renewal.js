/**
 * 案例一：慢性病用药续约 - 完整对话树
 * 难度：简单 | 续约规则主轴 | 入门
 */
export const case3Dialogue = {
  round1: {
    startNode: 'r1_pharma_open',

    r1_pharma_open: {
      nodeId: 'r1_pharma_open',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '立普妥在医保目录中已经服务中国患者8年了。累计处方超过30亿张，惠及数亿高血脂患者。我们今天的续约报价是：维持每片5.6元不变。毕竟——这个价格已经是全球最低梯队。',
      emotion: 'confident',
      options: [
        {
          id: 'A', type: 'pressure', label: '施压型',
          text: '维持原价？原协议预估年销量5000万盒，实际2.1亿盒——超预期320%。销量翻了4倍，价格不该降吗？',
          nextNode: 'r1_pressure_response',
          effects: { priceChange: -1.4 }
        },
        {
          id: 'B', type: 'empathy', label: '情理型',
          text: '立普妥确实是好药，2亿患者每天都在用。正因为用量大，每降1分钱，基金每年就能多释放数亿空间去救更多人。',
          nextNode: 'r1_empathy_response',
          effects: { priceChange: -0.8 }
        },
        {
          id: 'C', type: 'technical', label: '技术型',
          text: '根据最新续约规则，超额销量200%以上须重新测算降价比例。我方模型建议降至3.2元。',
          nextNode: 'r1_technical_response',
          effects: { priceChange: -1.8 }
        }
      ]
    },

    r1_pressure_response: {
      nodeId: 'r1_pressure_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '销量超出预期恰恰说明这款药深得中国患者信赖。但请注意——如果每次销量超预期就要降价，药企还有什么动力去推广药品、让更多基层患者用上好药？我们辉瑞每年在中国投入超过30亿元的研发费用。回报预期持续走低，未来的投入决策难免受到影响。',
      emotion: 'defensive',
      isEndOfRound: true
    },

    r1_empathy_response: {
      nodeId: 'r1_empathy_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '我们理解基金压力和"以量换价"的逻辑。立普妥的市场规模确实远超预估，基于公平原则，我们愿意重新核算方案。第二轮见。',
      emotion: 'conciliatory',
      isEndOfRound: true
    },

    r1_technical_response: {
      nodeId: 'r1_technical_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '3.2元非常接近成本线了。但新规写得清楚，我们有义务配合重新测算。给我方再做一轮评估，第二轮带回调整方案。',
      emotion: 'defensive',
      isEndOfRound: true
    }
  },

  round2: {
    startNode: 'r2_start',

    r2_start: {
      nodeId: 'r2_start',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '经过与总部沟通，我们愿意降至每片4.8元。但我必须坦诚相告：这已接近边际成本。在新的8年协议期内，不能再追加降价——企业需要一个可预期、可规划的定价环境，才敢在中国持续投入。',
      emotion: 'conciliatory',
      options: [
        {
          id: 'A', type: 'pressure', label: '施压型',
          text: '4.8元还不够。仿制药集采已到1.5元。原研药溢价超3倍，难以向公众解释。',
          nextNode: 'r2_pressure_response',
          effects: { priceChange: -1.5 }
        },
        {
          id: 'B', type: 'empathy', label: '情理型',
          text: '8年来立普妥零质量事故，这是信任。我们希望这份信任能延续下去，以更多患者负担得起的价格。',
          nextNode: 'r2_empathy_response',
          effects: { priceChange: -1.2 }
        },
        {
          id: 'C', type: 'technical', label: '技术型',
          text: '阶梯定价如何？前2亿盒维持4元以上，超出部分自动降至3.2元。既保障利润预期又控制基金支出。',
          nextNode: 'r2_technical_response',
          effects: { priceChange: -1.0 }
        }
      ]
    },

    r2_pressure_response: {
      nodeId: 'r2_pressure_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（面色凝重）直接将原研药与仿制药简单对比"几倍溢价"，恐怕忽视了原研药数十年临床数据的积累成本。不过我们理解基金压力。好，这是最终报价。但请记住：立普妥之后，我们还有12个在研新药——今天的谈判结果会影响总部对"中国市场是否值得持续投入"的判断。',
      emotion: 'defensive',
      triggerEnvelope: true
    },

    r2_empathy_response: {
      nodeId: 'r2_empathy_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（微笑）8年了，信任无价。我们愿意为了中国患者的长期利益再让一步。请听最终报价。',
      emotion: 'conciliatory',
      triggerEnvelope: true
    },

    r2_technical_response: {
      nodeId: 'r2_technical_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '阶梯定价——既保证了患者可及又维护了创新回报预期。三方共赢的思路。基于这个框架，我们调整最终报价。',
      emotion: 'confident',
      triggerEnvelope: true
    }
  }
}
