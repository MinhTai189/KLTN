import { Box } from '@material-ui/core'
import { Spin } from 'antd'

interface Props {
    size?: "large" | "small" | "default"
}

export const LoadingAdmin = ({ size = 'default' }: Props) => {
    return (
        <Box style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            placeItems: 'center'
        }}>
            <Spin size={size} />
        </Box>
    )
}
