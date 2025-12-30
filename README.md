# [Alan Pereira | Profile](ansperson.github.io/myself/)

![GitHub deployments](https://img.shields.io/github/deployments/ansperson/myself/gh-pages?style=flat-square&label=Deployment)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ansperson/myself/pages.yml?style=flat-square&label=Actions)
![OSSF-Scorecard Score](https://img.shields.io/ossf-scorecard/github.com/ansperson/myself?style=flat-square&label=openssf%20scorecard)

## About

This repository showcases an interactive terminal-based portfolio and curriculum vitae. The project implements a fully interactive terminal interface that allows visitors to explore my professional background, projects, and skills through a command-line experience or in a grafical mode.

The project applies the latest standards in:
- **Automation**: CI/CD pipelines, automated versioning, dependency management, and deployment workflows
- **Security**: OSSF Scorecard compliance, security scanning, and best practices
- **Development**: Modern tooling, code quality checks, and maintainable architecture

All credits and attributions for the technologies and resources used can be found in `credits.txt` when running the application in GUI mode.

## Quick Start (For development only)

0. Set up pre-commit

```bash
pre-commit install
```

### Using docker (recommended)

```bash
docker run -d --name terminal -p 3000:3000 .
```

or

```bash
docker compose up --build --force-recreate -d
```

### Running Local

1. Install dependencies:

```bash
yarn install
```

3. Run the server:

```bash
yarn dev
```
