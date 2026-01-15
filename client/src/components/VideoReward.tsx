import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface VideoRewardProps {
  isOpen: boolean;
  onClose: () => void;
  videoPath: string;
  title: string;
  description: string;
}

export default function VideoReward({
  isOpen,
  onClose,
  videoPath,
  title,
  description,
}: VideoRewardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* 视频弹窗 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl border-2 border-cyan-400/30 overflow-hidden">
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-cyan-400" />
              </button>

              {/* 标题区域 */}
              <div className="relative p-6 border-b border-cyan-400/20">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
                    🎉 {title}
                  </h2>
                  <p className="text-cyan-300/80 text-sm">{description}</p>
                </motion.div>
              </div>

              {/* 视频播放区域 */}
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={videoPath}
                  controls
                  className="w-full h-full"
                  onEnded={() => {
                    // 视频播放结束后可以自动关闭或显示提示
                  }}
                >
                  您的浏览器不支持视频播放。
                </video>
              </div>

              {/* 装饰元素 */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
