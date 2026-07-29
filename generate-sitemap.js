import fs from 'fs';
import path from 'path';

// Using relative paths to dynamically import the TypeScript data
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the raw data from TS (simplified by reading the file, or compiling first if needed)
// For simplicity in a pre-build step without ts-node, we'll read the TS file and parse the basic array.
const blogPostsPath = path.join(__dirname, 'src', 'data', 'blogPosts.ts');
const fileContent = fs.readFileSync(blogPostsPath, 'utf8');

// A simple regex to extract id and date
const idRegex = /id:\s*['"]([^'"]+)['"]/g;
const dateRegex = /date:\s*['"]([^'"]+)['"]/g;

const ids = [...fileContent.matchAll(idRegex)].map(m => m[1]);
const dates = [...fileContent.matchAll(dateRegex)].map(m => m[1]);

const baseUrl = 'https://blogs.namanoncode.me';

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

ids.forEach((id, index) => {
  const date = dates[index] || new Date().toISOString().split('T')[0];
  sitemap += `  <url>
    <loc>${baseUrl}/post/${id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

sitemap += `</urlset>`;

const publicPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, sitemap);

console.log('✅ Sitemap generated successfully at public/sitemap.xml');
