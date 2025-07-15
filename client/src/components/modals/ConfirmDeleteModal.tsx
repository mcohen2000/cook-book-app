import { type FC } from 'react';
import CheckIcon from '../icons/CheckIcon';
import XIcon from '../icons/XIcon';
import { useModal } from '../../context/ModalContext';

interface ConfirmDeleteModalProps {
  itemType: string; // e.g., 'recipe', 'cookbook'
  itemName?: string; // Optional, e.g., the title
  onConfirm: () => void;
  message?: string;
  loading?: boolean;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  itemType,
  itemName,
  onConfirm,
  message,
  loading = false,
}) => {
  const { closeModal } = useModal();

  return (
    <div style={{ minWidth: 300 }}>
      <h2
        style={{
          fontWeight: 600,
          fontSize: 20,
          marginBottom: 16,
          color: '#ef4444',
        }}
      >
        Confirm Delete
      </h2>
      <div style={{ marginBottom: 20, color: '#374151', fontSize: 16 }}>
        {message ? (
          <span>{message}</span>
        ) : (
          <span>
            Are you sure you want to delete this {itemType}
            {itemName ? `: "${itemName}"` : ''}?<br />
            This action cannot be undone.
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button
          type='button'
          onClick={closeModal}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            fontSize: 16,
            padding: '8px 16px',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          disabled={loading}
        >
          <XIcon className='w-[20px] h-[20px] mr-1' /> Cancel
        </button>
        <button
          type='button'
          onClick={onConfirm}
          style={{
            background: '#ef4444',
            border: 'none',
            color: 'white',
            fontSize: 16,
            padding: '8px 16px',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
          }}
          disabled={loading}
        >
          <CheckIcon className='w-[20px] h-[20px] mr-1' />
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
