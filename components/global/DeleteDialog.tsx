import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

const DeleteDialog = (
    { open, onClose, onConfirm, data }: { open: boolean; onClose: () => void; onConfirm: () => void; data: { id: string } | null }
) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>Are you sure you want to delete this item? {data?.id}</DialogDescription>
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