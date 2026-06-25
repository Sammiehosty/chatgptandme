const PUBLIC_VAPID_KEY =
    "BD6Bj-MmUU4pMvX9tDdE45zoTVCEGXdDRl_NfubpUx8u84AjrdHvtgtqwb6v4XoEaIQYAty4_hpyZtf3UaY_Hbk";

class PushService {

    private registration: ServiceWorkerRegistration | null = null;

    async init() {

        if (!("serviceWorker" in navigator))
            return;

        this.registration = await navigator.serviceWorker.register("/sw.js");

        console.log("✅ Service Worker Registered");

        await navigator.serviceWorker.ready;

    }

    async requestPermission() {

        if (!("Notification" in window))
            return false;

        const permission = await Notification.requestPermission();

        return permission === "granted";

    }

    async subscribe() {

        if (!this.registration)
            return null;

        const subscription =
            await this.registration.pushManager.subscribe({

                userVisibleOnly: true,

                applicationServerKey: this.urlBase64ToUint8Array(
                    PUBLIC_VAPID_KEY
                )

            });

        return subscription;

    }

    private urlBase64ToUint8Array(base64String: string) {

        const padding = "=".repeat((4 - base64String.length % 4) % 4);

        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);

        return Uint8Array.from(
            [...rawData].map(char => char.charCodeAt(0))
        );

    }

}

export default new PushService();