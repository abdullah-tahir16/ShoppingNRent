export function SectionCard({ eyebrow, title, description, aside, children }) {
  return (
    <section className="panel panel-padding">
      <div className="flex flex-col gap-4 border-b border-stone-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-stone-950">{title}</h2>
          {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">{description}</p> : null}
        </div>
        {aside ? <div className="max-w-sm text-sm leading-6 text-stone-500">{aside}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
