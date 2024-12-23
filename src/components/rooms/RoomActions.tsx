import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RoomDialog } from "./RoomDialog";
import { Room } from "@/types/room";

interface RoomActionsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingRoom: Room | null;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  onSave: (room: Partial<Room>) => void;
  onDeleteConfirm: () => void;
}

export function RoomActions({
  isDialogOpen,
  setIsDialogOpen,
  editingRoom,
  deleteDialogOpen,
  setDeleteDialogOpen,
  onSave,
  onDeleteConfirm,
}: RoomActionsProps) {
  return (
    <>
      <RoomDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={onSave}
        editingRoom={editingRoom}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}