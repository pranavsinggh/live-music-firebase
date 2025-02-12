import React from "react";

const AlbumDetail = ({ field, data }) => {
  return (
    <li className="flex text-[14px] text-[#eee] capitalize">
      <span className="w-[120px] shrink-0">{field}</span>
      <span>{data}</span>
    </li>
  );
};

export default AlbumDetail;
