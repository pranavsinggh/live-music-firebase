import React from "react";

const AlbumDetail = ({ field, data }) => {
  return (
    <li className="flex gap-[10px] text-[14px] text-[#eee] capitalize">
      <span>{field} : </span>
      <span>{data}</span>
    </li>
  );
};

export default AlbumDetail;
