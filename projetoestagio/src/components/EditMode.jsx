import React, { useState, useEffect } from 'react';
import '../styles/Mode.css'; // Vamos criar este arquivo de estilo a seguir

const EditMode = ({ isOpen, onClose, onSave, entity, entityName }) => {
  const [name, setName] = useState('');

  useEffect(() => {
 
    if (entity) {
      setName(entity.nome || '');
    }
  }, [entity]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (name.trim()) {
      onSave(entity.id, name.trim());
    } else {
      alert(`O nome do ${entityName} não pode estar em branco.`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Editar {entityName}</h2>
        <label htmlFor="edit-name" className="form-label">Nome</label>
        <input
          id="edit-name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default EditMode;