import type { NextConfig } from 'next'

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true'
const defaultBasePath = process.env.NODE_ENV === 'production' ? '/shnurok' : ''
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (isGithubPages && repo ? `/${repo}` : defaultBasePath)

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shnurok-choice.ru',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
