import { FC } from 'hono/jsx'
import { PageData } from '../types'

export const Splash: FC<{ page: PageData }> = ({ page }) => {
  const splashimage = page.attrs.splash?.image ?? page.attrs.splashimage
  if (!splashimage) return null
  return (
    <img
      id="splashimage"
      src={splashimage}
      alt="splash image"
      class="h-[10.5rem] w-full my-6 object-cover cursor-default"
    />
  )
}
