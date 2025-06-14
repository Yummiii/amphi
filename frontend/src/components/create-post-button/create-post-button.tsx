import { useState, useRef, useCallback } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload, type FileUploadSelectEvent } from "primereact/fileupload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/posts";
import styles from "./create-post-button.module.scss";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export interface CreatePostButtonProps {
  boardSlug: string;
}

export default function CreatePostButton(props: CreatePostButtonProps) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileUploadRef = useRef<FileUpload>(null);
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", props.boardSlug] });
      setVisible(false);
      setContent("");
      setSelectedFile(null);
      if (fileUploadRef.current) {
        fileUploadRef.current.clear();
      }
    },
  });

  const handleSubmit = useCallback(() => {
    if (content.trim() || selectedFile) {
      createPostMutation.mutate({
        content: content.trim(),
        board: props.boardSlug,
        attachment: selectedFile || undefined,
      });
    }
  }, [content, createPostMutation, props.boardSlug, selectedFile]);

  const onFileSelect = useCallback((e: FileUploadSelectEvent) => {
    const file = e.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const onFileRemove = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
    setContent("");
    setSelectedFile(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  }, []);

  if (!user) {
    return null;
  }

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={closeModal}
        className="p-button-text"
      />
      <Button
        label="Publicar"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={createPostMutation.isPending}
        disabled={!content.trim() && !selectedFile}
      />
    </div>
  );

  return (
    <>
      <Button
        label="Criar post"
        icon="pi pi-plus"
        onClick={() => setVisible(true)}
        className={styles.createPostButton}
        severity="success"
      />

      <Dialog
        header="Criar novo post"
        visible={visible}
        style={{ width: "40vw" }}
        onHide={closeModal}
        footer={footerContent}
      >
        <div className="field">
          <label htmlFor="content">Conteúdo:</label>
          <InputTextarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ width: "100%", marginTop: "0.5rem" }}
            placeholder="Digite o conteúdo da sua publicação..."
          />
        </div>

        <div className="field" style={{ marginTop: "1.3rem" }}>
          <label>Imagem ou vídeo (opcional):</label>
          <FileUpload
            ref={fileUploadRef}
            mode="basic"
            name="attachment"
            accept="image/*,video/*"
            maxFileSize={10000000}
            onSelect={onFileSelect}
            onClear={onFileRemove}
            chooseLabel="Escolher arquivo"
            className={styles.fileUpload}
            style={{ marginTop: "0.5rem" }}
          />
        </div>
      </Dialog>
    </>
  );
}
