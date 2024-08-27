import { type FC } from 'hono/jsx'
import { useRequestContext } from 'hono/jsx-renderer'
import { getMarkdown } from '../markdown/get-markdown'

export const Navbar: FC = async ({children}) => {
	return (
		<div class="drawer">
			<input id="presskit-nav" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content flex flex-col">
				<div class="navbar bg-base-200 w-full">
					<div class="flex-none lg:hidden">
						<label for="presskit-nav" aria-label="open sidebar" class="btn btn-square btn-ghost">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="inline-block h-6 w-6 stroke-current"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</label>
					</div>
					<div class="mx-2 flex-1 px-2">
						<a href="/" class="link link-hover font-black">
							Presskit
						</a>
					</div>
					<div class="hidden flex-none lg:block">
						<ul class="menu menu-horizontal">
							<NavItems />
						</ul>
					</div>
				</div>
				{children}
			</div>
			<div class="drawer-side">
				<label for="presskit-nav" aria-label="close sidebar" class="drawer-overlay"></label>
				<ul class="menu bg-base-200 min-h-full min-w-fit p-4">
					<li class="-mx-2">
						<a href="/" class="link link-hover font-black w-40 text-lg">
							Presskit
						</a>
					</li>
					<NavItems />
				</ul>
			</div>
		</div>
	)
}

const NavItems: FC = async () => {
	const c = useRequestContext()
	const navItems = (await getMarkdown('/', c))?.attrs?.nav || []
	return (
		<>
			{navItems.map((item: any) => (
				<li>
					<a class="link px-2" href={item.link}>
						{item.text ?? item.link}
					</a>
				</li>
			))}
			<li>
				<a class="link px-2" href="/admin">
					Admin
				</a>
			</li>
		</>
	)
}
