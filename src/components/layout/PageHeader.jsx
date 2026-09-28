import Breadcrumbs from "../ui/Breadcrumbs";

// `breadcrumbs` ([{ label, to? }], last = current page) replaces the eyebrow
// label — the trail already says where the visitor is.
const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  as: Tag = "h1",
}) => {
  const hasBreadcrumbs = breadcrumbs?.length > 0;
  return (
    <div className="mb-10 flex max-w-3xl flex-col items-start gap-4 text-left sm:mb-12">
      {hasBreadcrumbs ? (
        <Breadcrumbs items={breadcrumbs} className="mb-1" />
      ) : (
        eyebrow && (
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/40">
            {eyebrow}
          </span>
        )
      )}
      <Tag className="font-display text-[clamp(2rem,4vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-black text-pretty">
        {title}
      </Tag>
      {subtitle && (
        <p className="max-w-2xl text-sm leading-relaxed text-black/50 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
