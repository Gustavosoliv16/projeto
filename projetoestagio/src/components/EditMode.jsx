import { useState, useEffect } from 'react';
import '../styles/Mode.css';

// O componente agora espera 'entity' que deve ser um objeto com as propriedades 'id' e 'name'
const EditMode = ({ isOpen, onClose, onSave, entity, entityName }) => {
  const [currentName, setCurrentName] = useState('');

  // Este hook atualiza o nome no campo de texto sempre que o modal é aberto com uma nova entidade
  useEffect(() => {
    if (isOpen && entity) {
      setCurrentName(entity.name || '');
    }
  }, [isOpen, entity]);

  if (!isOpen) {
    return null;
  }

  // A função de salvar agora é mais simples
  const handleSave = () => {
    // Verifica se o nome não está vazio
    if (!currentName.trim()) {
      alert(`O nome do ${entityName} não pode estar em branco.`);
      return;
    }
    // Verifica se a entidade e o ID existem antes de salvar
    if (entity && entity.id) {
      onSave(entity.id, currentName.trim());
    } else {
      console.error("Erro: A entidade ou o ID da entidade não foi fornecido para o modal.", entity);
      alert("Ocorreu um erro ao tentar salvar. O ID não foi encontrado.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Editar {entityName}</h2>
        <label htmlFor="edit-name" className="form-label">Nome</label>
        <input
          id="edit-name"
          type="text"
          className="form-input"
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          autoFocus
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