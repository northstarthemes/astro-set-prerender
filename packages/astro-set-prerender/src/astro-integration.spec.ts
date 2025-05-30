import { describe, it, expect } from 'vitest'
import type { AstroIntegrationLogger } from 'astro'
import createSetPrerenderIntegration from './'

const mockLogger = {} as unknown as AstroIntegrationLogger

describe('createSetPrerenderIntegration', () => {
	describe('SSR by default mode (staticRender)', () => {
		const plugin = createSetPrerenderIntegration({
			staticRender: [/^\/blog\/.*$/, /^\/products\/.*$/],
		})

		it('should static render routes matching patterns', () => {
			const route = { prerender: undefined, component: '/blog/post-1' }
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(true)

			const route2 = {
				prerender: undefined,
				component: '/products/item-1',
			}
			plugin.hooks['astro:route:setup']?.({
				route: route2,
				logger: mockLogger,
			})
			expect(route2.prerender).toBe(true)
		})

		it('should server render routes not matching patterns', () => {
			const route = { prerender: undefined, component: '/about' }
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(false)

			const route2 = { prerender: undefined, component: '/contact' }
			plugin.hooks['astro:route:setup']?.({
				route: route2,
				logger: mockLogger,
			})
			expect(route2.prerender).toBe(false)
		})
	})

	describe('Static render by default mode (serverRender)', () => {
		const plugin = createSetPrerenderIntegration({
			serverRender: [/^\/admin\/.*$/, /^\/api\/.*$/],
		})

		it('should server render routes matching patterns', () => {
			const route = {
				prerender: undefined,
				component: '/admin/dashboard',
			}
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(false)

			const route2 = { prerender: undefined, component: '/api/users' }
			plugin.hooks['astro:route:setup']?.({
				route: route2,
				logger: mockLogger,
			})
			expect(route2.prerender).toBe(false)
		})

		it('should static render routes not matching patterns', () => {
			const route = { prerender: undefined, component: '/about' }
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(true)

			const route2 = { prerender: undefined, component: '/contact' }
			plugin.hooks['astro:route:setup']?.({
				route: route2,
				logger: mockLogger,
			})
			expect(route2.prerender).toBe(true)
		})
	})

	describe('Edge cases', () => {
		it('should handle empty pattern arrays', () => {
			const plugin = createSetPrerenderIntegration({ staticRender: [] })
			const route = { prerender: undefined, component: '/any-route' }
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(false)
		})

		it('should handle complex regex patterns', () => {
			const plugin = createSetPrerenderIntegration({
				staticRender: [/^\/blog\/\d{4}\/\d{2}\/.*$/],
			})

			const matchingRoute = {
				prerender: undefined,
				component: '/blog/2024/03/post-1',
			}
			plugin.hooks['astro:route:setup']?.({
				route: matchingRoute,
				logger: mockLogger,
			})
			expect(matchingRoute.prerender).toBe(true)

			const nonMatchingRoute = {
				prerender: undefined,
				component: '/blog/2024/post-1',
			}
			plugin.hooks['astro:route:setup']?.({
				route: nonMatchingRoute,
				logger: mockLogger,
			})
			expect(nonMatchingRoute.prerender).toBe(false)
		})

		it('should handle routes with special characters', () => {
			const plugin = createSetPrerenderIntegration({
				staticRender: [/^\/docs\/.*$/, /^\/user\/.*$/],
			})

			const routes = [
				'/docs/getting-started/installation',
				'/user/john.doe@example.com',
				'/user/special/chars/!@#$%^&*()',
				'/docs/api/v1/endpoints',
			]

			routes.forEach((route) => {
				const routeObj = { prerender: undefined, component: route }
				plugin.hooks['astro:route:setup']?.({
					route: routeObj,
					logger: mockLogger,
				})
				expect(routeObj.prerender).toBe(true)
			})
		})

		it('should handle routes matching multiple patterns', () => {
			const plugin = createSetPrerenderIntegration({
				staticRender: [/^\/blog\/.*$/, /^\/blog\/featured\/.*$/],
			})

			const route = {
				prerender: undefined,
				component: '/blog/featured/post-1',
			}
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(true)
		})

		it('should handle invalid regex patterns gracefully', () => {
			const plugin = createSetPrerenderIntegration({
				staticRender: [/^\/blog\/\[$/], // Invalid regex
			})

			const route = { prerender: undefined, component: '/blog/post-1' }
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			// Should not throw, but also not match the invalid pattern
			expect(route.prerender).toBe(false)
		})

		it('should handle root path correctly', () => {
			const plugin = createSetPrerenderIntegration({
				staticRender: [/^\/$/],
			})

			const route = { prerender: undefined, component: '/' }
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(true)
		})

		it('should respect the prerender flag when using staticRender', () => {
			const plugin = createSetPrerenderIntegration({
				staticRender: [/^\/blog\/.*$/],
			})

			const route = {
				component: '/blog/post-1',
				prerender: false,
			}
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(false)

			const route2 = { component: '/blog/post-2', prerender: true }
			plugin.hooks['astro:route:setup']?.({
				route: route2,
				logger: mockLogger,
			})
			expect(route2.prerender).toBe(true)
		})

		it('should respect the prerender flag when using serverRender', () => {
			const plugin = createSetPrerenderIntegration({
				serverRender: [/^\/blog\/.*$/],
			})

			const route = {
				component: '/blog/post-1',
				prerender: true,
			}
			plugin.hooks['astro:route:setup']?.({ route, logger: mockLogger })
			expect(route.prerender).toBe(true)

			const route2 = { component: '/blog/post-2', prerender: false }
			plugin.hooks['astro:route:setup']?.({
				route: route2,
				logger: mockLogger,
			})
			expect(route2.prerender).toBe(false)
		})
	})
})
