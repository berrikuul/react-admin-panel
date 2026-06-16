// src/components/OfficeEditCard.js
import React, { useState, useEffect } from "react";

/**
 * OfficeEditCard
 * props:
 *  - office: объект офиса
 *  - updateOffice: мутация react-query ({ mutate })
 */
export default function OfficeEditCard({ office, updateOffice }) {
  const [editData, setEditData] = useState(office);
  const [preview, setPreview] = useState(office.img);

  // если внешние данные офиса поменялись, синхронизируем локальное состояние
  useEffect(() => {
    setEditData(office);
    setPreview(office.img);
  }, [office]);

  const handleSave = () => {
    // валидируем простейшие поля (можно расширить)
    const payload = {
      ...editData,
      name: (editData.name || "").trim(),
      desc: editData.desc || "",
      img: editData.img || "",
    };
    updateOffice.mutate(payload);
  };

  return (
    <div className="office-edit-card">
      <div className="office-header">
        <img src={preview} alt={editData.name} onError={() => setPreview(office.img)} />
      </div>

      <div className="office-body">
        <label>Название:</label>
        <input
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />

        <label>Описание:</label>
        <textarea
          value={editData.desc}
          onChange={(e) => setEditData({ ...editData, desc: e.target.value })}
        />

        <label>URL картинки:</label>
        <input
          value={editData.img}
          onChange={(e) => {
            setEditData({ ...editData, img: e.target.value });
            setPreview(e.target.value); 
          }}
        />

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="save-btn" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}
