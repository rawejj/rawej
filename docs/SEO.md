# SEO Configuration

This document describes the SEO implementation for the multi-language doctor appointment system.

## Features

### 1. **Dynamic Metadata per Language**
Each language route (`/en`, `/de`, `/fr`, `/ku-sor`, `/ku-kur`, `/fa`) generates its own metadata including:
- Page title
- Meta description
- Keywords
- OpenGraph tags (for social media sharing)
- Twitter Card tags

### 2. **Language and Direction Attributes**
- `lang` attribute is set dynamically based on the route
- `dir` attribute is set to `rtl` for Persian and Kurdish Sorani, `ltr` for others
- Proper HTML semantics for accessibility and SEO

### 3. **Alternate Language Links**
Each page includes `<link rel="alternate" hreflang="xx">` tags pointing to all language versions:
```html
<link rel="alternate" hreflang="en" href="https://yourdomain.com/en" />
<link rel="alternate" hreflang="de" href="https://yourdomain.com/de" />
<link rel="alternate" hreflang="fr" href="https://yourdomain.com/fr" />
<link rel="alternate" hreflang="ku-sor" href="https://yourdomain.com/ku-sor" />
<link rel="alternate" hreflang="ku-kur" href="https://yourdomain.com/ku-kur" />
<link rel="alternate" hreflang="fa" href="https://yourdomain.com/fa" />
```

### 4. **Canonical URLs**
Each page has a canonical URL to prevent duplicate content issues.

### 5. **Sitemap**
Auto-generated sitemap at `/sitemap.xml` includes:
- All language routes
- Last modification dates
- Change frequency
- Priority levels

### 6. **Robots.txt**
Auto-generated robots.txt at `/robots.txt` includes:
- Allow all pages except `/api/` and `/storage/`
- Link to sitemap

## Configuration

### Environment Variables
Create a `.env.local` file with:
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

For local development:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Translation Structure

Each language file (`public/locales/{lang}.json`) includes a `meta` section:
```json
{
  "meta": {
    "title": "Page Title",
    "description": "Page description for SEO",
    "keywords": "keyword1, keyword2, keyword3"
  }
}
```

## URL Structure

- English: `https://yourdomain.com/en`
- German: `https://yourdomain.com/de`
- French: `https://yourdomain.com/fr`
- Kurdish Sorani: `https://yourdomain.com/ku-sor`
- Kurdish Kurmanji: `https://yourdomain.com/ku-kur`
- Persian: `https://yourdomain.com/fa`

## Best Practices Implemented

1. ✅ **Unique titles and descriptions** for each language
2. ✅ **Proper hreflang tags** for international SEO
3. ✅ **Canonical URLs** to prevent duplicate content
4. ✅ **OpenGraph tags** for social media
5. ✅ **Structured data** ready (can be extended)
6. ✅ **Sitemap** for search engine crawlers
7. ✅ **Robots.txt** for crawler instructions
8. ✅ **Language-specific keywords** for better local SEO

## Testing SEO

### Check Metadata
View page source and look for:
```html
<title>...</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<link rel="alternate" hreflang="..." href="..." />
<link rel="canonical" href="..." />
```

### Check Sitemap
Visit: `http://localhost:3000/sitemap.xml`

### Check Robots
Visit: `http://localhost:3000/robots.txt`

### Validation Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)

## Future Enhancements

- Add structured data (JSON-LD) for doctor profiles
- Implement breadcrumb schema
- Add organization schema
- Create language switcher that preserves the current page
- Add more meta tags for specific platforms (Pinterest, LinkedIn, etc.)
