import axios from "axios";
import React, { useEffect, useState } from "react";

const DownloadedFiles = ({ data: { token, url } }) => {
  const [urls, setUrls] = useState([]);
console.log(url)
  useEffect(() => {
    const getDownloadedFiles = async () => {
      try {
        const response = await axios.get("https://cors-everywhere.herokuapp.com/http://52.54.29.221:3000/getFilesURL", {
          headers: { Authorization: token },
        });

        console.log(response.data);
        const urls = response.data;

        setUrls(urls);
      } catch (err) {
        console.log(err);
      }
    };

    getDownloadedFiles();
  }, [token, url]);

  return (
    <div>
      {urls.map((url) => {
        return <div key={url.id}>{url.url}</div>;
      })}
    </div>
  );
};

export default DownloadedFiles;
