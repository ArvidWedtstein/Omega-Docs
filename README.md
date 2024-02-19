<h1>Omega Docs <img alt="Netlify Status" src="https://api.netlify.com/api/v1/badges/d2c42e80-54e9-4c16-920c-2844a3ca23b7/deploy-status"></h1> 

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```



<!--https://nvie.com/posts/a-successful-git-branching-model/-->

## New feature

When starting work on a new feature, branch off from the development branch: 
```sh
git checkout -b myfeature Development
# Switched to a new branch "myfeature"
```

Finished features may be merged into the development branch to definitely add them to the upcoming release:
```sh
git checkout Development
# Switched to branch 'Development'
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
git push origin Development
```