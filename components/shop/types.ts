
import { Product } from '../../types';

export interface ShopLogicState {
    searchTerm: string;
    page: number;
    totalPages: number;
    displayedProducts: Product[];
    hasResults: boolean;
    compareIds: number[];
    comparedProducts: Product[];
    showCompareModal: boolean;
}

export interface ShopLogicActions {
    setSearchTerm: (term: string) => void;
    setPage: (page: number) => void;
    toggleCompare: (product: Product) => void;
    removeCompare: (id: number) => void;
    clearCompare: () => void;
    setShowCompareModal: (show: boolean) => void;
}

export interface ProductCardProps {
    product: Product;
    isSelected: boolean;
    onDetail: (p: Product) => void;
    onCompare: (p: Product) => void;
}
