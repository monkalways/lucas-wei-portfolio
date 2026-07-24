import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hobbies } from '@/lib/content'

// Pre-render one static page per hobby (/hobbies/tennis, /hobbies/golf, …).
export function generateStaticParams() {
  return hobbies.items.map((h) => ({ slug: h.slug }))
}

export default async function HobbyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hobby = hobbies.items.find((h) => h.slug === slug)
  if (!hobby) notFound()
  const { detail } = hobby

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Link
          href="/#hobbies"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to Centre Court
        </Link>

        <header className="mt-10">
          <span className="text-xs uppercase tracking-[0.35em] text-primary">
            Hobby
          </span>
          <h1 className="mt-3 font-serif text-6xl font-light leading-none md:text-7xl">
            {hobby.name}
          </h1>
          <p className="mt-4 font-serif text-xl italic text-foreground/80 md:text-2xl">
            {detail.tagline}
          </p>
        </header>

        <div className="mt-10 space-y-5 text-lg leading-relaxed text-foreground/85">
          {detail.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {detail.images.map((src, i) => (
            <div
              key={i}
              className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              {/* Swap these for real photos in public/hobbies/ */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${hobby.name} photo ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
