function filterAuctionEndWithTimeAgo(auction, _compareTime) {
	const currentTime = new Date();
	return auction.filter((i) => i.bidHideTime?.getTime() >= currentTime.getTime());
}

module.exports = filterAuctionEndWithTimeAgo;
