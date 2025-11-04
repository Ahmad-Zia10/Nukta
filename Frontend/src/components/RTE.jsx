import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';

export default function RTE({name , control, label ,defaultvalue =' '}) {
    return (
        
        <div className='w-full'> 
        {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
        <Controller
        name={name || "content"}
        control={control}
        render={({field : {onChange}}) => (
            <Editor
            apiKey='x84qahmuovdvu6q1fg0axsm9em4p9bk2l1vglpmslxosbynd'
            initialValue={defaultvalue}
            init={{
                menubar: true,
                height : 500,
                plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={onChange} // onEditorChange is called whenver the content in the editor field changes 
            />

        )}     

        />
        </div>
    
    )
  }


//   <body>
//   <form method="post">
//     <textarea>Hello, World!</textarea>
//   </form>
// </body>
// </html>