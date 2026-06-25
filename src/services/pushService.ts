class PushService {

    private registration: ServiceWorkerRegistration | null = null;

    async init() {

        if (!('serviceWorker' in navigator))
            return false;

        this.registration = await navigator.serviceWorker.register('/sw.js');

        console.log("Service Worker Registered");

        return true;

    }

}

export default new PushService();
