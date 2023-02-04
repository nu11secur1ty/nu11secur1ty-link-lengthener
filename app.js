const emotes = ["𐑋", "𐑍", "𐑃", "𐑁", "𐐼"];
const seperator = "ෲ";
const ee = {
	0: "𐑈𐑈𐑈",
	1: "𐐥𐐩𐑈",
	2: "𐐬𐐬𐐥",
	3: "𐑍𐑋𐐹",
	4: "𐐟𐐣𐐬",
	5: "𐐩𐐠𐐟",
	6: "𐐢𐐢𐐢",
	7: "𐐬𐐬𐐬",
	8: "𐑃𐑃𐑃",
	9: "𐑊𐑈𐑇",
};

window.onhashchange = () => window.location.reload();

const URL = location.href;

const codeFormEle = document.querySelector("#formCode");
const codeInputEle = document.querySelector("#codeLinkInput");
const codeResult = document.querySelector("#codeResult");

codeFormEle.addEventListener("submit", handleCode);

function handleCode(e) {
	e.preventDefault();
	let link = codeInputEle.value;
	if (!link.startsWith("https://") && !link.startsWith("http://")) {
		link = "https://" + link;
	}
	codeResult.value = URL + "#go/" + code(link);
}

if (URL.includes("#go")) {
	const SUS_URL = decodeURIComponent(URL.split("go/")[1]);
	const finalLink = decode(SUS_URL);

	const redirectUrlEle = document.querySelector("#redirectURL");
	redirectUrlEle.href = finalLink;
	redirectUrlEle.textContent = finalLink;

	document.querySelector("#redirectBtn").href = finalLink;

	document.querySelector("#redirect-area").classList.remove("hidden");

	const redirectWaitTime = 6;
	const countdownTimerEle = document.querySelector("#countdownTimer");
	countdownTimerEle.textContent = redirectWaitTime;
	setInterval(() => {
		if (countdownTimerEle.textContent <= 0) return;
		countdownTimerEle.textContent = Number(countdownTimerEle.textContent) - 1;
	}, 1000);
	setTimeout(() => (window.location.href = finalLink), redirectWaitTime * 1000);
} else {
	document.querySelector("#main-page").classList.remove("hidden");
}

function code(link) {
	let linkCharCode = [];
	let result = [];
	Array.from(link).forEach((char) => linkCharCode.push(char.charCodeAt()));

	linkCharCode.forEach((c) => {
		const charArr = Array.from(c.toString());
		charArr.forEach((c) => result.push(ee[c] + seperator));
		result.push("𐑍");
	});
	return result.join("");
}

function decode(code) {
	const arr = code.split(seperator);
	const keys = Object.keys(arr);
	let temp = [];
	let result = "";
	arr.forEach((item) => {
		let c = item;
		if (c.includes("𐑍")) {
			const char = String.fromCharCode(temp.join(""));
			result += char;
			c = c.replace("𐑍", "");
			temp = [];
		}
		const charCode = keys.find((key) => ee[key] === c);
		temp.push(charCode);
	});
	return result;
}

const copyToClipboard = (str) => {
	if (navigator && navigator.clipboard && navigator.clipboard.writeText)
		return navigator.clipboard.writeText(str);
	return Promise.reject("The Clipboard API is not available.");
};

let timeout;
const copyTextBtn = document.querySelector("#copyText");
copyTextBtn.addEventListener("click", () => {
	copyToClipboard(codeResult.value);
	copyTextBtn.textContent = "copied";
  
  if(timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    copyTextBtn.textContent = "click to copy";
  }, 1000)
});
