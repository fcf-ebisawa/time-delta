# NPM Package Template

TypeScriptを使用したnpmパッケージ開発のためのテンプレートリポジトリです。

## 機能

- ⚡️ [Vite](https://vitejs.dev/)によるビルド
- 🎯 [TypeScript](https://www.typescriptlang.org/)による型安全性
- ✅ [Vitest](https://vitest.dev/)によるテスト
- 📝 [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)によるコード品質管理
- 🚀 GitHub Actionsによる自動パブリッシュ
- 📦 ES ModulesとCommonJSの両方をサポート

## セットアップ手順

1. このテンプレートを使用して新しいリポジトリを作成
2. 以下のファイルの設定を変更

### package.json

```json
{
  "name": "<package-name>", // パッケージ名を変更
  "repository": {
    "type": "git",
    "url": "<repository-url>" // リポジトリURLを変更
  },
  "version": "0.0.0" // 初期バージョンを設定
  // ... その他の設定は必要に応じて変更
}
```

### vite.config.ts

```typescript
export default defineConfig({
  build: {
    lib: {
      name: '<package-name>', // パッケージ名を変更
      entry: {
        main: './lib/index.ts', // エントリーポイントを必要に応じて変更
        // 追加のエントリーポイントを設定
      },
    },
  },
});
```

### .github/workflows/npm-publish.yml

```yaml
env:
  NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}  // NPM_TOKENをGitHubシークレットに設定
```

## 開発手順

1. 依存関係のインストール

```bash
npm install
```

2. テストの実行

```bash
npm test                 # テストの実行
npm run test:coverage   # カバレッジレポートの生成
```

3. リントとフォーマット

```bash
npm run lint           # リントの実行
npm run lint:fix       # リントエラーの自動修正
npm run format         # コードフォーマットの実行
```

4. ビルド

```bash
npm run build
```

## パッケージの構造

```
.
├── lib/                    # ソースコード
│   ├── index.ts           # メインエントリーポイント
│   └── **/*.ts           # その他のモジュール
│   └── **/*.spec.ts         # テストファイル
└── dist/                  # ビルド出力（自動生成）
    ├── es/               # ES Modules
    ├── cjs/              # CommonJS
    └── types/            # 型定義ファイル
```

## パッケージの使用方法

### ES Modules

```typescript
import { yourFunction } from '<package-name>';
```

### CommonJS

```javascript
const { yourFunction } = require('<package-name>');
```

## パブリッシュ手順

1. GitHubリポジトリの設定

   - NPM_TOKENをシークレットに追加
   - 必要に応じてブランチ保護ルールを設定

2. バージョン管理とリリース

   ```bash
   npm version patch|minor|major
   git push --follow-tags
   ```

3. GitHubでリリースを作成
   - リリースを作成すると自動的にnpmにパブリッシュされます

## 注意点

- `package.json`の`"type": "module"`設定を変更する場合は、ビルド設定も適切に調整してください
- 新しいエントリーポイントを追加する場合は、`vite.config.ts`と`package.json`の`exports`フィールドの両方を更新する必要があります
- テストファイルは対象のソースファイルと同じディレクトリに`*.spec.ts`として配置してください

## ライセンス

このテンプレートは[Apache-2.0ライセンス](LICENSE)の下で公開されています。

---

> [!NOTE]
> このREADMEは新しいパッケージ用にカスタマイズしてください。
