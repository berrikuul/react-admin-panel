import React, { useState } from "react";
import { usersApi, STORAGE_KEYS, save } from "../api";

export default function AuthModal({ show, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  if (!show) return null;

  const doLogin = async () => {
    setError(null);

    try {
      const allUsers = await usersApi.getAll();
      const user = allUsers.find((u) => u.email === email && u.password === password);

      if (!user) {
        setError("Неверные данные");
        return;
      }

      const auth = { id: user.id, email: user.email, role: user.role };
      save(STORAGE_KEYS.AUTH, auth);
      onLogin(auth);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Ошибка при авторизации");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Вход</h3>

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
          <button onClick={doLogin}>Войти</button>
        </div>
      </div>
    </div>
  );
}
