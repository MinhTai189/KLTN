import { Grid } from '@material-ui/core'
import { motelApi } from 'api/motel'
import { Header } from 'components/Common'
import { AlbumMotel, InforMotelDetail, InforOnwerUp, InforRoomDetail } from 'features/motels/components'
import { Slider } from 'features/rate/components'
import { Editor, Motel, MotelOnly, Owner, Response, Room } from 'models'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Props {

}

interface OwnerDetail extends Owner {
    createdAt: string
}

interface DataMotel {
    album: string[]
    room: Room[]
    motel: MotelOnly | undefined
    editor: Editor[]
    owner: OwnerDetail | undefined
}

const MotelDetailPage = (props: Props) => {
    const { id } = useParams<{ id: string }>()
    const [dataMotel, setDataMotel] = useState<DataMotel>({
        album: [],
        motel: undefined,
        room: [],
        editor: [],
        owner: undefined
    })

    const albumRef = useRef<HTMLElement>()
    const infoRef = useRef<HTMLElement>()
    const roomRef = useRef<HTMLElement>()

    useEffect(() => {
        //scroll page event
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

        //get motel
        motelApi.getMotelById(id)
            .then((res: Response<Motel>) => {
                const { data } = res
                const { images, thumbnail, editor, owner, createdAt, room, ...motel } = data

                const album: string[] = []
                album.push(images as any, thumbnail as string)

                console.log({ data })

                setDataMotel({
                    ...dataMotel,
                    album,
                    room,
                    editor: (editor as Editor[]),
                    owner: { ...owner, createdAt: (createdAt as string) } as OwnerDetail
                })
            })
            .catch((err: any) => console.log('Get Motel failed', err))

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
                            {dataMotel.album.length > 0 && <AlbumMotel images={dataMotel.album} />}
                        </div>

                        <InforMotelDetail />
                    </Grid>

                    <Grid item md={3}>
                        <div ref={infoRef as any}>
                            {/* {dataMotel.owner && dataMotel.editor.length > 0 && <InforOnwerUp editor={dataMotel.editor} owner={dataMotel.owner} />} */}
                        </div>
                    </Grid>

                    <Grid item md={12}>
                        <div ref={roomRef as any}>
                            <InforRoomDetail room={dataMotel.room} />
                        </div>
                    </Grid>
                </Grid>
                <Slider />
            </div>
        </>
    )
}

export default MotelDetailPage
