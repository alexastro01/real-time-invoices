import React from 'react';
import { SenderDetails } from '@/types/types';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Mail, Building, Globe, Info } from 'lucide-react';

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
    { id: 'email', label: 'Email', icon: <Mail className="h-4 w-4" />, required: true },
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
    <Card className="w-full max-w-3xl mx-auto ">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-16 w-16 sm:h-24 sm:w-24 mb-4">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${senderDetails.name}`} />
            <AvatarFallback>{senderDetails.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          {isFetching ? (
            <Skeleton className="h-8 w-48" />
          ) : editMode ? (
            <div className="w-full max-w-xs">
              <Label htmlFor="name" className="sr-only">Name</Label>
              <Input
                id="name"
                value={senderDetails.name}
                onChange={handleInputChange}
                className="text-xl sm:text-2xl font-bold text-center"
                required
              />
              <p className="text-xs text-red-500 text-center mt-1">* Required</p>
            </div>
          ) : (
            <h2 className="text-xl sm:text-2xl font-bold text-center">{senderDetails.name} <span className='text-red-500 text-xs'>*</span></h2>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-center break-all">{senderDetails.evmAddress}</p>
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:w-1/4">
                {field.icon}
                <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
              </div>
              {isFetching ? (
                <Skeleton className="h-9 flex-grow" />
              ) : editMode ? (
                <div className="flex-grow">
                  <Input
                    id={field.id}
                    value={senderDetails[field.id as keyof SenderDetails]}
                    onChange={handleInputChange}
                    placeholder={field.label}
                    required={field.required}
                  />
                  {field.required && <p className="text-xs text-red-500 mt-1">* Required</p>}
                </div>
              ) : (
                <p className="flex-grow text-sm sm:text-base">
                  {senderDetails[field.id as keyof SenderDetails] || `No ${field.label.toLowerCase()} provided`}
                  {field.required && <span className='text-red-500 text-xs ml-1'>*</span>}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center">
          {editMode ? (
            <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          ) : (
            <Button onClick={toggleEditMode} className="w-full sm:w-auto">
              Edit Profile
            </Button>
          )}
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-4 text-center">
            <Info className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>Fields marked with <span className="text-red-500">*</span> are required.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};