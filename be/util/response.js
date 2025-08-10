exports.response = (status, message, data) => {
	const result = {
		status,
		message,
	};
	data && result.status === 'success' ? (result.data = data) : (result.error_code = data);

	return result;
};
