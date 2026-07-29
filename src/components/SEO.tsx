import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  schemaData?: object[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  url = 'https://blogs.namanoncode.me/',
  type = 'website',
  author = 'Naman Jain',
  publishedTime,
  schemaData = [],
}) => {
  const metaKeywords = keywords ? keywords.join(', ') : 'Software Engineer, Technical Blog, Distributed Systems, GPU Computing, Java';

  // Base structured data for the website
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Naman Jain | Technical Blog',
    url: 'https://blogs.namanoncode.me/',
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://blogs.namanoncode.me/',
      },
      ...(type === 'article'
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: title,
              item: url,
            },
          ]
        : []),
    ],
  };

  const allSchemas = [baseSchema, breadcrumbSchema, ...schemaData];

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Article Specific Metadata */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={author} />
      )}

      {/* JSON-LD Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(allSchemas)}
      </script>
    </Helmet>
  );
};

export default SEO;
