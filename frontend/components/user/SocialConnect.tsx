/**
 * SocialConnect 社群連結綁定
 *
 * 簡化版社群平台連結
 */

'use client'

import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SocialConnect({ className }: { className?: string }) {
  const socials = [
    { name: 'Discord', url: 'https://discord.gg/waterballsa', icon: '🎮' },
    { name: 'GitHub', url: 'https://github.com/waterballsa', icon: '🐙' },
  ]

  return (
    <div className={cn('space-y-3', className)}>
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg bg-background-tertiary border border-border hover:border-primary transition-colors"
        >
          <span className="text-2xl">{social.icon}</span>
          <span className="flex-1 font-medium text-text-primary">{social.name}</span>
          <ExternalLink className="w-4 h-4 text-text-muted" />
        </a>
      ))}
    </div>
  )
}
