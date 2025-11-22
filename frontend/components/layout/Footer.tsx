/**
 * Footer 頁腳元件
 *
 * 符合目標網站設計：https://world.waterballsa.tw/
 */

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Share2 } from 'lucide-react'

// 社群連結 - 完全符合目標網站
const socialLinks = [
  {
    icon: '/world/social/line.svg',
    href: 'https://waterballs.tw/line-footer',
    label: 'Line'
  },
  {
    icon: '/world/social/facebook.svg',
    href: 'https://waterballs.tw/fb-wfooter',
    label: 'Facebook'
  },
  {
    icon: '/world/social/discord.svg',
    href: 'https://waterballs.tw/ig-wfooter',
    label: 'Discord'
  },
  {
    icon: '/world/social/youtube.svg',
    href: 'https://waterballs.tw/yt-wfooter',
    label: 'Youtube'
  },
  {
    icon: '/world/social/card.svg',
    href: 'https://waterballs.tw/lg-wfooter',
    label: '社群卡片'
  },
]

// 法律連結
const legalLinks = [
  { label: '隱私權政策', href: '/terms/privacy' },
  { label: '服務條款', href: '/terms/service' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1A1D2E] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 主要內容 */}
        <div className="flex flex-col items-center space-y-6">
          {/* 社群連結 - 橫向排列 */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>{social.label}</span>
              </a>
            ))}
          </div>

          {/* 法律連結 + 客服信箱 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <a
              href="mailto:support@waterballsa.tw"
              className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>客服信箱: support@waterballsa.tw</span>
            </a>
          </div>

          {/* Logo */}
          <div className="py-4">
            <Link href="/">
              <Image
                src="/world/logo.png"
                alt="水球軟體學院"
                width={200}
                height={54}
                className="object-contain"
              />
            </Link>
          </div>

          {/* 版權資訊 */}
          <p className="text-sm text-gray-500">
            © {currentYear} 水球球特務有限公司
          </p>
        </div>
      </div>
    </footer>
  )
}
