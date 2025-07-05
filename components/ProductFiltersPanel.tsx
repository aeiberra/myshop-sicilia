'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, ChevronDown } from 'lucide-react';
import { ProductFilters, PRODUCT_CATEGORIES } from '@/types/product';

interface ProductFiltersPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClose: () => void;
}

export default function ProductFiltersPanel({ 
  filters, 
  onFiltersChange, 
  onClose 
}: ProductFiltersPanelProps) {
  const t = useTranslations();
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: ProductFilters = {
      category: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      minPrice: undefined,
      maxPrice: undefined,
      search: undefined,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">
          {t('common.filter')}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {t('products.filterByCategory')}
          </label>
          <select
            value={localFilters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('products.allCategories')}</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t(`categories.${category}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de precio */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {t('products.priceRange')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-secondary-500 mb-1">
                {t('products.from')}
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-secondary-500 mb-1">
                {t('products.to')}
              </label>
              <input
                type="number"
                min="0"
                placeholder="∞"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Ordenamiento */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {t('products.sortBy')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={localFilters.sortBy || 'name'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">{t('products.sortOptions.name')}</option>
              <option value="price">{t('products.sortOptions.price')}</option>
              <option value="category">{t('products.sortOptions.category')}</option>
              <option value="date">{t('products.sortOptions.date')}</option>
            </select>
            <select
              value={localFilters.sortOrder || 'asc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="asc">A-Z / ↑</option>
              <option value="desc">Z-A / ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={handleApplyFilters}
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          {t('common.apply')}
        </button>
        <button
          onClick={handleClearFilters}
          className="flex-1 bg-gray-100 text-secondary-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          {t('common.clear')}
        </button>
      </div>
    </div>
  );
} 