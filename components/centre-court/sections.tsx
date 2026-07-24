'use client'

import { motion } from 'framer-motion'
import {
  MessagesSquare,
  Code2,
  Rocket,
  Trophy,
  Mail,
  ExternalLink,
  MapPin,
  ArrowDown,
} from 'lucide-react'
import {
  hero,
  about,
  hobbies,
  traveling,
  projects,
  skills,
  contact,
} from '@/lib/content'

const projectIcons = {
  debate: MessagesSquare,
  startup: Rocket,
  code: Code2,
  leadership: Trophy,
} as const

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

function SectionShell({
  id,
  children,
  align = 'center',
}: {
  id: string
  children: React.ReactNode
  align?: 'center' | 'start' | 'end'
}) {
  const justify =
    align === 'start'
      ? 'md:justify-start'
      : align === 'end'
        ? 'md:justify-end'
        : 'justify-center'
  return (
    <section
      id={id}
      className={`relative flex min-h-screen w-full items-center justify-center ${justify} px-6 py-24 md:px-16`}
    >
      {children}
    </section>
  )
}

function Glass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#0b1620]/40 p-8 shadow-2xl backdrop-blur-md md:p-12 ${className}`}
    >
      {children}
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.35em] text-primary">
      {children}
    </span>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-5xl font-light leading-tight text-balance text-foreground md:text-7xl">
      {children}
    </h2>
  )
}

/* -------------------------------- HERO --------------------------------- */
export function HeroSection() {
  return (
    <SectionShell id="hero">
      <div className="pointer-events-none flex w-full flex-col items-center justify-end">
        {/* The name itself is rendered in 3D behind this. */}
        <div className="mt-[46vh] flex flex-col items-center gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="font-serif text-2xl italic tracking-wide text-foreground/90 md:text-3xl"
          >
            {hero.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-[0.3em]">Scroll to walk in</span>
            <ArrowDown className="h-5 w-5 animate-bounce text-primary" />
          </motion.div>
        </div>
      </div>
    </SectionShell>
  )
}

/* ------------------------------- ABOUT --------------------------------- */
export function AboutSection() {
  return (
    <SectionShell id="about" align="start">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-xl"
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>Game 1 — 40</Eyebrow>
        </motion.div>
        <motion.div variants={fadeUp} custom={1}>
          <Title>{about.title}</Title>
        </motion.div>
        <motion.div variants={fadeUp} custom={2}>
          <Glass className="mt-8">
            <p className="font-serif text-xl leading-relaxed text-foreground/90 md:text-2xl">
              {about.body}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {about.facts.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Glass>
        </motion.div>
      </motion.div>
    </SectionShell>
  )
}

/* ------------------------------ HOBBIES -------------------------------- */
export function HobbiesSection() {
  return (
    <SectionShell id="hobbies" align="end">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-2xl"
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>Between the points</Eyebrow>
        </motion.div>
        <motion.div variants={fadeUp} custom={1}>
          <Title>{hobbies.title}</Title>
        </motion.div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {hobbies.items.map((h, i) => (
            <motion.div key={h.name} variants={fadeUp} custom={i + 2}>
              <Glass className="h-full p-6 md:p-6">
                <h3 className="font-serif text-2xl text-foreground">{h.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {h.blurb}
                </p>
              </Glass>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionShell>
  )
}

/* ----------------------------- TRAVELING ------------------------------- */
export function TravelingSection() {
  return (
    <SectionShell id="traveling" align="start">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-2xl"
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>Away matches</Eyebrow>
        </motion.div>
        <motion.div variants={fadeUp} custom={1}>
          <Title>{traveling.title}</Title>
        </motion.div>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 font-serif text-xl italic text-foreground/80"
        >
          {traveling.intro}
        </motion.p>
        <div className="mt-8 space-y-3">
          {traveling.destinations.map((d, i) => (
            <motion.div key={d.place} variants={fadeUp} custom={i + 3}>
              <Glass className="flex items-center gap-4 p-5 md:p-5">
                <MapPin className="h-5 w-5 flex-none text-primary" />
                <div>
                  <h3 className="font-serif text-xl text-foreground">{d.place}</h3>
                  <p className="text-sm text-muted-foreground">{d.note}</p>
                </div>
              </Glass>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionShell>
  )
}

/* ------------------------------ PROJECTS ------------------------------- */
export function ProjectsSection() {
  return (
    <SectionShell id="projects">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-4xl"
      >
        <motion.div variants={fadeUp} className="text-center">
          <Eyebrow>Game 2 — 30</Eyebrow>
        </motion.div>
        <motion.div variants={fadeUp} custom={1} className="text-center">
          <Title>{projects.title}</Title>
        </motion.div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {projects.items.map((p, i) => {
            const Icon = projectIcons[p.icon as keyof typeof projectIcons] ?? Code2
            return (
              <motion.div
                key={p.name}
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Glass className="h-full p-7 md:p-7">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-3xl text-foreground">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </p>
                </Glass>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </SectionShell>
  )
}

/* ------------------------------- SKILLS -------------------------------- */
export function SkillsSection() {
  return (
    <SectionShell id="skills" align="end">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-md text-right"
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>In the racquet bag</Eyebrow>
        </motion.div>
        <motion.div variants={fadeUp} custom={1}>
          <Title>{skills.title}</Title>
        </motion.div>
        <motion.div variants={fadeUp} custom={2}>
          <Glass className="mt-8">
            <p className="font-serif text-lg italic text-foreground/80">
              Each skill orbits the court behind you — no boring progress bars.
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {skills.items.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </Glass>
        </motion.div>
      </motion.div>
    </SectionShell>
  )
}

/* ------------------------------ CONTACT -------------------------------- */
export function ContactSection() {
  return (
    <SectionShell id="contact">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="w-full max-w-lg text-center"
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>Game 3 — 15</Eyebrow>
        </motion.div>
        <motion.div variants={fadeUp} custom={1}>
          <Title>{contact.title}</Title>
        </motion.div>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 font-serif text-xl italic text-foreground/80"
        >
          {contact.subtitle}
        </motion.p>
        <motion.a
          variants={fadeUp}
          custom={3}
          href={`mailto:${contact.email}`}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground transition-transform hover:scale-105"
        >
          <Mail className="h-5 w-5" />
          {contact.email}
        </motion.a>
        <motion.div
          variants={fadeUp}
          custom={4}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {contact.socials
            .filter((s) => s.label !== 'Email')
            .map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {s.label}
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
        </motion.div>
        <p className="mt-16 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Press T to serve · Lucas Wei
        </p>
      </motion.div>
    </SectionShell>
  )
}
