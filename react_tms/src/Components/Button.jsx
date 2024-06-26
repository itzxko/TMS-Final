import React from "react";
import { TbDownload } from "react-icons/tb";

const Button = () => {
  return (
    <table className=" w-full">
      <thead className=" w-full">
        <tr className="w-full">
          <th>Data</th>
          <th>Data</th>
          <th>Data</th>
          <th>Data</th>
          <th>Data</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody className="w-full">
        <tr>
          <td>
            <div className="flex px-2 w-full">
              <p className="truncate">
                SSSSSSSSSSSSSSSSSSSsssssssssssssssssssssssssssssssssssssssssssssss
              </p>
            </div>
          </td>
          <td>SSSSSSSSSSSSSSSSSSSssssssssssssssssssssssssssss</td>
          <td>SSSSSSSSSSSSSSSSSSSssssssssssssssssssssssssssss</td>
          <td>SSSSSSSSSSSSSSSSSSSssssssssssssssssssssssssssss</td>
          <td>SSSSSSSSSSSSSSSSSSSssssssssssssssssssssssssssss</td>
          <td>SSSSSSSSSSSSSSSSSSSssssssssssssssssssssssssssss</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Button;
