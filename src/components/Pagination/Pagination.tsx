import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';
import type React from 'react';

interface PaginationProps {
    pageCount: number;
    pageRangeDisplayed?: number;
    marginPagesDisplayed?: number;
    onPageChange: (selectedItem: { selected: number }) => void;
    forcePage?: number;
    containerClassName?: string;
    activeClassName?: string;
    nextLabel?: React.ReactNode;
    previousLabel?: React.ReactNode;
}
export const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
    if (pageCount <= 1) return null;
    return (
        <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
        />
    );
};

       