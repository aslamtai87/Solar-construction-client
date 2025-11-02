import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data?: { id: string } | null;
  title?: string;
  description?: string;
}

const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  data,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone."
}: DeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="ghost" onClick={onConfirm} className="bg-orange-600 text-white hover:bg-orange-700 hover:text-white">
            <Trash className="mr-1" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog