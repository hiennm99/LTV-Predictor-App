import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
    totalPages: number;
}
const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageClick = (e) => {
        console.log(">> Check event: ",e);
        const selectedPage = e.selected;
      };

    return (
        <React.Fragment>
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            pageClassName='page-item'
            pageLinkClassName='page-link'
            previousClassName='page-item'
            previousLinkClassName='page-link'
            nextClassName='page-item'
            nextLinkClassName='page-link'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName='pagination'
            activeClassName='active'
        />
        </React.Fragment>
    )
};

export default Pagination;