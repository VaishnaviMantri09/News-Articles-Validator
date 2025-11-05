# News Articles Validator

This project uses [Microsoft Playwright](https://playwright.dev/) to automate a browser, navigate to [Hacker News - Newest](https://news.ycombinator.com/newest), and validate that the **first 100 articles** are sorted from **newest to oldest**.

## What the Script Does ?
- Launches a headless browser using **Playwright**.
- Navigates webpage (https://news.ycombinator.com/newest).
- Validates the chronological order to ensure articles are sorted from newest to oldest.
- Logs results: success if the order is correct; an error with the position if not.

## Requirements

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Microsoft Playwright](https://playwright.dev/)

## Execution of Script Locally

1. **Clone this repository**:

   ```bash
   git clone https://github.com/VaishnaviMantri09/News-Articles-Validator.git
   cd News-Articles-Validator
   ```


2. **Install the dependencies**

```bash
npm i
```

3. **Run the script by passing the URL of the target webpage**

```bash
node index.js
```

## Output

The original article data is saved as original_articles.json, and the validated, correctly sorted data is saved as sorted_articles.json.

```bash
├── original_articles.json
├── sorted_articles.json
└── ...
```
