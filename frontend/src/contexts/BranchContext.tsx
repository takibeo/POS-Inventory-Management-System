import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Branch } from '../types/branch';
import branchService from '../services/branchService';

const STORAGE_KEY = 'selectedBranchId';

type BranchContextType = {
  branches: Branch[];
  selectedBranchId: string | null;
  setSelectedBranchId: (branchId: string | null) => void;
  loading: boolean;
};

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchIdState] = useState<string | null>(
    localStorage.getItem(STORAGE_KEY)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await branchService.getBranches();
        setBranches(data);
        if (!selectedBranchId && data.length > 0) {
          setSelectedBranchIdState(data[0].id);
          localStorage.setItem(STORAGE_KEY, data[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  const setSelectedBranchId = (branchId: string | null) => {
    setSelectedBranchIdState(branchId);
    if (branchId) localStorage.setItem(STORAGE_KEY, branchId);
    else localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ branches, selectedBranchId, setSelectedBranchId, loading }),
    [branches, selectedBranchId, loading]
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranchContext() {
  const context = useContext(BranchContext);
  if (!context) throw new Error('useBranchContext must be used within BranchProvider');
  return context;
}
