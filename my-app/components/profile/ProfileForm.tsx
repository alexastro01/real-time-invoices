import React from 'react';
import { SenderDetails } from '@/types/types';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Mail, Building, Globe } from 'lucide-react';

interface ProfileFormProps {
  senderDetails: SenderDetails;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
  isFetching: boolean;
  toggleEditMode: () => void;
  validateAndProceed: () => Promise<void>;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  senderDetails,
  handleInputChange,
  editMode,
  isFetching,
  toggleEditMode,
  validateAndProceed,
  isLoading
}) => {
  const fields = [
    { id: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
    { id: 'address', label: 'Address', icon: <MapPin className="h-4 w-4" /> },
    { id: 'city', label: 'City', icon: <Building className="h-4 w-4" /> },
    { id: 'state', label: 'State/Province', icon: <Building className="h-4 w-4" /> },
    { id: 'zip', label: 'Zip/Postal Code', icon: <MapPin className="h-4 w-4" /> },
    { id: 'country', label: 'Country', icon: <Globe className="h-4 w-4" /> },
  ];

  const handleSave = async () => {
    await validateAndProceed();
    toggleEditMode();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${senderDetails.name}`} />
            <AvatarFallback>{senderDetails.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          {isFetching ? (
            <Skeleton className="h-8 w-48" />
          ) : editMode ? (
            <Input
              id="name"
              value={senderDetails.name}
              onChange={handleInputChange}
              className="text-2xl font-bold text-center"
            />
          ) : (
            <h2 className="text-2xl font-bold">{senderDetails.name}</h2>
          )}
          <p className="text-sm text-muted-foreground mt-1">{senderDetails.evmAddress}</p>
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center space-x-4">
              {field.icon}
              {isFetching ? (
                <Skeleton className="h-9 flex-grow" />
              ) : editMode ? (
                <div className="flex-grow">
                  <Label htmlFor={field.id} className="sr-only">{field.label}</Label>
                  <Input
                    id={field.id}
                    value={senderDetails[field.id as keyof SenderDetails]}
                    onChange={handleInputChange}
                    placeholder={field.label}
                  />
                </div>
              ) : (
                <p className="flex-grow">{senderDetails[field.id as keyof SenderDetails] || `No ${field.label.toLowerCase()} provided`}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          {editMode ? (
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          ) : (
            <Button onClick={toggleEditMode}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};