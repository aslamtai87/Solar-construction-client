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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
}

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  roleData?: Role | null;
}

const RoleDialog: React.FC<RoleDialogProps> = ({
  open,
  onClose,
  mode,
  roleData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: '',
  });

  useEffect(() => {
    if (mode === 'edit' && roleData) {
      setFormData({
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: '',
      });
    }
  }, [mode, roleData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement save logic
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black">
            {mode === 'create' ? 'Add New Role' : 'Edit Role'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {mode === 'create'
              ? 'Fill in the details to create a new role'
              : 'Update the role information'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black font-medium">
                Role Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter role name"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-black font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter role description"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 min-h-20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissions" className="text-black font-medium">
                Permissions
              </Label>
              <Select
                value={formData.permissions}
                onValueChange={(value) => handleChange('permissions', value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Select permissions" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Permissions">All Permissions</SelectItem>
                  <SelectItem value="Read, Write, Update">Read, Write, Update</SelectItem>
                  <SelectItem value="Read, Write">Read, Write</SelectItem>
                  <SelectItem value="Read Only">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {mode === 'create' ? 'Create Role' : 'Update Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;
