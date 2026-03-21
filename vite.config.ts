import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/** `/api/*` 는 SvelteKit(`src/routes/api/...`) BFF에서 처리. Vite에서 `/api`→8080 프록시를 쓰면
 *  BFF를 건너뛰어 백엔드로 직접 가며 JWT·쿠키 흐름이 깨질 수 있다. */
export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' })
	],
	server: {
		port: 5173
	}
});
