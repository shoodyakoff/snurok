const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isGithubActions && repo ? `/${repo}` : '')
const baseUrl = `http://localhost:3000${basePath}`

module.exports = {
  ci: {
    collect: {
      url: [
        `${baseUrl}/`,
        `${baseUrl}/chat/`,
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      numberOfRuns: 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
