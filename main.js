const inputTable = document.getElementById("table-input");
const buttonSubmit = document.getElementById("submit-btn");
const resultField = document.getElementById("result");
const outputTable = document.getElementById("table-output");

buttonSubmit.addEventListener("click", (e) => {
	e.preventDefault();
	let correctTable = deleteTrash(inputTable.value);
	correctTable = changeCaseFirstLetter(correctTable);
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

function changeCaseFirstLetter(table) {
	const parser = new DOMParser();
	const docWithTable = parser.parseFromString(table, "text/html");
	const rows = docWithTable.querySelectorAll("tr");
	rows.forEach((row) => {
		const [tdFirst, tdSecond] = row.children;
		//First cell of row
		let valueTdFirst = tdFirst.innerText.trim();
		valueTdFirst = valueTdFirst[0].toUpperCase() + valueTdFirst.slice(1);
		tdFirst.innerHTML = valueTdFirst;
		//Second cell of  row
		if (!tdSecond) return;
		let valueTdSecond = tdSecond?.innerText.trim();
		if (
			valueTdSecond?.length > 1 &&
			valueTdSecond[1]?.toLowerCase() === valueTdSecond[1]
		) {
			valueTdSecond = valueTdSecond[0].toLowerCase() + valueTdSecond.slice(1);
		}
		tdSecond.innerHTML = valueTdSecond;
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
