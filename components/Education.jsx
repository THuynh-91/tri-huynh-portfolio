import { useRouter } from 'next/router';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Education() {
  const router = useRouter();
  const basePath = router.basePath || '';
  const coursework = [
    'Algorithms & Data Structures',
    'Artificial Intelligence',
    'Data Science',
    'Theory of Computation',
    'Object-Oriented Design',
    'Discrete Mathematics',
    'Computer Systems',
    'Computer Organization & Architecture',
  ];

  return (
    <section id="education" className="section-padding">
      <div className="mx-auto max-w-wide">
        <SectionHeader index="05" eyebrow="education" title="Where I'm" accent="learning." />

        <Reveal className="mt-12 rounded-2xl border border-line bg-surface p-8 md:p-10">
          <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-start md:justify-between">
            <div>
              <img
                src={`${basePath}/images/northeastern.svg`}
                alt="Northeastern University"
                className="h-7 w-auto"
              />
              <p className="mt-4 text-accent">Khoury College of Computer Sciences</p>
              <p className="text-fg">B.S. in Computer Science</p>
              <p className="text-muted">Concentration in Artificial Intelligence</p>
            </div>
            <div className="font-mono text-sm md:text-right">
              <p className="text-fg">Boston, MA</p>
              <p className="text-accent">expected · April 2027</p>
            </div>
          </div>

          <div className="pt-8">
            <p className="eyebrow mb-5">relevant coursework</p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {coursework.map((course, index) => (
                <Reveal
                  key={course}
                  delay={index * 0.04}
                  className="flex items-center gap-3 border-b border-line/60 pb-2"
                >
                  <span className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-fg/90">{course}</span>
                </Reveal>
              ))}
            </div>
          </div>

        </Reveal>
      </div>
    </section>
  );
}
