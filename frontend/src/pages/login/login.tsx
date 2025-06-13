import { Card } from "primereact/card";
import "./login.scss";
import { InputText } from "primereact/inputtext";
import { useCallback, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const mutation = useMutation({
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
    <div className="page">
      <Card title="Login" className="login-card">
        <div className="form">
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
        <div className="button-container">
          <Button
            label="Login"
            disabled={!valid}
            onClick={loginClick}
            loading={loading}
          />
        </div>
      </Card>
    </div>
  );
}
