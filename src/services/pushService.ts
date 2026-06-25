class PushService {

    private registration: ServiceWorkerRegistration | null = null;

    async init() {

        if (!("serviceWorker" in navigator))
            return;

        this.registration = await navigator.serviceWorker.register("/sw.js");

        console.log("Service Worker Ready");

        await navigator.serviceWorker.ready;

    }

    getRegistration() {

        return this.registration;

    }

}

export default new PushService();
