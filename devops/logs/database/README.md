# Log Database T-AIMS
Penanggung jawab: Wafian (DevOps, Server & Security Engineer)

## Lokasi & Cara Cek Log MySQL
### 1. Docker Container (Layanan Utama):
```bash
docker logs --tail 100 taims-mysql
```

### 2. File Log Tersimpan:
```text
logs/database/mysql_YYYY-MM-DD.log
```
