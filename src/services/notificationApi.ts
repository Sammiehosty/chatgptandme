export async function getNotifications() {

    const response = await fetch(

        "/api/notifications"

    );

    return response.json();

}
