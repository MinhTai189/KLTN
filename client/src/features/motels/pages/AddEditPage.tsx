import { RollbackOutlined } from "@ant-design/icons"
import { Box } from "@material-ui/core"
import { Typography } from "antd"
import { Link, useParams } from "react-router-dom"
import { InputField } from "../components"

interface EditParams {
    id: string
}

const { Title } = Typography

const AddEditPage = () => {
    const { id } = useParams<EditParams>()

    return (
        <Box>
            <Box>
                <Link to='/admin/motels'>
                    <RollbackOutlined />
                    Quay về
                </Link>
            </Box>

            <Box>
                <Box>
                    <Title level={2}>
                        {id ? "Chỉnh sửa nhà trọ" : "Thêm nhà trọ"}
                    </Title>
                </Box>z

                <Box>
                    <InputField name='name' label='Tên nhà trọ' placeHolder='Nhập tên của nhà trọ' />
                    <InputField name='address' label='Địa chỉ' placeHolder='Nhập địa của nhà trọ' />

                    <InputField type='number' step={10000} min={0} max={30000000} name='price' label='Giá thuê' placeHolder='Tiền thuê/tháng' />

                    <InputField type='area' rows={4} name='desc' label='Mô tả' placeHolder='Hãy ghi một số mô tả về nhà trọ' />

                    <InputField type='number' step={1} min={0} max={50} name='room' label='Số lượng phòng' placeHolder='Số lượng phòng cho thuê' />

                    <Box>
                        <Typography>Diện tích phòng(mét)</Typography>

                        <Box>
                            <InputField type='number' step={1} min={1} max={100} name='length' label='Chiều' placeHolder='Số lượng phòng cho thuê' />
                            <InputField type='number' step={1} min={1} max={100} name='room' label='Số lượng phòng' placeHolder='Số lượng phòng cho thuê' />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default AddEditPage
