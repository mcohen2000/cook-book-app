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
    <div className='min-w-[300px]'>
      <h2 className='text-xl font-semibold mb-4 text-red-500'>
        Confirm Delete
      </h2>
      <div className='mb-5 text-base text-gray-700'>
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
      <div className='flex justify-end gap-2'>
        <button
          type='button'
          onClick={closeModal}
          className='flex items-center rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors cursor-pointer hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={loading}
        >
          <XIcon className='mr-1 h-[20px] w-[20px]' /> Cancel
        </button>
        <button
          type='button'
          onClick={onConfirm}
          className='flex items-center rounded-md bg-red-500 px-4 py-2 font-medium text-white transition-colors cursor-pointer hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={loading}
        >
          <CheckIcon className='mr-1 h-[20px] w-[20px]' />
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
