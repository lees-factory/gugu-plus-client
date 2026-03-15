<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="mt-auto px-6 py-6 sm:px-8" style="border-top: 1px solid rgba(45, 45, 42, 0.06);">
	<div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
		<p class="text-xs" style="color: #6b6b65;">
			© {year} Gugu Plus. All rights reserved.
		</p>
		<div class="flex items-center gap-5 text-xs" style="color: #6b6b65;">
			<a
				href="/terms"
				class="transition hover:opacity-70"
				style="color: #6b6b65;"
			>
				이용약관
			</a>
			<span style="opacity: 0.3;">·</span>
			<a
				href="/privacy"
				class="transition hover:opacity-70"
				style="color: #6b6b65;"
			>
				개인정보처리방침
			</a>
			<span style="opacity: 0.3;">·</span>
			<a
				href="mailto:support@gugu.plus"
				class="transition hover:opacity-70"
				style="color: #6b6b65;"
			>
				문의하기
			</a>
		</div>
	</div>
</footer>
