/**
 * 案例三：肿瘤靶向药 - 完整对话树
 * 难度：困难 | 博弈主轴 | 跨国定价+研发成本对抗
 */
export const case2Dialogue = {
  round1: {
    startNode: 'r1_start',

    r1_start: {
      nodeId: 'r1_start',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '艾瑞卡在欧美市场的定价折合人民币约15万元/疗程。考虑到中国市场的价格敏感性，我们给出的初始报价是9.8万元。这已经是在全球定价体系下能做出的最大让步了。',
      emotion: 'confident',
      options: [
        {
          id: 'A', type: 'pressure', label: '施压型',
          text: '9.8万？贵方在印度授权仿制药的价格不到1.5万。中国有8.5万患者急需此药，我们不可能接受这种价格差异。',
          nextNode: 'r1_pressure_response',
          effects: { priceChange: -18000 }
        },
        {
          id: 'B', type: 'empathy', label: '情理型',
          text: '如果这个药不能进医保，8.5万中国肿瘤患者中大多数人根本用不起。这不是降价，是打开全球最大的肿瘤药市场。',
          nextNode: 'r1_empathy_response',
          effects: { priceChange: -10000 }
        },
        {
          id: 'C', type: 'technical', label: '技术型',
          text: '全球III期中国亚组分析显示中国患者ORR低于全球均值。基于疗效调整的价格模型建议不超过5.5万。请回应。',
          nextNode: 'r1_technical_response',
          effects: { priceChange: -15000 }
        }
      ]
    },

    r1_pressure_response: {
      nodeId: 'r1_pressure_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（面色微变）印度的情况特殊——那是自愿许可机制下的例外，生产商无需承担研发成本。中国作为全球第二大创新药市场，定价必须反映研发投入。从实验室到获批，这个药经历了12年、耗资超15亿美元——而在进入临床试验的100个候选分子中，最终只有不到12个能走到上市。你今天的每一个报价数字，背后都是数万个失败实验的沉默成本。不过——我们可以重新计算。',
      emotion: 'defensive',
      isEndOfRound: true
    },

    r1_empathy_response: {
      nodeId: 'r1_empathy_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '这个角度很有意思。中国确实是全球最大的肿瘤患者市场。如果纳入医保带来足够的量，以量换价——我们可以在第二轮调整方案。',
      emotion: 'conciliatory',
      isEndOfRound: true
    },

    r1_technical_response: {
      nodeId: 'r1_technical_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '亚组分析确实显示了一些差异，但可能与入组患者基线特征相关。不过——（合上报告）我们尊重科学，第二轮会基于这些数据调整报价。',
      emotion: 'defensive',
      isEndOfRound: true
    }
  },

  round2: {
    startNode: 'r2_start',

    r2_start: {
      nodeId: 'r2_start',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '经过与总部连夜沟通，我们可以降至7.2万元。这是基于"以量换价"的诚意——前提是纳入医保后年采购量不低于5万疗程。',
      emotion: 'conciliatory',
      options: [
        {
          id: 'A', type: 'pressure', label: '施压型',
          text: '7.2万还是太高。据我所知，贵方下月在欧洲面临专利到期。中国市场的及时准入对贵方的全球收入至关重要——建议重新考虑。',
          nextNode: 'r2_pressure_response',
          effects: { priceChange: -20000 }
        },
        {
          id: 'B', type: 'empathy', label: '情理型',
          text: '以量换价我们认可。但请记住——每一轮谈判拖延，都有肿瘤患者在这期间因用不起药而离世。我们能否今天就达成一个真正让患者受益的价格？',
          nextNode: 'r2_empathy_response',
          effects: { priceChange: -15000 }
        },
        {
          id: 'C', type: 'technical', label: '技术型',
          text: '基于多国参考价（德国4.8万、日本5.2万、澳大利亚4.5万），结合中国人均GDP调整因子，4.8万才是合理价格。',
          nextNode: 'r2_technical_response',
          effects: { priceChange: -24000 }
        }
      ]
    },

    r2_pressure_response: {
      nodeId: 'r2_pressure_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（瞳孔微缩）你消息很灵通。专利悬崖确实是不得不考虑的因素。不过我想请你思考一个更长远的问题：中国正在从"仿制药大国"向"创新药强国"转型。如果创新药在中国市场始终面临最激进的砍价压力，跨国药企和本土创新药企都会重新评估"值不值得为这个市场冒险研发"。我们当然希望做这笔交易——但我们也希望，5年后，没有药企因为"怕砍价"而绕过中国市场。这是我们的最终报价。',
      emotion: 'defensive',
      triggerEnvelope: true
    },

    r2_empathy_response: {
      nodeId: 'r2_empathy_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（长叹一口气）你说得对。药品的真正价值不在于研发投入的数据——而在于患者能否用上。我们愿意为了这个目标再做一次努力。请听最终报价。',
      emotion: 'sympathetic',
      triggerEnvelope: true
    },

    r2_technical_response: {
      nodeId: 'r2_technical_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（仔细审视数据表）多国参考价+人均GDP调整……你们的模型非常专业。中国谈判准备越来越充分了。这是我们基于数据做出的最终调整。',
      emotion: 'confident',
      triggerEnvelope: true
    }
  }
}
