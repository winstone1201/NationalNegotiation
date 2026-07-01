/**
 * 谈判案例完整数据
 * 整合药品信息 + 谈判回合 + 对话树
 *
 * 注意：完整对话树将在 Step 7 中扩展。
 * 当前版本使用默认对话生成逻辑（useDialogueEngine），
 * 确保核心谈判流程端到端可运行。
 * 后续可逐步替换为手写对话脚本。
 */
import { caseDrugInfoMap, budgetDataMap } from './caseDrugInfo'
import { case1Dialogue } from './case1-rare-disease'
import { case2Dialogue } from './case2-tumor-drug'
import { case3Dialogue } from './case3-chronic-renewal'

export const negotiationCases = {
  'rare-disease-1': {
    id: 'rare-disease-1',
    name: '案例二：罕见病救命药',
    drugInfo: caseDrugInfoMap['rare-disease-1'],
    // 谈判回合
    rounds: [
      {
        roundNumber: 1,
        narrativeIntro: '谈判室的门在你身后关上了。对面是全球排名前三的跨国药企代表。你的桌上放着一份1200名SMA患儿的名单——他们患上了一种叫"脊髓性肌萎缩症"的罕见病，全身会逐渐失去力气，最终连呼吸都变得困难。全球只有6万名患者，因为患病的人太少，药企研发的动力不足，这类药在业内被叫做"孤儿药"——不是药被抛弃了，而是这些孩子被市场"遗忘"了。今天，你要帮他们发出声音。',
        pharmaOpeningQuote: 120000,
        floorPrice: 55000,
        timerSeconds: 120,
        triggerPhoneCall: false,
        dialogueTree: case1Dialogue.round1
      },
      {
        roundNumber: 2,
        narrativeIntro: '第一轮硝烟未散，你的手机在桌上震动——是一位SMA患儿的母亲打来的微信电话。按照规则，药企还有最后一次报价机会。如果报价仍然高于医保局内部测算的底价上限（大约是底价的1.15倍，相当于只给你留了15%的"商量余地"），谈判就直接宣告失败。这是双方最后的协商窗口——1200个家庭的希望，都压在这一轮了。',
        pharmaOpeningQuote: 80000,
        floorPrice: 55000,
        timerSeconds: 90,
        triggerPhoneCall: true,
        dialogueTree: case1Dialogue.round2
      }
    ],
    realResult: {
      finalPrice: 33000,
      discount: '降价72%',
      negotiatorName: '张劲妮',
      negotiatorQuote: '每一个小群体都不应该被放弃',
      year: 2021
    },
    policyTags: ['罕见病', '保基本', '价格谈判'],
    deepReads: [
      { title: '2025年国家医保目录调整工作方案', contentId: 'adjustment-plan-2025' },
      { title: '罕见病药物纳入医保的挑战与路径', contentId: 'rare-disease-path' }
    ],
    phoneCall: {
      callerName: 'SMA患儿母亲',
      callerRelation: '患儿家属',
      message: '谈判官您好……我的孩子今年3岁了，医生说如果能用上这个药，他就有可能站起来走路。我们知道药很贵，但请无论如何帮帮我们。',
      audioSrc: '/audio/mother-message.mp3'
    }
  },

  'tumor-drug-2': {
    id: 'tumor-drug-2',
    name: '案例三：肿瘤靶向药',
    drugInfo: caseDrugInfoMap['tumor-drug-2'],
    rounds: [
      {
        roundNumber: 1,
        narrativeIntro: '对面是全球肿瘤药巨头，他们的王牌产品——一种叫"免疫 checkpoint 抑制剂"的广谱抗癌药（学术名叫PD-1抑制剂），在欧美定价约15万元一个疗程。但他们也很清楚：中国有8.5万名肿瘤患者在等着这个药。一个新药从实验室到上市平均需要12年、烧掉超过15亿美元——更残酷的是，进入临床试验的100个候选药物里，最后能活着走到药店的不到12个。你既要为8.5万中国患者争一个用得起的公平价格，又不能传递出"中国市场不欢迎创新"的信号——毕竟，未来的新药研发也需要有人愿意冒险投钱。这是一场在"生命"和"商业"之间走钢丝的谈判。',
        pharmaOpeningQuote: 98000,
        floorPrice: 48000,
        timerSeconds: 120,
        triggerPhoneCall: false,
        dialogueTree: case2Dialogue.round1
      },
      {
        roundNumber: 2,
        narrativeIntro: '药企代表拿出一沓厚厚的研发成本报告，数字很震撼："这个药用了12年、烧了15亿美元才做出来。"药企希望用这些沉默成本来证明高价的合理性。但你手中有一份利器——多国参考价模型：你的团队已经把这个药在德国、日本、澳大利亚等国的实际售价全部拉出来横向对比过，再根据中国人均收入水平重新计算出了一个"在中国该卖多少钱"的合理数字。中国医保的独特优势是14亿人的市场规模——"以量换价"的底牌就在你手上。现在，用这个逻辑说服对方。',
        pharmaOpeningQuote: 72000,
        floorPrice: 48000,
        timerSeconds: 100,
        triggerPhoneCall: true,
        dialogueTree: case2Dialogue.round2
      }
    ],
    realResult: {
      finalPrice: 42000,
      discount: '降价57%',
      negotiatorName: '国家医保局谈判组',
      negotiatorQuote: '以量换价，用14亿人的市场规模换取企业合理降价空间',
      year: 2024
    },
    policyTags: ['肿瘤药', '跨国谈判', '定价机制'],
    deepReads: [
      { title: 'PD-1抑制剂全球定价机制比较', contentId: 'pd1-global-pricing' },
      { title: '药物经济学模型如何影响谈判', contentId: 'pharma-economics' }
    ],
    phoneCall: {
      callerName: '药物经济学专家组',
      callerRelation: '场外技术支持',
      message: '谈判官，我们刚完成了艾瑞卡在全球7个主要市场的定价模型交叉验证。德国4.8万、日本5.2万、澳大利亚4.5万——这是他们自己的全球定价体系。结合中国人均GDP调整，4.8万是站得住脚的底线。注意他们可能会拿印度仿制药说事，但那是自愿许可的特殊情况，不能作为参照。祝你谈判顺利。',
      audioSrc: '/audio/expert-call.mp3'
    }
  },

  'chronic-renewal-3': {
    id: 'chronic-renewal-3',
    name: '案例一：慢性病用药续约',
    drugInfo: caseDrugInfoMap['chronic-renewal-3'],
    rounds: [
      {
        roundNumber: 1,
        narrativeIntro: '这次的对手有些不同。对方不是新面孔，而是在医保目录里服务了8年的老朋友——辉瑞公司的降脂药"立普妥"。中国有2亿高血脂患者，这个药是很多人的日常必备，8年累计开了超过30亿张处方。但问题出在一个谁也没料到的数字上：当初签协议时预估每年卖5000万盒，可实际需求太大，一年卖了2.1亿盒——是预估的4倍！医保基金为此多花了一大笔钱。按照新规：药物销量严重超标后，药企必须在续约时重新谈价格。道理很简单：卖得越多，单盒成本越低——价格就该越低。但也有人说：如果药品卖得好反而要被"罚"，那以后药企还敢在中国推广好药吗？',
        pharmaOpeningQuote: 5.6,
        floorPrice: 3.2,
        timerSeconds: 100,
        triggerPhoneCall: false,
        dialogueTree: case3Dialogue.round1
      },
      {
        roundNumber: 2,
        narrativeIntro: '第一轮没有谈拢。药企坚持目前的定价"已经是全球最低了"，但摆在面前的数据没法回避——按现在的销量增速，明年医保基金的预算将出现严重缺口。这里有一个容易被忽略的细节：立普妥是"原研药"（辉瑞最早研发出来的原版），市面上还有很多过了专利期后其他药厂照着配方做的"仿制药"，价格只有原研药的几分之一。但原研药有几十年来几千万患者使用后积累的安全性数据——这不只是"药效一样不一样"的问题，而是一份沉甸甸的临床信任。你的任务不是简单地"价低者赢"，而是要在这份信任和基金可持续之间，找到一个公平的平衡点。',
        pharmaOpeningQuote: 4.8,
        floorPrice: 3.2,
        timerSeconds: 90,
        triggerPhoneCall: true,
        dialogueTree: case3Dialogue.round2
      }
    ],
    realResult: {
      finalPrice: 3.0,
      discount: '再降37%（累计降幅82%）',
      negotiatorName: '国家医保局谈判组',
      negotiatorQuote: '医保基金每一分钱都要花在刀刃上——量大就该价优',
      year: 2024
    },
    policyTags: ['续约机制', '慢性病', '规则博弈'],
    deepReads: [
      { title: '药品续约规则详解', contentId: 'renewal-rules' },
      { title: '8年独家品种转常规：新规解读', contentId: 'innovation-balance' }
    ],
    phoneCall: {
      callerName: '乡镇卫生院医生',
      callerRelation: '基层医疗机构',
      message: '谈判官您好，我是湖南一个乡镇卫生院的。我们这里很多老人家血脂高，立普妥是控制得最稳定的药。如果价格能再降一点，我们就能给更多村民开这个药了。拜托您了。',
      audioSrc: '/audio/doctor-call.mp3'
    }
  }
}

/**
 * 获取谈判案例数据
 */
export function getNegotiationCase(caseId) {
  return negotiationCases[caseId] || null
}
