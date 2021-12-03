import { NotificationItem } from "./NotificationItem"

interface Props {

}

export const ListNotification = (props: Props) => {
    return (
        <ul>
            {new Array(10).fill(1).map((_, index) => (
                <NotificationItem
                    key={index}
                    isUnread={index < 4}
                />
            ))}
        </ul>
    )
}
