import React from 'react';
import { ProfileField } from './ProfileField';
import { SenderDetails } from '@/types/types';

interface ProfileFormProps {
  senderDetails: SenderDetails;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
  isFetching: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ senderDetails, handleInputChange, editMode, isFetching }) => {
  const fields = [
    { id: 'name', label: 'Name', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State/Province' },
    { id: 'zip', label: 'Zip/Postal Code' },
    { id: 'country', label: 'Country' },
  ];

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="grid w-full items-center gap-4">
        {fields.map((field) => (
          <ProfileField
            key={field.id}
            {...field}
            value={senderDetails[field.id as keyof SenderDetails]}
            onChange={handleInputChange}
            disabled={!editMode}
            isFetching={isFetching}
          />
        ))}
      </div>
    </form>
  );
};