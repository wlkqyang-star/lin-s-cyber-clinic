import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2, Users, Stethoscope, Pill, Activity, Trophy } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Instructions() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      icon: Gamepad2,
      title: '游戏目标',
      color: '#b026ff',
      content: '经营一家赛博朋克风格的中医诊所，为患者诊断治疗各种赛博病症，赚取金币和声望，升级诊所设备，解锁更多病症和治疗方法。'
    },
    {
      icon: Users,
      title: '接诊台',
      color: '#00ff00',
      content: '患者会自动排队等待，点击"接诊患者"按钮接待他们。每个患者都有耐心值，耐心值归零前必须完成治疗，否则患者会离开并扣除声望。'
    },
    {
      icon: Stethoscope,
      title: '诊断台 - 望诊小游戏',
      color: '#b026ff',
      content: '选择患者开始望诊，在15秒内点击患者身上的所有异常症状点。找到的症状越多，诊断评分越高，获得的金币奖励也越多。'
    },
    {
      icon: Pill,
      title: '药房 - 配药小游戏',
      color: '#ff461f',
      content: '根据右侧药方提示，点击对应的药柜抽屉选择药材。每个药方需要3种药材，选对所有药材即可完成配药。药柜共有15个抽屉，记住药材位置可以提高效率。'
    },
    {
      icon: Activity,
      title: '针灸室 - 精准点击',
      color: '#00ff00',
      content: '根据病症选择正确的穴位进行针灸治疗。点击对应的穴位按钮，精准度越高，治疗效果越好。每个病症需要治疗3个穴位。'
    },
    {
      icon: Trophy,
      title: '升级系统',
      color: '#b026ff',
      content: '完成治疗获得经验值和金币。升级后解锁新病症，可使用金币升级诊所设备：提升诊断速度、增加药房槽位、提高患者耐心值、增加金币倍率。'
    }
  ];

  const tips = [
    '合理安排工作站切换顺序，避免患者等待时间过长',
    '优先处理耐心值较低的患者，防止失败',
    '记住常见病症的药方和穴位，提高治疗速度',
    '升级"耐心值提升"可以给你更多时间处理患者',
    '完美治疗（所有小游戏高分）可获得额外奖励和连击',
    '查看成就系统了解更多挑战目标'
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col items-center p-8 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mb-8"
      >
        <Button
          onClick={() => setLocation('/')}
          variant="outline"
          className="font-pixel border-[#b026ff]/40 text-[#b026ff] hover:bg-[#b026ff]/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回主菜单
        </Button>

        <h1 className="font-calligraphy text-6xl text-[#ff461f] neon-glow text-center mb-4">
          游戏说明
        </h1>
        <p className="font-pixel text-lg text-[#e6dcc3] text-center">
          CYBER_TCM_CLINIC_v4.0 操作手册
        </p>
      </motion.div>

      {/* Game Sections */}
      <div className="w-full max-w-4xl space-y-6 mb-8">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/60 border-2 rounded-lg p-6"
              style={{ borderColor: `${section.color}40` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${section.color}20`, border: `2px solid ${section.color}` }}
                >
                  <Icon className="w-6 h-6" style={{ color: section.color }} />
                </div>
                <h2 
                  className="font-calligraphy text-3xl"
                  style={{ color: section.color }}
                >
                  {section.title}
                </h2>
              </div>
              <p className="font-pixel text-base text-[#e6dcc3] leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-4xl bg-black/60 border-2 border-[#00ff00]/40 rounded-lg p-6 mb-8"
      >
        <h2 className="font-calligraphy text-3xl text-[#00ff00] mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span> 游戏技巧
        </h2>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="font-pixel text-sm text-[#e6dcc3] flex items-start gap-3"
            >
              <span className="text-[#00ff00] mt-1">▸</span>
              <span>{tip}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-4xl bg-black/60 border-2 border-[#ff461f]/40 rounded-lg p-6 mb-8"
      >
        <h2 className="font-calligraphy text-3xl text-[#ff461f] mb-4">
          操作说明
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="font-pixel text-sm text-[#e6dcc3]">
            <span className="text-[#b026ff]">鼠标左键：</span> 点击按钮和交互元素
          </div>
          <div className="font-pixel text-sm text-[#e6dcc3]">
            <span className="text-[#b026ff]">底部导航栏：</span> 切换工作站
          </div>
          <div className="font-pixel text-sm text-[#e6dcc3]">
            <span className="text-[#b026ff]">暂停按钮：</span> 暂停游戏查看统计
          </div>
          <div className="font-pixel text-sm text-[#e6dcc3]">
            <span className="text-[#b026ff]">升级按钮：</span> 使用金币升级设备
          </div>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Button
          onClick={() => setLocation('/')}
          className="font-pixel text-xl px-12 py-6 bg-gradient-to-r from-[#b026ff] to-[#ff461f] hover:from-[#9020dd] hover:to-[#dd3a1a] text-white"
        >
          开始游戏
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="font-pixel text-xs text-[#b026ff]/40 mt-8"
      >
        © 2077 LIN'S CLINIC. ALL RIGHTS RESERVED.
      </motion.p>
    </div>
  );
}
