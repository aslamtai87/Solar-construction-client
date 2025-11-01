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
import { useForm } from 'react-hook-form';
import { CreateUserSchema, CreateUser } from '@/lib/validation/userAndRole';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFieldWrapper } from '@/components/global/Form/FormFieldWrapper';
import { FormSelectField } from '@/components/global/Form/FormSelectField';
import { useCreateStaff, useUpdateStaff } from '@/hooks/ReactQuery/useStaffs';
import { useGetRoles } from '@/hooks/ReactQuery/useAuth';
import { StaffUser } from '@/lib/types/user';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  userData?: StaffUser | null;
  onSuccess?: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  onClose,
  mode,
  userData,
  onSuccess,
}) => {
  const { mutate: createStaff } = useCreateStaff();
  const { mutate: updateStaff } = useUpdateStaff(userData?.id || '');
  const { data: rolesData } = useGetRoles(null, 100); // Get all roles

  const form = useForm<CreateUser>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (mode === 'edit' && userData) {
      form.reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roleId: userData.userRoles?.[0]?.role?.id || '',
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        roleId: '',
      });
    }
  }, [mode, userData, open, form]);

  const onSubmit = (data: CreateUser) => {
    if (mode === 'create') {
      createStaff(data, {
        onSuccess: () => {
          form.reset();
          onClose();
          onSuccess?.();
        }
      });
    } else if (mode === 'edit' && userData) {
      updateStaff({
        firstName: data.firstName,
        lastName: data.lastName,
        roleId: data.roleId,
      }, {
        onSuccess: () => {
          onClose();
          onSuccess?.();
        }
      });
    }
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
            <FormFieldWrapper name='firstName' control={form.control} label='First Name' placeholder="Enter first name" />
            <FormFieldWrapper name='lastName' control={form.control} label='Last Name' placeholder="Enter last name" />
            <FormFieldWrapper name='email' control={form.control} label='Email' placeholder="Enter email address" disabled={mode === 'edit'} />
            <FormSelectField
              name='roleId'
              control={form.control}
              label='Role'
              options={rolesData?.data?.result?.map((role) => ({
                value: role.id,
                label: role.name,
              })) || []}
              placeholder="Select a role"
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
