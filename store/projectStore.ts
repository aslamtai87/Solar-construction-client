import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectResponse } from '@/lib/types/project';

interface ProjectStore {
  selectedProject: ProjectResponse | null;
  setSelectedProject: (project: ProjectResponse | null) => void;
  clearSelectedProject: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      selectedProject: null,
      setSelectedProject: (project) => set({ selectedProject: project }),
      clearSelectedProject: () => set({ selectedProject: null }),
    }),
    {
      name: 'selected-project-storage',
    }
  )
);
