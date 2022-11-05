/**
 * 添加APP到主屏幕之前
 *
 * @format
 */

export default function onBeforeInstallPrompt(cb: (confirm: CommonFunction) => void) {
	navigator?.serviceWorker?.ready.then((res) => {
		window.addEventListener('beforeinstallprompt', (ev) => {
			// 防止 Chrome 67 及更早版本自动显示安装提示
			ev.preventDefault();
			const addToHomeScreen = () => {
				ev.prompt();
				// 等待用户反馈
				ev.userChoice.then((choiceResult) => {
					if (choiceResult.outcome === 'accepted') {
						console.log('User accepted the A2HS prompt');
					} else {
						console.log('User dismissed the A2HS prompt');
					}
				});
			};
			cb(addToHomeScreen);
		});
	});
}
