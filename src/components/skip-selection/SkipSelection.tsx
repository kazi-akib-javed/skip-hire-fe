import React, { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import SkipCard from "./SkipCard";
import SkipFilters, { SortOption } from "./SkipFilters";
import { showToast } from "../../store/toastSlice";
import useSkips from "../../hooks/useSkips";
import "./SkipSelection.css";

const ITEMS_PER_PAGE = 8;

// Memoized SkipCard component
const MemoizedSkipCard = React.memo(SkipCard);

// Memoized SkipList component
const SkipList: React.FC<{
  skips: any[];
  selectedSkipId: number | null;
  onSkipSelect: (skipId: number) => void;
}> = React.memo(({ skips, selectedSkipId, onSkipSelect }) => (
  <div className="skip-list">
    {skips.map((skip) => (
      <MemoizedSkipCard
        key={skip.id}
        skip={skip}
        isSelected={selectedSkipId === skip.id}
        onSelect={onSkipSelect}
      />
    ))}
  </div>
));

// Pagination component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = React.memo(({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
});

// View component - handles only UI rendering
const SkipSelectionView: React.FC<{
  skips: any[];
  loading: boolean;
  error: string | null;
  selectedSkipId: number | null;
  onSkipSelect: (skipId: number) => void;
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = React.memo(
  ({
    skips,
    loading,
    error,
    selectedSkipId,
    onSkipSelect,
    currentSort,
    onSortChange,
    searchQuery,
    onSearchChange,
    currentPage,
    totalPages,
    onPageChange,
  }) => {
    if (loading) {
      return <div className="loading-state">Loading skips...</div>;
    }

    if (error) {
      return <div className="error-state">Error: {error}</div>;
    }

    return (
      <div className="skip-selection">
        <header>
          <h1>Select Your Skip Size</h1>
          <p>Select the skip size that best suits your needs</p>
        </header>

        <SkipFilters
          currentSort={currentSort}
          onSortChange={onSortChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        {skips.length > 0 ? (
          <>
            <SkipList
              skips={skips}
              selectedSkipId={selectedSkipId}
              onSkipSelect={onSkipSelect}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        ) : (
          <p className="no-skips-found">
            No skips available for this location.
          </p>
        )}
      </div>
    );
  }
);

// Container component - handles business logic
const SkipSelection: React.FC = () => {
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(null);
  const [currentSort, setCurrentSort] = useState<SortOption>("price-asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { skips, loading, error } = useSkips();

  // Memoize price parsing function
  const parsePrice = useCallback((price: string) => {
    return parseFloat(price.replace(/[^0-9.-]+/g, ""));
  }, []);

  const handleSkipSelect = useCallback(
    (skipId: number) => {
      setSelectedSkipId(skipId);
      const selectedSkip = skips.find((skip) => skip.id === skipId);
      if (selectedSkip) {
        dispatch(showToast(`${selectedSkip.size} Yard skip selected!`));
      }
    },
    [skips, dispatch]
  );

  // Filter and sort skips
  const filteredAndSortedSkips = useMemo(() => {
    // Wrong search
    const filtered = skips.filter((skip) =>
      skip.size.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      skip.totalPrice.toLowerCase().includes(searchQuery.toLowerCase())
      //|| skip.hirePeriod.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const priceA = parsePrice(a.totalPrice);
      const priceB = parsePrice(b.totalPrice);

      switch (currentSort) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "size-asc":
          return a.size - b.size;
        case "size-desc":
          return b.size - a.size;
        default:
          return 0;
      }
    });
  }, [skips, currentSort, searchQuery, parsePrice]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedSkips.length / ITEMS_PER_PAGE);
  const paginatedSkips = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedSkips.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedSkips, currentPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, currentSort]);

  return (
    <SkipSelectionView
      skips={paginatedSkips}
      loading={loading}
      error={error}
      selectedSkipId={selectedSkipId}
      onSkipSelect={handleSkipSelect}
      currentSort={currentSort}
      onSortChange={setCurrentSort}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
};

export default SkipSelection;
