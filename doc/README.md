# Website Content Update & Development Guide

This document serves as a comprehensive guide for updating your website’s content and managing the codebase. It covers how to manually edit JSON files for website content and outlines steps for repository setup, installation (Next.js), and the Git workflow for pull requests and merging.

---

## Table of Contents

1. [Content Update Guide](#content-update-guide)
    - [Language Files & Website URLs](#language-files--website-urls)
    - [Overview](#overview)
    - [JSON Structure and Data Types](#json-structure-and-data-types)
    - [How to Update the Content](#how-to-update-the-content)
2. [Repository Setup and Installation](#repository-setup-and-installation)
3. [Git Workflow: Pull Requests and Merging](#git-workflow-pull-requests-and-merging)
4. [Additional Guidelines](#additional-guidelines)
5. [Support](#support)

---

## Content Update Guide

### Language Files & Website URLs

- **Language Files:**
  - **English:** [locales/en.json](https://estoyonline-roan.vercel.app/locales/en.json)
  - **Español:** [locales/es.json](https://estoyonline-roan.vercel.app/locales/es.json)

- **Website URLs:**
  - English: [https://estoyonline-roan.vercel.app/en](https://estoyonline-roan.vercel.app/en)
  - Español: [https://estoyonline-roan.vercel.app/es](https://estoyonline-roan.vercel.app/es)

### Overview

The website’s text, labels, SEO metadata, and links are managed via JSON data files that adhere to specific TypeScript interfaces. By updating these files manually, you can control the content displayed on your site. It’s important to maintain the JSON structure and data types as defined in the project.

### JSON Structure and Data Types

#### Example JSON Data

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
    "LearnSpanishbutton": "Sample videos from Lesson"
    // ... other homepage content
  }
  // Other sections: teachers, videos, courses, price, contact
}
```

#### Key Data Types

The JSON files follow the TypeScript interfaces defined in the project. Notable interfaces include:

- **HomeProps:** Contains homepage content (hero titles, descriptions, buttons, etc.).
- **TeachersData:** Holds teacher profiles (names, bios, and media).
- **VideosData:** Details video information (titles, descriptions, YouTube IDs).
- **CoursesData & LevelsProps:** Manages course details, levels, and scheduling.
- **ContactData:** Contains contact information.
- **SeoData:** Stores SEO metadata for various routes.
- **PriceData:** Covers pricing details, course tables, and cards.

Refer to your project’s TypeScript definitions for a complete reference.

### How to Update the Content

1. **Choose the Correct File:**
   - **English:** Edit `en.json`
   - **Español:** Edit `es.json`

2. **Identify the Section to Update:**
   - **SEO Metadata:** Modify the `seo.pages` array.
   - **Navbar Links:** Update keys in the `navbar.links` object.
   - **Homepage Content:** Edit values under the `home` object.
   - **Teacher Profiles:** Update the `teachers` object.
   - **Videos:** Modify content under the `videos` section.
   - **Courses Information:** Adjust data in the `courses` section (accordion data, course cards, levels).
   - **Pricing and Contact:** Update the `price` and `contact` sections.

3. **Edit the Content:**
   - **Preserve the Structure:** Do not remove or rename any keys.
   - **Maintain Data Types:** Strings remain strings; arrays remain arrays.
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

4. **Save and Deploy:**
   - **Validate:** Use a JSON validator to check for syntax errors.
   - **Deploy:** Commit and push your changes. The updates will be visible at:
     - [English Site](https://estoyonline-roan.vercel.app/en)
     - [Español Site](https://estoyonline-roan.vercel.app/es)

---

## Repository Setup and Installation

### 1. Clone the Repository

Open your terminal and run:
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install Dependencies

Assuming you are using Next.js, install the required packages with:
```bash
npm install
# or
yarn install
```

### 3. Run the Development Server

Start the Next.js development server:
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser to see your site running locally.

---

## Git Workflow: Pull Requests and Merging

### 1. Create a New Branch

Before making any changes, create a new branch:
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Edit the JSON files or other project files as needed. Remember to follow the guidelines in this document.

### 3. Commit Your Changes

Stage and commit your changes with a meaningful message:
```bash
git add .
git commit -m "Update website content: [brief description of changes]"
```

### 4. Push Your Branch

Push your branch to the remote repository:
```bash
git push origin feature/your-feature-name
```

### 5. Open a Pull Request (PR)

- Go to your repository on GitHub.
- Click on **"Compare & pull request"** for your branch.
- Provide a clear description of your changes.
- Submit the PR for review.

### 6. Merge the Pull Request

Once your PR is reviewed and approved:
- **Merge:** Use GitHub’s merge button to combine your changes into the main branch.
- **Pull:** Update your local main branch with:
  ```bash
  git checkout main
  git pull origin main
  ```

---

## Additional Guidelines

- **Consistency:** Ensure changes in one language file are reflected in the other if applicable.
- **Backup:** Backup current JSON files before making significant changes.
- **Validation:** Always use a JSON validator to avoid syntax errors.
- **Testing:** Verify changes on both [English](https://estoyonline-roan.vercel.app/en) and [Español](https://estoyonline-roan.vercel.app/es) versions after deployment.
- **SEO:** Update SEO metadata carefully to align with your search optimization strategy.

---

## Support

For further assistance or questions, please contact our support team or consult the development team responsible for the initial setup.

Happy updating and happy coding!
