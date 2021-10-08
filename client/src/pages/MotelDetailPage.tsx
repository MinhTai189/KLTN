import { useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Grid } from '@material-ui/core'
import { AlbumMotel, InforMotelDetail, InforOnwerUp, InforRoomDetail } from 'features/motels/components'
import { Header } from 'components/Common'
import { CardItem, Slider } from 'features/rate/components'

interface Props {

}

const MotelDetailPage = (props: Props) => {
    const { id } = useParams<{ id: string }>()
    const albumRef = useRef<HTMLElement>()
    const infoRef = useRef<HTMLElement>()
    const roomRef = useRef<HTMLElement>()

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (albumRef.current && infoRef.current && roomRef.current) {
                const windY = window.scrollY
                const albTop = albumRef.current.offsetTop
                const infoHeight = infoRef.current.clientHeight
                const roomTop = roomRef.current.offsetTop - 70

                if (windY + 58 >= albTop) {
                    const y = (windY * 1.02) - albTop + 58
                    const isScroll = windY + infoHeight < roomTop

                    if (isScroll)
                        infoRef.current.style.transform = `translateY(${y}px)`
                } else {
                    infoRef.current.style.transform = 'translateY(0)'
                }
            }
        })

        return () => {
            window.removeEventListener('scroll', () => { })
        }
    }, [])

    return (
        <>
            <Header isChangeNav={true} />

            <div className="container">
                <h2
                    style={{
                        width: '100%', textAlign: 'center',
                        textTransform: 'uppercase', margin: '120px 0 48px',
                        fontSize: 25
                    }}>
                    Thông tin chi tiết nhà trọ
                </h2>

                <Grid container spacing={2}>
                    <Grid item md={9}>
                        <div ref={albumRef as any}>
                            <AlbumMotel />
                        </div>

                        <InforMotelDetail />
                    </Grid>

                    <Grid item md={3}>
                        <div ref={infoRef as any}>
                            <InforOnwerUp />
                        </div>
                    </Grid>

                    <Grid item md={12}>
                        <div ref={roomRef as any}>
                            <InforRoomDetail />
                        </div>
                    </Grid>
                </Grid>
                <Slider />
            </div>
        </>
    )
}

export default MotelDetailPage
