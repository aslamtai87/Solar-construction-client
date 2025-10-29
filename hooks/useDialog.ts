import { useState } from 'react';

interface DialogState<T = any> {
    mode: "edit" | "create";
    open: boolean;
    data: T | null;
}

export const useDialog = <T = any>(initialState?: Partial<DialogState<T>>) => {
    const [dialog, setDialog] = useState<DialogState<T>>({
        mode: "create",
        open: false,
        data: null,
        ...initialState
    });

    const openCreateDialog = () => {
        setDialog({ mode: "create", open: true, data: null });
    };

    const openEditDialog = (data: T) => {
        setDialog({ mode: "edit", open: true, data });
    };

    const closeDialog = () => {
        setDialog(prev => ({ ...prev, open: false }));
    };

    const updateDialog = (updates: Partial<DialogState<T>>) => {
        setDialog(prev => ({ ...prev, ...updates }));
    };

    return {
        dialog,
        setDialog,
        openCreateDialog,
        openEditDialog,
        closeDialog,
        updateDialog
    };
};
