# Time delta

時間計算のためのTypeScriptライブラリです。時間差の計算や時間の加減算、フォーマット変換などの機能を提供します。

## 機能

- ⚡️ 時間差の計算と操作
- 🎯 TypeScriptによる型安全性
- ✅ Vitestによる包括的なテストカバレッジ
- 📦 ES ModulesとCommonJSの両方をサポート

## インストール

```bash
npm install @fcf-ebisawa/time-delta
```

## 基本的な使用方法

### 時間差の計算

```typescript
import { duration, timeDiff } from '@fcf-ebisawa/time-delta';

// 基本的な時間差の計算
const diff = duration(new Date('2024-01-01T10:00:00'), new Date('2024-01-01T12:30:00'));
console.log(diff.toString()); // "02:30:00.000"

// オプションを使用した時間差の計算
const roundedDiff = timeDiff(new Date('2024-01-01T10:00:00'), new Date('2024-01-01T12:30:45'), {
  roundTo: 'hour',
});
console.log(roundedDiff.toString()); // "03:00:00.000"
```

### SignedTimeクラスの使用

```typescript
import { SignedTime } from '@fcf-ebisawa/time-delta';

// インスタンスの作成
const time = new SignedTime(1, 30, 45, 500); // 1時間30分45秒500ミリ秒
console.log(time.toString()); // "01:30:45.500"

// 時間の加算
const time1 = new SignedTime(1, 30, 0);
const time2 = new SignedTime(0, 45, 0);
const sum = time1.add(time2);
console.log(sum.toString()); // "02:15:00.000"

// カスタムフォーマット
console.log(time.toString('h時m分s秒')); // "1時30分45秒"

// 時間の比較
const isGreater = time1.isGreaterThan(time2); // true
```

## API リファレンス

### duration(from: DateLike, to: DateLike): SignedTime

2つの日時の間の時間差を計算します。

- **引数**
  - `from`: 開始日時（Date、文字列、または数値）
  - `to`: 終了日時（Date、文字列、または数値）
- **戻り値**: SignedTimeインスタンス

### timeDiff(from: DateLike, to: DateLike, options?): SignedTime

2つの日時の時間差を計算し、オプションに基づいて加工します。

- **引数**
  - `from`: 開始日時
  - `to`: 終了日時
  - `options`:
    - `absolute`: trueの場合、結果を絶対値に変換
    - `roundTo`: 丸め単位（'hour' | 'minute' | 'second'）
- **戻り値**: SignedTimeインスタンス

### SignedTime

時間を表現するクラスで、以下のような機能を提供します：

- 時間の加算・減算・乗除算
- 時間の比較
- フォーマット変換
- 丸め処理
- 絶対値の取得
- 符号の反転

詳細なメソッドとプロパティについては、ソースコードのJSDocコメントを参照してください。

## 開発

```bash
# 依存関係のインストール
npm install

# テストの実行
npm test
npm run test:coverage

# リントとフォーマット
npm run lint
npm run lint:fix
npm run format

# ビルド
npm run build
```

## ライセンス

[Apache-2.0](LICENSE)

---

> [!NOTE]
> バグの報告や機能の要望は、GitHubのIssueでお願いします。
