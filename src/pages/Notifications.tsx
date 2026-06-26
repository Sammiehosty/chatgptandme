import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationApi";

export default function Notifications() {

    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {

        getNotifications()

            .then(setItems);

    }, []);

    return (

        <div className="page">

            <h1>Notifications</h1>

            {items.map(item => (

                <div
                    key={item.id}
                    className="notification-card"
                >

                    <h3>{item.title}</h3>

                    <p>{item.body}</p>

                    <small>{item.sent_at}</small>

                </div>

            ))}

        </div>

    );

}
