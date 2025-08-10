function formatWord(value) {
	const sanitizedValue = value.replace(/\s+/g, " ").trim().split(" ");

	sanitizedValue[0] = sanitizedValue[0].charAt(0).toUpperCase() + sanitizedValue[0].slice(1).toLowerCase();

	const formattedString = sanitizedValue.join(" ");

	return formattedString;
}

module.exports = {
	formatWord,
};
