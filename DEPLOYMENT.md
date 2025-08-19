# Deployment Guide untuk Vercel

## Masalah yang Diperbaiki

Error `404: NOT_FOUND` saat deploy ke Vercel disebabkan oleh:
1. Custom server (server.ts) yang tidak kompatibel dengan Vercel serverless
2. Konfigurasi webpack yang tidak sesuai untuk production
3. Socket.IO yang memerlukan persistent connection

## Perubahan yang Dilakukan

### 1. Konfigurasi Vercel (`vercel.json`)
- Menambahkan konfigurasi build khusus untuk Prisma
- Mengoptimalkan untuk Next.js framework
- Menambahkan environment variables

### 2. Package.json
- Mengubah script `start` dari custom server ke `next start`
- Memindahkan custom server ke `start:custom` untuk development lokal

### 3. Next.js Config (`next.config.ts`)
- Menghilangkan konfigurasi webpack yang bermasalah
- Menambahkan optimisasi untuk Vercel deployment
- Menambahkan konfigurasi Prisma external packages

### 4. Socket.IO Fallback
- Membuat API route `/api/socketio` sebagai fallback
- Real-time features akan terbatas di Vercel

## Langkah Deploy ke Vercel

### 1. Setup Environment Variables di Vercel
Tambahkan environment variables berikut di Vercel dashboard:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

### 2. Database Setup
- Gunakan Vercel Postgres, Supabase, atau provider PostgreSQL lainnya
- Pastikan DATABASE_URL sudah benar
- Jalankan migration jika diperlukan

### 3. Deploy
1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Vercel akan otomatis detect Next.js dan menggunakan konfigurasi dari `vercel.json`

## Catatan Penting

### Socket.IO Limitations
- Vercel menggunakan serverless functions yang tidak mendukung persistent connections
- Real-time features (Socket.IO) akan terbatas
- Untuk full Socket.IO support, pertimbangkan deploy ke:
  - Railway
  - Render
  - DigitalOcean App Platform
  - AWS EC2/ECS

### Development vs Production
- **Development**: Gunakan `npm run dev` (dengan custom server)
- **Production Local**: Gunakan `npm run start:custom` (dengan Socket.IO)
- **Vercel**: Otomatis menggunakan `npm run start` (tanpa custom server)

## Troubleshooting

### Jika masih error 404:
1. Pastikan semua environment variables sudah diset
2. Check build logs di Vercel dashboard
3. Pastikan Prisma schema sudah di-generate
4. Verify database connection

### Jika Prisma error:
1. Pastikan DATABASE_URL format sudah benar
2. Check apakah database accessible dari Vercel
3. Verify Prisma client generation

## Alternative Deployment Options

Jika Socket.IO sangat diperlukan, pertimbangkan:

1. **Railway**: Full support untuk custom server
2. **Render**: Support WebSocket dan persistent connections
3. **DigitalOcean App Platform**: Support custom server
4. **AWS/GCP**: Full control dengan container deployment