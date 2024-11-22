// components/CustomCKEditor.js
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CustomCKEditor = ({ editorConfig, data, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            data={data}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default CustomCKEditor;
