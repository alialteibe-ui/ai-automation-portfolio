create table public.customers (
  id bigint generated always as identity primary key,
  phone text not null unique,
  status text not null default 'active',
  opted_out boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.campaigns (
  id bigint generated always as identity primary key,
  name text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.campaign_recipients (
  campaign_id bigint not null references public.campaigns(id) on delete cascade,
  customer_id bigint not null references public.customers(id) on delete cascade,
  delivery_status text not null default 'queued',
  external_message_id text,
  last_error text,
  updated_at timestamptz not null default now(),
  primary key (campaign_id, customer_id)
);

create index campaign_recipients_status_idx
  on public.campaign_recipients(campaign_id, delivery_status);

alter table public.customers enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_recipients enable row level security;

-- Public portfolio note:
-- production policies should be based on authenticated roles/claims and
-- least-privilege access. They are intentionally omitted here because this
-- repository is an architectural showcase rather than a deployable client system.
