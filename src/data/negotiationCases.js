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
        narrativeIntro: '谈判室的门在你身后关上了。对面是全球排名前三的跨国药企代表，他们带着一份不菲的报价单。你的桌上则放着1200名SMA患儿的名单——这种罕见病全球仅6万患者，药物研发成本极高，因此有个沉重的别名："孤儿药"。',
        pharmaOpeningQuote: 120000,
        floorPrice: 55000,
        timerSeconds: 120,
        triggerPhoneCall: false,
        dialogueTree: case1Dialogue.round1
      },
      {
        roundNumber: 2,
        narrativeIntro: '第一轮硝烟未散。此时你的手机震动了一下——是一位SMA患儿的母亲。按照规则，药企还有最后一次报价机会，若仍超出底价的1.15倍，谈判即告终止。这是双方最后的协商窗口。',
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
      message: '谈判官您好……我的孩子今年3岁了，医生说如果能用上这个药，他就有可能站起来走路。我们知道药很贵……但请无论如何帮帮我们。'
    }
  },

  'tumor-drug-2': {
    id: 'tumor-drug-2',
    name: '案例三：肿瘤靶向药',
    drugInfo: caseDrugInfoMap['tumor-drug-2'],
    rounds: [
      {
        roundNumber: 1,
        narrativeIntro: '对面是全球肿瘤药巨头。他们的PD-1抑制剂在欧美定价约15万元/疗程。但他们也清楚——中国有85000名患者等着这个药。一款新药从实验室到上市平均需要12年、耗资超15亿美元，而最终能进入市场的候选分子不足12%。你既要为患者争一个用得起的价格，又不能传递"中国市场不欢迎创新"的信号。',
        pharmaOpeningQuote: 98000,
        floorPrice: 48000,
        timerSeconds: 120,
        triggerPhoneCall: false,
        dialogueTree: case2Dialogue.round1
      },
      {
        roundNumber: 2,
        narrativeIntro: '药企代表拿出厚厚一沓研发成本报告。"这个药经历了12年研发，投入超15亿美元。"——药企希望定价覆盖沉默成本。但你手中的多国参考价模型指向另一个数字。中国医保的独特优势是"以量换价"——14亿人的市场规模足以摊薄单支成本，现在就用这个逻辑说服对方。',
        pharmaOpeningQuote: 72000,
        floorPrice: 48000,
        timerSeconds: 100,
        triggerPhoneCall: false,
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
    phoneCall: null  // 案例二没有来电特效
  },

  'chronic-renewal-3': {
    id: 'chronic-renewal-3',
    name: '案例一：慢性病用药续约',
    drugInfo: caseDrugInfoMap['chronic-renewal-3'],
    rounds: [
      {
        roundNumber: 1,
        narrativeIntro: '这次的对手有些不同。对方不是"新进入者"，而是在医保目录中服务了8年的老面孔。然而问题出在销量——预估5000万盒，实际2.1亿盒，基金支出超预算120%。新规明确：超额销量200%以上须启动降价重算。"以量换价"的逻辑很简单——卖得越多越该降价。但另一面是：如果卖得好就成了"惩罚"的理由，药企何必费力推广？',
        pharmaOpeningQuote: 5.6,
        floorPrice: 3.2,
        timerSeconds: 100,
        triggerPhoneCall: false,
        dialogueTree: case3Dialogue.round1
      },
      {
        roundNumber: 2,
        narrativeIntro: '第一轮没有谈拢。药企坚持"价格已经全球最低"，但基金数据不会撒谎——按现在的销量增速，明年预算将出现严重缺口。值得注意的是，原研药与仿制药并不等价：前者积累了数十年的真实世界安全性数据，简单比价并不可取。你要的是一个与销量匹配的价格，而非"价低者赢"。',
        pharmaOpeningQuote: 4.8,
        floorPrice: 3.2,
        timerSeconds: 90,
        triggerPhoneCall: false,
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
    phoneCall: null
  }
}

/**
 * 获取谈判案例数据
 */
export function getNegotiationCase(caseId) {
  return negotiationCases[caseId] || null
}
