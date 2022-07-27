import { NextRouter } from 'next/router'

const router = {
  asPath: '/test',
  push: jest.fn(),
} as unknown as NextRouter

export function useRouter(): NextRouter {
  return router
}
