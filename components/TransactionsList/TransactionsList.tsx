"use client";

import Button from "@/components/Button/Button";
import { TransactionWithId } from "@/types/transaction";
import css from "./TransactionsList.module.css";

const transactions: TransactionWithId[] = [
  {
    _id: "1",
    type: "expenses",
    category: "Cinema",
    comment: "Jhon Week 4",
    date: "Sn, 3.03.2023",
    time: "14:30",
    sum: 150,
  },
  {
    _id: "2",
    type: "expenses",
    category: "Products",
    comment: "Milk, Bread...",
    date: "Sn, 18.03.2023",
    time: "10:50",
    sum: 1500,
  },
  {
    _id: "3",
    type: "expenses",
    category: "Clothes",
    comment: "Tshirt",
    date: "Sn, 20.03.2023",
    time: "17:25",
    sum: 5000,
  },
  {
    _id: "4",
    type: "expenses",
    category: "Cinema",
    comment: "Avatar 2",
    date: "Sn, 29.03.2023",
    time: "20:30",
    sum: 150,
  },
];

const EditIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.33333 2.66666H2.66666C2.31304 2.66666 1.97391 2.80713 1.72386 3.05718C1.47381 3.30723 1.33333 3.64637 1.33333 3.99999V13.3333C1.33333 13.687 1.47381 14.0261 1.72386 14.2761C1.97391 14.5262 2.31304 14.6667 2.66666 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V8.66666"
      stroke="#0c0d0d"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3333 1.66665C12.5986 1.40144 12.9583 1.25244 13.3333 1.25244C13.7084 1.25244 14.0681 1.40144 14.3333 1.66665C14.5986 1.93187 14.7476 2.29157 14.7476 2.66665C14.7476 3.04174 14.5986 3.40144 14.3333 3.66665L7.99999 9.99999L5.33333 10.6667L5.99999 7.99999L12.3333 1.66665Z"
      stroke="#0c0d0d"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 4H3.33333H14"
      stroke="#fafafa"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33333 4.00001V2.66668C5.33333 2.31305 5.47381 1.97392 5.72386 1.72387C5.97391 1.47382 6.31304 1.33334 6.66666 1.33334H9.33333C9.68695 1.33334 10.0261 1.47382 10.2761 1.72387C10.5262 1.97392 10.6667 2.31305 10.6667 2.66668V4.00001M12.6667 4.00001V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2762C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66666C4.31304 14.6667 3.97391 14.5262 3.72386 14.2762C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4.00001H12.6667Z"
      stroke="#fafafa"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function TransactionsList() {
  return (
    <div className={css.tableWrapper}>
      <table className={css.table}>
        <thead>
          <tr className={css.headerRow}>
            <th className={css.th}>Category</th>
            <th className={css.th}>Comment</th>
            <th className={css.th}>Date</th>
            <th className={css.th}>Time</th>
            <th className={css.th}>Sum</th>
            <th className={css.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item._id} className={css.row}>
              <td className={css.td}>{item.category}</td>
              <td className={css.td}>{item.comment}</td>
              <td className={css.td}>{item.date}</td>
              <td className={css.td}>{item.time}</td>
              <td className={css.td}>{item.sum} / UAH</td>
              <td className={css.td}>
                <div className={css.actions}>
                  <Button
                    color="green"
                    text="Edit"
                    icon={EditIcon}
                    onClick={() => {}}
                  />
                  <Button
                    color="dark"
                    text="Delete"
                    icon={DeleteIcon}
                    onClick={() => {}}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
