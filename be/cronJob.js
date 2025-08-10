const cron = require("node-cron");
const auctionService = require("./auction_component/auction.service");

const startCronJob = () => {
	// Optimized: Run every minute instead of every second (60x performance improvement)
	// This is sufficient for auction bid processing and reduces server load significantly
	const job = cron.schedule("0 * * * * *", async () => {
		try {
			const result = await auctionService.activeAutoBid();
			if (result === "stop") {
				// Cron job stopped
				job.stop();
			}
		} catch (error) {
			console.error("❌[Cron]: Error in cron job:", error.message);
		}
	});
	
	// Add graceful shutdown handling
	process.on('SIGTERM', () => {
		console.log('⚡️[Cron]: Gracefully stopping cron job...');
		if (job) job.stop();
	});
	
	console.log("⚡️[Cron]: Auction cron job started (runs every minute)");
};

// const userService = require("./auction_component/auction.service");
// const { CronJob } = require("cron");

// const TIME_ZONE = {
// 	VN_TZ: "Asia/Ho_Chi_Minh",
// };

// const runCronTxJob = (user_id) => {
// 	console.log("running");
// 	try {
// 		const runCronTxJob = new CronJob(
// 			"* * * * * *",
// 			async function () {
// 				try {
// 					const status = await userService.eventCheckout(user_id);
// 					if (status === "ok") {
// 						cronJob.stop();
// 					}
// 				} catch (error) {
// 					console.error("Lỗi trong eventCheckout:", error);
// 				}
// 			},
// 			// null,
// 			true,
// 			"Asia/Ho_Chi_Minh"
// 		);
// 		runCronTxJob.start();
// 	} catch (error) {
// 		console.error("Lỗi khởi tạo CronJob:", error);
// 	}
// };

// const eventBidEndJob = (time, bid_id) => {
// 	console.log("running");
// 	try {
// 		new CronJob({
// 			/* at every minute check status transaction to update db */
// 			cronTime: time + " * * * * *",
// 			async onTick() {
// 				const status = await service.eventBidEnd(bid_id);
// 			},
// 			start: true,
// 			timeZone: TIME_ZONE.VN_TZ,
// 		}).start();
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const runCronMintNFTJob = () => {
//     try {
//         new CronJob({
//             /* at 2:30AM every day check available market to update db */
//             cronTime: "30 2 * * *",
//             onTick() {
//               createNFT();
//             },
//             start: true,
//             timeZone: TIME_ZONE.VN_TZ,
//         }).start();
//     } catch (error) {
//         throw new Error(error);
//     }
// };

// const runCronListingNFTJob = () => {
//   try {
//     new CronJob({
//       /* at every 5 minutes list market to update db */
//       cronTime: '*/5 * * * *',
//       onTick() {
//         listNft()
//       },
//       start: true,
//       timeZone: TIME_ZONE.VN_TZ,
//     }).start()

//   } catch (error) {
//     throw new Error(error);
//   }
// }

// const runResetDataLeaderBoard = () => {
//   try {
//     new CronJob({
//       /* at 0:00AM every day reset data leader board */
//       cronTime: '0 0 * * *',
//       onTick() {
//         resetDataLeaderBoard()
//       },
//       start: true,
//       timeZone: TIME_ZONE.VN_TZ,
//     }).start()

//   } catch (error) {
//     throw new Error(error);
//   }
// }

module.exports = {
	startCronJob,
	// runCronTxJob,
	// eventBidEndJob,
	//,runCronMintNFTJob,
	//   ,runCronListingNFTJob,
	//   runResetDataLeaderBoard
};
