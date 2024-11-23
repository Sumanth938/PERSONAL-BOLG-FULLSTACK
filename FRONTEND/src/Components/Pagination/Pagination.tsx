// PaginationComponent.tsx
import React from 'react';

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const renderPaginationItems = () => {
    let items = [];
    if (totalPages <= 5) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button className="page-link rounded-pill" onClick={() => handlePageChange(number)}>
              {number}
            </button>
          </li>
        );
      }
    } else {
      items.push(
        <li key={1} className={`page-item ${1 === currentPage ? 'active' : ''}`}>
          <button className="page-link rounded-pill" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
      );
      if (currentPage > 3) {
        items.push(<li key="ellipsis1" className="page-item"><span className="page-link">...</span></li>);
      }
      for (let number = Math.max(2, currentPage - 1); number <= Math.min(currentPage + 1, totalPages - 1); number++) {
        items.push(
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button className="page-link rounded-pill" onClick={() => handlePageChange(number)}>
              {number}
            </button>
          </li>
        );
      }
      if (currentPage < totalPages - 2) {
        items.push(<li key="ellipsis2" className="page-item"><span className="page-link">...</span></li>);
      }
      items.push(
        <li key={totalPages} className={`page-item ${totalPages === currentPage ? 'active' : ''}`}>
          <button className="page-link rounded-pill" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        </li>
      );
    }
    return items;
  };

  return (
    <nav>
      <ul className="pagination justify-content-center gap-3">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link rounded-pill" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
        </li>
        {renderPaginationItems()}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link rounded-pill" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationComponent;
