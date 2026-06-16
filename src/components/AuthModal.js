import React, { useState } from "react";
import {
  usersApi,
  STORAGE_KEYS,
  save,
  validateEmail,
  validatePassword,
} from "../api";

export default function AuthModal({ show, onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  if (!show) return null;

  const doLogin = async () => {
    setError(null);

    try {
      const allUsers = await usersApi.getAll();

      const user = allUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        setError("Неверный email или пароль");
        return;
      }

      const auth = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      save(STORAGE_KEYS.AUTH, auth);

      onLogin(auth);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Ошибка при авторизации");
    }
  };

  const doRegister = async () => {
    setError(null);

    try {
      if (!name.trim()) {
        setError("Введите имя");
        return;
      }

      if (!validateEmail(email)) {
        setError("Некорректный email");
        return;
      }

      if (!validatePassword(password)) {
        setError("Пароль должен содержать минимум 6 символов");
        return;
      }

      const allUsers = await usersApi.getAll();

      const exists = allUsers.find((u) => u.email === email);

      if (exists) {
        setError("Пользователь уже существует");
        return;
      }

      const newUser = await usersApi.add({
        name,
        email,
        password,
      });

      const auth = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };

      save(STORAGE_KEYS.AUTH, auth);

      onLogin(auth);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Ошибка регистрации");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{isRegister ? "Регистрация" : "Вход"}</h3>

        {isRegister && (
          <input
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <div className="modal-buttons">
          {isRegister ? (
            <button onClick={doRegister}>
              Зарегистрироваться
            </button>
          ) : (
            <button onClick={doLogin}>
              Войти
            </button>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          {isRegister ? (
            <button
              onClick={() => setIsRegister(false)}
            >
              Уже есть аккаунт?
            </button>
          ) : (
            <button
              onClick={() => setIsRegister(true)}
            >
              Зарегистрироваться
            </button>
          )}
        </div>
      </div>
    </div>
  );
}