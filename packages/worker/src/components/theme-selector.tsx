import {Dropdown} from './icons/dropdown'

export const ThemeSelector = () => (
	<div class="dropdown dropdown-bottom dropdown-end">
		<div tabindex={0} role="button" class="link link-hover -mx-2">
			Theme
			&nbsp;
			<Dropdown />
		</div>
		<ul tabindex={0} class="dropdown-content bg-base-300 rounded-box z-[1] shadow-2xl">
			<li>
				<input
					type="radio"
					name="theme-dropdown"
					class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
					aria-label="Default"
					value="default"
				/>
			</li>
			<li>
				<input
					type="radio"
					name="theme-dropdown"
					class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
					aria-label="Dark"
					value="dark"
				/>
			</li>
			<li>
				<input
					type="radio"
					name="theme-dropdown"
					class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
					aria-label="Light"
					value="light"
				/>
			</li>
			<li>
				<input
					type="radio"
					name="theme-dropdown"
					class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
					aria-label="Emerald"
					value="emerald"
				/>
			</li>
		</ul>
	</div>
)
