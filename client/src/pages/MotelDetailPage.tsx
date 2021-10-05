import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

interface Props {

}

const MotelDetailPage = (props: Props) => {
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        console.log({ id })
    }, [])

    return (
        <div>
            This is motel detail page
        </div>
    )
}

export default MotelDetailPage
