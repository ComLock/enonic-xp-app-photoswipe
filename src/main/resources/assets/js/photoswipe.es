import PhotoSwipe from 'photoswipe/dist/photoswipe.js';
//import PhotoSwipe from 'photoswipe/dist/photoswipe.min.js';

import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default.js';
//import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default.min.js';

window.photoSwipeInitializer = images => {
	let singleImage;


	function wrapElement(element, wrapper) {
		element.parentNode.insertBefore(wrapper, element);
		wrapper.appendChild(element);
	}


	/**
	 * Get closest DOM element up the tree of a certain type
	 * @param  {Node} elem The base element
	 * @param  {String} selector The tag to look for
	 * @return {Node} Null if no match
	 */
	function getClosest(elem, selector) {
		// Get closest match
		for (; elem && elem !== document; elem = elem.parentNode) { // eslint-disable-line no-param-reassign
			// If selector is a tag
			if (elem.tagName.toLowerCase() === selector) {
				return elem;
			}
		}
		return false;
	}


	function getCaptionText(caption) {
		return caption ? caption.innerHTML : '';
	}


	function setSlideProperties(image, captionText) {
		return {
			src: image.src,
			w: image.naturalWidth,
			h: image.naturalHeight,
			title: captionText
		};
	}


	function openGallery(event, index) {
		event.preventDefault();
		const options = {
			index,
			bgOpacity: 0.8,
			showHideOpacity: true
		};
		const photoswipeWrapper = document.getElementsByClassName('pswp')[0];
		const gallery = new PhotoSwipe(photoswipeWrapper, PhotoSwipeUIDefault, singleImage, options);
		gallery.init();
	}


	Array.from(images).forEach((image, index) => {
		const anchorWrapper = document.createElement('a');
		wrapElement(image, anchorWrapper);

		anchorWrapper.setAttribute('href', image.src);
		const parentFigure = getClosest(image, 'figure');
		parentFigure.setAttribute('data-index', index);

		const caption = parentFigure.querySelector('figcaption');
		const captionText = getCaptionText(caption);

		parentFigure.addEventListener('click', event => {
			singleImage = [setSlideProperties(image, captionText)];
			const anindex = parseInt(parentFigure.getAttribute('data-index'), 10);
			openGallery(event, anindex);
		}, true);
	});
};
