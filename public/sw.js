/* Service Worker */

self.addEventListener("install", (event) => {
    console.log("Service Worker Installed");

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated");

    event.waitUntil(clients.claim());
});

/*
|--------------------------------------------------------------------------
| Push Notification
|--------------------------------------------------------------------------
*/

self.addEventListener("push", (event) => {

    if (!event.data) return;

    const data = event.data.json();

    const options = {

        body: data.body,

        icon: data.icon || "/icons/icon-192.png",

        badge: data.badge || "/icons/badge-72.png",

        image: data.image || null,

        vibrate: [200, 100, 200],

        requireInteraction: false,

        tag: data.tag || "pst-ifeanyi-sermon",

        renotify: true,

        data: {

            url: data.url || "/"

        },

        actions: [

            {

                action: "listen",

                title: "▶ Listen"

            },

            {

                action: "dismiss",

                title: "Dismiss"

            }

        ]

    };

    event.waitUntil(

        self.registration.showNotification(

            data.title,

            options

        )

    );

});

/*
|--------------------------------------------------------------------------
| Notification Click
|--------------------------------------------------------------------------
*/

self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    if (event.action === "dismiss") {

        return;

    }

    const url = event.notification.data.url || "/";

    event.waitUntil(

        clients.matchAll({

            type: "window",

            includeUncontrolled: true

        }).then((clientList) => {

            for (const client of clientList) {

                if (client.url.includes(self.location.origin)) {

                    client.focus();

                    client.navigate(url);

                    return;

                }

            }

            return clients.openWindow(url);

        })

    );

});

/*
|--------------------------------------------------------------------------
| Notification Close
|--------------------------------------------------------------------------
*/

self.addEventListener("notificationclose", () => {

    console.log("Notification Closed");

});
