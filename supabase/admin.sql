-- ============================================
-- 财运体质测试 · 密钥管理后台 SQL
-- 在 Supabase SQL Editor 中执行（跑一次即可）
-- ============================================

-- 管理密码表
create table if not exists public.admin_settings (
  id int primary key default 1,
  admin_password text not null
);

-- 初始管理密码（登录管理后台用，之后可在后台页面修改）
insert into public.admin_settings (id, admin_password)
values (1, 'CFAdmin-8k3N-vQ7z')
on conflict (id) do nothing;

-- 校验管理密码（内部函数）
create or replace function public.admin_check(p_password text)
returns boolean
language sql
security definer
as $$
  select exists(
    select 1 from public.admin_settings
    where id = 1 and admin_password = p_password
  );
$$;

-- 验证登录
create or replace function public.admin_verify(p_password text)
returns json
language plpgsql
security definer
as $$
begin
  if not public.admin_check(p_password) then
    return json_build_object('ok', false, 'message', '管理密码错误');
  end if;
  return json_build_object('ok', true);
end;
$$;

-- 查询全部密钥状态
create or replace function public.admin_list_cards(p_password text)
returns table(code text, used_count int, max_uses int, created_at timestamptz)
language plpgsql
security definer
as $$
begin
  if not public.admin_check(p_password) then
    raise exception '管理密码错误';
  end if;
  return query
  select c.code, c.used_count, c.max_uses, c.created_at
  from public.cards c
  order by c.id desc;
end;
$$;

-- 批量添加密钥
create or replace function public.admin_add_cards(p_password text, p_codes text[])
returns json
language plpgsql
security definer
as $$
declare
  v_added int := 0;
begin
  if not public.admin_check(p_password) then
    return json_build_object('ok', false, 'message', '管理密码错误');
  end if;

  insert into public.cards (code)
  select distinct upper(trim(x))
  from unnest(p_codes) as x
  on conflict (code) do nothing;

  get diagnostics v_added = row_count;
  return json_build_object('ok', true, 'added', v_added);
end;
$$;

-- 删除单个密钥
create or replace function public.admin_delete_card(p_password text, p_code text)
returns json
language plpgsql
security definer
as $$
begin
  if not public.admin_check(p_password) then
    return json_build_object('ok', false, 'message', '管理密码错误');
  end if;
  delete from public.cards where code = upper(trim(p_code));
  return json_build_object('ok', true);
end;
$$;

-- 重置密钥使用次数
create or replace function public.admin_reset_card(p_password text, p_code text)
returns json
language plpgsql
security definer
as $$
begin
  if not public.admin_check(p_password) then
    return json_build_object('ok', false, 'message', '管理密码错误');
  end if;
  update public.cards set used_count = 0 where code = upper(trim(p_code));
  return json_build_object('ok', true);
end;
$$;

-- 修改管理密码
create or replace function public.admin_set_password(p_password text, p_new_password text)
returns json
language plpgsql
security definer
as $$
begin
  if not public.admin_check(p_password) then
    return json_build_object('ok', false, 'message', '管理密码错误');
  end if;
  if length(p_new_password) < 8 then
    return json_build_object('ok', false, 'message', '新密码至少8位');
  end if;
  update public.admin_settings set admin_password = p_new_password where id = 1;
  return json_build_object('ok', true);
end;
$$;

-- 授权匿名调用（函数内部已做密码校验）
grant execute on function public.admin_verify(text) to anon;
grant execute on function public.admin_list_cards(text) to anon;
grant execute on function public.admin_add_cards(text, text[]) to anon;
grant execute on function public.admin_delete_card(text, text) to anon;
grant execute on function public.admin_reset_card(text, text) to anon;
grant execute on function public.admin_set_password(text, text) to anon;
