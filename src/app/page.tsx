import { getProjects } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity.client';
import Desktop from '@/components/Desktop/Desktop';

export const revalidate = 3600; // ISR: revalidate at most every hour

export default async function Home() {
  const projects = await getProjects();
  const wallpaperUrl = process.env.NEXT_PUBLIC_WALLPAPER_URL;

  return (
    <>
      {/* Desktop (hidden on mobile via CSS) */}
      <Desktop projects={projects} wallpaperUrl={wallpaperUrl} />

      {/* Mobile fallback */}
      <div className="mobile-fallback">
        <h1>Portfolio</h1>
        <p>Best viewed on desktop for the full experience.</p>
        <div className="mobile-grid">
          {projects.map((p) => {
            const thumbUrl = p.thumbnail
              ? urlFor(p.thumbnail).width(400).height(300).url()
              : null;
            return (
              <a
                key={p._id}
                href={p.externalUrl ?? '#'}
                target={p.externalUrl ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="mobile-card"
              >
                {thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbUrl} alt={p.title} className="mobile-card-thumb" />
                ) : (
                  <div className="mobile-card-thumb-placeholder">
                    {p.category === 'website'
                      ? '🌐'
                      : p.category === 'branding'
                        ? '✏️'
                        : p.category === 'illustration'
                          ? '🎨'
                          : '📁'}
                  </div>
                )}
                <div className="mobile-card-body">
                  <div className="mobile-card-title">{p.title}</div>
                  <div className="mobile-card-meta">
                    {p.category}
                    {p.year ? ` · ${p.year}` : ''}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
