import {
	assetUrl,
	getSiteConfig as getCurrentSiteConfig
} from '/lib/xp/portal';

export function responseFilter(req, res) {
	//log.info(`pageContributions:${JSON.stringify(res.pageContributions, null, 4)}`);
	const currentSiteConfig = getCurrentSiteConfig();
	//log.info(`currentSiteConfig:${JSON.stringify(currentSiteConfig, null, 4)}`);
	const cssSelector = currentSiteConfig.cssSelector || 'img';
	const headEndHtmlStr = `<link rel="stylesheet" href="${assetUrl({path: 'css/photoswipe.css'})}"></link>`;
	const bodyEndHtmlStr = `
<div aria-hidden="true" class="pswp" tabindex="-1" role="dialog">
	<div class="pswp__bg"></div>
	<div class="pswp__scroll-wrap">
		<div class="pswp__container">
			<div class="pswp__item"></div>
			<div class="pswp__item"></div>
			<div class="pswp__item"></div>
		</div>
		<div class="pswp__ui pswp__ui--hidden">
			<div class="pswp__top-bar">
				<div class="pswp__counter"></div>
				<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
				<button class="pswp__button pswp__button--share" title="Share"></button>
				<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
				<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
				<div class="pswp__preloader">
					<div class="pswp__preloader__icn">
					  <div class="pswp__preloader__cut">
						<div class="pswp__preloader__donut"></div>
					  </div>
					</div>
				</div>
			</div>
			<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
				<div class="pswp__share-tooltip"></div>
			</div>
			<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
			<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
			<div class="pswp__caption">
				<div class="pswp__caption__center"></div>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">var exports = {};</script>
<script type="text/javascript" src="${assetUrl({path: 'js/photoswipe.js'})}"></script>
<script type="text/javascript">
	window.onload = function() {
		const images = document.querySelectorAll('${cssSelector}');
		window.photoSwipeInitializer(images);
	};
</script>
`;
	//document.addEventListener('DOMContentLoaded', () => {});
	if (!res.pageContributions) {
		res.pageContributions = {
			headEnd: [headEndHtmlStr],
			bodyEnd: [bodyEndHtmlStr]
		};
		return res;
	}

	if (!res.pageContributions.headEnd) {
		res.pageContributions.headEnd = [headEndHtmlStr];
	} else if (Array.isArray(res.pageContributions.headEnd)) {
		res.pageContributions.headEnd.push(headEndHtmlStr);
	} else {
		res.pageContributions.headEnd = [res.pageContributions.headEnd, headEndHtmlStr];
	}

	if (!res.pageContributions.bodyEnd) {
		res.pageContributions.bodyEnd = [bodyEndHtmlStr];
	} else if (Array.isArray(res.pageContributions.bodyEnd)) {
		res.pageContributions.bodyEnd.push(bodyEndHtmlStr);
	} else {
		res.pageContributions.bodyEnd = [res.pageContributions.bodyEnd, bodyEndHtmlStr];
	}

	return res;
}
