/**
 * A drop-in art slot: renders the image if the asset file exists, disappears
 * silently if it doesn't (404s under /assets/ are expected by design — same
 * contract as character art). Dropping files in upgrades the UI, zero code.
 */
interface Props {
  src: string;
  className?: string;
  alt?: string;
}

export function Art({ src, className, alt = '' }: Props) {
  const resolvedSrc =
    src.startsWith('/') && import.meta.env.BASE_URL !== '/'
      ? `${import.meta.env.BASE_URL}${src.slice(1)}`
      : src;

  return (
    <img
      src={resolvedSrc}
      className={className}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
