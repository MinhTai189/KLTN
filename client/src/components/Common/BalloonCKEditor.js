import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-kltn/build/ckeditor'
import { getToken } from 'utils';

let url = '';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    url = 'http://localhost:5000/api/uploads/posts';
} else {
    url = 'https://kltnapi.herokuapp.com/api/uploads/posts';
}

const editorConfig = {
    placeholder: 'Gõ nội dung vào đây. Kéo & thả hình để chèn vào bài. Chọn các đoạn chữ để hiện công cụ định dạng...',
    mediaEmbed: {
        previewsInData: true
    },
    simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: url,

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