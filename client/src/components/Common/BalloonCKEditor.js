import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { getToken } from 'utils';

const editorConfig = {
    placeholder: 'Gõ nội dung vào đây. Kéo & thả hình để chèn vào bài. Chọn các đoạn chữ để hiện công cụ định dạng...',
    simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: 'http://localhost:5000/api/uploads/posts',

        // Headers sent along with the XMLHttpRequest to the upload server.
        headers: {
            Authorization: getToken().accessToken
        }
    },
}

export const BalloonCKEditor = ({ value, onChange }) => {
    return (
        <CKEditor
            editor={Editor}
            config={editorConfig}
            data={value}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data)
            }}
        />
    )
}