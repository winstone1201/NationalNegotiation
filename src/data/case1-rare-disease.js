/**
 * 案例二：罕见病救命药 - 完整对话树
 * 难度：中等 | 情感主轴 | 患者家属来电
 */
export const case1Dialogue = {
  round1: {
    startNode: 'r1_start',

    r1_start: {
      nodeId: 'r1_start',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: 'Spinraza是目前全球唯一获批的SMA治疗药物。我们理解中国患者的需求，但研发成本是不得不考虑的因素——这个药物从基础研究到上市用了18年，耗资超过20亿美元。我们的初始报价：每支12万元。',
      emotion: 'confident',
      options: [
        {
          id: 'A', type: 'pressure', label: '施压型',
          text: '12万元一支？贵方在澳大利亚定价折合人民币不到6万。为什么中国患者需要支付双倍？',
          nextNode: 'r1_pressure_response',
          effects: { priceChange: -15000 }
        },
        {
          id: 'B', type: 'empathy', label: '情理型',
          text: '我桌上放着全国1200名SMA患儿名单，最小的只有8个月大。如果不能尽快入医保，这些孩子中的大多数等不到明年。',
          nextNode: 'r1_empathy_response',
          effects: { priceChange: -8000 }
        },
        {
          id: 'C', type: 'technical', label: '技术型',
          text: '以Spinraza的QALY值计算，合理价格区间应在5-7万元。12万远超常规阈值，请提供论证依据。',
          nextNode: 'r1_technical_response',
          effects: { priceChange: -12000 }
        }
      ]
    },

    r1_pressure_response: {
      nodeId: 'r1_pressure_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（略显不悦）各国的定价受市场规模、人均收入、物流成本等多重因素影响，不能简单横向比较。而且——恕我直言——如果中国市场的定价被压得过低，向全球药企传递的信号将是负面的：投入20亿美元研发的罕见病药物，在最大的新兴市场得不到合理回报。这对未来所有罕见病药物的研发热情都是一种打击。不过——我方愿意在第二轮给出更有竞争力的报价。',
      emotion: 'defensive',
      isEndOfRound: true
    },

    r1_empathy_response: {
      nodeId: 'r1_empathy_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（沉默片刻）我们也收到过很多中国患者家庭的来信。以患者为中心是我们企业的核心价值观。请给我们一些时间内部讨论，第二轮我们会认真考虑一个更具可及性的方案。',
      emotion: 'sympathetic',
      isEndOfRound: true
    },

    r1_technical_response: {
      nodeId: 'r1_technical_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（翻阅资料）贵方的模型需要更新——Spinraza的研发周期长达18年，早期失败项目成本也需要摊销。不过——（合上文件）我们承认报价空间存在，第二轮调整。',
      emotion: 'defensive',
      isEndOfRound: true
    }
  },

  round2: {
    startNode: 'r2_start',

    r2_start: {
      nodeId: 'r2_start',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '经过内部紧急讨论，我们决定将价格调整至每支8万元。这是我们基于中国市场特殊性给出的诚意价格。',
      emotion: 'conciliatory',
      options: [
        {
          id: 'A', type: 'pressure', label: '施压型',
          text: '8万仍在底价之上。如果贵方不能降至6万以内，我们只能遗憾终止谈判。1200个家庭在等我们的结果。',
          nextNode: 'r2_pressure_response',
          effects: { priceChange: -25000 }
        },
        {
          id: 'B', type: 'empathy', label: '情理型',
          text: '今早我接到一位SMA患儿母亲的电话。孩子3岁了还不能独坐。她说："谈判官，我们不是要免费，只是想要一个希望。"',
          nextNode: 'r2_empathy_response',
          effects: { priceChange: -20000 }
        },
        {
          id: 'C', type: 'technical', label: '技术型',
          text: '测算显示合理支付标准约5.5万。考虑全球定价体系，我们可在6.3万（底价×1.15）内接受。请斟酌。',
          nextNode: 'r2_technical_response',
          effects: { priceChange: -22000 }
        }
      ]
    },

    r2_pressure_response: {
      nodeId: 'r2_pressure_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（长时间沉默，与团队低声用英语交流）……这是一个非常艰难的决定。在全球任何市场，我们都没有在单个谈判中做出如此大的让步。但考虑到中国SMA患儿的迫切需求，我们同意。这是最终报价。同时我想坦诚地说：未来，当我们在董事会讨论下一个罕见病药物的研发预算时，今天的谈判结果会被作为一个参考案例。我们真诚希望，罕见病药物的创新之路不会因为定价压力而越走越窄。',
      emotion: 'conciliatory',
      triggerEnvelope: true
    },

    r2_empathy_response: {
      nodeId: 'r2_empathy_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（眼眶微红）那个电话……让我想起最初研发这个药物的初心。不是为了利润——是因为我们见过那些孩子的眼睛。请听最终报价。我们愿意为了这些孩子做出超出常规决策的让步。',
      emotion: 'sympathetic',
      triggerEnvelope: true
    },

    r2_technical_response: {
      nodeId: 'r2_technical_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '测算非常精准。说实话，6.3万已经接近我们的全球最低价。但中国罕见病市场的特殊意义——以及贵方展现的专业态度——让我们愿意接受。这是最终报价。',
      emotion: 'confident',
      triggerEnvelope: true
    }
  }
}
