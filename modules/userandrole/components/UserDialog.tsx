'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useForm} from 'react-hook-form';
import { CreateUserSchema, CreateUser } from '@/lib/validation/userAndRole';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFieldWrapper } from '@/components/global/Form/FormFieldWrapper';
import { FormSelectField } from '@/components/global/Form/FormSelectField';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  userData?: User | null;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onClose,
  mode,
  userData,
}) => {

  const form = useForm<CreateUser>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (mode === 'edit' && userData) {
      form.reset({
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: '',
      });
    }
  }, [mode, userData, open]);

  const onSubmit = (data: CreateUser) => {
  };

  const handleChange = (field: keyof CreateUser, value: string) => {
    form.setValue(field, value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black">
            {mode === 'create' ? 'Add New User' : 'Edit User'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {mode === 'create'
              ? 'Fill in the details to create a new user'
              : 'Update the user information'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <FormFieldWrapper name='name' control={form.control} label='Full Name' />
            <FormFieldWrapper name='email' control={form.control} label='Email' />
            <FormSelectField
              name='role'
              control={form.control}
              label='Role'
              options={[
                { value: 'Admin', label: 'Admin' },
                { value: 'Editor', label: 'Editor' },
                { value: 'Viewer', label: 'Viewer' },
              ]}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
