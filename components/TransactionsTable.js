// src/components/TransactionsTable.js
import React from "react";
import PropTypes from "prop-types";
import styles from "../src/pages/transactions/style.module.css";

const TransactionsTable = ({ transactions, onSort, sortBy, order }) => {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return order === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr style={{border: "1px solid #ddd"}}>
            <th onClick={() => onSort("transactionDate")} style={{border: "1px solid #ddd"}}>
              Date{renderSortIndicator("transactionDate")}
            </th>
            <th onClick={() => onSort("transactionId")} style={{border: "1px solid #ddd"}}>
              Transaction ID{renderSortIndicator("transactionId")}
            </th>
            <th onClick={() => onSort("customerName")} style={{border: "1px solid #ddd"}}>
              Customer Name{renderSortIndicator("customerName")}
            </th>
            <th onClick={() => onSort("courseName")} style={{border: "1px solid #ddd"}}>
              Course Name{renderSortIndicator("courseName")}
            </th>
            <th onClick={() => onSort("totalPaidAmount")} style={{border: "1px solid #ddd"}}>
              Amount{renderSortIndicator("totalPaidAmount")}
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} style={{border: "1px solid #ddd"}}>
              <td data-label="Date" style={{border: "1px solid #ddd"}}>{new Date(tx.transactionDate).toLocaleDateString()}</td>
              <td data-label="Transaction ID" style={{border: "1px solid #ddd"}}>{tx.transactionId}</td>
              <td data-label="Customer Name" style={{border: "1px solid #ddd"}}>{tx.customerName}</td>
              <td data-label="Course Name" style={{border: "1px solid #ddd"}}>{tx.courseName}</td>
              <td data-label="Amount" style={{border: "1px solid #ddd"}}>Rs. {tx.totalPaidAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
};

export default TransactionsTable;
