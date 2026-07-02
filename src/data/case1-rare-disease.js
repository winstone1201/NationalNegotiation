/**
 * 案例二：罕见病救命药 - 完整对话树
 * 难度：中等 | 情感主轴 | 患者家属来电
 * 药企人格：情感矛盾型 —— 真心在乎患者，但被公司利润要求束缚
 * 结构：2轮 + 电话事件，R2为3选项（施压/共情/技术）
 * 成功率：6/9 ≈ 67%（介于案例一78%和案例三67%之间）
 */
export const case1Dialogue = {
  round1: {
    startNode: 'r1_start',

    r1_start: {
      nodeId: 'r1_start',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: 'Spinraza是目前全球唯一获批的SMA治疗药物。我们很清楚中国患者的需求——我们收到过很多中国家庭的来信，也见过那些孩子的照片。但研发的现实是：这个药从基础研究走到今天用了整整18年，投入超过20亿美元。我们的初始报价是每支12万元。我知道这个数字听起来很高，但请理解——当全球只有6万名患者时，每一支药背后分摊的研发成本是一个天文数字。',
      emotion: 'confident',
      options: [
        {
          id: 'A', type: 'pressure', label: '价格质疑',
          text: '12万元一支？你们在澳大利亚的定价折合人民币还不到6万。为什么中国患者要付双倍的价钱？请解释这个差距。',
          nextNode: 'r1_pressure_response',
          effects: { priceChange: -15000 }
        },
        {
          id: 'B', type: 'empathy', label: '患者优先',
          text: '我桌上放着全国1200名SMA患儿的名单，最小的只有8个月大。如果不能尽快纳入医保，这些孩子中的大多数等不到明年。今天我不是来砍价的——我是来处理一场公共卫生危机。',
          nextNode: 'r1_empathy_response',
          effects: { priceChange: -8000 }
        },
        {
          id: 'C', type: 'technical', label: '价值分析',
          text: '根据国际通用的"性价比"测算模型，这个药每帮患者延长一年高质量生命，合理花费应该在5-7万元。12万远超这个范围——请贵方提供你们自己的测算依据。',
          nextNode: 'r1_technical_response',
          effects: { priceChange: -12000 }
        }
      ]
    },

    r1_pressure_response: {
      nodeId: 'r1_pressure_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（略显不悦，但控制住了情绪）各国的定价受市场规模、物流成本等多种因素影响，不能简单比较。澳大利亚有政府专项罕见病基金补贴，而中国市场需要我们自己承担全部商业风险。（停顿）但我理解你的立场。请给我们内部讨论的时间，第二轮我们会拿出更有诚意的方案。',
      emotion: 'defensive',
      isEndOfRound: true
    },

    r1_empathy_response: {
      nodeId: 'r1_empathy_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（沉默了好一会儿，声音变轻了）8个月大……这个数字让我很难受。以患者为中心是我们做这个药的初衷——不是为了利润，是因为我们见过那些孩子的眼睛。（整理了一下情绪）请给我们一些时间，第二轮我们会认真考虑一个更可及的价格方案。',
      emotion: 'sympathetic',
      isEndOfRound: true
    },

    r1_technical_response: {
      nodeId: 'r1_technical_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（认真翻阅资料）贵方的测算框架很专业，但有一个盲点：Spinraza的研发周期长达18年，其中前12年都是在试错——那些失败的项目成本，在"性价比"模型里是算不进去的。不过——（合上文件，语气诚恳）我承认12万的报价确实有调整空间。第二轮我们拿出诚意。',
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
      text: '（神情比上一轮更加严肃）我跟总部通了紧急电话。经过讨论，我们决定将价格调整至每支8万元。这是我们基于中国市场的特殊情况能做出的最大诚意了。坦率地说，再往下降，每一支药都将在亏损——全球没有任何一个市场有这个先例。',
      emotion: 'conciliatory',
      options: [
        {
          id: 'A', type: 'pressure', label: '坚守底线（高风险）',
          text: '8万还是太高。如果贵方不能降至6万以内，我只能遗憾地终止今天的谈判。这不是威胁——1200个家庭在等我的结果，我没有退路。',
          nextNode: 'r2_pressure_response',
          effects: { priceChange: -28000 }
        },
        {
          id: 'B', type: 'empathy', label: '寻求合作（情感牌）',
          text: '我接到了一位SMA患儿母亲的电话。她的孩子3岁了还不能独坐。她说："谈判官，我们不是要免费，只是想要一个希望。"如果贵方今天能把价格降到患者真正可及的程度——我愿意在后续推动建立患者援助计划，让这个药不是进了目录就完事，而是真正用到每个需要的孩子身上。',
          nextNode: 'r2_empathy_response',
          effects: { priceChange: -24000 }
        },
        {
          id: 'C', type: 'technical', label: '国际对标（数据牌）',
          text: '我们做了跨国比价：诺西那生钠在德国、日本、法国的实际支付价折合人民币在5.5-6.8万之间。这些国家同样有严格的药物经济学评估。8万的价格意味着中国患者支付的比德法日还要高——这在国际参照系下很难成立。请贵方基于全球价格体系重新核算。',
          nextNode: 'r2_technical_response',
          effects: { priceChange: -27000 }
        }
      ]
    },

    r2_pressure_response: {
      nodeId: 'r2_pressure_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（脸色变了，与团队成员用英语低声争论了近一分钟。气氛极度紧张。）……这是我从业二十年来最艰难的谈判。6万以内——（深吸一口气）这个要求在全球任何董事会都会被直接否决。但如果我今天说不，那些孩子就真的没有机会了。好。我向总部承担这个决定的风险。这是我们的最终报价。',
      emotion: 'defensive',
      triggerEnvelope: true
    },

    r2_empathy_response: {
      nodeId: 'r2_empathy_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（眼眶微微发红，声音有些沙哑）那个电话……让我想起我们研发团队里的一位科学家。她花了整整15年做这个药，她办公桌上一直放着一张SMA患儿的照片。（停顿了很久）你说得对，进了目录不是终点。患者援助计划这个提议很有价值——但在商业层面，仅凭情感诉求我们能调动的降价空间确实有限。这是我能拿出的最终报价。',
      emotion: 'sympathetic',
      triggerEnvelope: true
    },

    r2_technical_response: {
      nodeId: 'r2_technical_response',
      speaker: 'pharma',
      speakerName: '诺华制药代表',
      text: '（翻阅资料，眉头紧锁）你们连德、法、日的净价都查到了——功课做得很深。（摘下眼镜，语气转为务实）我承认，在全球定价体系里，中国市场不应该被放在比欧洲更高的价格区间。你们的国际对标数据站得住脚。基于全球参照系，这是我们重新核算后的最终报价。',
      emotion: 'defensive',
      triggerEnvelope: true
    }
  }
}
