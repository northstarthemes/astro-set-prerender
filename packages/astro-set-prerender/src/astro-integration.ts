import type { AstroIntegration } from 'astro'
import type { IntegrationOptions } from './types'

export function createSetPrerenderIntegration(
	options: IntegrationOptions = {}
): AstroIntegration {
	return {
		name: 'set-prerender',
		hooks: {
			'astro:route:setup': ({ route }) => {
				if (route.prerender !== undefined) return
				// Determine if we're in prerender-first or server-render-first mode
				const ssrByDefault = 'staticRender' in options
				const staticByDefault = 'serverRender' in options
				const patterns = ssrByDefault
					? options.staticRender
					: staticByDefault
						? options.serverRender
						: null

				if (!patterns) return

				const matchesPattern = patterns.some((pattern) =>
					pattern.test(route.component)
				)

				// If in static-render mode (SSR by default):
				// - Routes matching patterns are static rendered
				// - All other routes are server rendered
				// If in server-render mode (static by default):
				// - Routes matching patterns are server rendered
				// - All other routes are static rendered
				route.prerender = ssrByDefault
					? matchesPattern
					: !matchesPattern
			},
		},
	}
}
