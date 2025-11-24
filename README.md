# Personal Auth & File Storage Dashboard (Frontend)

This project is the frontend client authentication + file storage server.  
It requires a running backend (auth + file API) and is not a standalone service.

## Features

- Cookie-based login & authentication  
- Protected routes using a server-side auth check  
- Usage dashboard (username, file count, storage usage)  
- File upload (drag & drop, queue, progress, error states)  
- File list with infinite loading + thumbnail preview  
- Image/video preview, download, delete  
- Responsive navigation (mobile + desktop)  

## Tech Stack

- Next.js 16 (App Router)  
- shadcn/ui  
- TanStack Query  
- Zustand

## Requirements

A backend server providing:

```plain
POST /auth/login
GET /auth/me
POST /auth/logout
GET /files
DELETE /files/:id
POST /upload
```

## Project Structure

```plain
app/
  page.tsx              # Login or connection error
  layout.tsx            # Root layout
  providers.tsx         # React Query provider
  (protected)/          # Auth-protected section
    layout.tsx          # Auth check + navigation
    dashboard/page.tsx  # Usage dashboard
    files/page.tsx      # File list
    files/[id]/page.tsx # File detail
    upload/page.tsx     # File upload

components/
  client/
    LoginCard
    AppNavigation
    DeleteFileButton
    Upload (UploadBox / UploadQueueList)
  ui/                   # shadcn/ui components

lib/
  api.ts                # API wrapper
  server/auth.ts        # Server-side auth check
  client/uploadStore.ts # Upload queue state
  utils.ts              
```

## Roadmap

- Global error & 404 pages
- Upload retry & cancel
- Concurrent upload limits
- Toast notifications
