import { type FC } from 'hono/jsx'
import { DefaultLayout } from './default-layout'
import { LandingPage } from './landing-page'

export const componentMap: Record<string, FC> = {
  DefaultLayout: DefaultLayout,
  LandingPage: LandingPage
}