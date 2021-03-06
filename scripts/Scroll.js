export const Scroll = {
	headerLinks: document.querySelectorAll(".menu a"),
	sectionsElements: document.querySelectorAll("section"),

	closeMenuFunction: () => {},

	init(closeMenuFunction) {
		Scroll.headerLinks.forEach((element) => {
			element.addEventListener("click", Scroll.scrollToIdSection);
		});

		Scroll.scrollEventListeners();

		Scroll.verifyActualOffset();

		Scroll.closeMenuFunction = closeMenuFunction;
	},

	scrollToIdSection(event) {
		event.preventDefault();

		let element = event.target;

		let to = Scroll.getYOffset(element);

		Scroll.smoothScrollTo(0, to);

		Scroll.closeMenuFunction();

		console.log(Scroll.getYOffset(element));
	},

	getYOffset(element) {
		let href = element.getAttribute("href");
		let sectionElement = document.querySelector(href);
		let headerHeight = document.querySelector("header").offsetHeight;

		return sectionElement.offsetTop - (headerHeight + 16);
	},

	verifyActualOffset() {
		let yOffset = window.pageYOffset;

		let links = Scroll.headerLinks;

		if (yOffset < Scroll.getYOffset(links[1])) {
			Scroll.activeElement(Scroll.headerLinks[0]);
		} else if (
			yOffset >= Scroll.getYOffset(links[1]) &&
			yOffset < Scroll.getYOffset(links[2])
		) {
			Scroll.activeElement(Scroll.headerLinks[1]);
		} else if (
			yOffset >= Scroll.getYOffset(links[2]) &&
			yOffset < Scroll.getYOffset(links[3])
		) {
			Scroll.activeElement(Scroll.headerLinks[2]);
		} else if (
			yOffset >= Scroll.getYOffset(links[3]) &&
			yOffset < Scroll.getYOffset(links[4]) - 15
		) {
			Scroll.activeElement(Scroll.headerLinks[3]);
		} else if (yOffset >= Scroll.getYOffset(links[4]) - 15) {
			Scroll.activeElement(Scroll.headerLinks[4]);
		}
	},

	activeElement(element) {
		Scroll.headerLinks.forEach((el) => el.classList.remove("active"));

		element.classList.add("active");
	},

	smoothScrollTo(endX, endY, duration) {
		const startX = window.scrollX || window.pageXOffset;
		const startY = window.scrollY || window.pageYOffset;
		const distanceX = endX - startX;
		const distanceY = endY - startY;
		const startTime = new Date().getTime();

		duration = typeof duration !== "undefined" ? duration : 400;

		const easeInOutQuart = (time, from, distance, duration) => {
			if ((time /= duration / 2) < 1)
				return (distance / 2) * time * time * time * time + from;
			return (
				(-distance / 2) * ((time -= 2) * time * time * time - 2) + from
			);
		};

		const timer = setInterval(() => {
			const time = new Date().getTime() - startTime;
			const newX = easeInOutQuart(time, startX, distanceX, duration);
			const newY = easeInOutQuart(time, startY, distanceY, duration);
			if (time >= duration) {
				clearInterval(timer);
			}
			window.scroll(newX, newY);
		}, 1000 / 60);
	},

	hideHeader() {
		if (Scroll.detectScrollDir() == "up" && window.pageYOffset > 300) {
			document.querySelector("header").classList.add("hidden");
		} else {
			document.querySelector("header").classList.remove("hidden");
		}
	},

	detectScrollDir(event) {
		let delta = null;
		let direction = false;

		if (!event) event = window.event;

		if (event.wheelDelta) {
			delta = event.wheelDelta / 60;
		} else if (event.detail) {
			delta = -event.detail / 2;
		}

		if (delta !== null) {
			direction = delta > 0 ? "up" : "down";
		}

		return direction;
	},

	scrollEventListeners() {
		document.body.addEventListener("mousewheel", Scroll.verifyActualOffset);
		window.onscroll = () => {
			Scroll.hideHeader;
			Scroll.verifyActualOffset();
		};
		document.body.addEventListener("mousewheel", Scroll.hideHeader, false);
		document.body.addEventListener("touchmove", Scroll.hideHeader, false);
		document.body.addEventListener(
			"DOMMouseScroll",
			Scroll.hideHeader,
			false
		);
	},
};
