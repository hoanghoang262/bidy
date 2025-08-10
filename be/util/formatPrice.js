function formatPrice(price) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(price);
}

function formatNumberWithVND(price) {
	return new Intl.NumberFormat("vi-VN", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price) + " VNĐ";
}

module.exports = { formatPrice, formatNumberWithVND };
