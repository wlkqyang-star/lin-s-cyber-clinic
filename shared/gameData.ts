import type { Diagnosis } from './types';

export const DIAGNOSES: Diagnosis[] = [
  {
    id: 'D001',
    name: '视网膜过载症',
    symptoms: ['全息短视频刷太多', '眼神涣散', '降维打击感'],
    prescription: {
      herbs: ['睛明穴药膏', '黑屏凝视法'],
      acupuncturePoints: ['睛明穴']
    }
  },
  {
    id: 'D002',
    name: '幻肢焦虑',
    symptoms: ['离开手机即灵魂剥离', '手掌滑动动作', 'WiFi信号依赖'],
    prescription: {
      herbs: ['断网茶', '磁石手串'],
      acupuncturePoints: ['劳宫穴']
    }
  },
  {
    id: 'D003',
    name: '数据淤血',
    symptoms: ['脑机接口过热', '思维卡顿', '传输速度慢'],
    prescription: {
      herbs: ['归脾汤', '液氮冷凝剂'],
      acupuncturePoints: ['百会穴']
    }
  },
  {
    id: 'D004',
    name: '量子脱发',
    symptoms: ['发际线叠加态', '观测时后移', '薛定谔困扰'],
    prescription: {
      herbs: ['生姜擦剂', '量子纠缠剂'],
      acupuncturePoints: ['百会穴', '风池穴']
    }
  },
  {
    id: 'D005',
    name: '带宽虚火',
    symptoms: ['语速极快', '信息量低', '5G症候群'],
    prescription: {
      herbs: ['菊花茶', '闭口禅丸'],
      acupuncturePoints: ['内关穴']
    }
  },
  {
    id: 'D006',
    name: '算法心悸',
    symptoms: ['大数据杀熟', '心率异常', '推荐算法同步'],
    prescription: {
      herbs: ['乱序浏览方', '心率重置剂'],
      acupuncturePoints: ['内关穴', '神门穴']
    }
  },
  {
    id: 'D007',
    name: '云端湿气',
    symptoms: ['记忆混乱', '头重如裹', '云盘同步错误'],
    prescription: {
      herbs: ['艾灸包', '手写日记本'],
      acupuncturePoints: ['足三里穴']
    }
  },
  {
    id: 'D008',
    name: '防火墙惊悸',
    symptoms: ['陌生来电恐惧', 'DDoS幻觉', '应激反应'],
    prescription: {
      herbs: ['安神补脑液', 'TCP连接方'],
      acupuncturePoints: ['神门穴']
    }
  },
  {
    id: 'D009',
    name: '二进制干眼',
    symptoms: ['眼泪枯竭', '机械快门声', '矩阵视觉'],
    prescription: {
      herbs: ['蒸汽眼罩', '枸杞菊花茶'],
      acupuncturePoints: ['睛明穴', '太阳穴']
    }
  },
  {
    id: 'D010',
    name: '表情包面瘫',
    symptoms: ['现实面瘫', '网络疯狂', '肌肉萎缩'],
    prescription: {
      herbs: ['面部训练方', '纯文字疗法'],
      acupuncturePoints: ['太阳穴', '颊车穴']
    }
  }
];

export const PATIENT_NAMES = [
  '赛博小王', '数据李姐', '算法张哥', '云端小刘',
  '量子陈总', '区块链老赵', '元宇宙小周', '代码小吴',
  '像素小郑', '网络小孙', '虚拟小钱', '全息小朱'
];

export const HERBS = [
  '量子枸杞', '纳米当归', '区块链人参', '云端灵芝',
  '5G黄芪', '赛博甘草', '全息何首乌', '神经网络川芎',
  '加密白芍', '算法茯苓', '数据流党参', '像素决明子',
  '代码生姜', '防火墙柴胡', '带宽菊花'
];

export const ACUPOINTS = [
  { id: 'P001', name: '百会穴', position: { x: 50, y: 10 } },
  { id: 'P002', name: '睛明穴', position: { x: 45, y: 20 } },
  { id: 'P003', name: '太阳穴', position: { x: 40, y: 22 } },
  { id: 'P004', name: '风池穴', position: { x: 48, y: 18 } },
  { id: 'P005', name: '劳宫穴', position: { x: 30, y: 60 } },
  { id: 'P006', name: '内关穴', position: { x: 35, y: 55 } },
  { id: 'P007', name: '足三里穴', position: { x: 48, y: 75 } },
  { id: 'P008', name: '三阴交穴', position: { x: 50, y: 85 } },
  { id: 'P009', name: '涌泉穴', position: { x: 50, y: 95 } },
  { id: 'P010', name: '神门穴', position: { x: 32, y: 58 } }
];

export const GAME_CONFIG = {
  INITIAL_COINS: 500,
  INITIAL_REPUTATION: 0,
  PATIENCE_DECAY_RATE: 0.5, // per second
  MAX_PATIENTS_PER_LEVEL: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
  PATIENT_SPAWN_INTERVAL: [30000, 25000, 20000, 18000, 15000, 12000, 10000, 8000, 6000, 5000], // ms
  DIAGNOSIS_TIME_LIMIT: [15, 15, 12, 12, 10, 10, 8, 8, 6, 6], // seconds
  PERFECT_SCORE_BONUS: 100,
  GOOD_SCORE_BONUS: 50,
  FAIL_PENALTY: -50
};
