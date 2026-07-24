'use client'

import dynamic from 'next/dynamic'

const Experience = dynamic(
  () => import('@/components/centre-court/experience').then((m) => m.Experience),
  { ssr: false },
)

export default function Page() {
  return <Experience />
}
