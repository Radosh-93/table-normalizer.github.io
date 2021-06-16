const inputTable = document.getElementById("table-input");
const buttonSubmit = document.getElementById("submit-btn");
const resultField = document.getElementById("result");
const outputTable = document.getElementById("table-output");

buttonSubmit.addEventListener("click", (e) => {
	e.preventDefault();
	let correctTable = deleteTrash(inputTable.value);
	correctTable = upperCaseFirstLetter(correctTable);
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

function upperCaseFirstLetter(table) {
	const parser = new DOMParser();
	const docWithTable = parser.parseFromString(table, "text/html");
	const rows = docWithTable.querySelectorAll("tr");
	rows.forEach((row) => {
		const tdFirst = row.children[0];
		let valueTd = tdFirst.innerText.trim();
		valueTd = valueTd[0].toUpperCase() + valueTd.slice(1);
		tdFirst.innerHTML = valueTd;
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
