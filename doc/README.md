# Website Content Update Guide

This guide explains how to update your website’s content by manually editing two JSON files. The website supports multiple languages with separate files for English and Español.

**Language Files:**
- **English:** [locales/en.json](https://estoyonline-roan.vercel.app/locales/en.json)
- **Español:** [locales/es.json](https://estoyonline-roan.vercel.app/locales/es.json)

**Website URLs:**
- English: [https://estoyonline-roan.vercel.app/en](https://estoyonline-roan.vercel.app/en)
- Español: [https://estoyonline-roan.vercel.app/es](https://estoyonline-roan.vercel.app/es)

---

## Overview

The content on your website is managed via JSON data files that follow specific TypeScript interfaces. Updating these files manually allows you to modify texts, labels, SEO metadata, and links that appear across your website. Be sure to maintain the JSON structure and data types as defined.

---

## JSON Structure and Data Types

### Example JSON Data

Below is an example snippet illustrating the JSON structure:

```json
{
  "seo": {
    "pages": [
      {
        "route": "/",
        "datas": {
          "title": "Estoyonline | Start your spanish learning journey",
          "description": "Learn Spanish online with native teachers and let the sun warm your words."
        }
      },
      {
        "route": "/teachers",
        "datas": {
          "title": "Estoyonline | Teachers",
          "description": "Know more about our teachers."
        }
      }
      // ... additional pages
    ]
  },
  "navbar": {
    "links": {
      "Teachers": "/teachers",
      "Courses": "/courses",
      "Videos": "/videos",
      "Price": "/price",
      "Contact": "/contact"
    }
  },
  "home": {
    "HeroTitle": "The World",
    "HeroYellowTitle": "Speaks Spanish,",
    "HeroTitle2": "Will You?",
    "HeroDescription": "Learn Spanish online with native teachers and let the sun warm your words",
    "HeroButton": "Explore Courses",
    "LearnSpanishtitle": "Learn Spanish in a fun way at our boutique school.",
    "LearnSpanishdescription": "At our boutique school Estyonline.es, based in Barcelona, we teach Spanish in fun and engaging ways...",
    "LearnSpanishbutton": "Sample videos from Lesson",
    // ... other homepage content
  }
  // Other sections: teachers, videos, courses, price, contact
}
```

### Data Types and Sections

The JSON files are based on TypeScript interfaces. Key interfaces include:

- **HomeProps:** Main homepage content (hero titles, descriptions, buttons, etc.)
- **TeachersData:** Teacher profiles with names, bios, and media.
- **VideosData:** Video details (titles, descriptions, YouTube IDs).
- **CoursesData & LevelsProps:** Course details, levels, and scheduling.
- **ContactData:** Contact information for the website.
- **SeoData:** SEO metadata for different routes.
- **PriceData:** Pricing details, course tables, and course cards.

Refer to your project’s TypeScript definitions for a complete reference.

---

## How to Update the Content

### 1. Choose the Correct File
- **English:** Edit `en.json`
- **Español:** Edit `es.json`

### 2. Identify the Section to Update
Each section in the JSON corresponds to a part of the website:
- **SEO Metadata:** Modify the `seo.pages` array.
- **Navbar Links:** Update keys in the `navbar.links` object.
- **Homepage Content:** Edit values under the `home` object.
- **Teacher Profiles:** Update the `teachers` object.
- **Videos:** Modify content under the `videos` section.
- **Courses Information:** Adjust data in the `courses` section, which includes accordion data, course cards, and levels.
- **Pricing and Contact:** Update the `price` and `contact` sections.

### 3. Edit the Content
- **Preserve the Structure:** Do not remove or rename any keys.
- **Maintain Data Types:** Ensure strings remain strings, arrays remain arrays, etc.
- **Example:**  
  To update the homepage hero title, locate the `HeroTitle` key in the `home` section:
  ```json
  "home": {
    "HeroTitle": "The World",
    "HeroYellowTitle": "Speaks Spanish,",
    "HeroTitle2": "Will You?",
    ...
  }
  ```
  Update it to:
  ```json
  "home": {
    "HeroTitle": "Discover New Horizons",
    "HeroYellowTitle": "Empower Your Journey,",
    "HeroTitle2": "Are You Ready?",
    ...
  }
  ```

### 4. Save and Deploy
- **Save Changes:** Validate your JSON to ensure no syntax errors.
- **Deploy:** Commit and push your changes to redeploy your site. Verify that the updates appear at:
  - [English Site](https://estoyonline-roan.vercel.app/en)
  - [Español Site](https://estoyonline-roan.vercel.app/es)

---

## Additional Guidelines

- **Consistency:** When updating content, make changes to both language files if needed while keeping the structure identical.
- **Backup:** Always backup the current JSON files before making any changes.
- **Validation:** Use a JSON validator to check your updates.
- **Testing:** After deployment, check both language versions to ensure the content appears as expected.
- **SEO:** If modifying SEO data, ensure the new metadata aligns with your search optimization strategy.

---

## Support

For additional assistance or questions, please contact our support team or consult the development team responsible for the initial setup.

Happy updating!
