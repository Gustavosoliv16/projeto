export const StatusIcon = ({ status, size = 20 }) => {
  const normalizeStatus = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();

    if (statusLower.includes('aberta') || statusLower.includes('novo') || statusLower.includes('em andamento')) {
      return 'aberta';
    }
    if (statusLower.includes('resolvido') || statusLower.includes('concluido') || statusLower.includes('finalizado')) {
      return 'resolvido';
    }
    if (statusLower.includes('pendente') || statusLower.includes('andamento') || statusLower.includes('aberto')) {
      return 'pendente';
    }
    if (statusLower.includes('fechado') || statusLower.includes('cancelado') || statusLower.includes('rejeitado')) {
      return 'fechado';
    }
    return null;
  };

  const normalizedStatus = normalizeStatus(status);

  const getIcon = () => {
    switch (normalizedStatus) {
        case 'aberta':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#3b82f6"/>
            <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'resolvido':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#22c55e"/>
            <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'pendente':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#f59e0b"/>
            <polyline points="12,6 12,12 16,14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'fechado':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#ef4444"/>
            <path d="m15 9-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m9 9 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#6b7280"/>
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="white">?</text>
          </svg>
        );
    }
  };

  return getIcon();
};