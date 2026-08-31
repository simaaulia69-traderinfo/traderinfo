type SchemaJsonLdProps = {
  data: Record<string, unknown>;
};

export function SchemaJsonLd({ data }: SchemaJsonLdProps) {
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
