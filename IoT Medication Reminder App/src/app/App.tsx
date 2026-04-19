import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

type IconName =
  | 'activity'
  | 'arrow'
  | 'bell'
  | 'camera'
  | 'check'
  | 'heart'
  | 'mic'
  | 'shield'
  | 'sparkles'
  | 'timer'
  | 'users';

const reminders = [
  { name: 'Lisinopril', dose: '10mg', time: '8:00 AM', status: 'Taken', color: '#2F80ED' },
  { name: 'Metformin', dose: '500mg', time: '12:00 PM', status: 'Due now', color: '#00A86B' },
  { name: 'Atorvastatin', dose: '20mg', time: '8:00 PM', status: 'Queued', color: '#FFB020' },
];

const journey = [
  {
    icon: 'bell',
    title: 'Smart reminder',
    detail: 'Doses surface with timing, dosage, and caregiver-safe escalation windows.',
  },
  {
    icon: 'camera',
    title: 'Visual check',
    detail: 'Camera verification supports the moment when a dose needs extra confidence.',
  },
  {
    icon: 'mic',
    title: 'Voice confirmation',
    detail: 'Spoken confirmation adds a second signal without slowing the patient down.',
  },
  {
    icon: 'shield',
    title: 'Care alert',
    detail: 'Missed or risky patterns become clear, calm alerts for trusted caregivers.',
  },
] satisfies Array<{ icon: IconName; title: string; detail: string }>;

const stats = [
  ['97%', 'verification confidence'],
  ['5 day', 'adherence streak'],
  ['3 min', 'average response window'],
];

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    activity: <polyline points="3 12 7 12 10 4 14 20 17 12 21 12" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    bell: <path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9M10 21h4" />,
    camera: <path d="M4 8h4l2-3h4l2 3h4v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />,
    check: <path d="M5 13l4 4L19 7" />,
    heart:
      <path d="M20 8.5c0 5-8 10.5-8 10.5S4 13.5 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5zM9 12h2l1-3 2 6 1-3h2" />,
    mic: <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zM5 11a7 7 0 0 0 14 0M12 18v3" />,
    shield: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM12 8v5M12 17h.01" />,
    sparkles: <path d="M12 3l1.5 5L19 10l-5.5 2L12 17l-1.5-5L5 10l5.5-2zM5 4v4M3 6h4M19 16v4M17 18h4" />,
    timer: <path d="M10 2h4M12 8v5l3 2M5 5l2 2M19 5l-2 2M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16" />,
    users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

function LoadingScreen() {
  return (
    <motion.div
      className="loader-shell"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.45, duration: 0.45, ease: 'easeOut' }}
    >
        <div className="loader-card" aria-label="Loading MedCare">
        <div className="loader-orbit">
          <span />
          <span />
          <span />
        </div>
        <Icon name="heart" size={34} />
        <p>Preparing care dashboard</p>
      </div>
    </motion.div>
  );
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppPreview() {
  return (
    <motion.div
      className="phone-frame"
      initial={{ opacity: 0, y: 40, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="phone-top">
        <div>
          <span>Today</span>
          <strong>MedCare</strong>
        </div>
        <button aria-label="Notifications">
          <Icon name="bell" size={18} />
        </button>
      </div>
      <div className="progress-ring">
        <div>
          <strong>92%</strong>
          <span>adherence</span>
        </div>
      </div>
      <div className="reminder-list">
        {reminders.map((reminder) => (
          <div className="reminder-row" key={reminder.name}>
            <span className="pill-dot" style={{ backgroundColor: reminder.color }} />
            <div>
              <strong>{reminder.name}</strong>
              <span>
                {reminder.dose} at {reminder.time}
              </span>
            </div>
            <small>{reminder.status}</small>
          </div>
        ))}
      </div>
      <div className="ai-panel">
        <Icon name="sparkles" size={18} />
        <p>Evening dose risk is low after two verified check-ins.</p>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -110]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const statItems = useMemo(() => stats, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="site-shell">
      {isLoading && <LoadingScreen />}
      <motion.div className="background-grid" style={{ y: gridY }} />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="MedCare home">
          <Icon name="heart" size={24} />
          <span>MedCare</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#workflow">Workflow</a>
          <a href="#care">Care team</a>
          <a href="#dashboard">Dashboard</a>
        </nav>
        <a className="nav-action" href="#dashboard">
          <span>Open app</span>
          <Icon name="arrow" size={17} />
        </a>
      </header>

      <main id="home">
        <section className="hero-section page-grid">
          <motion.div className="hero-copy" style={{ y: heroY }}>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              IoT Medication Reminder
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              MedCare keeps every dose visible, verified, and cared for.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              A connected medication experience for patients, families, and caregivers, built
              around reminders, verification, and calm escalation.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <a className="primary-action" href="#dashboard">
                <Icon name="activity" size={19} />
                Launch dashboard
              </a>
              <a className="secondary-action" href="#workflow">
                View flow
                <Icon name="arrow" size={18} />
              </a>
            </motion.div>
          </motion.div>

          <div className="hero-visual" id="dashboard">
            <AppPreview />
          </div>
        </section>

        <section className="stats-band page-grid" aria-label="Medication adherence metrics">
          {statItems.map(([value, label], index) => (
            <Reveal className="metric" delay={index * 0.08} key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </Reveal>
          ))}
        </section>

        <section className="workflow-section page-grid" id="workflow">
          <Reveal className="section-heading">
            <span className="eyebrow">Verification Grid</span>
            <h2>A care framework that moves from reminder to response.</h2>
          </Reveal>

          <div className="workflow-grid">
            {journey.map((item, index) => {
              return (
                <Reveal className="workflow-card" delay={index * 0.08} key={item.title}>
                  <div className="icon-box">
                    <Icon name={item.icon} size={24} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="care-section page-grid" id="care">
          <Reveal className="care-copy">
            <span className="eyebrow">Care Team View</span>
            <h2>Patients get a simple rhythm. Caregivers get the signal they need.</h2>
            <p>
              The interface separates everyday dose tracking from urgent exceptions, so the web
              dashboard can stay scannable while the mobile app stays reassuring.
            </p>
          </Reveal>

          <Reveal className="care-board" delay={0.12}>
            <div className="alert-card">
              <Icon name="users" size={22} />
              <div>
                <strong>Margaret Thompson</strong>
                <span>Caregiver notified after missed noon dose.</span>
              </div>
            </div>
            <div className="timeline">
              {['Reminder sent', 'Camera checked', 'Voice confirmed', 'Risk updated'].map(
                (label, index) => (
                  <div className="timeline-item" key={label}>
                    <span>
                      <Icon name={index < 3 ? 'check' : 'timer'} size={15} />
                    </span>
                    <p>{label}</p>
                  </div>
                ),
              )}
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
