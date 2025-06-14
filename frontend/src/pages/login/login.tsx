import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useCallback, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import type { AuthResponse, LoginRequest } from "../../models/auth";
import { useNavigate } from "react-router";
import styles from "./login.module.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const mutation = useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/");
    },
  });

  const loginClick = useCallback(() => {
    mutation.mutate({
      email,
      password,
    });
  }, [mutation, email, password]);

  const loading = useMemo(() => {
    return mutation.isPending;
  }, [mutation]);

  const valid = useMemo(() => {
    if (!email || !password) {
      return false;
    }

    if (email.length <= 0 || password.length <= 0) {
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      return false;
    }

    return true;
  }, [email, password]);

  return (
    <div className={styles.page}>
      <Card title="Login" className={styles.loginCard}>
        <div className={styles.form}>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
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
              <i className="pi pi-lock"></i>
            </span>
            <Password
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
            />
          </div>
        </div>
        <Divider />
        <div className={styles.buttonContainer}>
          <Button
            label="Login"
            disabled={!valid}
            onClick={loginClick}
            loading={loading}
          />
        </div>
        <div className={styles.linkContainer}>
          <span>Não tem uma conta? </span>
          <Button
            label="Criar Conta"
            link
            onClick={() => navigate("/register")}
          />
        </div>
      </Card>
    </div>
  );
}
