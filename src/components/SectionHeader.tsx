type SectionHeaderProps = {
  index: string;
  label: string;
  heading: string;
  subhead?: string;
  id?: string;
};

export function SectionHeader({ index, label, heading, subhead, id }: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="mb-3 font-mono text-xs font-medium uppercase text-heat">
        {index} / {label}
      </p>
      <h2 id={id} className="font-display text-3xl font-semibold text-ink md:text-4xl">
        {heading}
      </h2>
      {subhead ? <p className="mt-4 max-w-2xl text-lg text-graphite">{subhead}</p> : null}
    </div>
  );
}
