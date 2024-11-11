# Nursing Project

## Getting Started

<img src="https://img.shields.io/badge/version-v1.0.0-orange"/>
<img src="https://img.shields.io/badge/language-Typescript-blue"/>
<img src="https://img.shields.io/badge/framework-Next.js-%2306bcee"/>
<img src="https://img.shields.io/badge/state%20management-Jotai%2C%20React%20Query-red"/>
<img src="https://img.shields.io/badge/css-TailwindCSS-%2338b2ac"/>

### Cloning the GitHub Repository

```sh
$ git clone [repository URL]
```

### Installation

```sh
$ yarn
$ yarn dev
```

---

### Project Structure

```bash
├── README.md                # Project documentation
│
├── src/                     # Source code folder
│   │
│   ├── api/                 # API request and service logic
│   │
│   ├── app/                 # Core application and routing components
│   │   ├── layout/          # Common layout components (headers, footers, etc.)
│   │   ├── pages/           # Page components for each route
│   │
│   ├── components/          # Common reusable components, organized by feature
│   │
│   ├── constants/           # Project-wide constants
│   │
│   ├── fonts/               # Fonts and typography-related assets
│   │
│   ├── hooks/               # Custom hooks for various features and queries
│   │
│   ├── lib/                 # External libraries and shared utilities
│   │
│   ├── store/               # Global state management (Jotai atoms, etc.)
│   │
│   ├── styles/              # Project styling, including Tailwind configuration
│   │
│   ├── types/               # TypeScript types and interfaces
│   │
│   └── utils/               # Utility functions
│
└── .env                     # Environment variables for configuration
```

### 📁 Folder Details

- **src/api**: Contains API request functions and services for managing data flow.
- **src/app**: Main application files including layout and routing components.
  - **layout**: Common layout components used across pages (e.g., headers, footers).
  - **pages**: Each route page component for the app.
- **src/components**: Organizes reusable components, with folders structured in PascalCase and grouped by functionality. Sub-components related to a main component are stored within their corresponding component folder.
- **src/constants**: Centralizes project-wide constants for easy maintenance and reusability.
- **src/fonts**: Manages font files and typography assets.
- **src/hooks**: Contains custom hooks for modular functionality. Queries are stored separately to organize network requests.
- **src/lib**: Stores shared libraries and common configurations, such as Firebase and React Query providers.
- **src/store**: Manages global state definitions with Jotai, organized by feature.
- **src/styles**: Contains global and component-specific styles, with Tailwind CSS configuration.
- **src/types**: Defines types and interfaces for TypeScript, including API request/response types.
- **src/utils**: Utility functions that are shared across components or features.

---

### Naming Conventions

- **Variables, functions, and filenames** should follow consistent naming standards.
- **TypeScript types and interfaces** should be organized based on their purpose and scope.

For guidelines, refer to:

- [Naming Cheatsheet](https://github.com/kettanaito/naming-cheatsheet)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

---

### Open Source (Third-Party Library) Checklist

- **Purpose**: Ensure libraries enhance productivity, improve structure, or resolve specific issues.
- **Verification**:
  - Consider GitHub stars, issue tracking, stability, and license compatibility.
- **Project Suitability**:
  - Ensure new libraries do not overlap with existing packages.
  - Assess compatibility with other libraries used in the project.

---

### Documentation

- Focus on feature-based documentation, detailing complex logic and core functionalities.
- Use JSDoc/TSDoc for in-file comments.

---

### Common Components

- Use **`@radix-ui`** for UI components.
- Reference components from the [Radix official documentation](https://www.radix-ui.com/primitives/docs/overview/introduction).

Example of importing Radix UI:

```typescript
import * as RSelect from "@radix-ui/react-select";

const Select = () => {
  return <RSelect.Root>...</RSelect.Root>;
};
```

---

### Branch & Commit Style

#### Branch Naming

- Format: `[name]/[objective]/[keyword]`
- Example: `ymy/d/readme`

#### Commit Message Format

- Format: `[[objective]] [message]`
- Example: `[docs] Add README with installation guide and conventions`

| Branch | Commit   | Purpose                                        |
| ------ | -------- | ---------------------------------------------- |
| f      | feat     | Feature addition, library addition, API change |
| r      | refactor | Code structure changes and refactoring         |
| b      | bugfix   | Bug fixes                                      |
| d      | docs     | Documentation changes (e.g., README)           |
| test   | test     | Test code creation                             |
| c      | chore    | Config and settings file updates               |

---

### GitHub Merge Request & Code Review Guide

1. **Rebase Target Branch** before creating a merge request (MR). [Learn about Rebase](https://git-scm.com/book/en/v2/Git-Branching-Rebasing).
2. **Resolve Conflicts** through Merge after MR registration (not Rebase).

---
