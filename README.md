<a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
<img alt="Netlify Status" height="28" src="https://api.netlify.com/api/v1/badges/d2c42e80-54e9-4c16-920c-2844a3ca23b7/deploy-status">
</div>

<br />
<div align="center">
  <a href="https://github.com/ArvidWedtstein/Omega-Docs">
    <img src="https://content.energage.com/company-images/SE45893/SE45893_logo_orig.png" alt="Omega Logo" width="200" height="200">
  </a>

  <h3 align="center">Omega Docs</h3>


  <p align="center">
    Website for missing Omega 365 (NT) Documentation
    <br />
    <a href="https://omegadocs.netlify.app"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ArvidWedtstein/Omega-Docs/issues">Report Bug</a>
    ·
    <a href="https://github.com/ArvidWedtstein/Omega-Docs/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#recommended-ide-setup">Recommended IDE Setup</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

More info comming soon


### Built With

Frontend was written with Vue Composition API, with Bootstrap.

[![Vue][Vue.js]][Vue-url]
[![Bootstrap][Bootstrap]][Bootstrap-url]


<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

To run this project you'll need to have nodejs installed on your computer. You can download it [here](https://nodejs.org/en/download/)

Get latest npm version

- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ArvidWedtstein/Omega-Docs.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Compile and Hot-Reload for Development
   ```sh
   npm run dev
   ```
4. Type-Check, Compile and Minify for Production
   ```sh
   npm run build
   ```


### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).


### Deploying new feature

<!--https://nvie.com/posts/a-successful-git-branching-model/-->

When starting work on a new feature, branch off from the dev branch: 
```sh
git checkout -b myfeature Development
# Switched to a new branch "myfeature"
```

Finished features may be merged into the dev branch to definitely add them to the upcoming release:
```sh
git checkout dev
# Switched to branch 'dev'
```

```sh
git merge --no-ff myfeature
#Updating ea1b82a..05e9557
# (Summary of changes)
```


```sh
git branch -d myfeature
# Deleted branch myfeature (was 05e9557).
```

```sh
git push origin dev
```


### Deploying

Hosted on netlify

Push to prod branch, and it will deploy automatically

<!-- USAGE EXAMPLES -->

## Usage

Usage is comming soon

<!-- ROADMAP -->

## Roadmap

Roadmap comming soon (or never)

See the [open issues](https://github.com/ArvidWedtstein/Omega-Docs/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/ArvidWedtstein/Omega-Docs.svg?style=for-the-badge
[contributors-url]: https://github.com/ArvidWedtstein/Omega-Docs/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ArvidWedtstein/Omega-Docs.svg?style=for-the-badge
[forks-url]: https://github.com/ArvidWedtstein/Omega-Docs/network/members
[stars-shield]: https://img.shields.io/github/stars/ArvidWedtstein/Omega-Docs.svg?style=for-the-badge
[stars-url]: https://github.com/ArvidWedtstein/Omega-Docs/stargazers
[issues-shield]: https://img.shields.io/github/issues/ArvidWedtstein/Omega-Docs.svg?style=for-the-badge
[issues-url]: https://github.com/ArvidWedtstein/Omega-Docs/issues


[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Bootstrap]: https://img.shields.io/badge/Bootstrap-dddddd?style=for-the-badge&logo=bootstrap&logoColor=572b8a
[Bootstrap-url]: https://getbootstrap.com/docs/5.3/getting-started/introduction/