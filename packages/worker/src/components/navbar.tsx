import { type FC } from 'hono/jsx'
import { useRequestContext } from 'hono/jsx-renderer'
import { getRootConfig } from '../markdown/get-markdown'
import { MenuIcon } from './icons/menu.js'
import { ThemeSelector } from './theme-selector'

export const Navbar: FC = async ({ children }) => {
	const c = useRequestContext()
	const rootConfig = await getRootConfig(c)
	const navlinks = rootConfig?.navlinks ?? []
	return (
		<div class="drawer">
			<input id="presskit-nav" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content flex flex-col">
				<div class="navbar bg-base-200 w-full">
					<div class="flex-none lg:hidden">
						<label for="presskit-nav" aria-label="open sidebar" class="btn btn-square btn-ghost">
							<MenuIcon />
						</label>
					</div>
					<div class="mx-2 flex-1 px-2">
						<a href="/" class="link link-hover">
							Presskit
						</a>
					</div>
					<div class="hidden flex-none lg:block">
						<ul class="menu menu-horizontal">
							<NavLinks />
							<li>
								<ThemeSelector />
							</li>
						</ul>
					</div>
				</div>
				{children}
			</div>
			<div class="drawer-side">
				<label for="presskit-nav" aria-label="close sidebar" class="drawer-overlay"></label>
				<ul class="menu bg-base-200 min-h-full min-w-fit p-4">
					<li class="-mx-2">
						<a href="/" class="link link-hover w-40 text-lg">
							Presskit
						</a>
					</li>
					<NavLinks />
				</ul>
			</div>
		</div>
	)

	function NavLinks() {
		return (
			<>
				{navlinks.map((navLink) => (
					<li>
						<a class="link link-hover px-2" href={navLink.href}>
							{navLink.text ?? navLink.href}
						</a>
					</li>
				))}
				<li>
					<a class="link link-hover px-2" href="/admin">
						Admin
					</a>
				</li>
			</>
		)
	}
}
