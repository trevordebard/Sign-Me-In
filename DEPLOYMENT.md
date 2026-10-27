# Hetzner deployment

Sign Me In runs as the `signmein` Dokku app on `157.180.37.245`.
Domains: `signmein.org`, `www.signmein.org`, `signmein.trevordebard.com`.
All A records must point to this server. Remove old Fly.io AAAA records.

The Dockerfile uses Node 22, Next.js 15 Pages Router, React 18, Prisma 6,
and Socket.IO 4. API requests and sockets use the visitor's origin;
server rendering calls the API over loopback. No Fly.io service is required.

The existing `smi-db` PostgreSQL service is linked through Dokku's secret
`DATABASE_URL`. Do not commit credentials. The original records were reused
at the owner's request (249 rooms and 1,546 attendance entries).

## Deploy

```sh
npm ci --legacy-peer-deps
npm run build
git remote add dokku dokku@157.180.37.245:signmein # once
git push dokku HEAD:master
```

The `app.json` predeploy hook applies committed Prisma migrations. Do not
modify previously applied migrations. Dokku checks `/healthz` before routing
traffic to a new container. The app runs one web process with a 512 MiB
memory limit and one CPU. Dokku restarts the container after server reboot.

```sh
ssh root@157.180.37.245 'dokku ps:report signmein'
ssh root@157.180.37.245 'dokku logs signmein -n 100'
ssh root@157.180.37.245 'dokku letsencrypt:report signmein'
```

## Backups

Before deployment, a database export was saved at
`/var/backups/signmein/pre-deploy-2026-10-27.dump` (root-only).
Daily exports run through `/etc/cron.d/signmein-backup` and keep 14 days.
Backups are on this server; they do not protect against loss of the server.

## Fly.io retirement

Verify HTTPS, room creation, attendance submission, live room updates,
and CSV download on the Hetzner deployment before removing Fly machines.
The Fly account was not accessible during deployment. Stop/delete the old
app and any unused volumes/database services through Fly's dashboard to
end their charges. Other applications on the Fly account may still depend
on its resources; check dependencies before removing shared services.
