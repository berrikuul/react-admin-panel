import React from "react";
import "./MapArea.css";

export default function MapArea({ onOpen, offices = [] }) {
  if (!offices || offices.length === 0) return null;

  return (
    <div className="map-area">
      <h3>Комнаты для бронирования</h3>
      <div className="map-grid">
        {offices.flatMap((office) =>
          office.rooms.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="room-info">
                <h4>{room.name}</h4>
                <p>до {room.capacity} чел</p>
              </div>
              <button onClick={() => onOpen(office, room)}>Забронировать</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
