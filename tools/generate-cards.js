// 批量生成财运体质测试密钥
// 用法: node tools/generate-cards.js [数量] (默认100)
// 输出: tools/cards.csv (导入发卡平台) + tools/cards.sql (导入Supabase)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 排除易混淆字符 (0/O, 1/I/L)
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomBlock(len) {
  const bytes = crypto.randomBytes(len);
  let s = '';
  for (let i = 0; i < len; i++) {
    s += CHARSET[bytes[i] % CHARSET.length];
  }
  return s;
}

function generateCode() {
  return `CF-${randomBlock(4)}-${randomBlock(4)}-${randomBlock(4)}`;
}

const count = parseInt(process.argv[2], 10) || 100;
const codes = new Set();
while (codes.size < count) {
  codes.add(generateCode());
}

const outDir = __dirname;
const list = Array.from(codes);

// CSV: 导入发卡平台（买家付款后平台自动发一个密钥）
const csv = 'code\n' + list.join('\n') + '\n';
fs.writeFileSync(path.join(outDir, 'cards.csv'), csv, 'utf8');

// SQL: 导入 Supabase SQL Editor 批量插入
const values = list.map(c => `('${c}')`).join(',\n  ');
const sql = `-- 财运体质测试密钥（${count} 个，由 generate-cards.js 生成）
insert into public.cards (code) values
  ${values}
on conflict (code) do nothing;
`;
fs.writeFileSync(path.join(outDir, 'cards.sql'), sql, 'utf8');

console.log(`✅ 已生成 ${count} 个密钥:`);
console.log(`   ${path.join(outDir, 'cards.csv')}  → 导入发卡平台自动发货`);
console.log(`   ${path.join(outDir, 'cards.sql')}  → 在 Supabase SQL Editor 执行导入`);
console.log('\n密钥示例:');
list.slice(0, 5).forEach(c => console.log('  ' + c));
