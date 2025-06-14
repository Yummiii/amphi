import { useState, useRef, useCallback } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload, type FileUploadSelectEvent } from "primereact/fileupload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "../../api/boards";
import styles from "./create-board-button.module.scss";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function CreateBoardButton() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileUploadRef = useRef<FileUpload>(null);
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setVisible(false);
      setName("");
      setDescription("");
      setSlug("");
      setSelectedFile(null);
      if (fileUploadRef.current) {
        fileUploadRef.current.clear();
      }
    },
  });

  const handleSubmit = useCallback(() => {
    if (name.trim() && description.trim() && slug.trim()) {
      createBoardMutation.mutate({
        name: name.trim(),
        description: description.trim(),
        slug: slug.trim(),
        image: selectedFile || undefined,
      });
    }
  }, [name, description, slug, selectedFile, createBoardMutation]);

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
    setName("");
    setDescription("");
    setSlug("");
    setSelectedFile(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  }, []);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 32);
    setSlug(generatedSlug);
  }, []);

  const handleSlugChange = useCallback((value: string) => {
    const sanitizedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .substring(0, 32);
    setSlug(sanitizedSlug);
  }, []);

  if (!user) {
    return null;
  }

  const isFormValid = name.trim() && description.trim() && slug.trim();

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={closeModal}
        className="p-button-text"
      />
      <Button
        label="Criar Board"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={createBoardMutation.isPending}
        disabled={!isFormValid}
      />
    </div>
  );

  return (
    <>
      <div className={styles.creatContainer}>
        <Button
          label="Criar Board"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
          className={styles.createBoardButton}
          severity="success"
          size="small"
        />
      </div>

      <Dialog
        header="Criar nova board"
        visible={visible}
        style={{ width: "40vw" }}
        onHide={closeModal}
        footer={footerContent}
      >
        <div className="field">
          <label htmlFor="name">Nome:</label>
          <InputText
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            style={{ width: "100%", marginTop: "0.5rem" }}
            placeholder="Digite o nome da board..."
          />
        </div>

        <div className="field" style={{ marginTop: "1.3rem" }}>
          <label htmlFor="description">Descrição:</label>
          <InputTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", marginTop: "0.5rem" }}
            placeholder="Digite a descrição da board..."
          />
        </div>

        <div className="field" style={{ marginTop: "1.3rem" }}>
          <label htmlFor="slug">Slug:</label>
          <InputText
            id="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            style={{ width: "100%", marginTop: "0.5rem" }}
            placeholder="slug-da-board"
            maxLength={32}
          />
          <small
            style={{
              color: "var(--text-color-secondary)",
              fontSize: "0.75rem",
            }}
          >
            {slug.length}/32 caracteres
          </small>
        </div>

        <div className="field" style={{ marginTop: "1.3rem" }}>
          <label>Imagem (opcional):</label>
          <FileUpload
            ref={fileUploadRef}
            mode="basic"
            name="image"
            accept="image/*"
            maxFileSize={5000000}
            onSelect={onFileSelect}
            onClear={onFileRemove}
            chooseLabel="Escolher imagem"
            className={styles.fileUpload}
            style={{ marginTop: "0.5rem" }}
          />
        </div>
      </Dialog>
    </>
  );
}
