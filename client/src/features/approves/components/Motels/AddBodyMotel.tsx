import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { MotelApprove } from "models"
import { useMemo } from "react"
import Carousel from 'react-elastic-carousel'
import AddRowContent from "../common/AddRowContent"
import TableRoom from "./TableRoom"

interface Props {
    dataMotel: MotelApprove
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .carousel': {
            '& .rec-carousel': {
                position: 'relative',
            },

            '& .rec-slider-container': {
                margin: 0
            },

            '& .rec-arrow': {
                position: 'absolute',
                width: 25,
                height: 40,
                lineHeight: 'unset',
                fontSize: 17,
                background: 'rgba(0, 0, 0, 0.4)',
                minWidth: 'unset',
                borderRadius: 0,
                border: "none",
                outline: 'none',
                boxShadow: 'none',
                color: '#fff',

                '&:disabled': {
                    cursor: 'pointer'
                },

                '&:hover:enabled': {
                    background: 'rgba(0, 0, 0, 0.4)',
                },

                '&.rec-arrow-right': {
                    right: 0
                },

                '&.rec-arrow-left': {
                    left: 0,
                    zIndex: 5
                }
            },

            '& .images': {
                width: '100%',
                height: 65,
                objectFit: 'cover'
            }
        }
    }
}))

const AddBodyMotel = ({ dataMotel }: Props) => {
    const classes = useStyles()

    const desc = dataMotel.desc.length > 120 ? `${dataMotel.desc.slice(0, 120)}...` : dataMotel.desc

    const listImg = [dataMotel.thumbnail, ...dataMotel.images]

    const school = useMemo(() => {
        return dataMotel.school.map(x => x.name).join(',')
    }, [dataMotel])

    return (
        <Box className={classes.root}>
            <AddRowContent
                labelLeft='Tên nhà trọ'
                contentLeft={dataMotel.name}
                linkContentLeft={dataMotel.type === 'update' ? `/motels/${dataMotel._id}` : undefined}
                labelRight="Địa chỉ"
                contentRight={dataMotel.address}
            />

            <AddRowContent
                labelLeft='Mô tả'
                contentLeft={desc}
                titleContentLeft={dataMotel.desc}
                labelRight="Trường học"
                contentRight={school}
            />

            <AddRowContent
                labelLeft='Điện thoại'
                contentLeft={dataMotel.contact.phone || ''}
                labelRight="Email"
                contentRight={dataMotel.contact.email || ''}
            />

            <AddRowContent
                labelLeft='Facebook'
                contentLeft={dataMotel.contact.facebook || ''}
                labelRight="Zalo"
                contentRight={dataMotel.contact.zalo || ''}
            />

            <AddRowContent
                labelLeft='Trạng thái'
                contentLeft={dataMotel.status ? 'Còn phòng' : 'Hết phòng'}
                labelRight="Phòng trống"
                contentRight={dataMotel.available ? `${dataMotel.available} phòng` : ''}
            />

            {dataMotel.room && <TableRoom rooms={dataMotel.room} />}

            <Box mt={2} mb={1}>
                <Carousel
                    className='carousel'
                    itemsToShow={5}
                    isRTL={false}
                    pagination={false}
                    itemPosition='START'
                    enableSwipe={false}
                    enableMouseSwipe={false}
                    itemPadding={[0, 4, 0, 4]}
                    showEmptySlots={true}
                >
                    {listImg.map((url, index) => {

                        return (
                            <img
                                key={index.toString()}
                                className="images"
                                src={url}
                                alt="Tìm nhà trọ sinh viên"
                            />
                        )
                    })}
                </Carousel>
            </Box>
        </Box>
    )
}

export default AddBodyMotel
