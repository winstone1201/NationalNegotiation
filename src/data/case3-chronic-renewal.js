/**
 * 案例一：慢性病用药续约 - 完整对话树
 * 难度：简单 | 续约规则主轴 | 入门
 * 药企人格：务实老练型 —— 合作8年的老伙伴，讲规矩也讲情分
 * 结构：2轮 + 社区医生来电
 */
export const case3Dialogue = {
  round1: {
    startNode: 'r1_pharma_open',

    r1_pharma_open: {
      nodeId: 'r1_pharma_open',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（微笑着推过来一份文件）立普妥在医保目录里已经服务中国患者8年了，累计开了超过30亿张处方——全国2亿多高血脂患者，很多人每天的"小蓝片"就是它。我们今天的续约报价是：维持每片5.6元不变。坦率地说，这已经是全球最低价格梯队了，我们再降的空间非常有限。',
      emotion: 'confident',
      options: [
        {
          id: 'A', type: 'pressure', label: '销量施压',
          text: '维持原价？原协议预估每年卖5000万盒，你们实际卖了2.1亿盒——是预估的4倍！卖得越多单盒成本越低，价格不该相应地降下来吗？',
          nextNode: 'r1_pressure_response',
          effects: { priceChange: -1.4 }
        },
        {
          id: 'B', type: 'empathy', label: '患者考量',
          text: '立普妥确实是好药，2亿患者每天都在用它控制血脂。但正因为用量这么大——每降1分钱，医保基金每年就能多释放几个亿的空间去覆盖更多救命药。这不是为难你们，是让这笔钱发挥最大的社会价值。',
          nextNode: 'r1_empathy_response',
          effects: { priceChange: -0.8 }
        },
        {
          id: 'C', type: 'technical', label: '规则核算',
          text: '根据最新的续约规则：当实际销量超过预估销量的3倍以上时，必须重新测算降价比例。这个规则对所有药企一视同仁——不是针对立普妥。我们的测算模型建议降至3.2元。请你们核算一下。',
          nextNode: 'r1_technical_response',
          effects: { priceChange: -1.8 }
        }
      ]
    },

    r1_pressure_response: {
      nodeId: 'r1_pressure_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（笑容收了一些，但语气仍然平稳）销量超预期恰恰说明这个药真正帮到了中国患者——这不就是医保的初衷吗？如果每次药品卖得好就要被惩罚性地砍价，那我们这些药企还有什么动力去深入基层、让更多偏远地区的患者用上好药？我觉得规则可以执行，但方式上应该有温度。第二轮我们拿一个新方案出来。',
      emotion: 'defensive',
      isEndOfRound: true
    },

    r1_empathy_response: {
      nodeId: 'r1_empathy_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（点了点头）这个视角我认同。医保基金的每一分钱都该花在刀刃上——立普妥用量大，降价确实能给更多人腾出空间。基于公平原则，我们愿意重新核算。第二轮见。',
      emotion: 'conciliatory',
      isEndOfRound: true
    },

    r1_technical_response: {
      nodeId: 'r1_technical_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（仔细看了一遍续约规则条款）3.2元非常接近我们的成本线了。但规则确实写得清楚，我们有义务配合重新测算。给我们再做一轮评估，第二轮带着调整方案回来。',
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
      text: '（与团队简单交换意见后）经过重新核算，我们愿意降至每片4.8元。但我必须坦诚相告：这已经接近我们的边际成本了。在新的8年协议期内，不能再追加降价——企业需要一个可预期、可规划的定价环境，才敢在中国市场持续投入。这是8年合作换来的信任，我不希望今天把它用光。',
      emotion: 'conciliatory',
      options: [
        {
          id: 'A', type: 'pressure', label: '对标仿制药',
          text: '4.8元还是不够。仿制药集采价格已经压到了1.5元一片。你们的定价是仿制药的3倍多——这个差距怎么向公众和审计部门解释？',
          nextNode: 'r2_pressure_response',
          effects: { priceChange: -1.7 }
        },
        {
          id: 'B', type: 'empathy', label: '珍惜合作',
          text: '8年来立普妥零质量事故，这份信任是双方一点一点建立起来的。我愿意本着这份信任，让更多中国患者以负担得起的价格继续用上这个好药。希望我们之间的合作能走得更远。',
          nextNode: 'r2_empathy_response',
          effects: { priceChange: -1.4 }
        },
        {
          id: 'C', type: 'technical', label: '阶梯定价',
          text: '我们提一个折中方案——阶梯定价：前2亿盒维持4块多，超出2亿盒的部分自动降至3.2元。这样你们的利润核心盘有保障，医保基金也不会被超额销量拖垮。两全其美。',
          nextNode: 'r2_technical_response',
          effects: { priceChange: -1.5 }
        }
      ]
    },

    r2_pressure_response: {
      nodeId: 'r2_pressure_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（面色凝重起来）仿制药1.5元是集采中标的极端价格——那种价格下厂家几乎零利润，只靠走量。但原研药有几十年几千万患者用过之后积累的安全性数据，这不是一句"成分一样"就能抹平的差距。不过——（叹了口气）我理解基金的压力。这是我们的最终报价。我们还有12个在研新药——今天的谈判结果，总部会认真审视，来判断中国市场是否值得继续投入大量资源。我希望答案是肯定的。',
      emotion: 'defensive',
      triggerEnvelope: true
    },

    r2_empathy_response: {
      nodeId: 'r2_empathy_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（微笑）8年了，信任无价。立普妥是我们在中国最自豪的产品——不只是销售数字，而是它真正守护了几亿中国人的血管健康。为了延续这份信任，我们愿意为患者再让一步。请听最终报价。',
      emotion: 'conciliatory',
      triggerEnvelope: true
    },

    r2_technical_response: {
      nodeId: 'r2_technical_response',
      speaker: 'pharma',
      speakerName: '辉瑞中国代表',
      text: '（眼睛一亮）阶梯定价——这个思路好。既保证了患者用得起的量，也给了企业一个可以预期的利润底线。三方共赢的方案。基于这个框架，我们调整最终报价。',
      emotion: 'confident',
      triggerEnvelope: true
    }
  }
}
