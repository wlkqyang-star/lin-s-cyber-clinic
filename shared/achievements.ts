import type { Achievement } from './types';

export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_patient',
    name: '初诊',
    description: '完成第一位患者的治疗',
    icon: '🏥',
    target: 1
  },
  {
    id: 'perfect_10',
    name: '完美医者',
    description: '完成10次完美治疗（满意度100%）',
    icon: '⭐',
    target: 10
  },
  {
    id: 'combo_5',
    name: '连击高手',
    description: '达成5连击',
    icon: '🔥',
    target: 5
  },
  {
    id: 'combo_10',
    name: '连击大师',
    description: '达成10连击',
    icon: '💥',
    target: 10
  },
  {
    id: 'speed_demon',
    name: '神速',
    description: '在30秒内完成一次治疗',
    icon: '⚡',
    target: 1
  },
  {
    id: 'rich_doctor',
    name: '富甲一方',
    description: '累计获得10000金币',
    icon: '💰',
    target: 10000
  },
  {
    id: 'reputation_master',
    name: '名医',
    description: '声望达到1000',
    icon: '🏆',
    target: 1000
  },
  {
    id: 'level_5',
    name: '小有名气',
    description: '达到5级',
    icon: '📈',
    target: 5
  },
  {
    id: 'level_10',
    name: '医馆名家',
    description: '达到10级',
    icon: '👑',
    target: 10
  },
  {
    id: 'serve_100',
    name: '百人医者',
    description: '治疗100位患者',
    icon: '🎯',
    target: 100
  },
  {
    id: 'diagnosis_master',
    name: '望诊专家',
    description: '在诊断台获得50次满分',
    icon: '👁️',
    target: 50
  },
  {
    id: 'pharmacy_master',
    name: '配药大师',
    description: '在药房完成100次配药',
    icon: '🧪',
    target: 100
  },
  {
    id: 'acupuncture_master',
    name: '针灸圣手',
    description: '在针灸室获得50次满分',
    icon: '💉',
    target: 50
  },
  {
    id: 'no_fail_day',
    name: '完美一天',
    description: '一天内没有失败的订单',
    icon: '✨',
    target: 1
  },
  {
    id: 'upgrade_all',
    name: '顶级诊所',
    description: '将所有设备升级到最高级',
    icon: '🏛️',
    target: 1
  }
];

export function initializeAchievements(): Achievement[] {
  return ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: false,
    progress: 0
  }));
}
