import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { useEffect, useRef, useState } from 'react';

const EDITOR_TOOLS = {
  header: {
    class: Header,
    config: {
      placeholder: 'Заголовок',
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
};

let isInitialized = false;

export interface EditorProps {
  data: OutputData;
  readOnly?: boolean;
  setEditorRef: Function;
}

const Editor = (
  { data, readOnly, setEditorRef }: EditorProps = {
    data: { blocks: [] },
    readOnly: true,
    setEditorRef: () => {},
  },
) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ref = root.current;
    let editor: EditorJS | null = null;
    (async function setup() {
      if (!isInitialized) {
        isInitialized = true;
        editor = new EditorJS({
          holder: 'editor-js',
          tools: EDITOR_TOOLS,
          data: data,
          readOnly: readOnly,
        });
        await editor.isReady;
        if (setEditorRef !== undefined) {
          setEditorRef(editor);
        }
      }
    })();

    return () => {
      (async function remove() {
        if (ref) {
          ref.innerHTML = '';
        }
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={root} id='editor-js' className='prose'></div>;
};

export default Editor;
