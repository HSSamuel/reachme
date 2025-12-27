import { Helmet } from "react-helmet-async";

export function SEO({ title, description, image, url }) {
  const siteTitle = "ReachMe";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDesc = "One link for all your content.";
  const metaDesc = description || defaultDesc;
  // Fallback to logo only if no specific image is provided
  const metaImage = image || "https://reachme.netlify.app/logo.png";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}
