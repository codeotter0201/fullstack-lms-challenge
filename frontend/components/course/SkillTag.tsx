/**
 * SkillTag 技能標籤元件
 *
 * 用於顯示課程技能標籤
 */

import { cn } from '@/lib/utils'
import { Skill } from '@/types/journey'
import { Tag } from 'lucide-react'

interface SkillTagProps {
  skill: Skill
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'outline'
  showIcon?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
  outline: 'border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-700',
}

export default function SkillTag({
  skill,
  size = 'md',
  variant = 'primary',
  showIcon = true,
  className,
}: SkillTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-full font-medium',
        'transition-colors duration-200',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      title={skill.description}
    >
      {showIcon && <Tag className="w-3 h-3" />}
      <span>{skill.name}</span>
    </span>
  )
}

/**
 * SkillTagList 技能標籤列表
 */
interface SkillTagListProps {
  skills: Skill[]
  maxVisible?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'outline'
  className?: string
}

export function SkillTagList({
  skills,
  maxVisible = 5,
  size = 'md',
  variant = 'primary',
  className,
}: SkillTagListProps) {
  const visibleSkills = skills.slice(0, maxVisible)
  const remainingCount = skills.length - maxVisible

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {visibleSkills.map((skill) => (
        <SkillTag
          key={skill.id}
          skill={skill}
          size={size}
          variant={variant}
        />
      ))}

      {remainingCount > 0 && (
        <span
          className={cn(
            'inline-flex items-center',
            'text-gray-500 font-medium',
            sizeStyles[size]
          )}
        >
          +{remainingCount} 更多
        </span>
      )}
    </div>
  )
}
