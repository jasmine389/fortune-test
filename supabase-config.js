// Supabase 配置
// 部署时填入你的项目 URL 和 anon key（Supabase Dashboard → Settings → API）
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
} else {
  console.info('[财运测试] Supabase 未配置，密码验证使用本地降级模式');
}

function getSupabaseClient() {
  return supabaseClient;
}
