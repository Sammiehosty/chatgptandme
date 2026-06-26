import { useEffect, useState } from "react";

interface NotificationItem {
    id: number;
    title: string;
    body: string;
    image?: string;
    url?: string;
    sent_at: string;
}

export default function Notifications() {

    const [items, setItems] = useState<NotificationItem[]>([]);

    useEffect(() => {

        fetch("https://vcc.sammiehosty.com/api/notifications/index.php")
            .then(res => res.json())
            .then(setItems)
            .catch(console.error);

    }, []);

    return (

        <div className="max-w-5xl mx-auto px-4 py-6">

            <h1 className="text-3xl font-bold mb-6">
                🔔 Notifications
            </h1>

            {items.length === 0 && (

                <div className="text-center text-gray-500 py-10">

                    No notifications yet.

                </div>

            )}

            {items.map(item => (

                <div
                    key={item.id}
                    className="bg-slate-800 rounded-xl p-4 mb-4"
                >

                    <h3 className="font-bold text-lg">

                        {item.title}

                    </h3>

                    <p className="mt-2">

                        {item.body}

                    </p>

                    <small className="text-gray-400">

                        {item.sent_at}

                    </small>

                </div>

            ))}

        </div>

    );

}
