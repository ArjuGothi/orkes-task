import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pageCount, setPageCount] = useState(1);
  const [dataList, setDataList] = useState([]);
  const [listLoad, setListLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStopApiCall, setIsStopApiCall] = useState(false);

  useEffect(() => {
    if (dataList.length === 0) {
      getDataList(1);
    }
  }, [dataList]);

  const getDataList = (count) => {
    let requestData = {
      method: "GET",
      headers: new Headers({
        "content-type": "application/json",
      }),
    };

    fetch(`/api/${count}`, requestData)
      .then((response) => response.json())
      .then((response) => {
        if (response.nodes && response.nodes.length !== 0) {
          setDataList([...dataList, ...response.nodes]);
        } else {
          setIsStopApiCall(true);
          alert(response?.message);
        }
        setLoading(false);
        setTimeout(() => {
          setListLoad(false);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onScrollIncList = () => {
    if (listLoad === false && !isStopApiCall) {
      const y = document.querySelector("#tempBody");
      if (y.scrollTop >= y.scrollHeight - y.offsetHeight) {
        setListLoad(true);
        setPageCount(pageCount + 1);
        getDataList(pageCount + 1);
      }
    }
  };

  return (
    <div className="app-page">
      {!loading && (
        <div onScroll={onScrollIncList} id="tempBody" className="content-body">
          {dataList &&
            dataList.map((data, ind) => (
              <div key={ind} className="content-box">
                <div className="content-box-left">
                  <img
                    src={data?.node?.field_photo_image_section}
                    className="content-box-image"
                  />
                </div>
                <div className="content-box-right">
                  <div className="content-box-title">{data?.node?.title}</div>
                  <div className="content-box-path">
                    path: {data?.node?.path}
                  </div>
                </div>
              </div>
            ))}
          {listLoad ? (
            <div className="loader-ellipse">
              <span className="loader-ellipse__dot"></span>
              <span className="loader-ellipse__dot"></span>
              <span className="loader-ellipse__dot"></span>
              <span className="loader-ellipse__dot"></span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;
