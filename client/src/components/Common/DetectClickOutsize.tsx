import { useDetectClickOutside } from "hooks"
import { useRef } from "react"

interface Props {
    children: any
    cb: () => void
}

export const DetectClickOutsize = ({ children, cb }: Props) => {
    const ref = useRef(null)
    useDetectClickOutside(ref, cb)

    return (
        <div ref={ref}>
            {children}
        </div>
    )
}
