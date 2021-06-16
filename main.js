import { dictionary } from "./data.js";
const inputTable = document.getElementById("table-input");
const buttonSubmit = document.getElementById("submit-btn");
const buttonTranslate = document.getElementById("translate-btn");
const resultField = document.getElementById("result");
const outputTable = document.getElementById("table-output");

buttonSubmit.addEventListener("click", (e) => {
	e.preventDefault();
	let correctTable = deleteTrash(inputTable.value);
	correctTable = changeValueOfTable(correctTable, changeFirstLetter);
	resultField.innerHTML = correctTable;
	outputTable.value = correctTable;
	copyText(correctTable);
});

buttonTranslate.addEventListener("click", (e) => {
	e.preventDefault();
	let correctTable = changeValueOfTable(outputTable.value, translateToUA);
	resultField.innerHTML = correctTable;
	outputTable.value = correctTable;
	copyText(correctTable);
});

function deleteTrash(text) {
	const regExForAttr = /\s?((class|style|id)=".+?")/g;
	const regExForA = /<a.*?>(.+)<\/.*?a>/g;
	const regExForStrong = /<strong.*?>(.+)<\/.*?strong>/g;
	//Delete attributes
	let newText = text.replace(regExForAttr, "");
	//Delete links
	newText = newText.replace(regExForA, (result) => {
		const replaceA = result.replace(/<\/?a.*?>/g, "");
		return replaceA;
	});
	//Replace table headers(<th></th>)
	newText = newText.replace(/<\/?.*?th>/g, (match) => {
		return match.replace(/th/, "td");
	});
	//Delete <strong>
	newText = newText.replace(regExForStrong, (match) => {
		const result = match.match(/<strong.*?>(.+?)<\/.*?strong>/)[1];
		return result;
	});

	return newText;
}

function changeValueOfTable(table, callback) {
	const parser = new DOMParser();
	const docWithTable = parser.parseFromString(table, "text/html");
	const typeTable = typeof table;
	const rows = docWithTable.querySelectorAll("tr");
	rows.forEach((row) => {
		const [tdFirst, tdSecond] = row.children;
		//First cell of row
		tdFirst.innerHTML = callback(tdFirst.innerText.trim(), "upper");
		//Second cell of  row
		if (!tdSecond) return;
		tdSecond.innerHTML = callback(tdSecond.innerText.trim(), "lower");
	});
	table = docWithTable.body.innerHTML;

	return table;
}

function copyText(str) {
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
}

function changeFirstLetter(text, wordCase) {
	if (!text) return text;
	if (
		wordCase === "lower" &&
		text.length > 1 &&
		text[1].toLowerCase() === text[1]
	) {
		return text[0].toLowerCase() + text.slice(1);
	}
	if (wordCase === "upper") {
		return text[0].toUpperCase() + text.slice(1);
	}
	return text;
}

function isAbbreviation(text) {
	return text[1].toUpperCase() === text[1];
}
function translateToUA(text) {
	const arrWords = text.split(" ");
	const translateArr = arrWords.map((word) => {
		try {
			const lowWord = word.toLowerCase();
			const [all, rWord, wSymbol = ""] = lowWord.match(
				/([\wА-ЯЁа-яё]+)([,.]*)?/
			); //?
			let translatedWord = dictionary[rWord];
			if (!translatedWord) return word;

			translatedWord += wSymbol;
			//Check if this capitalize word
			if (lowWord !== word) {
				if (isAbbreviation(word)) {
					return translatedWord?.toUpperCase();
				}
				const upperWord =
					translatedWord?.[0].toUpperCase() + translatedWord?.slice(1);
				return upperWord;
			}
			return translatedWord;
		} catch (error) {
			console.log(error);
		}
	});
	return translateArr.join(" ");
}
//translateToUA("Some") //?
