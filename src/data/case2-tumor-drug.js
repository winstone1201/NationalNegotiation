/**
 * 案例三：肿瘤靶向药 - 完整对话树
 * 难度：困难 | 博弈主轴 | 跨国定价+研发成本对抗
 * 药企人格：冷硬精确型 —— 数据驱动，法律严谨，不讲感情只讲商业逻辑
 * 结构：2轮，R2新增"离席"高风险选项
 */
export const case2Dialogue = {
  round1: {
    startNode: 'r1_start',

    r1_start: {
      nodeId: 'r1_start',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '艾瑞卡在欧美市场的定价折合人民币约15万元/疗程。考虑到中国市场的价格敏感度，我们给出的初始报价是9.8万元。根据我们全球定价模型的分析，这个价格已经是将中国的人均GDP、医保支付能力和市场规模全部纳入计算后的结果。',
      emotion: 'confident',
      options: [
        {
          id: 'A', type: 'pressure', label: '价格质疑',
          text: '9.8万？你们在印度授权仿制药的价格不到1.5万。中国有8.5万患者急需此药——我们不可能接受近7倍的价格差异。请解释。',
          nextNode: 'r1_pressure_response',
          effects: { priceChange: -18000 }
        },
        {
          id: 'B', type: 'empathy', label: '市场逻辑',
          text: '如果这个药不能进医保，8.5万名中国肿瘤患者中大多数根本用不起。但反过来看——一旦纳入医保，这将是全球最大的肿瘤药单一市场。不是"降价"，是打开一扇大门。',
          nextNode: 'r1_empathy_response',
          effects: { priceChange: -10000 }
        },
        {
          id: 'C', type: 'technical', label: '疗效数据',
          text: '临床数据显示：中国患者用药后的肿瘤缩小率（34%）低于全球平均水平（42%）。既然对中国患者的疗效打了折扣，价格也应该相应调整——我们的测算模型建议不超过5.5万。请回应。',
          nextNode: 'r1_technical_response',
          effects: { priceChange: -15000 }
        }
      ]
    },

    r1_pressure_response: {
      nodeId: 'r1_pressure_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（面不改色，翻开一页文件）印度的情况完全不同——那是"自愿许可"机制下的例外，仿制药厂不需要承担任何研发费用。中国作为全球第二大创新药市场，价格必须反映研发投入。给你一个数据：从实验室到获批，这个药走了12年，烧了15亿美元。进入临床试验的100个候选分子中，只有不到12个能最终上市。刚才你提到的每一个折扣数字，都是这88个失败项目的成本没有被覆盖到的代价。不过——我们可以在第二轮调整报价。',
      emotion: 'defensive',
      isEndOfRound: true
    },

    r1_empathy_response: {
      nodeId: 'r1_empathy_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（微微点头）这个市场规模的逻辑是成立的。如果纳入医保确实意味着年销售量达到一定规模——以量换价我们完全可以谈。第二轮我们会基于这个思路调整方案。',
      emotion: 'conciliatory',
      isEndOfRound: true
    },

    r1_technical_response: {
      nodeId: 'r1_technical_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（快速翻阅临床数据）中国亚组的数据确实显示了一些差异，但这可能跟入组患者的病情阶段分布有关——不能简单归因为"药对中国患者效果差"。不过——（合上报告）我们尊重数据。第二轮会据此调整报价。',
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
      text: '（推过来一份新的报价单）经过与总部紧急沟通，我们可以降至7.2万元。这是基于中国市场的"以量换价"逻辑——前提是纳入医保后年采购量不低于5万疗程。低于这个量，这个价格无法维持。这是我们的底线。',
      emotion: 'conciliatory',
      options: [
        {
          id: 'A', type: 'pressure', label: '专利施压',
          text: '7.2万还是太高。据我所知，你们下个月在欧洲面临关键专利到期。届时仿制药一旦涌入，中国市场的及时准入对你们全球收入的稳定至关重要——建议贵方重新考虑。',
          nextNode: 'r2_pressure_response',
          effects: { priceChange: -25000 }
        },
        {
          id: 'B', type: 'empathy', label: '患者倒计时',
          text: '以量换价我们认可。但有一个事实请记住——我们每拖延一轮谈判，都有肿瘤患者在这期间因为用不起药而离开这个世界。今天我们能不能坐下来，谈出一个真正让患者用得起、也让你们有合理回报的价格？',
          nextNode: 'r2_empathy_response',
          effects: { priceChange: -20000 }
        },
        {
          id: 'C', type: 'technical', label: '全球比价',
          text: '我们的团队已经拉出了这个药在全球主要市场的实际售价：德国4.8万、日本5.2万、澳大利亚4.5万。再结合中国人均GDP调整因子，4.8万才是对标全球的公平价格。请你们的数据团队也复核一下这个数字。',
          nextNode: 'r2_technical_response',
          effects: { priceChange: -26000 }
        }
      ]
    },

    r2_pressure_response: {
      nodeId: 'r2_pressure_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（瞳孔微缩，迅速在手边的平板上查了一些东西）……专利信息是公开的，你查得很准。下个月的欧洲专利悬崖确实在我们的风险评估报告里。基于这个新变量，我可以在授权范围内做最后一次调整。这是最终报价。',
      emotion: 'defensive',
      triggerEnvelope: true
    },

    r2_empathy_response: {
      nodeId: 'r2_empathy_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（沉默了许久，放下手中的笔）我刚才跟你说数字、模型、底线——但你提醒了我，在这些数字背后是活生生的人。是的，我们今天就该给患者一个答案。不是为了交差——是因为每一轮拖延确实都有代价。让我们结束这场谈判。',
      emotion: 'sympathetic',
      triggerEnvelope: true
    },

    r2_technical_response: {
      nodeId: 'r2_technical_response',
      speaker: 'pharma',
      speakerName: '全球肿瘤药事业部代表',
      text: '（戴上眼镜，仔细核对了你递过来的全球比价表整整两分钟）德国4.8、日本5.2、澳大利亚4.5……你们的团队做了功课。基于这些数据和我们内部的价格模型交叉验证——你的数字是站得住脚的。这是我们基于全球市场数据做出的最终报价。',
      emotion: 'confident',
      triggerEnvelope: true
    },

  }
}
