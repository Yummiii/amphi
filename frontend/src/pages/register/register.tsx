import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useCallback, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { Calendar } from "primereact/calendar";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../api/auth";
import type { AuthResponse, RegisterRequest } from "../../models/auth";
import { useNavigate } from "react-router";
import styles from "./register.module.scss";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  const navigate = useNavigate();
  const mutation = useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/");
    },
  });

  const registerClick = useCallback(() => {
    if (birthdate) {
      mutation.mutate({
        email,
        username,
        password,
        birthdate: birthdate.toISOString().split("T")[0],
      });
    }
  }, [mutation, email, username, password, birthdate]);

  const loading = useMemo(() => {
    return mutation.isPending;
  }, [mutation]);

  const valid = useMemo(() => {
    if (!email || !username || !password || !confirmPassword || !birthdate) {
      return false;
    }

    if (email.length <= 0 || username.length <= 0 || password.length <= 0) {
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      return false;
    }

    if (password !== confirmPassword) {
      return false;
    }

    if (password.length < 6) {
      return false;
    }

    return true;
  }, [email, username, password, confirmPassword, birthdate]);

  return (
    <div className={styles.page}>
      <Card title="Criar Conta" className={styles.loginCard}>
        <div className={styles.form}>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-envelope"></i>
            </span>
            <InputText
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-calendar"></i>
            </span>
            <Calendar
              placeholder="Data de nascimento"
              value={birthdate}
              onChange={(e) => setBirthdate(e.value as Date)}
              dateFormat="dd/mm/yy"
              maxDate={new Date()}
              yearRange="1900:2030"
            />
          </div>

          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <Password
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={true}
              toggleMask
            />
          </div>

          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <Password
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              feedback={false}
              toggleMask
            />
          </div>
        </div>
        <Divider />
        <div className={styles.buttonContainer}>
          <Button
            label="Criar Conta"
            disabled={!valid}
            onClick={registerClick}
            loading={loading}
          />
        </div>
        <div className={styles.linkContainer}>
          <span>Já tem uma conta?</span>
          <Button label="Fazer Login" link onClick={() => navigate("/login")} />
        </div>
      </Card>
    </div>
  );
}
